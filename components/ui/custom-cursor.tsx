"use client"

import { useEffect, useRef } from "react"

/**
 * Precision cursor layer: instant dragon logo-mark.
 * The mark follows the pointer 1:1, tilts subtly with horizontal pointer
 * velocity (clamped, eased back to level at rest) and swells over interactive
 * elements. Enhancement only — the native cursor is never hidden, and this never
 * renders on touch devices or under prefers-reduced-motion.
 *
 * Theme polish is pure CSS below ([data-theme="light"]): a soft warm
 * drop-shadow keeps the orange mark legible on cream.
 */
const CURSOR_CSS = `
.fx-cursor-mark {
  will-change: transform;
  filter: drop-shadow(0 0 12px rgba(255, 106, 0, 0.35));
}
[data-theme="light"] .fx-cursor-mark {
  filter: drop-shadow(0 3px 8px rgba(120, 53, 15, 0.45))
    drop-shadow(0 0 3px rgba(10, 9, 8, 0.2));
}
`

export default function CustomCursor() {
  const markRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const mark = markRef.current
    const img = imgRef.current
    if (!mark || !img) return

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!fine.matches || reduced.matches) return

    const clamp = (v: number, min: number, max: number) =>
      v < min ? min : v > max ? max : v

    let mouseX = -100
    let mouseY = -100
    let prevX = -100
    let prevY = -100
    let tilt = 0
    let markScale = 1
    let hovering = false
    let raf = 0
    let shown = false

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!shown) {
        shown = true
        prevX = mouseX
        prevY = mouseY
        mark.style.opacity = "1"
      }
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      hovering = !!target?.closest("a, button, [data-cursor='hover']")
    }

    const loop = () => {
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
          width={84}
          height={84}
          draggable={false}
          className="fx-cursor-mark h-21 w-21 select-none"
        />
      </div>
    </>
  )
}