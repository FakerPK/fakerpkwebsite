"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { SCENE_BOUNDS, getSceneConfig } from "@/lib/three-config"
import { getTheme, subscribe, type Theme } from "@/lib/theme"
import { createAccretionDisk } from "./accretion-disk"
import { createBlackHoleRig } from "./blackhole-rig"

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
/* Light-mode targets: warm paper background, ink-toned particles. */
const DARK_FOG = new THREE.Color("#0a0908")
const CREAM_FOG = new THREE.Color("#f2ebdd")
const INK = new THREE.Color("#251c14")

/* Particles crossing this radius are consumed by the horizon and respawned
 * at the field edge — matches the disk's inner gap (2.2) around the
 * radius-2 event horizon. */
const HORIZON_KILL_RADIUS = 2.2
const KILL_RADIUS_SQ = HORIZON_KILL_RADIUS * HORIZON_KILL_RADIUS
/* Pointer parallax: a few degrees of tilt on the hole assembly. Parallax,
 * not control — the pointer never moves the attractor. */
const TILT_X = 0.07
const TILT_Y = 0.09
/* Reduced motion freezes the disk shader at this composed moment. */
const DISK_STATIC_TIME = 6.5

/* ------------------------------------------------------------------ */
/* Black hole assembly: rig (horizon + photon ring + lensed halo) and  */
/* accretion disk, co-axial at the origin, tilted together by the      */
/* pointer. The old star's pointLight is kept — the debris ring's      */
/* standard material goes near-black without it.                       */
/* ------------------------------------------------------------------ */

function BlackHoleAssembly({ paused }: { paused: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  const rig = useMemo(() => createBlackHoleRig(), [])
  const disk = useMemo(() => createAccretionDisk({ intensity: 1.15 }), [])

  useEffect(() => () => rig.dispose(), [rig])
  useEffect(() => () => disk.dispose(), [disk])

  // Reduced motion: compose one static disk frame, never advance it.
  useEffect(() => {
    if (paused) disk.setTime(DISK_STATIC_TIME)
  }, [paused, disk])

  useFrame(({ clock }, delta) => {
    if (paused || runtime.hidden) return
    const d = Math.min(delta, 0.05)
    disk.update(d)

    // Retained from the old core: gentle breathing on the fill light.
    if (lightRef.current) {
      lightRef.current.intensity = 26 + Math.sin(clock.elapsedTime * 0.8) * 2.5
    }

    // Pointer parallax — eased few-degree tilt of the whole assembly.
    const group = groupRef.current
    if (!group) return
    const tx = runtime.hasPointer ? -runtime.ndc.y * TILT_X : 0
    const ty = runtime.hasPointer ? runtime.ndc.x * TILT_Y : 0
    const k = 1 - Math.exp(-2.5 * d)
    group.rotation.x += (tx - group.rotation.x) * k
    group.rotation.y += (ty - group.rotation.y) * k
  })

  return (
    <group ref={groupRef}>
      <primitive object={rig} />
      {/* RingGeometry natively lies in XY — same plane the dust circulates in;
       * identity rotation keeps the shader's Doppler tangent correct. */}
      <primitive object={disk.mesh} />
      <pointLight ref={lightRef} color="#ff7a1f" intensity={26} distance={40} decay={2} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Gravity dust: particle field pulled into the hole, consumed at the  */
/* horizon, replenished from the field edge                            */
/* ------------------------------------------------------------------ */

const GRAVITY_G = 65
const SOFTENING = 22
const SWIRL = 0.45
const MAX_SPEED = 9

function DustField({
  count,
  paused,
  light,
}: {
  count: number
  paused: boolean
  light: boolean
}) {
  const pointsRef = useRef<THREE.Points>(null)
  /* 0 = dark palette, 1 = light palette, eased per frame. */
  const themeMix = useRef(light ? 1 : 0)

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Disc facing the camera; floor keeps spawns outside the kill sphere.
      const r = 2.6 + Math.sqrt(Math.random()) * 10.4
      const theta = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(theta) * r
      positions[i * 3 + 1] = Math.sin(theta) * r * 0.96 + gauss() * 0.7
      positions[i * 3 + 2] = gauss() * 1.6
      // Initial tangential drift -> instant swirl character (CCW, matching
      // the disk shader's advection direction).
      velocities[i * 3] = -Math.sin(theta) * 0.35
      velocities[i * 3 + 1] = Math.cos(theta) * 0.35
      velocities[i * 3 + 2] = 0
      colors[i * 3] = EMBER.r
      colors[i * 3 + 1] = EMBER.g
      colors[i * 3 + 2] = EMBER.b
    }
    return { positions, velocities, colors }
  }, [count])

  // Reduced motion freezes the frame loop below — including the themeMix
  // easing that lives inside it — so a live theme toggle would strand stale
  // palette colors on the particles until reload. When paused, snap the mix
  // and run exactly one recolor pass instead.
  useEffect(() => {
    if (!paused) return
    themeMix.current = light ? 1 : 0
    const m = themeMix.current
    const baseR = EMBER.r + (INK.r - EMBER.r) * m
    const baseG = EMBER.g + (INK.g - EMBER.g) * m
    const baseB = EMBER.b + (INK.b - EMBER.b) * m
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const iy = ix + 1
      const iz = ix + 2
      // Same speed-based ember -> orange -> pale ramp as the frame loop,
      // evaluated against the frozen velocities.
      const speed = Math.sqrt(
        velocities[ix] * velocities[ix] +
          velocities[iy] * velocities[iy] +
          velocities[iz] * velocities[iz],
      )
      const hot = Math.min(speed / 3, 1)
      const white = Math.max(0, Math.min((speed - 3) / 5, 1))
      colors[ix] = (baseR + (ACCENT.r - baseR) * hot) * (1 - white) + PALE.r * white
      colors[iy] = (baseG + (ACCENT.g - baseG) * hot) * (1 - white) + PALE.g * white
      colors[iz] = (baseB + (ACCENT.b - baseB) * hot) * (1 - white) + PALE.b * white
    }
    const points = pointsRef.current
    const colorAttr = points?.geometry.attributes.color as THREE.BufferAttribute | undefined
    if (colorAttr) colorAttr.needsUpdate = true
  }, [paused, light, count, velocities, colors])

  useFrame((_, delta) => {
    if (paused || runtime.hidden) return
    const d = Math.min(delta, 0.05)
    const damp = Math.exp(-0.7 * d)

    themeMix.current += ((light ? 1 : 0) - themeMix.current) * (1 - Math.exp(-3 * d))
    const m = themeMix.current
    // Base particle tone: ember in dark, warm ink on cream paper in light.
    const baseR = EMBER.r + (INK.r - EMBER.r) * m
    const baseG = EMBER.g + (INK.g - EMBER.g) * m
    const baseB = EMBER.b + (INK.b - EMBER.b) * m

    // Attractor pinned to the black hole at the origin — the field feeds it.
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const iy = ix + 1
      const iz = ix + 2

      const px = positions[ix]
      const py = positions[iy]
      const pz = positions[iz]

      const r = Math.sqrt(px * px + py * py + pz * pz) + 1e-5
      const force = GRAVITY_G / (r * r + SOFTENING)

      // Radial pull + perpendicular swirl -> spiral infall, not collapse.
      // Swirl uses the CCW tangent (-ny, nx), matching the drift velocities
      // and the disk shader's advection handedness.
      const nx = px / r
      const ny = py / r
      const nz = pz / r
      const ax = (nx - ny * SWIRL) * force
      const ay = (ny + nx * SWIRL) * force
      const az = nz * force * 0.6

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

      // Consumed at the horizon: respawn at the outer field edge.
      if (
        positions[ix] * positions[ix] +
          positions[iy] * positions[iy] +
          positions[iz] * positions[iz] <
        KILL_RADIUS_SQ
      ) {
        const r2 = 12 + Math.random() * 1.8
        const theta = Math.random() * Math.PI * 2
        positions[ix] = Math.cos(theta) * r2
        positions[iy] = Math.sin(theta) * r2 * 0.96
        positions[iz] = gauss() * 1.6
        velocities[ix] = -Math.sin(theta) * 0.35
        velocities[iy] = Math.cos(theta) * 0.35
        velocities[iz] = 0
      }

      // Soft wrap keeps the field dense without hard edges.
      if (positions[ix] > SCENE_BOUNDS.xy) positions[ix] = -SCENE_BOUNDS.xy
      else if (positions[ix] < -SCENE_BOUNDS.xy) positions[ix] = SCENE_BOUNDS.xy
      if (positions[iy] > SCENE_BOUNDS.xy) positions[iy] = -SCENE_BOUNDS.xy
      else if (positions[iy] < -SCENE_BOUNDS.xy) positions[iy] = SCENE_BOUNDS.xy
      if (positions[iz] > SCENE_BOUNDS.zMax) positions[iz] = SCENE_BOUNDS.zMin
      else if (positions[iz] < SCENE_BOUNDS.zMin) positions[iz] = SCENE_BOUNDS.zMax

      // Speed-based ember -> orange -> pale-white ramp (ink-based in light).
      const speed = Math.sqrt(
        velocities[ix] * velocities[ix] +
          velocities[iy] * velocities[iy] +
          velocities[iz] * velocities[iz],
      )
      const hot = Math.min(speed / 3, 1)
      const white = Math.max(0, Math.min((speed - 3) / 5, 1))
      colors[ix] = (baseR + (ACCENT.r - baseR) * hot) * (1 - white) + PALE.r * white
      colors[iy] = (baseG + (ACCENT.g - baseG) * hot) * (1 - white) + PALE.g * white
      colors[iz] = (baseB + (ACCENT.b - baseB) * hot) * (1 - white) + PALE.b * white
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
      {/* Light mode flips to normal blending: ink-dark motes read on cream,
       * where additive-only glow would wash out. */}
      <pointsMaterial
        size={0.032}
        sizeAttenuation
        vertexColors
        transparent
        opacity={light ? 0.6 : 0.85}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
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
/* Debris ring: instanced drifting fragments                           */
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
/* Theme atmosphere: fog eases between warm near-black and cream paper */
/* ------------------------------------------------------------------ */

function Atmosphere({ light }: { light: boolean }) {
  const scene = useThree((state) => state.scene)
  const mix = useRef(light ? 1 : 0)

  useFrame((_, delta) => {
    const d = Math.min(Math.max(delta, 0), 0.05)
    const target = light ? 1 : 0
    mix.current += (target - mix.current) * (1 - Math.exp(-3.2 * d))
    if (Math.abs(target - mix.current) < 0.0005) mix.current = target
    const m = mix.current

    const fog = scene.fog
    if (fog instanceof THREE.FogExp2) {
      fog.color.copy(DARK_FOG).lerp(CREAM_FOG, m)
      fog.density = 0.02 + (0.012 - 0.02) * m
    }
  })

  return null
}

/* ------------------------------------------------------------------ */
/* Scene root                                                          */
/* ------------------------------------------------------------------ */

export default function GravityScene() {
  const [config, setConfig] = useState(() => getSceneConfig())
  const [reducedMotion, setReducedMotion] = useState(false)
  const [theme, setThemeState] = useState<Theme>(() => getTheme())

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

  // lib/theme.ts pushes the DOM attribute + storage events here.
  useEffect(() => subscribe(setThemeState), [])

  // Reduced motion: one composed static frame, no simulation.
  const paused = reducedMotion
  const light = theme === "light"

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
        {/* Mounted dark; Atmosphere owns color/density so theme swaps ease. */}
        <fogExp2 attach="fog" args={["#0a0908", 0.02]} />

        <ambientLight intensity={0.15} />
        <BlackHoleAssembly paused={paused} />
        <DustField count={config.particles} paused={paused} light={light} />
        <DebrisRing count={config.debris} paused={paused} />
        {!paused && <CameraRig paused={paused} />}
        <Atmosphere light={light} />

        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.18} luminanceSmoothing={0.25} />
          <Noise opacity={0.05} premultiply blendFunction={BlendFunction.OVERLAY} />
          <Vignette darkness={0.72} offset={0.22} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
