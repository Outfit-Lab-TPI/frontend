import HeroSection from "../components/landing/Hero";
import BenefitsSection from "../components/landing/Benefits";
import BrandsCarousel from "../components/landing/brands-carousel";
import DemoSection from "../components/landing/Demo";
import ContactSection from "../components/landing/ContactUs";

export default function Landing() {
  return (
    <div className="p-6 pt-24 max-w-[1800px] mx-auto">
      <HeroSection />
      <BenefitsSection />
      <BrandsCarousel />
      <DemoSection />
      <ContactSection />
    </div>
  );
}
