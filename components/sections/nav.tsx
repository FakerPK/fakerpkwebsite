"use client"

import { useEffect, useState } from "react"
import MagneticButton from "@/components/ui/magnetic-button"

const LINKS = [
  { label: "Stack", href: "#stack" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-5 md:px-8">
        <div
          className={`flex h-14 items-center justify-between rounded-full px-5 transition-all duration-300 ease-brand md:px-6 ${
            scrolled ? "glass" : "border border-transparent"
          }`}
        >
          <a href="#home" className="group flex items-center gap-2.5" aria-label="FakerPK — back to top">
            <span className="font-display text-sm font-bold tracking-tight text-ink">
              FAKER PK<span className="text-accent">™</span>
            </span>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-signage text-ink-muted transition-colors duration-200 ease-brand hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <MagneticButton>
            <a
              href="#contact"
              className="text-signage inline-flex items-center rounded-full bg-accent px-4 py-2 text-void transition-all duration-300 ease-brand hover:brightness-110 active:scale-[0.96]"
            >
              Get In Touch
            </a>
          </MagneticButton>
        </div>
      </div>
    </header>
  )
}
