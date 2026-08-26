"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import MagneticButton from "@/components/ui/magnetic-button"
import ThemeToggle from "@/components/theme-toggle"
import { SITE } from "@/lib/content"

const LINKS = [
  { label: "Stack", href: "#stack" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
]

/*
 * Theme-keyed visuals, zero JS: both brand wordmarks render stacked in
 * the same spot; [data-theme] on <html> — set pre-paint by the inline
 * script in app/layout.tsx — decides visibility. No state, no
 * subscription, no hydration risk. The shared ease is the site-wide
 * cubic-bezier(0.16, 1, 0.3, 1) (.ease-brand vocabulary). The theme
 * toggle itself is the canonical components/theme-toggle.tsx.
 */
const NAV_THEME_CSS = `
.nav-brand{display:grid}
.nav-brand>*{grid-area:1/1}
.nav-brand img{height:2rem;width:auto;transition:opacity .35s cubic-bezier(.16,1,.3,1)}
.nav-brand .wordmark-light{opacity:0}
[data-theme="light"] .nav-brand .wordmark-dark{opacity:0}
[data-theme="light"] .nav-brand .wordmark-light{opacity:1}
`

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
      <style>{NAV_THEME_CSS}</style>
      <div className="mx-auto mt-4 max-w-6xl px-5 md:px-8">
        <div
          className={`flex h-14 items-center justify-between rounded-full px-5 transition-all duration-300 ease-brand md:px-6 ${
            scrolled ? "glass" : "border border-transparent"
          }`}
        >
          <a href="#home" className="nav-brand group" aria-label={`${SITE.name} — back to top`}>
            <Image
              src="/wordmark-ondark.png"
              alt=""
              width={500}
              height={149}
              priority
              className="wordmark-dark"
            />
            <Image
              src="/wordmark-onlight.png"
              alt=""
              width={500}
              height={150}
              aria-hidden="true"
              className="wordmark-light"
            />
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

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <MagneticButton>
              <a
                href="#contact"
                className="text-signage inline-flex items-center rounded-full bg-accent px-4 py-2 text-primary-foreground transition-all duration-300 ease-brand hover:brightness-110 active:scale-[0.96]"
              >
                Get In Touch
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>
    </header>
  )
}
