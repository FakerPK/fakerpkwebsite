"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function CursorFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    // Only add listeners on desktop
    const mediaQuery = window.matchMedia("(min-width: 768px)")

    if (mediaQuery.matches) {
      document.addEventListener("mousemove", updateMousePosition)
      document.addEventListener("mouseleave", handleMouseLeave)
    }

    const handleResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        document.addEventListener("mousemove", updateMousePosition)
        document.addEventListener("mouseleave", handleMouseLeave)
      } else {
        document.removeEventListener("mousemove", updateMousePosition)
        document.removeEventListener("mouseleave", handleMouseLeave)
        setIsVisible(false)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      document.removeEventListener("mousemove", updateMousePosition)
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <motion.div
      className="fixed pointer-events-none z-50 hidden md:block"
      animate={{
        x: mousePosition.x + 15,
        y: mousePosition.y + 15,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 200,
        mass: 1.2,
      }}
      style={{
        left: 0,
        top: 0,
      }}
    >
      <div className="relative w-16 h-16">
        <Image
          src="/images/dragon-logo.png"
          alt="Dragon cursor"
          width={200}
          height={200}
          className="w-full h-full object-contain drop-shadow-lg"
          style={{
            filter: "drop-shadow(0 0 8px rgba(255, 165, 0, 0.6))",
          }}
        />
      </div>
    </motion.div>
  )
}
