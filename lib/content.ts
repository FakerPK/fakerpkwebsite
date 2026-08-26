export const SITE = {
  name: "FakerPK",
  brand: "FAKER PK™",
  role: "Backend & Automations Developer",
  url: "https://fakerpk.vercel.app",
}

export const HERO = {
  headline: "Websockets that never drop.",
  headlineAccent: "Nodes that never sleep.",
  sub: "Custom Python automation: many concurrent websocket sessions over SOCKS5 proxy pools, dead proxies removed automatically, and node management engineered for 24/7 uptime.",
  ctas: [
    { label: "View My Work", href: "#work" },
    { label: "Get In Touch", href: "#contact" },
  ],
}

export const ABOUT =
  "I create custom Python scripts that automate the tedious side of crypto — websocket fleets, multi-connection proxy pools, and node management that stays online when nobody's watching. Robust error handling comes standard: dead proxies get caught and pulled from the file automatically, sessions recover instead of dying quietly. Every build ships with its reasoning — code on GitHub, full write-ups on Medium."

export const SKILLS = [
  { name: "JavaScript", tagline: "Modern ES6+ and TypeScript, tuned for real-time work" },
  { name: "Python", tagline: "Every bot starts here — Python-based scripts built to run unattended" },
  { name: "Node.js", tagline: "Websocket servers, socket clients, event-driven runtimes" },
  { name: "Git", tagline: "Disciplined version control behind every deploy" },
  { name: "Vercel", tagline: "Continuous deployment and edge-ready hosting" },
  { name: "GitHub", tagline: "Public source for every bot — clone the repo, install requirements, run" },
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
      "Grass node mining automated on any cheap VPS — multiple devices, User IDs, and IPs held open over SOCKS5 websocket connections for 24/7 uptime. Robust error handling catches dead proxies, SSL WRONG_VERSION_NUMBER errors, and dropped keepalives, then pulls the dead proxies from the file automatically.",
    image: "/grass.png",
    tags: ["Python", "Node.js", "Websockets", "Git"],
    articleUrl:
      "https://medium.com/@FakerPK/farm-the-getgrass-io-airdrop-with-this-farming-bot-community-node-1-25x-multiple-accounts-b032a952f9a6",
    githubUrl: "https://github.com/FakerPK/NewGrassBot",
  },
  {
    title: "Bless Network Node Management & Points Mining",
    description:
      "Bless Network node management and pings fully automated — no hardware ID needed. Handles multiple devices and websocket connections over proxies, keeps nodes alive, boosts network uptime, and ends manual node registration for good. Built to maximize node earnings around the clock, perfect for cheap VPS setups.",
    image: "/bless.png",
    tags: ["Node.js", "Python", "PHP", "Git", "Websockets"],
    articleUrl:
      "https://medium.com/@FakerPK/bless-network-bot-v1-0-automate-node-management-and-mining-6f017d47bb44",
    githubUrl: "https://github.com/FakerPK/BlessNetworkBot",
  },
]

export const COLLAB = {
  eyebrow: "03 · CONNECT",
  heading: "Bring me the repetitive, the fragile, the always-on.",
  sub: "I'll turn it into automation that holds. Source on GitHub, reasoning on Medium — questions, projects, collaborations: hit me up.",
  socials: [
    { label: "GitHub", href: "https://github.com/FakerPK" },
    { label: "Twitter", href: "https://x.com/fakerpk" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/fakerpk" },
    { label: "Telegram", href: "https://t.me/+rurxli5cagplMjM8" },
  ],
}

export const FOOTER = "© 2026 FakerPK™ — Backend and Automations Developer. Still up, running 24/7."

export const EMAILJS = {
  serviceId: "service_bto3h2c",
  templateId: "template_91urqtt",
  publicKey: "TbtGB1kcwnxILeFXU",
}
