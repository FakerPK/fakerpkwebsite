import SceneLoader from "@/components/three/scene-loader"
import GrainOverlay from "@/components/ui/grain-overlay"
import CustomCursor from "@/components/ui/custom-cursor"
import Nav from "@/components/sections/nav"
import HeroSection from "@/components/sections/hero"
import SkillsSection from "@/components/sections/skills"
import ProjectsSection from "@/components/sections/projects"
import CollabSection from "@/components/sections/collab"
import Footer from "@/components/sections/footer"
import SmoothScroll from "@/components/sections/smooth-scroll"
import { COLLAB, SITE } from "@/lib/content"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  jobTitle: SITE.role,
  sameAs: COLLAB.socials.map((s) => s.href),
}

export default function Home() {
  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-void"
      >
        Skip to content
      </a>

      {/* WebGL gravity field, fixed behind everything */}
      <SceneLoader />

      <GrainOverlay />
      <CustomCursor />
      <SmoothScroll />
      <Nav />

      <main id="home" className="relative z-10">
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <CollabSection />
      </main>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
