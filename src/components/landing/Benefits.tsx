import { Monitor, Zap, Smartphone, Lightbulb } from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <Monitor className="mx-auto text-[var(--tertiary)]" size={60} />,
      title: "Visualización 3D en tiempo real",
      description:
        "Tus clientes podrán probar los productos como si estuvieran en la tienda, aumentando la confianza en la compra.",
    },
    {
      icon: <Zap className="mx-auto text-[var(--tertiary)]" size={60} />,
      title: "Modelado automático con fotos",
      description: (
        <span>
          Subí fotos de la prenda: <br /> nuestro sistema genera el modelo 3D de
          forma automática y lista para probar.
        </span>
      ),
    },
    {
      icon: <Smartphone className="mx-auto text-[var(--tertiary)]" size={60} />,
      title: "Compatible con cualquier dispositivo",
      description:
        "Funciona perfectamente en computadoras, tablets y smartphones, ofreciendo la mejor experiencia a todos los usuarios.",
    },
    {
      icon: <Lightbulb className="mx-auto text-[var(--tertiary)]" size={60} />,
      title: "Aumenta tus conversiones",
      description:
        "La experiencia interactiva con el probador virtual 3D incrementa la decisión de compra y reduce devoluciones.",
    },
  ];

  return (
    <section className="md:mx-20 my-20 py-10 px-4 md:px-10 bg-[var(--primary)] rounded-xl">
      <div className="mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          ¿Por qué elegir nuestro probador virtual?
        </h2>
        <p className="mt-4 text-[var(--gray)] text-xl mx-auto">
          Convierte la experiencia de tu tienda online en algo interactivo y
          memorable para tus clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-[var(--white)]/90 max-w-[350px] mx-auto px-4 py-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 text-center"
          >
            <div className="mb-4">{benefit.icon}</div>
            <h3 className="text-2xl font-semibold mb-3 text-[var(--secondary)]">
              {benefit.title}
            </h3>
            <p className="text-gray-700 text-md">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
