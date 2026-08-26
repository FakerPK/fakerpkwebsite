"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react"

type RevealVariant = "mask" | "fade"

interface RevealProps {
  children: ReactNode
  /** "mask" expects .mask-line > .mask-inner children; "fade" fades the whole block. */
  variant?: RevealVariant
  /** Transition delay in ms — drives the --stagger custom property. */
  delayMs?: number
  className?: string
  /** Element to render — use "span" when nesting inside headings. */
  as?: "div" | "span"
}

/**
 * IntersectionObserver reveal container.
 * Adds .is-inview once when ~20% visible; CSS handles all motion.
 * Under prefers-reduced-motion everything is already visible via globals.css,
 * but we also add the class immediately so JS-driven states stay consistent.
 */
export default function Reveal({
  children,
  variant = "fade",
  delayMs = 0,
  className = "",
  as = "div",
}: RevealProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = divRef.current ?? spanRef.current
    if (!el) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-inview")
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-inview")
            io.disconnect()
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style = { "--stagger": `${delayMs}ms` } as CSSProperties
  const classes = `${variant === "fade" ? "fade-item" : ""} ${className}`.trim()

  return as === "span" ? (
    <span ref={spanRef} style={style} className={classes}>
      {children}
    </span>
  ) : (
    <div ref={divRef as RefObject<HTMLDivElement>} style={style} className={classes}>
      {children}
    </div>
  )
}
