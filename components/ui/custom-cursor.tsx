"use client"

import { useEffect, useRef } from "react"

/**
 * Precision cursor layer: instant dragon logo-mark + lerped difference-blend
 * ring. The mark follows the pointer 1:1, tilts subtly with horizontal pointer
 * velocity (clamped, eased back to level at rest) and swells over interactive
 * elements; the ring trails behind as its echo, sized to frame the mark.
 * Enhancement only — the native cursor is never hidden, and this never
 * renders on touch devices or under prefers-reduced-motion.
 *
 * Theme polish is pure CSS below ([data-theme="light"]): a soft warm
 * drop-shadow keeps the orange mark legible on cream, and the ring drops
 * difference blending for a solid ink line.
 */
const CURSOR_CSS = `
.fx-cursor-mark {
  will-change: transform;
  filter: drop-shadow(0 0 8px rgba(255, 106, 0, 0.28));
}
.fx-cursor-ring {
  transition: opacity 250ms cubic-bezier(0.16, 1, 0.3, 1);
}
[data-theme="light"] .fx-cursor-mark {
  filter: drop-shadow(0 2px 5px rgba(120, 53, 15, 0.38))
    drop-shadow(0 0 2px rgba(10, 9, 8, 0.16));
}
[data-theme="light"] .fx-cursor-ring {
  mix-blend-mode: normal;
  border-color: rgba(68, 44, 24, 0.45);
}
`

export default function CustomCursor() {
  const markRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mark = markRef.current
    const img = imgRef.current
    const ring = ringRef.current
    if (!mark || !img || !ring) return

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!fine.matches || reduced.matches) return

    const clamp = (v: number, min: number, max: number) =>
      v < min ? min : v > max ? max : v

    let mouseX = -100
    let mouseY = -100
    let prevX = -100
    let prevY = -100
    let ringX = -100
    let ringY = -100
    let tilt = 0
    let markScale = 1
    let ringScale = 1
    let hovering = false
    let raf = 0
    let shown = false

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!shown) {
        shown = true
        // Snap the velocity baseline so the first frame doesn't produce a
        // phantom tilt spike from the (-100, -100) origin.
        prevX = mouseX
        prevY = mouseY
        ringX = mouseX
        ringY = mouseY
        mark.style.opacity = "1"
        ring.style.opacity = "1"
      }
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      hovering = !!target?.closest("a, button, [data-cursor='hover']")
      ring.style.opacity = hovering ? "0.55" : "1"
    }

    const loop = () => {
      // Mark position is instant; tilt tracks per-frame horizontal velocity
      // (clamped, lerped — settles back to level when the pointer rests).
      const vx = mouseX - prevX
      prevX = mouseX
      prevY = mouseY
      const tiltTarget = clamp(vx * 0.9, -14, 14)
      tilt += (tiltTarget - tilt) * 0.2

      const markScaleTarget = hovering ? 1.35 : 1
      markScale += (markScaleTarget - markScale) * 0.22

      mark.style.left = `${mouseX}px`
      mark.style.top = `${mouseY}px`
      img.style.transform = `rotate(${tilt.toFixed(2)}deg) scale(${markScale.toFixed(3)})`

      // Ring trails on lerp 0.15; scale rides the same rAF so the pair
      // breathes together.
      const ringScaleTarget = hovering ? 1.5 : 1
      ringScale += (ringScaleTarget - ringScale) * 0.22
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`
      ring.style.transform = `translate(-50%, -50%) scale(${ringScale.toFixed(3)})`

      raf = requestAnimationFrame(loop)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mouseover", onOver, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseover", onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <style>{CURSOR_CSS}</style>
      <div
        ref={markRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[90] hidden opacity-0 md:block"
        style={{ left: -100, top: -100, transform: "translate(-50%, -50%)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="/logo-mark.png"
          alt=""
          width={28}
          height={28}
          draggable={false}
          className="fx-cursor-mark h-7 w-7 select-none"
        />
      </div>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fx-cursor-ring pointer-events-none fixed z-[90] hidden h-10 w-10 rounded-full border border-white/70 opacity-0 mix-blend-difference md:block"
        style={{ left: -100, top: -100, transform: "translate(-50%, -50%)" }}
      />
    </>
  )
}
