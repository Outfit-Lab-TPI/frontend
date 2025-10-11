import React from "react";
import HeroSection from "../components/landing/Hero";
import BenefitsSection from "../components/landing/Benefits";
import DemoSection from "../components/landing/Demo";

export default function Home() {
  return (
    <div className="p-6">
      <HeroSection />
      <BenefitsSection />
      <DemoSection />
    </div>
  );
}
