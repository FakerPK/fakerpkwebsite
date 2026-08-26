import { ArrowUp } from "lucide-react"
import { FOOTER } from "@/lib/content"

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10 md:px-8">
        <p className="text-signage text-ink-muted">{FOOTER}</p>
        <a
          href="#home"
          aria-label="Back to top"
          className="group inline-flex items-center gap-2 text-signage text-ink-muted transition-colors duration-200 ease-brand hover:text-accent"
        >
          Back to top
          <ArrowUp size={14} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 ease-brand group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  )
}
