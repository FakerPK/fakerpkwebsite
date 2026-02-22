"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home")
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  })
  const [shouldPop, setShouldPop] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === "light"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "technologies", "portfolio", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setShouldPop(true)
      setTimeout(() => setShouldPop(false), 600)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!mounted) return null

  return (
    <nav className="fixed top-6 left-1/2 z-50 hidden -translate-x-1/2 md:block">
      <div className="relative">
        <div className="absolute inset-0 rounded-full animate-spin-slow">
          <div
            className={`absolute top-0 left-1/2 h-2 w-2 ${isLight ? "bg-orange-400/40" : "bg-primary/30"} -translate-x-1/2 -translate-y-3 rounded-full blur-sm`}
          ></div>
          <div
            className={`absolute bottom-0 left-1/2 h-2 w-2 ${isLight ? "bg-orange-400/40" : "bg-primary/30"} -translate-x-1/2 translate-y-3 rounded-full blur-sm`}
          ></div>
          <div
            className={`absolute top-1/2 left-0 h-2 w-2 ${isLight ? "bg-orange-400/40" : "bg-primary/30"} -translate-x-3 -translate-y-1/2 rounded-full blur-sm`}
          ></div>
          <div
            className={`absolute top-1/2 right-0 h-2 w-2 ${isLight ? "bg-orange-400/40" : "bg-primary/30"} translate-x-3 -translate-y-1/2 rounded-full blur-sm`}
          ></div>
        </div>

        <ul
          onMouseLeave={() => {
            setPosition((pv) => ({
              ...pv,
              opacity: 0,
            }))
          }}
          className={`navbar-gradient relative mx-auto flex w-fit rounded-full border-2 p-1.5 shadow-xl backdrop-blur-md transition-all duration-500 hover:scale-110 hover:shadow-2xl ${
            isLight
              ? "border-orange-300/70 bg-white/95 hover:shadow-orange-500/30"
              : "border-orange-500/30 bg-black/80 hover:shadow-orange-500/20"
          } ${shouldPop ? "scale-110 shadow-2xl shadow-orange-500/20" : ""}`}
        >
          <Tab setPosition={setPosition} onClick={() => scrollToSection("home")} isActive={activeSection === "home"} isLight={isLight}>
            Home
          </Tab>
          <Tab
            setPosition={setPosition}
            onClick={() => scrollToSection("technologies")}
            isActive={activeSection === "technologies"}
            isLight={isLight}
          >
            Tech
          </Tab>
          <Tab
            setPosition={setPosition}
            onClick={() => scrollToSection("portfolio")}
            isActive={activeSection === "portfolio"}
            isLight={isLight}
          >
            Work
          </Tab>
          <Tab
            setPosition={setPosition}
            onClick={() => scrollToSection("contact")}
            isActive={activeSection === "contact"}
            isLight={isLight}
          >
            Contact
          </Tab>

          <Cursor position={position} isLight={isLight} />
        </ul>
      </div>
    </nav>
  )
}

const Tab = ({
  children,
  setPosition,
  onClick,
  isActive,
  isLight,
}: {
  children: React.ReactNode
  setPosition: (position: any) => void
  onClick: () => void
  isActive: boolean
  isLight: boolean
}) => {
  const ref = useRef<HTMLLIElement>(null)

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return

        const { width } = ref.current.getBoundingClientRect()

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        })
      }}
      onClick={onClick}
      className={`relative z-10 block cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
        isLight
          ? isActive
            ? "font-semibold text-zinc-900"
            : "text-zinc-700 hover:text-zinc-900"
          : isActive
            ? "font-semibold text-white"
            : "text-zinc-300 hover:text-white"
      }`}
    >
      {children}
    </li>
  )
}

const Cursor = ({
  position,
  isLight,
}: { position: { left: number; width: number; opacity: number }; isLight: boolean }) => {
  return (
    <motion.li
      animate={{
        left: position.left + 6,
        width: position.width - 12,
        opacity: position.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className="absolute z-0 h-9 rounded-full bg-primary shadow-lg"
      style={{
        boxShadow: isLight
          ? "0 0 20px rgba(255, 106, 0, 0.35), 0 0 40px rgba(255, 106, 0, 0.15)"
          : "0 0 20px rgba(255, 102, 0, 0.5), 0 0 40px rgba(255, 102, 0, 0.3)",
      }}
    />
  )
}
