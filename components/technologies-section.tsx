"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

const technologies = [
  {
    name: "JavaScript",
    image: "/images/javascript-logo.png",
    description: "Modern ES6+ & TypeScript",
  },
  {
    name: "Python",
    image: "/images/python-logo.png",
    description: "Backend & Data Science",
  },
  {
    name: "Git",
    image: "/images/git-logo.png",
    description: "Version Control",
  },
  {
    name: "Vercel",
    image: "/images/vercel-logo.png",
    description: "Deployment & Hosting",
  },
  {
    name: "GitHub",
    image: "/github-logo.png",
    description: "Code Repository",
  },
]

export default function TechnologiesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const techButtons = entry.target.querySelectorAll(".tech-button")
            techButtons.forEach((button, index) => {
              setTimeout(() => {
                button.classList.add("animate-in", "slide-in-from-bottom-4", "fade-in")
              }, index * 100)
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="technologies" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-balance">Technologies I Work With</h2>
        <p className="text-lg md:text-xl text-muted-foreground text-center mb-16 text-pretty">
          Cutting-edge tools and frameworks for modern development
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              className="tech-button group bg-card rounded-xl p-6 text-center hover:bg-primary/10 hover:scale-110 hover:shadow-2xl hover:shadow-primary/20 border border-border hover:border-primary/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex justify-center">
                <Image
                  src={tech.image || "/placeholder.svg"}
                  alt={tech.name}
                  width={60}
                  height={60}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-primary transition-colors">
                {tech.name}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
