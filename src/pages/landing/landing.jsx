import { Navigation } from "../../components/navigation/navigation"
import { HeroSection } from "../../components/hero-section/hero-section"
import { BenefitsSection } from "../../components/benefits-section/benefits-section"
import { ContactSection } from "../../components/contact-us-section/contact-us-section"

export default function Landing() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <BenefitsSection />
      <ContactSection />
    </main>
  )
}
