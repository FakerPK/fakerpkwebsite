"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Send } from "lucide-react"

export default function HeroSection() {
  const logoRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const logo = logoRef.current
    if (!logo) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = logo.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * 0.05
      const deltaY = (e.clientY - centerY) * 0.05

      logo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`
    }

    const handleMouseLeave = () => {
      logo.style.transform = "translate(0px, 0px) scale(1)"
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const socialLinks = [
    { icon: Github, href: "https://github.com/FakerPK", label: "GitHub" },
    { icon: Twitter, href: "https://x.com/fakerpk", label: "Twitter" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/fakerpk", label: "LinkedIn" },
    { icon: Send, href: "https://t.me/+rurxli5cagplMjM8", label: "Telegram" },
  ]

  return (
    <section id="home" className="min-h-screen flex flex-col relative overflow-hidden z-10">
      <div className="absolute top-6 left-6 md:block hidden z-10">
        <Image src="/images/dragon-logo.png" alt="Dragon Logo" width={140} height={140} className="animate-float" />
      </div>

      <div className="flex items-center justify-center text-center md:mt-16 min-h-screen">
        <div className="max-w-4xl px-4">
          <div className="md:hidden flex justify-center mb-6">
            <Image src="/images/dragon-logo.png" alt="Dragon Logo" width={120} height={120} className="animate-float" />
          </div>

          <div ref={logoRef} className="mb-8 transition-transform duration-300 ease-out">
            <Image
              src={isDark ? "/images/faker-dark.png" : "/images/faker-light.png"}
              alt="FAKER PK Logo"
              width={500}
              height={150}
              className="mx-auto w-80 md:w-[500px]"
              priority
            />
          </div>

          <div className="flex justify-center gap-3 md:gap-4 mb-8">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                </Button>
              )
            })}
          </div>

          <h1 className="text-2xl md:text-5xl font-bold mb-6 text-balance text-foreground">Backend and Automations Developer</h1>

          <p className="text-base md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Ceating exceptional scripts and backend tech with newly implemented technologies and reverse engineered solutions
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 md:px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-secondary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 text-sm md:text-base"
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 md:px-8 py-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 text-sm md:text-base"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
