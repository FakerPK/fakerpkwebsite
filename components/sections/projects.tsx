import Image from "next/image"
import { ArrowUpRight, FileText, Github } from "lucide-react"
import { PROJECTS } from "@/lib/content"
import Eyebrow from "@/components/ui/eyebrow"
import Reveal from "@/components/ui/reveal"

// Editorial asymmetry: first card wide-left, second narrow-right and offset down.
// Sizes hints mirror that split so next/image picks the right candidate per column.
const CARD_LAYOUT = [
  "lg:col-span-7",
  "lg:col-span-5 lg:col-start-8 lg:mt-28",
]

const CARD_SIZES = ["(max-width: 1024px) 100vw, 58vw", "(max-width: 1024px) 100vw, 42vw"]

export default function ProjectsSection() {
  return (
    <section id="work" className="relative py-32 md:py-40">
      {/* Liquid glass backdrop behind projects content */}
      <div className="absolute inset-x-0 top-0 mx-auto max-w-5xl px-5 md:px-8 -z-10">
        <div className="rounded-3xl liquid-glass py-24 md:py-32" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-6xl px-5 md:px-8 relative z-10">
        <Reveal variant="mask">
          <Eyebrow index="02" label="In Production" className="mb-8" />
        </Reveal>

        <Reveal variant="mask">
          <h2 className="text-display-md">
            Two systems.
            <br />
            Zero <span className="text-accent-text">downtime.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-12 gap-6 md:mt-24 lg:gap-8">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.title} variant="fade" delayMs={i * 120} className={`col-span-12 ${CARD_LAYOUT[i] ?? ""}`}>
              <article
                data-cursor="hover"
                className="group overflow-hidden rounded-2xl liquid-glass transition-all duration-500 ease-brand hover:border-accent/30 hover:shadow-[0_0_40px_rgba(255,106,0,0.12)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                  <Image
                    src={project.image}
                    alt={`${project.title} — project visual`}
                    fill
                    sizes={CARD_SIZES[i] ?? "(max-width: 1024px) 100vw"}
                    className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent opacity-60"
                  />
                </div>

                <div className="space-y-5 p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-signage text-ink-muted">P·0{i + 1}</span>
                    <div className="flex flex-wrap justify-end gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full liquid-glass-pill px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold tracking-tight transition-colors duration-300 ease-brand group-hover:text-accent-text md:text-3xl">
                    {project.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-ink-muted md:text-base">{project.description}</p>

                  <div className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
                    <a
                      href={project.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} — read the Medium write-up`}
                      className="text-signage inline-flex items-center gap-2 text-ink underline-offset-8 decoration-white/20 transition-colors duration-200 ease-brand hover:text-accent-text hover:decoration-accent"
                    >
                      <FileText size={15} strokeWidth={1.5} aria-hidden="true" />
                      Write-up
                      <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 ease-brand hover:-translate-y-0.5 hover:translate-x-0.5" />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} — view source on GitHub`}
                      className="text-signage inline-flex items-center gap-2 text-ink underline-offset-8 decoration-white/20 transition-colors duration-200 ease-brand hover:text-accent-text hover:decoration-accent"
                    >
                      <Github size={15} strokeWidth={1.5} aria-hidden="true" />
                      Source
                      <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-300 ease-brand hover:-translate-y-0.5 hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}