import Navbar from "@/components/navbar"
import MobileNav from "@/components/mobile-nav"
import ThemeToggle from "@/components/theme-toggle"
import HeroSection from "@/components/hero-section"
import TechnologiesSection from "@/components/technologies-section"
import PortfolioSection from "@/components/portfolio-section"
import ContactSection from "@/components/contact-section"
import { GravityLogo } from "@/components/gravity-logo"
import CursorFollower from "@/components/cursor-follower"
import VantaBackground from "@/components/vanta-background"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <VantaBackground />
      <Navbar />
      <MobileNav />
      <ThemeToggle />
      <GravityLogo />
      <CursorFollower />
      <div className="relative z-10">
        <div id="home">
          <HeroSection />
        </div>
        <div id="technologies">
          <TechnologiesSection />
        </div>
        <div id="portfolio">
          <PortfolioSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
      </div>
    </main>
  )
}
