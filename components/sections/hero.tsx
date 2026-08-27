import type { CSSProperties } from "react"
import { HERO, SITE } from "@/lib/content"
import Eyebrow from "@/components/ui/eyebrow"
import Reveal from "@/components/ui/reveal"

function splitAccent(text: string): { lead: string; accent: string } {
  const idx = text.lastIndexOf(" ")
  if (idx === -1) return { lead: "", accent: text }
  return { lead: text.slice(0, idx + 1), accent: text.slice(idx + 1) }
}

export default function HeroSection() {
  const { lead, accent } = splitAccent(HERO.headlineAccent)

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center">
      {/* Liquid glass backdrop behind hero content */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto max-w-5xl px-5 md:px-8 -z-10">
        <div className="rounded-3xl liquid-glass py-16" aria-hidden="true" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-32 md:px-8 relative z-10">
        <Reveal variant="mask">
          <Eyebrow index="00" label={SITE.role} className="mb-8" />
        </Reveal>

        <h1 className="text-display" itemProp="name">
          <Reveal variant="mask" as="span" className="block">
            <span className="mask-line">
              <span className="mask-inner" style={{ "--stagger": "100ms" } as CSSProperties}>
                {HERO.headline}
              </span>
            </span>
            <span className="mask-line">
              <span className="mask-inner" style={{ "--stagger": "220ms" } as CSSProperties}>
                {lead}
                <span className="text-accent-text">{accent}</span>
              </span>
            </span>
          </Reveal>
        </h1>

        <Reveal variant="fade" delayMs={520} className="mt-8 max-w-xl">
          <p className="text-lg leading-relaxed text-ink-muted">{HERO.sub}</p>
        </Reveal>

        <Reveal variant="fade" delayMs={680} className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href={HERO.ctas[0].href}
            className="inline-flex items-center rounded-full liquid-glass-pill bg-accent px-8 py-4 font-medium text-primary-foreground transition-all duration-300 ease-brand hover:brightness-110 hover:shadow-[0_0_28px_rgba(255,106,0,0.3)] active:scale-[0.96]"
          >
            {HERO.ctas[0].label}
          </a>
          <a
            href={HERO.ctas[1].href}
            className="text-signage inline-flex items-center rounded-full liquid-glass-pill border border-hairline px-8 py-4 text-ink transition-colors duration-300 ease-brand hover:border-white/25 active:scale-[0.96]"
          >
            {HERO.ctas[1].label}
          </a>
        </Reveal>
      </div>

      <div aria-hidden="true" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-signage text-[10px] text-ink-muted">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-white/10">
          <span className="animate-scroll-cue absolute inset-x-0 top-0 h-full w-px bg-accent" />
        </span>
      </div>
    </section>
  )
}