export type DeviceTier = "mobile" | "tablet" | "desktop"

export interface TierConfig {
  particles: number
  dprMax: number
  debris: number
}

export const TIER_CONFIG: Record<DeviceTier, TierConfig> = {
  mobile: { particles: 2500, dprMax: 1.5, debris: 70 },
  tablet: { particles: 6000, dprMax: 1.75, debris: 110 },
  desktop: { particles: 9000, dprMax: 1.75, debris: 140 },
}

/** Soft simulation bounds; particles wrap around these. */
export const SCENE_BOUNDS = { xy: 14, zMin: -6, zMax: 6 } as const

/**
 * Classify the device once, on the client only.
 * Never call at module scope — reads window/navigator.
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
