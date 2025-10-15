import { Brain, Camera, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import CallToAction from "../ui/CallToAction";

export default function DemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: Camera,
      text: "Subís fotos de la prenda en diferentes ángulos."
    },
    {
      icon: Brain,
      text: "El sistema genera el modelado virtual."
    },
    {
      icon: ShoppingBag,
      text: "El modelo se agrega al catálogo del probador."
    }
  ];

  return (
    <section className="mx-auto my-20 rounded-lg" id="comoFunciona" ref={ref}>
      <div className="flex flex-col px-8 md:px-20 lg:flex-row items-center gap-10 mx-auto mb-10">
        <motion.div 
          className="lg:w-1/2 leading-loose text-[var(--gray)]"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="!text-3xl md:!text-4xl font-bold text-[var(--white)] text-left mb-8">
            Cómo tus prendas cobran vida en el probador virtual
          </h2>

          <p className="text-base md:text-lg mb-6">
            Convertimos tus prendas en modelos digitales de forma automática y
            precisa, listos para ser probados por tus clientes.
          </p>

          <ul className="space-y-6 text-base md:text-lg">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.li 
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + index * 0.2 
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="flex-shrink-0 w-7 h-7 mt-1 rounded-full bg-[var(--tertiary)]/80 p-1 text-[var(--white)]" />
                  </motion.div>
                  <span>{step.text}</span>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
        
        <motion.img
          src="./demo.jpg"
          alt="Demostración del probador virtual"
          className="lg:w-1/2 mx-auto h-auto rounded-lg shadow-md"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        />
      </div>
      <CallToAction text="Visitar probador" align="center" />
    </section>
  );
}
