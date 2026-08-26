"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { getTheme, setTheme, subscribe, type Theme } from "@/lib/theme"

/**
 * Ghost-language theme switcher for the nav row.
 *
 * Hydration safety: SSR and the first client render cannot know the theme the
 * inline no-flash script put on <html>, so both render a dimmed-sun
 * placeholder. subscribe() fires synchronously on mount with the resolved
 * theme (and keeps syncing on THEME_EVENT + cross-tab storage writes), so the
 * icon never contradicts the painted page and no mismatch warning fires.
 *
 * Click path: read the source of truth (the DOM attribute via getTheme()),
 * ask lib/theme.setTheme() to persist + apply + broadcast; our subscription
 * echoes the change back into state.
 */
export default function ThemeToggle() {
  // null = pre-mount placeholder state.
  const [theme, setThemeState] = useState<Theme | null>(null)

  // subscribe() calls back once immediately, then forwards change/storage
  // events; its return value is the effect cleanup.
  useEffect(() => subscribe(setThemeState), [])

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(getTheme() === "dark" ? "light" : "dark")}
      className="relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-ink-muted transition-all duration-300 ease-brand hover:bg-accent hover:text-accent-foreground active:scale-[0.96]"
    >
      {/* Crossfade + quarter-turn swap; overflow-hidden clips the turn inside the pill */}
      <Sun
        aria-hidden="true"
        className={`absolute size-[18px] transition-all duration-300 ease-brand ${
          theme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : theme === "dark"
              ? "-rotate-90 scale-50 opacity-0"
              : "rotate-0 scale-100 opacity-40"
        }`}
      />
      <Moon
        aria-hidden="true"
        className={`absolute size-[18px] transition-all duration-300 ease-brand ${
          theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"
        }`}
      />
    </button>
  )
}
