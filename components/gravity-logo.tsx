"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function GravityLogo() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [velocity, setVelocity] = useState({ x: 0.8, y: 0.5 })
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    if (!isClient || !isMobile) return

    let animationFrame: number

    const animate = () => {
      setPosition((prev) => {
        let newX = prev.x + velocity.x
        let newY = prev.y + velocity.y

        // Bounce off walls
        if (newX <= 0 || newX >= window.innerWidth - 50) {
          setVelocity((v) => ({ ...v, x: -v.x * 0.8 }))
          newX = Math.max(0, Math.min(window.innerWidth - 50, newX))
        }

        if (newY <= 0 || newY >= window.innerHeight - 50) {
          setVelocity((v) => ({ ...v, y: -v.y * 0.8 }))
          newY = Math.max(0, Math.min(window.innerHeight - 50, newY))
        }

        setVelocity((v) => ({ ...v, y: v.y + 0.05 }))

        return { x: newX, y: newY }
      })

      animationFrame = requestAnimationFrame(animate)
    }

    // Handle scroll events for jump effect
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = Math.abs(currentScrollY - lastScrollY)

      if (scrollDelta > 50) {
        setVelocity((v) => ({
          x: v.x + (Math.random() - 0.5) * 2,
          y: v.y - Math.random() * 4 - 2,
        }))
      }

      setLastScrollY(currentScrollY)
    }

    animationFrame = requestAnimationFrame(animate)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      window.removeEventListener("scroll", handleScroll)
    }
  }, [velocity.x, velocity.y, lastScrollY, isClient, isMobile])

  if (!isClient || !isMobile) {
    return null
  }

  return (
    <div
      className="fixed z-50 pointer-events-none md:hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: "none",
      }}
    >
      <Image
        src="/images/dragon-logo.png"
        alt="Floating Dragon"
        width={50}
        height={50}
        className="opacity-90 drop-shadow-2xl brightness-110"
        style={{
          filter: "drop-shadow(0 0 10px rgba(255, 102, 0, 0.6))",
        }}
      />
    </div>
  )
}
