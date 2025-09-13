"use client"

import { useEffect, useRef } from "react"

export default function InteractiveGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const isMobile = window.innerWidth < 768

    if (isMobile) {
      grid.style.background = `
        linear-gradient(rgba(255, 106, 0, 0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 106, 0, 0.15) 1px, transparent 1px)
      `
      grid.style.backgroundSize = "50px 50px"

      // Add animated wave effect for mobile
      let animationFrame: number
      let time = 0

      const animateGrid = () => {
        time += 0.02
        const intensity = (Math.sin(time) + 1) * 0.5 // Oscillates between 0 and 1
        const opacity = 0.1 + intensity * 0.2 // Between 0.1 and 0.3

        grid.style.background = `
          linear-gradient(rgba(255, 106, 0, ${opacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 106, 0, ${opacity}) 1px, transparent 1px)
        `

        animationFrame = requestAnimationFrame(animateGrid)
      }

      animateGrid()

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
      }
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = grid.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Create intense neon glow effect at cursor position
        grid.style.background = `
          radial-gradient(circle 120px at ${x}px ${y}px, rgba(255, 106, 0, 0.6) 0%, rgba(255, 106, 0, 0.3) 40%, transparent 70%),
          linear-gradient(rgba(255, 106, 0, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 106, 0, 0.2) 1px, transparent 1px)
        `
        grid.style.backgroundSize = "100% 100%, 50px 50px, 50px 50px"
      }

      const handleMouseLeave = () => {
        grid.style.background = `
          linear-gradient(rgba(255, 106, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 106, 0, 0.1) 1px, transparent 1px)
        `
        grid.style.backgroundSize = "50px 50px, 50px 50px"
      }

      grid.addEventListener("mousemove", handleMouseMove)
      grid.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        grid.removeEventListener("mousemove", handleMouseMove)
        grid.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div
      ref={gridRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `
          linear-gradient(rgba(255, 106, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 106, 0, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
      }}
    />
  )
}
