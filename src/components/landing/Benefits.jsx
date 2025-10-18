import { Monitor, Zap, Smartphone, ChartColumnIncreasing } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import CallToAction from "../ui/CallToAction";

function BenefitCard({ benefit, index, isInView }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouse = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className="bg-[var(--white)]/90 max-w-[320px] lg:w-full mx-auto px-3 py-4 rounded-xl shadow-md hover:shadow-2xl duration-300 cursor-pointer relative overflow-hidden"
    >
      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, transparent 40%, rgba(227, 193, 138, 0.3) 50%, transparent 60%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="mb-4"
        style={{ transform: "translateZ(50px)" }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {benefit.icon}
      </motion.div>

      <h3
        className="!text-2xl md:!text-3xl font-semibold mb-3 mx-2 text-center text-[var(--secondary)]"
        style={{ transform: "translateZ(30px)" }}
      >
        {benefit.title}
      </h3>

      <p
        className="text-gray-700 font-medium px-2 text-left"
        style={{ transform: "translateZ(20px)" }}
      >
        {benefit.description}
      </p>

      {/* Floating particles effect */}
      <motion.div
        className="absolute top-2 right-2 w-2 h-2 bg-[var(--tertiary)] rounded-full opacity-60"
        animate={{
          y: [0, -10, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.3,
        }}
      />
      <motion.div
        className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-[var(--secondary)] rounded-full opacity-40"
        animate={{
          y: [0, 10, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: index * 0.2,
        }}
      />
    </motion.div>
  );
}

export default function BenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const benefits = [
    {
      icon: <Monitor className="mx-auto text-[var(--tertiary)]" size={60} />,
      title: "Visualización en tiempo real",
      description:
        "Tus clientes podrán probar los productos como si estuvieran en la tienda.",
    },
    {
      icon: <Zap className="mx-auto text-[var(--tertiary)]" size={60} />,
      title: "Modelado automático",
      description:
        "Generamos modelos digitales de tus prendas de forma rápida y precisa.",
    },
    {
      icon: <Smartphone className="mx-auto text-[var(--tertiary)]" size={60} />,
      title: "Multi-plataforma",
      description:
        "Funciona en cualquier dispositivo, disponible para todos tus clientes.",
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
        "Incrementa la decisión de compra y reduce las devoluciones.",
    },
  ];

  return (
    <section id="beneficios" className="my-32 max-w-[1500px] mx-auto" ref={ref}>
      <div className="mx-1 sm:mx-10 md:mx-20 mb-10 py-10 px-6 sm:px-8 md:px-10 bg-[var(--primary)] rounded-xl">
        <motion.div
          className="mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="!text-3xl md:!text-4xl font-bold">
            ¿Por qué elegir nuestro probador virtual?
          </h2>
          <p className="mt-4 text-[var(--gray)] text-center font-medium text-lg md:text-xl mx-auto">
            Permití que tus clientes prueben tu ropa virtualmente, en segundos y
            sin complicaciones.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto perspective-1000">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              benefit={benefit}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
      <CallToAction text="Comenzar ahora" />
    </section>
  );
}
