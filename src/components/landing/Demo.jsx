import CallToAction from "../ui/CallToAction";

export default function DemoSection() {
  return (
    <section className="mx-auto my-20 rounded-lg">
      <div className="flex flex-col px-8 md:px-20 lg:flex-row items-center gap-10 mx-auto mb-20">
        <div className="lg:w-1/2 leading-loose text-[var(--gray)]">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--white)] text-left mb-8">
            Cómo tus prendas cobran vida en el probador virtual
          </h2>

          <p className="text-lg mb-6">
            Outfit Lab convierte tus prendas en modelos digitales de forma
            automática y precisa, listos para integrarse a tu tienda online.
          </p>

          <ul className="space-y-6 text-lg">
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 mt-1 rounded-full bg-[var(--tertiary)]/80 flex items-center justify-center font-bold text-[var(--white)]">
                1
              </span>
              <span>
                Tomá fotos de cada prenda —frente, espalda y costado— y subilas
                en la plataforma.
              </span>
            </li>

            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 mt-1 rounded-full bg-[var(--tertiary)]/80 flex items-center justify-center font-bold text-[var(--white)]">
                2
              </span>
              <span>
                Nuestro sistema genera una representación digital lista para el
                probador virtual.
              </span>
            </li>

            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 mt-1 rounded-full bg-[var(--tertiary)]/80 flex items-center justify-center font-bold text-[var(--white)]">
                3
              </span>
              <div className="flex flex-col">
                <span>
                  Los modelos se agregan al catálogo interactivo para que los
                  clientes puedan seleccionar las prendas sobre un avatar y
                  crear su outfit ideal antes de comprar.
                </span>
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
      <CallToAction text="Ir a la plataforma" align="center" />
    </section>
  );
}
