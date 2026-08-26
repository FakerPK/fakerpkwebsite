"use client"

import { useRef, useState, type FormEvent } from "react"
import Image from "next/image"
import emailjs from "@emailjs/browser"
import { CheckCircle2, Github, Linkedin, Loader2, Send, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import MagneticButton from "@/components/ui/magnetic-button"
import Eyebrow from "@/components/ui/eyebrow"
import Reveal from "@/components/ui/reveal"
import { COLLAB, EMAILJS } from "@/lib/content"

const SOCIAL_ICONS = { GitHub: Github, Twitter: Twitter, LinkedIn: Linkedin, Telegram: Send } as const

type FormStatus = "idle" | "sending" | "sent"

export default function CollabSection() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<FormStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formRef.current || status === "sending") return

    setStatus("sending")
    setError(null)
    try {
      await emailjs.sendForm(EMAILJS.serviceId, EMAILJS.templateId, formRef.current, {
        publicKey: EMAILJS.publicKey,
      })
      setStatus("sent")
      formRef.current.reset()
    } catch {
      setStatus("idle")
      setError("Message didn't send. Try again, or hit me up on any link below.")
    }
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      // Let the close animation finish before resetting state.
      setTimeout(() => {
        setStatus((s) => (s === "sent" ? "idle" : s))
        setError(null)
      }, 300)
    }
  }

  return (
    <section id="contact" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal variant="mask" className="flex justify-center">
          <span className="mask-line w-33">
            <Image
              src="/logo-mark.png"
              alt=""
              width={132}
              height={132}
              aria-hidden="true"
              className="mask-inner h-33 w-33 object-contain drop-shadow-[0_0_36px_rgba(255,106,0,0.35)]"
            />
          </span>
        </Reveal>

        <Reveal variant="mask" className="mt-10">
          <Eyebrow index={COLLAB.eyebrow.split(" · ")[0]} label={COLLAB.eyebrow.split(" · ")[1]} className="mb-8 justify-center" />
        </Reveal>

        <Reveal variant="mask">
          <h2 className="text-display-md">{COLLAB.heading}</h2>
        </Reveal>

        <Reveal variant="fade" delayMs={200} className="mt-6">
          <p className="mx-auto max-w-xl text-lg text-ink-muted">{COLLAB.sub}</p>
        </Reveal>

        <Reveal variant="fade" delayMs={380} className="mt-12">
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <MagneticButton>
                <Button className="h-auto rounded-full bg-accent px-9 py-4 text-base font-medium text-primary-foreground transition-all duration-300 ease-brand hover:bg-accent hover:brightness-110 hover:shadow-[0_0_28px_rgba(255,106,0,0.25)] active:scale-[0.96]">
                  Get In Touch
                </Button>
              </MagneticButton>
            </DialogTrigger>

            <DialogContent className="max-w-lg rounded-2xl border-hairline bg-surface p-6 md:p-8">
              {status !== "sent" ? (
                <>
                  <DialogHeader className="space-y-3 text-left">
                    <DialogTitle className="font-display text-2xl font-bold tracking-tight">Lay out the problem.</DialogTitle>
                    <DialogDescription className="text-sm text-ink-muted">
                      Tell me what needs automating — expect a reply within 24 hours.
                    </DialogDescription>
                  </DialogHeader>

                  <form ref={formRef} onSubmit={sendEmail} className="mt-6 flex flex-col gap-5">
                    <div className="space-y-2">
                      <label htmlFor="user_name" className="text-signage block text-ink-muted">
                        Name
                      </label>
                      <Input
                        id="user_name"
                        name="user_name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        disabled={status === "sending"}
                        className="rounded-lg border-hairline bg-white/[0.03] px-4 py-3 text-sm placeholder:text-ink-muted/60 focus-visible:border-accent/60 focus-visible:ring-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="user_email" className="text-signage block text-ink-muted">
                        Email
                      </label>
                      <Input
                        id="user_email"
                        name="user_email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@domain.com"
                        disabled={status === "sending"}
                        className="rounded-lg border-hairline bg-white/[0.03] px-4 py-3 text-sm placeholder:text-ink-muted/60 focus-visible:border-accent/60 focus-visible:ring-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-signage block text-ink-muted">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="What are we building?"
                        disabled={status === "sending"}
                        className="resize-none rounded-lg border-hairline bg-white/[0.03] px-4 py-3 text-sm placeholder:text-ink-muted/60 focus-visible:border-accent/60 focus-visible:ring-accent/20"
                      />
                    </div>

                    {error && (
                      <p role="alert" className="text-sm text-destructive">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full rounded-full bg-accent font-medium text-primary-foreground hover:bg-accent hover:brightness-110"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 size={16} strokeWidth={1.75} aria-hidden="true" className="mr-2 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <CheckCircle2 size={48} strokeWidth={1.25} aria-hidden="true" className="text-accent-text" />
                  <h3 className="font-display text-xl font-bold tracking-tight">Received.</h3>
                  <p className="max-w-xs text-sm text-ink-muted">Expect a reply within 24 hours.</p>
                  <div className="mt-2 flex w-full gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full border-hairline bg-transparent hover:bg-white/5"
                      onClick={() => setStatus("idle")}
                    >
                      Send Another
                    </Button>
                    <Button className="flex-1 rounded-full bg-accent text-primary-foreground hover:bg-accent hover:brightness-110" onClick={() => setOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </Reveal>

        <Reveal variant="fade" delayMs={520}>
          <ul className="mt-14 flex flex-wrap items-center justify-center gap-4">
            {COLLAB.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS]
              return (
                <li key={social.label}>
                  <MagneticButton>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} — opens in a new tab`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink-muted transition-all duration-300 ease-brand hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent-text"
                    >
                      <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  </MagneticButton>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
