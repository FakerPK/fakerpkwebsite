"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { SCENE_BOUNDS, getSceneConfig } from "@/lib/three-config"

/* Shared runtime state — avoids re-rendering React on high-frequency events */
const runtime = {
  hidden: false,
  ndc: new THREE.Vector2(0, 0),
  hasPointer: false,
  scrollProgress: 0,
}

const ACCENT = new THREE.Color("#ff6a00")
const EMBER = new THREE.Color("#7a2d00")
const PALE = new THREE.Color("#ffd9b8")

/* ------------------------------------------------------------------ */
/* Star core: fresnel-rim shader sphere + additive halo sprite         */
/* ------------------------------------------------------------------ */

const CORE_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const CORE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float fresnel = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), 2.2);
    float breathe = 0.92 + 0.08 * sin(uTime * 0.8);
    vec3 body = vec3(0.035, 0.022, 0.014);
    vec3 col = body + uColor * fresnel * uIntensity * breathe;
    gl_FragColor = vec4(col, 1.0);
  }
`

function createGlowTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null
  const size = 256
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, "rgba(255, 140, 60, 0.55)")
  gradient.addColorStop(0.25, "rgba(255, 106, 0, 0.28)")
  gradient.addColorStop(0.6, "rgba(255, 106, 0, 0.07)")
  gradient.addColorStop(1, "rgba(255, 106, 0, 0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function StarCore({ paused }: { paused: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  const uniforms = useMemo<{ [k: string]: THREE.IUniform }>(
    () => ({
      uTime: { value: 0 },
      uColor: { value: ACCENT },
      uIntensity: { value: 1.35 },
    }),
    [],
  )

  const glowTexture = useMemo(createGlowTexture, [])

  useEffect(() => () => glowTexture?.dispose(), [glowTexture])

  useFrame(({ clock }, delta) => {
    if (paused || runtime.hidden) return
    const d = Math.min(delta, 0.05)
    uniforms.uTime.value += d
    if (meshRef.current) meshRef.current.rotation.y += d * 0.06
    if (lightRef.current) lightRef.current.intensity = 26 + Math.sin(clock.elapsedTime * 0.8) * 2.5
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.15, 64, 64]} />
        <shaderMaterial vertexShader={CORE_VERTEX} fragmentShader={CORE_FRAGMENT} uniforms={uniforms} />
      </mesh>
      {glowTexture && (
        <sprite scale={[6.2, 6.2, 1]}>
          <spriteMaterial
            map={glowTexture}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            transparent
            opacity={0.5}
          />
        </sprite>
      )}
      <pointLight ref={lightRef} color="#ff7a1f" intensity={26} distance={40} decay={2} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Gravity dust: pointer-attracted particle field                      */
/* ------------------------------------------------------------------ */

const GRAVITY_G = 65
const SOFTENING = 22
const SWIRL = 0.45
const MAX_SPEED = 9

function DustField({ count, paused }: { count: number; paused: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Spiral-galaxy disc facing the camera.
      const r = Math.sqrt(Math.random()) * 13
      const theta = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(theta) * r
      positions[i * 3 + 1] = Math.sin(theta) * r * 0.96 + gauss() * 0.7
      positions[i * 3 + 2] = gauss() * 1.6
      // Initial tangential drift -> instant orbital character.
      velocities[i * 3] = -Math.sin(theta) * 0.35
      velocities[i * 3 + 1] = Math.cos(theta) * 0.35
      velocities[i * 3 + 2] = 0
      colors[i * 3] = EMBER.r
      colors[i * 3 + 1] = EMBER.g
      colors[i * 3 + 2] = EMBER.b
    }
    return { positions, velocities, colors }
  }, [count])

  const tmp = useMemo(() => new THREE.Vector3(), [])
  const attractor = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame(({ camera }, delta) => {
    if (paused || runtime.hidden) return
    const d = Math.min(delta, 0.05)
    const damp = Math.exp(-0.7 * d)

    // Attractor: pointer projected onto z=0, or a slow autonomous orbit.
    if (runtime.hasPointer) {
      tmp.set(runtime.ndc.x, runtime.ndc.y, 0.5).unproject(camera)
      tmp.sub(camera.position).normalize()
      if (Math.abs(tmp.z) > 1e-4) {
        const t = -camera.position.z / tmp.z
        attractor.copy(camera.position).addScaledVector(tmp, t)
      }
    } else {
      const t = performance.now() * 0.00012
      attractor.set(Math.cos(t * 1.7) * 3.4, Math.sin(t * 1.1) * 2.6, Math.sin(t * 0.9) * 1.2)
    }

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const iy = ix + 1
      const iz = ix + 2

      const dx = attractor.x - positions[ix]
      const dy = attractor.y - positions[iy]
      const dz = attractor.z - positions[iz]
      const r2 = dx * dx + dy * dy + dz * dz
      const r = Math.sqrt(r2) + 1e-5
      const force = GRAVITY_G / (r2 + SOFTENING)

      // Radial pull + perpendicular swirl -> orbital motion, not collapse.
      const ax = ((dx / r) + (-dy / r) * SWIRL) * force
      const ay = ((dy / r) + (dx / r) * SWIRL) * force
      const az = (dz / r) * force * 0.6

      velocities[ix] = (velocities[ix] + ax * d) * damp
      velocities[iy] = (velocities[iy] + ay * d) * damp
      velocities[iz] = (velocities[iz] + az * d) * damp

      const speedSq =
        velocities[ix] * velocities[ix] + velocities[iy] * velocities[iy] + velocities[iz] * velocities[iz]
      if (speedSq > MAX_SPEED * MAX_SPEED) {
        const s = MAX_SPEED / Math.sqrt(speedSq)
        velocities[ix] *= s
        velocities[iy] *= s
        velocities[iz] *= s
      }

      positions[ix] += velocities[ix] * d
      positions[iy] += velocities[iy] * d
      positions[iz] += velocities[iz] * d

      // Soft wrap keeps the field dense without hard edges.
      if (positions[ix] > SCENE_BOUNDS.xy) positions[ix] = -SCENE_BOUNDS.xy
      else if (positions[ix] < -SCENE_BOUNDS.xy) positions[ix] = SCENE_BOUNDS.xy
      if (positions[iy] > SCENE_BOUNDS.xy) positions[iy] = -SCENE_BOUNDS.xy
      else if (positions[iy] < -SCENE_BOUNDS.xy) positions[iy] = SCENE_BOUNDS.xy
      if (positions[iz] > SCENE_BOUNDS.zMax) positions[iz] = SCENE_BOUNDS.zMin
      else if (positions[iz] < SCENE_BOUNDS.zMin) positions[iz] = SCENE_BOUNDS.zMax

      // Speed-based ember -> orange -> pale-white ramp.
      const speed = Math.sqrt(
        velocities[ix] * velocities[ix] +
          velocities[iy] * velocities[iy] +
          velocities[iz] * velocities[iz],
      )
      const hot = Math.min(speed / 3, 1)
      const white = Math.max(0, Math.min((speed - 3) / 5, 1))
      colors[ix] = (EMBER.r + (ACCENT.r - EMBER.r) * hot) * (1 - white) + PALE.r * white
      colors[iy] = (EMBER.g + (ACCENT.g - EMBER.g) * hot) * (1 - white) + PALE.g * white
      colors[iz] = (EMBER.b + (ACCENT.b - EMBER.b) * hot) * (1 - white) + PALE.b * white
    }

    const points = pointsRef.current
    if (!points) return
    const geometry = points.geometry
    ;(geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
    ;(geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/** Box-Muller gaussian for soft vertical scatter. */
function gauss(): number {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/* ------------------------------------------------------------------ */
/* Debris ring: instanced orbital fragments                            */
/* ------------------------------------------------------------------ */

function DebrisRing({ count, paused }: { count: number; paused: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const params = useMemo(() => {
    const radius = new Float32Array(count)
    const phase = new Float32Array(count)
    const speed = new Float32Array(count)
    const jitter = new Float32Array(count)
    const scale = new Float32Array(count)
    const tumbleX = new Float32Array(count)
    const tumbleZ = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      radius[i] = 2.4 + Math.random() * 1.2
      phase[i] = Math.random() * Math.PI * 2
      speed[i] = 0.06 + Math.random() * 0.2
      jitter[i] = (Math.random() - 0.5) * 0.36
      scale[i] = 0.03 + Math.random() * 0.055
      tumbleX[i] = (Math.random() - 0.5) * 1.4
      tumbleZ[i] = (Math.random() - 0.5) * 1.4
    }
    return { radius, phase, speed, jitter, scale, tumbleX, tumbleZ }
  }, [count])

  useEffect(() => {
    // Seed one full pose immediately so the first frame is never empty.
    const mesh = meshRef.current
    if (!mesh) return
    const t = 4
    for (let i = 0; i < count; i++) {
      placeInstance(dummy, mesh, params, i, t)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [count, dummy, params])

  useFrame(({ clock }, delta) => {
    if (paused || runtime.hidden) return
    const mesh = meshRef.current
    if (!mesh) return
    void delta
    const t = clock.elapsedTime
    for (let i = 0; i < count; i++) {
      placeInstance(dummy, mesh, params, i, t)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <group rotation={[1.05, 0.15, 0.32]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#241a12"
          emissive="#ff6a00"
          emissiveIntensity={0.08}
          metalness={0.55}
          roughness={0.45}
        />
      </instancedMesh>
    </group>
  )
}

type RingParams = {
  radius: Float32Array
  phase: Float32Array
  speed: Float32Array
  jitter: Float32Array
  scale: Float32Array
  tumbleX: Float32Array
  tumbleZ: Float32Array
}

function placeInstance(
  dummy: THREE.Object3D,
  mesh: THREE.InstancedMesh,
  params: RingParams,
  i: number,
  t: number,
): void {
  const angle = params.phase[i] + t * params.speed[i]
  dummy.position.set(
    Math.cos(angle) * params.radius[i],
    params.jitter[i],
    Math.sin(angle) * params.radius[i],
  )
  dummy.rotation.set(t * params.tumbleX[i], 0, t * params.tumbleZ[i])
  dummy.scale.setScalar(params.scale[i])
  dummy.updateMatrix()
  mesh.setMatrixAt(i, dummy.matrix)
}

/* ------------------------------------------------------------------ */
/* Scroll-driven camera rig                                            */
/* ------------------------------------------------------------------ */

function CameraRig({ paused }: { paused: boolean }) {
  const { camera } = useThree()
  const desired = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock }, delta) => {
    if (paused || runtime.hidden) return
    const d = Math.min(delta, 0.05)
    const p = runtime.scrollProgress

    const azimuth = 0.55 * p
    const radius = 8.5 + 4.5 * p
    desired.set(
      Math.sin(azimuth) * radius - 1.6 * (1 - p),
      0.3 - 1.5 * p + Math.sin(clock.elapsedTime * 0.4) * 0.06,
      Math.cos(azimuth) * radius,
    )

    const k = 1 - Math.exp(-2.2 * d)
    camera.position.lerp(desired, k)
    target.set(0.6 * (1 - p), 0.2 * (1 - p), 0)
    camera.lookAt(target)
  })

  return null
}

/* ------------------------------------------------------------------ */
/* Scene root                                                          */
/* ------------------------------------------------------------------ */

export default function GravityScene() {
  const [config, setConfig] = useState(() => getSceneConfig())
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onReduced = () => setReducedMotion(reducedQuery.matches)
    onReduced()
    reducedQuery.addEventListener("change", onReduced)

    const onVisibility = () => {
      runtime.hidden = document.hidden
    }
    document.addEventListener("visibilitychange", onVisibility)

    const onPointerMove = (e: PointerEvent) => {
      runtime.ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
      runtime.hasPointer = true
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      runtime.scrollProgress = max > 0 ? window.scrollY / max : 0
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      reducedQuery.removeEventListener("change", onReduced)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // Reduced motion: one composed static frame, no simulation.
  const paused = reducedMotion

  return (
    <div aria-hidden="true" className="fixed inset-0">
      <Canvas
        dpr={[1, config.dprMax]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 42, near: 0.1, far: 100, position: [-1.6, 0.3, 8.5] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.15
        }}
      >
        <fogExp2 attach="fog" args={["#0a0908", 0.02]} />

        <ambientLight intensity={0.15} />
        <StarCore paused={paused} />
        <DustField count={config.particles} paused={paused} />
        <DebrisRing count={config.debris} paused={paused} />
        {!paused && <CameraRig paused={paused} />}

        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.18} luminanceSmoothing={0.25} />
          <Noise opacity={0.05} premultiply blendFunction={BlendFunction.OVERLAY} />
          <Vignette darkness={0.72} offset={0.22} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
