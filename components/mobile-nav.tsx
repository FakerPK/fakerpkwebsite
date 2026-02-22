"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Code, Briefcase, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === "light"

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false)
    }
  }

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "technologies", label: "Tech", icon: Code },
    { id: "portfolio", label: "Work", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Mail },
  ]

  return (
    <div className="fixed top-6 right-6 z-50 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`border-2 backdrop-blur-sm transition-all duration-300 ${
          isLight
            ? "border-orange-300 bg-white/90 hover:border-orange-400 hover:bg-white"
            : "border-primary/30 bg-black/80 hover:border-primary/50 hover:bg-black/90"
        }`}
        style={{
          boxShadow: isOpen ? "0 0 20px rgba(255, 102, 0, 0.25)" : "0 0 10px rgba(255, 102, 0, 0.15)",
        }}
      >
        {isOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-14 right-0 min-w-[140px] rounded-lg border-2 p-2 backdrop-blur-md ${
              isLight ? "border-orange-300 bg-white/95" : "border-primary/30 bg-black/90"
            }`}
            style={{
              boxShadow: "0 0 30px rgba(255, 102, 0, 0.18), 0 0 60px rgba(255, 102, 0, 0.08)",
            }}
          >
            {navItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full justify-start gap-3 text-left transition-all duration-200 ${
                      isLight
                        ? "text-zinc-800 hover:bg-orange-100 hover:text-orange-700"
                        : "text-white hover:bg-primary/20 hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
