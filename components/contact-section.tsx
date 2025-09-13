"use client"

import { Mail, Github, Twitter, Linkedin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

const socialLinks = [
  { icon: Github, href: "https://github.com/FakerPK", label: "GitHub" },
  { icon: Twitter, href: "https://x.com/fakerpk", label: "Twitter" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/fakerpk", label: "LinkedIn" },
  { icon: Send, href: "https://t.me/+rurxli5cagplMjM8", label: "Telegram" },
]

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Let's Work Together</h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 text-pretty">
          I would love it if you would like to collaborate with me in my projects.
        </p>

        <div className="mb-12">
          <Button
            size="lg"
            className="px-6 md:px-8 py-4 text-base md:text-lg bg-primary hover:bg-secondary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Contact Me
          </Button>
        </div>

        <div className="flex justify-center space-x-6">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="p-3 bg-card rounded-full border border-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-110 group"
              aria-label={social.label}
            >
              <social.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-muted-foreground">© 2025 FakerPK™</p>
          <p className="text-muted-foreground">All rights reserved</p>
        </div>
      </div>
    </section>
  )
}
