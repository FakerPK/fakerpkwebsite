/**
 * Static film-grain material layer. Purely decorative.
 *
 * All styling — texture, z-position, pointer-events, static (non-animated)
 * behavior, opacity (from the `--grain-opacity` token, 0.06 fallback) and
 * blend mode (`--grain-blend-mode`, soft-light fallback) — is owned by the
 * `.grain-overlay` rule in app/globals.css. This component renders only the
 * bare hooking element: React types mixBlendMode as a strict union that
 * rejects var() strings, so the values must stay plain CSS.
 */
export default function GrainOverlay() {
  return <div aria-hidden="true" className="grain-overlay" />
}
