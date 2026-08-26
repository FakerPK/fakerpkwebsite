export type DeviceTier = "mobile" | "tablet" | "desktop"

export interface TierConfig {
  particles: number
  dprMax: number
  debris: number
}

/**
 * Per-tier budget for the black hole scene (components/three/gravity-scene.tsx).
 *
 * `particles` / `debris` size the two per-frame CPU loops (dust integration,
 * instance matrix updates) and their buffer uploads — held flat from the
 * previous scene: the dust density is what reads as material feeding the
 * horizon, and the debris ring costs one instanced draw call regardless.
 *
 * `dprMax` is the fill-rate lever. The new scene runs a full-screen effect
 * chain every frame (bloom mip chain + grain + vignette) plus the disk's
 * fbm fragment shader on top of the unchanged simulation, so the DPR caps
 * come DOWN from the old star-scene values to keep total per-frame pixel
 * cost at or below it:
 *   mobile  1.5 -> 1.35  (~19% fewer pixels)
 *   tablet  1.75 -> 1.5  (~26% fewer pixels)
 *   desktop 1.75 -> 1.6  (~17% fewer pixels)
 * Additive glow and bloom smear mask the softness (the canvas already runs
 * antialias: false), so this trades resolution the eye doesn't parse for
 * headroom the composer needs.
 */
export const TIER_CONFIG: Record<DeviceTier, TierConfig> = {
  mobile: { particles: 2500, dprMax: 1.35, debris: 70 },
  tablet: { particles: 6000, dprMax: 1.5, debris: 110 },
  desktop: { particles: 9000, dprMax: 1.6, debris: 140 },
}

/**
 * Soft simulation bounds; dust particles wrap around these.
 *
 * Bound contract with gravity-scene.tsx (do not tighten blindly):
 *  - xy MUST exceed 13.8 — the largest dust respawn radius (12 + 1.8) in
 *    DustField. Below that, respawned particles instantly teleport across
 *    the field and the inflow streams visibly pop.
 *  - xy stays at 14 so wraps land off-frame: the fov-42 camera pulls back
 *    to distance ~13 looking at the origin, framing roughly +/-9 world
 *    units wide at 16:9, so the wrap seam is never on screen even though
 *    the field now organizes into visible spiral infall instead of an
 *    isotropic haze.
 *  - zMin/zMax (+/-6) hold a foreground layer between the hole plane (z=0)
 *    and the camera (z ~8.5 -> ~11 at full scroll) for parallax depth; the
 *    gaussian z scatter (sigma 1.6) makes these wraps nearly never fire.
 */
export const SCENE_BOUNDS = { xy: 14, zMin: -6, zMax: 6 } as const

/**
 * Classify the device once, on the client only.
 * Never call at module scope — reads window/navigator.
 * (gravity-scene.tsx calls getSceneConfig() once per mount via useState.)
 */
export function detectTier(): DeviceTier {
  if (typeof window === "undefined") return "desktop"
  const coarse = window.matchMedia("(pointer: coarse)").matches
  const width = window.innerWidth
  const cores = navigator.hardwareConcurrency ?? 4
  if (coarse || width < 768) return "mobile"
  if (width < 1280 || cores <= 4) return "tablet"
  return "desktop"
}

export function getSceneConfig(): TierConfig {
  return TIER_CONFIG[detectTier()]
}
