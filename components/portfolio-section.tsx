"use client"

import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "GetGrass.io Websocket Automation",
    description:
      "Python And Javascript based script to interact with the Grass.io Websocket with multiple connections with the use of proxies.",
    image: "/grass.png",
    technologies: ["Python", "Node.js", "Websockets", "Git"],
    liveUrl: "https://medium.com/@FakerPK/farm-the-getgrass-io-airdrop-with-this-farming-bot-community-node-1-25x-multiple-accounts-b032a952f9a6",
    githubUrl: "https://github.com/FakerPK/NewGrassBot",
  },
  {
    title: "Bless Network Node Management and Points Mining Automation Script",
    description:
      "Python, PHP and Javascript based Scripts to interact with the Bless Network Websocket and establish multiple connections for the same account using proxies.",
    image: "/bless.png",
    technologies: ["Node.js", "Python", "PHP", "Git", "Websockets"],
    liveUrl: "https://medium.com/@FakerPK/bless-network-bot-v1-0-automate-node-management-and-mining-6f017d47bb44",
    githubUrl: "https://github.com/FakerPK/BlessNetworkBot",
  },
]

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-balance">Featured Projects</h2>
        <p className="text-lg md:text-xl text-muted-foreground text-center mb-16 text-pretty">
          Showcasing my latest work and creative solutions
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="project-card bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 group"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-primary hover:bg-secondary">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-pretty text-sm md:text-base">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs md:text-sm font-medium border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
