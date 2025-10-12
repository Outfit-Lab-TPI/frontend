import { Monitor, Zap, Smartphone, ChartColumnIncreasing } from "lucide-react";
import CallToAction from "../ui/CallToAction";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <Monitor className="mx-auto text-[var(--tertiary)]" size={60} />,
      title: "Visualización en tiempo real",
      description:
        "Tus clientes podrán probar los productos como si estuvieran en la tienda, aumentando la confianza en la compra.",
    },
    {
      icon: <Zap className="mx-auto text-[var(--tertiary)]" size={60} />,
      title: "Modelado automático con fotos",
      description:
        "Nuestro sistema genera el modelo de forma automática y lista para probar, en base a las fotos que subas",
    },
    {
      icon: <Smartphone className="mx-auto text-[var(--tertiary)]" size={60} />,
      title: "Compatible con cualquier dispositivo",
      description:
        "Funciona perfectamente en computadoras, tablets y smartphones, ofreciendo la mejor experiencia a todos los usuarios.",
    },
    {
      icon: (
        <ChartColumnIncreasing
          className="mx-auto text-[var(--tertiary)]"
          size={60}
        />
      ),
      title: "Experiencia de compra mejorada",
      description:
        "La experiencia interactiva con el probador virtual incrementa la decisión de compra y reduce devoluciones.",
    },
  ];

  return (
    <section>
      <div className="mx-3 sm:mx-10 md:mx-20 mt-20 mb-7 py-10 px-5 md:px-10 bg-[var(--primary)] rounded-xl">
        <div className="mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            ¿Por qué elegir nuestro probador virtual?
          </h2>
          <p className="mt-4 text-[var(--gray)] text-xl mx-auto">
            Convierte la experiencia de tu tienda online en algo interactivo y
            memorable para tus clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-[var(--white)]/90 max-w-[320px] mx-auto px-3 py-4 rounded-xl shadow-md hover:shadow-2xl duration-300 hover:scale-102 hover:-translate-y-1 transition-all ease-in-out cursor-pointer"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-3 mx-2 text-center text-[var(--secondary)]">
                {benefit.title}
              </h3>
              <p className="text-gray-700 text-md text-left">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <CallToAction text="Comenzar ahora" />
    </section>
  );
}
