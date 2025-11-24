import { useEffect } from "react";
import { cargarModelosSiNoEstan } from "../lib/imageBodyValidation";
import { cargarModeloRopaSiNoEsta } from "../lib/clothingValidation";

import HeroSection from "../components/landing/Hero";
import BenefitsSection from "../components/landing/Benefits";
import StatsSection from "../components/landing/Stats";
import DemoSection from "../components/landing/Demo";
import ContactSection from "../components/landing/ContactUs";

export default function Landing() {

  useEffect(() => {
    cargarModelosSiNoEstan();
    cargarModeloRopaSiNoEsta();// cargo los dos modelos acá asi no hay tanto lag ni en perfil ni en nueva/editar prenda
  }, []);

  return (
    <div className="p-6 pt-24 max-w-[1800px] mx-auto">
      <HeroSection />
      <BenefitsSection />
      <StatsSection />
      <DemoSection />
      <ContactSection />
    </div>
  );
}
