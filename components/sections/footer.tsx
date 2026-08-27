import { ArrowUp } from "lucide-react"
import Image from "next/image"
import { FOOTER } from "@/lib/content"
import Reveal from "@/components/ui/reveal"

/* Wordmark theme switch: both variants stay stacked; the active theme's
   ancestor attribute picks which one shows. Crossfades on the shared ease. */
const WORDMARK_THEME_CSS = `
.fpk-wordmark .fpk-wordmark-img {
  transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.fpk-wordmark .fpk-wordmark-light {
  opacity: 0;
}
[data-theme="light"] .fpk-wordmark .fpk-wordmark-dark {
  opacity: 0;
}
[data-theme="light"] .fpk-wordmark .fpk-wordmark-light {
  opacity: 1;
}
`

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-hairline">
      <style>{WORDMARK_THEME_CSS}</style>

      <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:px-8 relative z-10">
        {/* Liquid glass backdrop wrapping footer content */}
        <div className="liquid-glass p-6 md:p-8 -m-6 md:-m-8 rounded-2xl" aria-hidden="true" />

        <Reveal variant="fade">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
            <div className="flex items-center gap-6">
              <Image
                src="/logo-mark.png"
                alt=""
                aria-hidden="true"
                width={500}
                height={500}
                className="h-24 w-24 object-contain opacity-90 drop-shadow-[0_0_24px_rgba(255,106,0,0.3)]"
              />
              <span aria-hidden="true" className="h-18 w-px bg-hairline" />
              <span className="fpk-wordmark relative inline-flex h-27">
                <Image
                  src="/wordmark-ondark.png"
                  alt="FakerPK"
                  width={500}
                  height={149}
                  className="fpk-wordmark-img fpk-wordmark-dark h-full w-auto"
                />
                <Image
                  src="/wordmark-onlight.png"
                  alt=""
                  aria-hidden="true"
                  width={500}
                  height={150}
                  className="fpk-wordmark-img fpk-wordmark-light absolute left-0 top-0 h-full w-auto"
                />
              </span>
            </div>

            <a
              href="#home"
              aria-label="Back to top"
              className="group inline-flex items-center gap-2 text-signage text-ink-muted transition-colors duration-200 ease-brand hover:text-accent-text"
            >
              Back to top
              <ArrowUp size={14} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 ease-brand group-hover:-translate-y-0.5" />
            </a>
          </div>

          <p className="text-signage mt-9 text-ink-muted">{FOOTER}</p>
        </Reveal>
      </div>
    </footer>
  )
}