import { Brain, Camera, ShoppingBag } from "lucide-react";
import CallToAction from "../ui/CallToAction";

export default function DemoSection() {
  return (
    <section className="mx-auto my-20 rounded-lg" id="comoFunciona">
      <div className="flex flex-col px-8 md:px-20 lg:flex-row items-center gap-10 mx-auto mb-10">
        <div className="lg:w-1/2 leading-loose text-[var(--gray)]">
          <h2 className="!text-3xl md:!text-4xl font-bold text-[var(--white)] text-left mb-8">
            Cómo tus prendas cobran vida en el probador virtual
          </h2>

          <p className="text-base md:text-lg mb-6">
            Convertimos tus prendas en modelos digitales de forma automática y
            precisa, listos para ser probados por tus clientes.
          </p>

          <ul className="space-y-6 text-base md:text-lg">
            <li className="flex items-start gap-4">
              <Camera className="flex-shrink-0 w-7 h-7 mt-1 rounded-full bg-[var(--tertiary)]/80 p-1 text-[var(--white)]" />
              <span>Subís fotos de la prenda en diferentes ángulos.</span>
            </li>

            <li className="flex items-start gap-4">
              <Brain className="flex-shrink-0 w-7 h-7 mt-1 rounded-full bg-[var(--tertiary)]/80 p-1 text-[var(--white)]" />
              <span>El sistema genera el modelado virtual.</span>
            </li>

            <li className="flex items-start gap-4">
              <ShoppingBag className="flex-shrink-0 w-7 h-7 mt-1 rounded-full bg-[var(--tertiary)]/80 p-1 text-[var(--white)]" />
              <div className="flex flex-col">
                <span>El modelo se agrega al catálogo del probador.</span>
              </div>
            </li>
          </ul>
        </div>
        <img
          src="./demo.jpg"
          alt="Demostración del probador virtual"
          className="lg:w-1/2 mx-auto h-auto rounded-lg shadow-md"
        />
      </div>
      <CallToAction text="Visitar probador" align="center" />
    </section>
  );
}
