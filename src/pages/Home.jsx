import React from "react";
import HeroSection from "../components/landing/Hero";

export default function Home() {
  return (
    <div className="p-6 bg-gradient-to-b from-[var(--black)] to-[var(--primary)]">
      <HeroSection />
    </div>
  );
}
