"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
}

/**
 * Magnetic pull wrapper: the element drifts toward the cursor within a
 * falloff radius and springs back on leave. Pure rAF — no animation libs.
 * Inert on touch devices and under prefers-reduced-motion.
 */
export default function MagneticButton({ children, className = "" }: MagneticButtonProps) {
  const outerRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!fine.matches || reduced.matches) return

    let targetX = 0
    let targetY = 0
    let x = 0
    let y = 0
    let raf = 0
    let rect: DOMRect | null = null

    const recache = () => {
      rect = outer.getBoundingClientRect()
    }
    recache()
    window.addEventListener("resize", recache)
    window.addEventListener("scroll", recache, { passive: true })

    const onMove = (e: MouseEvent) => {
      if (!rect) return
      // Rect is viewport-relative; mouse coords match while page is unscrolled
      // relative to cache time — recache on scroll keeps this honest.
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const radius = Math.max(rect.width, rect.height) * 1.5

      if (dist < radius) {
        const strength = 1 - dist / radius
        targetX = dx * 0.35 * strength
        targetY = dy * 0.35 * strength
      } else {
        targetX = 0
        targetY = 0
      }
    }

    const loop = () => {
      // Spring-lerp toward target; returns smoothly when target resets to 0.
      x += (targetX - x) * 0.12
      y += (targetY - y) * 0.12
      outer.style.transform = `translate(${x}px, ${y}px)`
      inner.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      window.removeEventListener("resize", recache)
      window.removeEventListener("scroll", recache)
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <span ref={outerRef} className={`inline-block will-change-transform ${className}`.trim()}>
      <span ref={innerRef} className="inline-block">
        {children}
      </span>
    </span>
  )
}
