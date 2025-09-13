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
  const { theme } = useTheme()

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
      setTimeout(() => setShouldPop(false), 600) // Slower animation duration
    }, 4000) // Every 4 seconds instead of 2

    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="relative">
        <div className="absolute inset-0 rounded-full animate-spin-slow">
          <div
            className={`absolute top-0 left-1/2 w-2 h-2 ${theme === "light" ? "bg-black/30" : "bg-primary/30"} rounded-full transform -translate-x-1/2 -translate-y-3 blur-sm`}
          ></div>
          <div
            className={`absolute bottom-0 left-1/2 w-2 h-2 ${theme === "light" ? "bg-black/30" : "bg-primary/30"} rounded-full transform -translate-x-1/2 translate-y-3 blur-sm`}
          ></div>
          <div
            className={`absolute left-0 top-1/2 w-2 h-2 ${theme === "light" ? "bg-black/30" : "bg-primary/30"} rounded-full transform -translate-x-3 -translate-y-1/2 blur-sm`}
          ></div>
          <div
            className={`absolute right-0 top-1/2 w-2 h-2 ${theme === "light" ? "bg-black/30" : "bg-primary/30"} rounded-full transform translate-x-3 -translate-y-1/2 blur-sm`}
          ></div>
          <div
            className={`absolute top-1/4 right-1/4 w-1.5 h-1.5 ${theme === "light" ? "bg-black/20" : "bg-primary/20"} rounded-full blur-sm`}
          ></div>
          <div
            className={`absolute bottom-1/4 left-1/4 w-1.5 h-1.5 ${theme === "light" ? "bg-black/20" : "bg-primary/20"} rounded-full blur-sm`}
          ></div>
          <div
            className={`absolute top-3/4 right-3/4 w-1.5 h-1.5 ${theme === "light" ? "bg-black/20" : "bg-primary/20"} rounded-full blur-sm`}
          ></div>
          <div
            className={`absolute bottom-3/4 left-3/4 w-1.5 h-1.5 ${theme === "light" ? "bg-black/20" : "bg-primary/20"} rounded-full blur-sm`}
          ></div>
        </div>

        <ul
          onMouseLeave={() => {
            setPosition((pv) => ({
              ...pv,
              opacity: 0,
            }))
          }}
          className={`relative mx-auto flex w-fit rounded-full border-2 backdrop-blur-md p-1.5 shadow-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl ${
            theme === "light"
              ? "bg-white/90 border-gray-200 hover:shadow-black/20"
              : "bg-black/80 border-ring hover:shadow-primary/20"
          } ${shouldPop ? "scale-110 shadow-2xl" : ""} ${
            shouldPop && theme === "light" ? "shadow-black/20" : shouldPop ? "shadow-primary/20" : ""
          }`}
        >
          <Tab
            setPosition={setPosition}
            onClick={() => scrollToSection("home")}
            isActive={activeSection === "home"}
            theme={theme}
          >
            Home
          </Tab>
          <Tab
            setPosition={setPosition}
            onClick={() => scrollToSection("technologies")}
            isActive={activeSection === "technologies"}
            theme={theme}
          >
            Tech
          </Tab>
          <Tab
            setPosition={setPosition}
            onClick={() => scrollToSection("portfolio")}
            isActive={activeSection === "portfolio"}
            theme={theme}
          >
            Work
          </Tab>
          <Tab
            setPosition={setPosition}
            onClick={() => scrollToSection("contact")}
            isActive={activeSection === "contact"}
            theme={theme}
          >
            Contact
          </Tab>

          <Cursor position={position} theme={theme} />
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
  theme,
}: {
  children: React.ReactNode
  setPosition: (position: any) => void
  onClick: () => void
  isActive: boolean
  theme?: string
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
      className={`relative z-10 block cursor-pointer px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
        theme === "light"
          ? isActive
            ? "text-black font-semibold"
            : "text-black/70 hover:text-black"
          : isActive
            ? "text-white font-semibold"
            : "text-white/80 hover:text-white"
      }`}
    >
      {children}
    </li>
  )
}

const Cursor = ({
  position,
  theme,
}: { position: { left: number; width: number; opacity: number }; theme?: string }) => {
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
      className={`absolute z-0 h-9 rounded-full shadow-lg ${theme === "light" ? "bg-black" : "bg-primary"}`}
      style={{
        boxShadow:
          theme === "light"
            ? "0 0 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.2)"
            : "0 0 20px rgba(255, 102, 0, 0.5), 0 0 40px rgba(255, 102, 0, 0.3)",
      }}
    />
  )
}
