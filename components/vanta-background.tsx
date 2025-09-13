"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    VANTA: any
    THREE: any
  }
}

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    // Only load on desktop (md breakpoint and above)
    const checkScreenSize = () => {
      return window.innerWidth >= 768
    }

    if (!checkScreenSize()) return

    // Load Three.js and Vanta.js scripts
    const loadScripts = async () => {
      // Load Three.js
      if (!window.THREE) {
        const threeScript = document.createElement("script")
        threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        threeScript.async = true
        document.head.appendChild(threeScript)

        await new Promise((resolve) => {
          threeScript.onload = resolve
        })
      }

      // Load Vanta.js
      if (!window.VANTA) {
        const vantaScript = document.createElement("script")
        vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
        vantaScript.async = true
        document.head.appendChild(vantaScript)

        await new Promise((resolve) => {
          vantaScript.onload = resolve
        })
      }

      // Initialize Vanta effect
      if (vantaRef.current && window.VANTA && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x9c3d02, // Much dimmer orange/brown
          backgroundColor: 0x0a0502, // Very dark background
          points: 15.0, // Reduced points for less density
          spacing: 18.0, // Increased spacing for less clutter
          maxDistance: 16.0,
        })
      }
    }

    loadScripts()

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  return (
    <div ref={vantaRef} className="fixed inset-0 z-0 hidden md:block opacity-30" style={{ pointerEvents: "none" }} />
  )
}
