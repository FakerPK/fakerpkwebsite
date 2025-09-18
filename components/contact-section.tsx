"use client"

import type React from "react"

import { Mail, Github, Twitter, Linkedin, Send, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRef, useState } from "react"
import emailjs from "@emailjs/browser"

const socialLinks = [
  { icon: Github, href: "https://github.com/FakerPK", label: "GitHub" },
  { icon: Twitter, href: "https://x.com/fakerpk", label: "Twitter" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/fakerpk", label: "LinkedIn" },
  { icon: Send, href: "https://t.me/+rurxli5cagplMjM8", label: "Telegram" },
]

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formRef.current) return

    setIsSubmitting(true)

    emailjs
      .sendForm(
        "service_bto3h2c", // your service ID
        "template_91urqtt", // your template ID
        formRef.current,
        "TbtGB1kcwnxILeFXU", // your public key
      )
      .then(() => {
        setIsSubmitting(false)
        setIsSuccess(true)
        formRef.current?.reset()
      })
      .catch(() => {
        setIsSubmitting(false)
        alert("❌ Failed to send. Try again later.")
      })
  }

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setTimeout(() => {
        setIsSuccess(false)
        setIsSubmitting(false)
      }, 300) // Delay to allow smooth closing animation
    }
  }

  const handleBackToForm = () => {
    setIsSuccess(false)
  }

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Let's Work Together</h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 text-pretty">
          I would love it if you would like to collaborate with me in my projects.
        </p>

        {/* Popup contact form */}
        <Dialog open={isOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="px-5 md:px-8 py-4 text-base md:text-lg bg-primary hover:bg-secondary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Contact Me
            </Button>
          </DialogTrigger>

          {/* Neon glowing border form */}
          <DialogContent className="sm:max-w-lg contact-popup">
            {!isSuccess ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white">Send me a message</DialogTitle>
                </DialogHeader>

                <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-4 p-6">
                  <Input type="text" name="user_name" placeholder="Your Name" required disabled={isSubmitting} />
                  <Input type="email" name="user_email" placeholder="Your Email" required disabled={isSubmitting} />
                  <Textarea name="message" placeholder="Your Message" rows={5} required disabled={isSubmitting} />
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-secondary transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-20"></div>
                  <div className="relative rounded-full bg-green-500/20 p-4">
                    <CheckCircle className="w-12 h-12 text-green-400 animate-pulse" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Message Sent! ✨</h3>
                <p className="text-muted-foreground mb-6 text-pretty">
                  Thanks for reaching out! I'll get back to you within 24 hours.
                </p>

                <div className="flex gap-3 w-full">
                  <Button
                    onClick={handleBackToForm}
                    variant="outline"
                    className="flex-1 border-primary/30 hover:bg-primary/10 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Send Another
                  </Button>
                  <Button onClick={() => setIsOpen(false)} className="flex-1 bg-primary hover:bg-secondary">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* socials */}
        <div className="flex justify-center space-x-6 mt-12">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
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
