export const SITE = {
  name: "FakerPK",
  brand: "FAKER PK™",
  role: "Backend & Automations Developer",
  url: "https://fakerpk.vercel.app",
}

export const HERO = {
  headline: "Scripts in orbit.",
  headlineAccent: "Systems under control.",
  sub: "Exceptional scripts and backend tech — websocket automation, multi-connection proxy pools, and node management that runs itself.",
  ctas: [
    { label: "View My Work", href: "#work" },
    { label: "Get In Touch", href: "#contact" },
  ],
}

export const ABOUT =
  "I create exceptional scripts and backend tech, pairing newly implemented technologies with reverse-engineered solutions. The specialty is real-time automation: websocket fleets, multi-connection proxy pools, and node management that stays online when nobody is watching. Every build ships with its reasoning — code on GitHub, full write-ups on Medium."

export const SKILLS = [
  { name: "JavaScript", tagline: "Modern ES6+ and TypeScript, tuned for real-time work" },
  { name: "Python", tagline: "Backend systems and data-driven automation at scale" },
  { name: "Node.js", tagline: "Websocket servers, socket clients, event-driven runtimes" },
  { name: "Git", tagline: "Disciplined version control behind every deploy" },
  { name: "Vercel", tagline: "Continuous deployment and edge-ready hosting" },
  { name: "GitHub", tagline: "Public source of truth for code and write-ups" },
]

export type Project = {
  title: string
  description: string
  image: string
  tags: string[]
  articleUrl: string
  githubUrl: string
}

export const PROJECTS: Project[] = [
  {
    title: "GetGrass.io Websocket Automation",
    description:
      "A Python and JavaScript engine holding many concurrent websocket sessions against the Grass.io network, each routed through its own proxy. Built for uptime: connection rotation, session recovery, and clean telemetry across the whole pool.",
    image: "/grass.png",
    tags: ["Python", "Node.js", "Websockets", "Git"],
    articleUrl:
      "https://medium.com/@FakerPK/farm-the-getgrass-io-airdrop-with-this-farming-bot-community-node-1-25x-multiple-accounts-b032a952f9a6",
    githubUrl: "https://github.com/FakerPK/NewGrassBot",
  },
  {
    title: "Bless Network Node Management & Points Mining",
    description:
      "Python, PHP, and JavaScript driving the Bless network websocket — multiple proxy-backed connections per account with automated node management and points mining. Scales from one account to a full fleet without extra hands.",
    image: "/bless.png",
    tags: ["Node.js", "Python", "PHP", "Git", "Websockets"],
    articleUrl:
      "https://medium.com/@FakerPK/bless-network-bot-v1-0-automate-node-management-and-mining-6f017d47bb44",
    githubUrl: "https://github.com/FakerPK/BlessNetworkBot",
  },
]

export const COLLAB = {
  eyebrow: "03 · TRANSMIT",
  heading: "Bring me the repetitive, the fragile, the always-on.",
  sub: "I'll turn it into automation that holds. Code on GitHub, reasoning on Medium — collaborations welcome.",
  socials: [
    { label: "GitHub", href: "https://github.com/FakerPK" },
    { label: "Twitter", href: "https://x.com/fakerpk" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/fakerpk" },
    { label: "Telegram", href: "https://t.me/+rurxli5cagplMjM8" },
  ],
}

export const FOOTER = "© 2026 FakerPK™ — Backend and Automations Developer. All systems nominal."

export const EMAILJS = {
  serviceId: "service_bto3h2c",
  templateId: "template_91urqtt",
  publicKey: "TbtGB1kcwnxILeFXU",
}
