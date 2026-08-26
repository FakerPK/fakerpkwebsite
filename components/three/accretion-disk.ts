/**
 * Accretion disk — flat shader disk matching the gravity-scene palette.
 *
 * Plain three.js + R3F v8, no drei / no noise libraries (all GLSL inline).
 *
 * Typical integration inside <Canvas>:
 *
 *   const disk = useMemo(() => createAccretionDisk(), [])
 *   useEffect(() => () => disk.dispose(), [disk])
 *   useFrame((_, delta) => !paused && disk.update(delta))
 *   return <primitive object={disk.mesh} />
 *
 * Or take only the material via `createAccretionDiskMaterial()` and build the
 * mesh yourself — see DISK_MESH_SETUP in the module tail for exact numbers.
 */

import * as THREE from "three"

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

export const DISK_INNER_RADIUS = 2.2
export const DISK_OUTER_RADIUS = 9.0
/** Draw after the dust points / halo sprites (both renderOrder 0). */
export const DISK_RENDER_ORDER = 2

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vLocalPos;
  varying vec3 vWorldPos;
  varying vec3 vTangentW;

  void main() {
    vLocalPos = position.xy;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    // World-space CCW tangent — computed here because three.js injects
    // modelMatrix into the vertex prefix only, never the fragment prefix.
    vTangentW = normalize(mat3(modelMatrix) * vec3(-position.y, position.x, 0.0));
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

/*
 * Fragment: radial temperature ramp (white-hot ISCO rim -> #ff6a00 family ->
 * deep red-brown), Doppler beaming around the line of sight, and 3-octave
 * value-noise fbm advected differentially (Keplerian: inner rings outrun
 * outer ones) plus a slow inward radial drift.
 *
 * Noise domain is a cylinder — angle mapped through cos/sin — so turbulence
 * is seamless across the atan() branch cut.
 */
const FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vLocalPos;
  varying vec3 vWorldPos;
  varying vec3 vTangentW;

  uniform float uTime;
  uniform float uIntensity;
  uniform float uInnerRadius;
  uniform float uOuterRadius;
  uniform float uFlowSpeed;
  uniform float uBeamStrength;

  /* Dave Hoskins-style scalar hash — no textures, no libs. */
  float hash13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
  }

  /* Trilinear value noise with quintic-ish smoothing. */
  float vnoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash13(i);
    float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z
    );
  }

  /* 3 octaves — long angular wavelengths give filament streaks. */
  float fbm(vec3 p) {
    float v = 0.0;
    float amp = 0.55;
    for (int i = 0; i < 3; i++) {
      v += amp * vnoise(p);
      p = p * 2.03 + vec3(7.7, 3.1, 1.9);
      amp *= 0.5;
    }
    return v;
  }

  /* Inner edge white-hot -> pale -> #ff6a00 -> burnt orange -> red-brown. */
  vec3 temperatureRamp(float t) {
    const vec3 cWhiteHot = vec3(1.000, 0.982, 0.940);
    const vec3 cPale     = vec3(1.000, 0.851, 0.722); // #ffd9b8
    const vec3 cAccent   = vec3(1.000, 0.416, 0.000); // #ff6a00
    const vec3 cBurnt    = vec3(0.761, 0.255, 0.047);
    const vec3 cEmber    = vec3(0.290, 0.114, 0.020); // deep red-brown
    vec3 col = mix(cWhiteHot, cPale, smoothstep(0.0, 0.22, t));
    col = mix(col, cAccent, smoothstep(0.18, 0.48, t));
    col = mix(col, cBurnt, smoothstep(0.46, 0.74, t));
    col = mix(col, cEmber, smoothstep(0.72, 1.0, t));
    return col;
  }

  void main() {
    float r = length(vLocalPos);
    float t = clamp(
      (r - uInnerRadius) / max(uOuterRadius - uInnerRadius, 1e-4),
      0.0,
      1.0
    );

    /* Keplerian-flavored differential advection: omega ~ r^-1.5. */
    float omega = uFlowSpeed / pow(max(r, 0.75), 1.5);
    float ang = atan(vLocalPos.y, vLocalPos.x);
    float angAdv = ang - uTime * omega;

    vec3 np = vec3(
      cos(angAdv) * 2.6,
      sin(angAdv) * 2.6,
      r * 2.1 + uTime * 0.16 /* slow inward drift = accretion */
    );
    float turb = fbm(np);
    float streak = 0.58 + 0.95 * (turb - 0.5);

    /* One cheap extra octave: large-scale clumping of the filaments. */
    float clump = vnoise(vec3(cos(angAdv) * 1.1, sin(angAdv) * 1.1, r * 0.9));
    streak *= 0.82 + 0.36 * clump;

    /* Emissive falls off steeply from the white-hot rim. */
    float brightness = mix(2.35, 0.22, pow(t, 0.65));

    /* Hot glow hugging the inner edge. */
    float rim = exp(-pow((r - uInnerRadius) * 2.4, 2.0)) * 1.15;

    /* Doppler beaming: tangent of the CCW rotation vs. direction to camera. */
    vec3 tangentW = normalize(vTangentW);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float los = dot(tangentW, viewDir); /* +1 approaching, -1 receding */
    float beam = pow(clamp(los * 0.5 + 0.5, 0.0, 1.0), uBeamStrength * 3.2);
    float gain = mix(0.38, 1.9, beam);
    vec3 col = mix(temperatureRamp(t), vec3(1.0, 0.985, 0.955), beam * 0.5);
    col = mix(col, col * vec3(1.02, 0.52, 0.34), (1.0 - beam) * 0.42);

    vec3 emissive = col * (brightness * streak * gain + rim * (0.35 + 0.65 * gain));

    /* Soft feathered band edges — no hard geometry silhouette. */
    float innerFade = smoothstep(uInnerRadius, uInnerRadius + 0.55, r);
    float outerFade = 1.0 - smoothstep(uOuterRadius - 2.6, uOuterRadius - 0.05, r);
    float alpha = innerFade * outerFade * clamp(uIntensity, 0.0, 8.0);

    gl_FragColor = vec4(emissive, alpha);
  }
`

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface AccretionDiskOptions {
  /** Overall emission multiplier. Default 1. */
  intensity?: number
  /** Override the band radii (units). Defaults 2.2 / 9.0. */
  innerRadius?: number
  outerRadius?: number
  /** Angular advection speed scale. Default 0.55. */
  flowSpeed?: number
  /** Doppler asymmetry strength (0 disables beaming). Default 1. */
  beamStrength?: number
}

export interface AccretionDiskHandle {
  material: THREE.ShaderMaterial
  /** Advance animation by a frame delta (clamped to 50 ms like the scene). */
  update: (deltaSeconds: number) => void
  /** Hard-set the shader clock (scrubbing / reduced-motion stills). */
  setTime: (seconds: number) => void
  dispose: () => void
}

export interface AccretionDisk extends AccretionDiskHandle {
  /** Ready-to-add mesh: RingGeometry + material, renderOrder preset. */
  mesh: THREE.Mesh
}

/* ------------------------------------------------------------------ */
/* Factories                                                           */
/* ------------------------------------------------------------------ */

/** Create only the ShaderMaterial (caller owns geometry + mesh). */
export function createAccretionDiskMaterial(
  options: AccretionDiskOptions = {},
): AccretionDiskHandle {
  const uniforms = {
    uTime: { value: 0 },
    uIntensity: { value: options.intensity ?? 1.0 },
    uInnerRadius: { value: options.innerRadius ?? DISK_INNER_RADIUS },
    uOuterRadius: { value: options.outerRadius ?? DISK_OUTER_RADIUS },
    uFlowSpeed: { value: options.flowSpeed ?? 0.55 },
    uBeamStrength: { value: options.beamStrength ?? 1.0 },
  }

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    uniforms,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
  })

  let time = 0

  return {
    material,
    update(deltaSeconds: number) {
      time += Math.min(Math.max(deltaSeconds, 0), 0.05)
      uniforms.uTime.value = time
    },
    setTime(seconds: number) {
      time = seconds
      uniforms.uTime.value = seconds
    },
    dispose() {
      material.dispose()
    },
  }
}

/** Geometry matching the shader's radius uniforms. */
export function createAccretionDiskGeometry(): THREE.RingGeometry {
  return new THREE.RingGeometry(DISK_INNER_RADIUS, DISK_OUTER_RADIUS, 160, 1)
}

/** Convenience: material + mesh wired together, with a full dispose path. */
export function createAccretionDisk(options: AccretionDiskOptions = {}): AccretionDisk {
  const handle = createAccretionDiskMaterial(options)
  const geometry = createAccretionDiskGeometry()
  const mesh = new THREE.Mesh(geometry, handle.material)
  mesh.renderOrder = DISK_RENDER_ORDER
  mesh.frustumCulled = true

  return {
    ...handle,
    mesh,
    dispose() {
      geometry.dispose()
      handle.dispose()
    },
  }
}
