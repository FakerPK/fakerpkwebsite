"use client"

import { useEffect } from "react"
import Lenis from "lenis"

/**
 * Inertial smooth scrolling + anchor interception.
 * Disabled entirely under prefers-reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({ lerp: 0.09 })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Route in-page anchors through Lenis so headings clear the fixed nav.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute("href")
      if (!hash || hash.length < 2) return
      const target = document.querySelector(hash)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -96 })
    }
    document.addEventListener("click", onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("click", onClick)
      lenis.destroy()
    }
  }, [])

  return null
}
