"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

declare global {
  interface Window {
    VANTA: any
    THREE: any
  }
}

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === "light"

  useEffect(() => {
    const checkScreenSize = () => window.innerWidth >= 768

    if (!checkScreenSize()) return

    const loadScripts = async () => {
      if (!window.THREE) {
        const threeScript = document.createElement("script")
        threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        threeScript.async = true
        document.head.appendChild(threeScript)

        await new Promise((resolve) => {
          threeScript.onload = resolve
        })
      }

      if (!window.VANTA) {
        const vantaScript = document.createElement("script")
        vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
        vantaScript.async = true
        document.head.appendChild(vantaScript)

        await new Promise((resolve) => {
          vantaScript.onload = resolve
        })
      }

      if (vantaRef.current && window.VANTA) {
        if (vantaEffect.current) {
          vantaEffect.current.destroy()
          vantaEffect.current = null
        }

        vantaEffect.current = window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: isLight ? 0xff8c42 : 0x9c3d02,
          backgroundColor: isLight ? 0xfff7ed : 0x0a0502,
          points: 15.0,
          spacing: 18.0,
          maxDistance: 16.0,
        })
      }
    }

    loadScripts()

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [isLight])

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 z-0 hidden md:block"
      style={{ pointerEvents: "none", opacity: isLight ? 0.22 : 0.3 }}
    />
  )
}
