import React from "react";
import HeroSection from "../components/landing/Hero";
import BenefitsSection from "../components/landing/Benefits";

export default function Home() {
  return (
    <div className="p-6 bg-gradient-to-b from-[var(--black)] to-[var(--primary)]">
      <HeroSection />
      <BenefitsSection />
    </div>
  );
}
