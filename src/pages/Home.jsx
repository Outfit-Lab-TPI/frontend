import React from "react";
import HeroSection from "../components/landing/Hero";
import BenefitsSection from "../components/landing/Benefits";

export default function Home() {
  return (
    <div className="p-6">
      <HeroSection />
      <BenefitsSection />
    </div>
  );
}
