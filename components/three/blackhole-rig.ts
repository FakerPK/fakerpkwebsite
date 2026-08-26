import * as THREE from "three"

/**
 * Black hole rig — event horizon, photon ring, lensed halo.
 *
 * Plain three.js (no drei / no React). Built for the gravity scene in
 * `components/three/gravity-scene.tsx`:
 *
 *   - Local frame contract: the rig's LOCAL XY PLANE is the accretion-disc /
 *     screen plane (the existing dust field spawns in world XY, camera parks
 *     on +Z), and +Z points at the camera. Drop the group at the scene origin
 *     unrotated and everything lines up with the existing composition.
 *   - The event-horizon sphere writes depth in the opaque pass, so any
 *     transparent material behind it (additive dust, glow sprites, the halo's
 *     far arc) fails the depth test and vanishes into the shadow, while
 *     particles between the camera and the horizon stay visible on top of it.
 *     Its renderOrder is pushed high anyway so it deterministically paints
 *     over every other opaque object (star core, instanced debris) inside the
 *     opaque queue instead of relying on distance sorting.
 *   - Both annuli use MeshBasicMaterial with HDR (>1.0) white-orange colors,
 *     toneMapped=false and AdditiveBlending — far above the scene's Bloom
 *     luminanceThreshold of 0.18, so the postprocessing mipmap bloom picks
 *     them up hard without touching the Bloom pass itself.
 *
 * Geometry note: the spec's literal "ring at 1.4-1.6" only works if the
 * horizon is smaller than the ring — anything inside a radius-2 sphere is
 * invisible. Defaults therefore hug the silhouette (ring ≈ 1.21x horizon);
 * pass explicit `horizonRadius`/`ringRadius`/`haloRadius` if you want the
 * 1.4-1.6 numbers (they need horizonRadius <= ~1.35).
 */

const ACCENT = new THREE.Color("#ff6a00")
const PALE = new THREE.Color("#ffd9b8")

export const BLACK_HOLE_DEFAULTS = {
  /** Shadow silhouette radius (world units, scene origin centered). */
  horizonRadius: 2,
  /** Photon ring hugs the silhouette edge — must exceed horizonRadius. */
  ringRadiusFactor: 1.21,
  /** Lensed halo rides slightly wider than the photon ring. */
  haloRadiusFactor: 1.31,
  /** Thin: reads as a bright filament once bloom smears it. */
  ringTubeFactor: 0.018,
  haloTubeFactor: 0.011,
  /** Out-of-plane tilt for the over-the-top lensed halo arc (degrees). */
  haloTiltDegrees: 80,
  /** HDR multipliers — tuned against Bloom luminanceThreshold 0.18. */
  ringBoost: 3.4,
  haloBoost: 1.55,
  haloOpacity: 0.34,
} as const

export type BlackHoleRigOptions = {
  /** World-space placement. Default (0, 0, 0) — the old star-core seat. */
  position?: [number, number, number]
  horizonRadius?: number
  ringRadius?: number
  haloRadius?: number
  ringTube?: number
  haloTube?: number
  haloTiltRadians?: number
}

export type BlackHoleRig = THREE.Group & {
  /** Disposes every geometry and material in the rig. Remove from scene first. */
  dispose(): void
}

function buildAnnulus(
  name: string,
  radius: number,
  tube: number,
  color: THREE.Color,
  opacity: number,
): THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial> {
  // TorusGeometry lies in the local XY plane — exactly the disc/screen plane.
  const geometry = new THREE.TorusGeometry(radius, tube, 12, 180)
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    fog: false,
    toneMapped: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = name
  return mesh
}

export function createBlackHoleRig(options: BlackHoleRigOptions = {}): BlackHoleRig {
  const d = BLACK_HOLE_DEFAULTS
  const horizonRadius = options.horizonRadius ?? d.horizonRadius

  const group = new THREE.Group() as BlackHoleRig
  group.name = "black-hole-rig"
  if (options.position) group.position.set(...options.position)

  /* -- 1. Event horizon: pure-black depth-writing silhouette --------------- */
  const horizonGeometry = new THREE.SphereGeometry(horizonRadius, 64, 48)
  // Slightly oversized vs the physical horizon so the shadow edge stays crisp
  // under the bloom smear of the surrounding ring.
  const horizonMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    fog: false,
    toneMapped: false,
  })
  const horizon = new THREE.Mesh(horizonGeometry, horizonMaterial)
  horizon.name = "event-horizon"
  horizon.renderOrder = 100 // wins the opaque queue; see module comment
  group.add(horizon)

  /* -- 2. Photon ring: bright filament hugging the silhouette -------------- */
  const ringRadius = options.ringRadius ?? horizonRadius * d.ringRadiusFactor
  const ringTube = options.ringTube ?? Math.max(0.024, horizonRadius * d.ringTubeFactor)
  // White-hot core leaning orange — HDR so the existing Bloom pass ignites it.
  const ringColor = PALE.clone().lerp(ACCENT, 0.32).multiplyScalar(d.ringBoost)
  const photonRing = buildAnnulus("photon-ring", ringRadius, ringTube, ringColor, 1)
  photonRing.renderOrder = 30
  group.add(photonRing)

  /* -- 3. Lensed halo: tilted twin annulus (Gargantua over-the-top arc) ---- */
  const haloRadius = options.haloRadius ?? horizonRadius * d.haloRadiusFactor
  const haloTube = options.haloTube ?? Math.max(0.016, horizonRadius * d.haloTubeFactor)
  const haloTilt = options.haloTiltRadians ?? THREE.MathUtils.degToRad(d.haloTiltDegrees)
  // Dimmer, thinner, tipped ~80deg out of the disc plane: the far arc passes
  // behind the horizon and is clipped by its depth, leaving the classic
  // arcs peeking above/below the shadow.
  const haloColor = ACCENT.clone().lerp(PALE, 0.25).multiplyScalar(d.haloBoost)
  const halo = buildAnnulus("lensed-halo", haloRadius, haloTube, haloColor, d.haloOpacity)
  halo.rotation.x = haloTilt
  halo.renderOrder = 20
  group.add(halo)

  /* -- 4. Group-level teardown --------------------------------------------- */
  group.dispose = () => {
    group.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.geometry.dispose()
      const material = mesh.material
      if (Array.isArray(material)) {
        for (const m of material) m.dispose()
      } else {
        material.dispose()
      }
    })
    group.clear()
  }

  return group
}
