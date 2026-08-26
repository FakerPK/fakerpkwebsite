"use client"

import { useEffect, useRef } from "react"

/**
 * Precision cursor layer: instant orange dot + lerped difference-blend ring.
 * Ring scales up over interactive elements. Enhancement only —
 * the native cursor is never hidden, and this never renders on touch
 * devices or under prefers-reduced-motion.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!fine.matches || reduced.matches) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let hovering = false
    let raf = 0
    let shown = false

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!shown) {
        shown = true
        ringX = mouseX
        ringY = mouseY
        dot.style.opacity = "1"
        ring.style.opacity = "1"
      }
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      hovering = !!target?.closest("a, button, [data-cursor='hover']")
      const scale = hovering ? 1.6 : 1
      ring.style.transform = `translate(-50%, -50%) scale(${scale})`
      dot.style.opacity = hovering ? "0.4" : "1"
    }

    const loop = () => {
      // Dot follows instantly; ring trails with lerp 0.15.
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      dot.style.left = `${mouseX}px`
      dot.style.top = `${mouseY}px`
      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`
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
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[90] hidden h-1.5 w-1.5 rounded-full bg-accent opacity-0 md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[90] hidden h-[34px] w-[34px] rounded-full border border-white/80 opacity-0 mix-blend-difference md:block"
        style={{ transform: "translate(-50%, -50%)", transition: "scale 250ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
    </>
  )
}
