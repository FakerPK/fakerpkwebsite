import { ABOUT, SKILLS } from "@/lib/content"
import Eyebrow from "@/components/ui/eyebrow"
import Reveal from "@/components/ui/reveal"

export default function SkillsSection() {
  return (
    <section id="stack" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-5 md:px-8 relative z-10">
        <div className="liquid-glass-wrapper rounded-2xl p-8 md:p-12">
          <Reveal variant="mask">
            <Eyebrow index="01" label="Systems" className="mb-8" />
          </Reveal>

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_380px]">
            <Reveal variant="mask">
              <h2 className="text-display-md">
                The toolkit behind
                <br />
                <span className="text-accent-text">the uptime.</span>
              </h2>
            </Reveal>
            <Reveal variant="fade" delayMs={200}>
              <p className="max-w-md text-sm leading-relaxed text-ink-muted lg:justify-self-end">{ABOUT}</p>
            </Reveal>
          </div>

          <ul className="mt-20 border-t border-hairline">
            {SKILLS.map((skill, i) => (
              <li key={skill.name}>
                <Reveal variant="fade" delayMs={i * 70}>
                  <div className="group -mx-3 grid grid-cols-[3rem_1fr] items-baseline gap-6 rounded-lg border-b border-hairline px-3 py-7 transition-colors duration-200 ease-brand hover:bg-surface/60 sm:grid-cols-[3rem_1fr_auto]">
                    <span className="font-mono text-xs text-ink-muted">0{i + 1}</span>
                    <h3 className="font-display text-2xl font-medium tracking-tight transition-all duration-300 ease-brand group-hover:translate-x-1 group-hover:text-accent-text md:text-3xl">
                      {skill.name}
                    </h3>
                    <p className="col-span-2 max-w-xs pl-[3.75rem] text-sm text-ink-muted sm:col-span-1 sm:pl-0 sm:text-right">
                      {skill.tagline}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}