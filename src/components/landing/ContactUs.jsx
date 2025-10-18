import { useState } from "react";
import { Mailbox, Newspaper, Send } from "lucide-react";
import { toast } from "react-toastify";
import ThemedToast from "../ui/ThemedToast";

export default function ContactSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
    toast.success("¡Gracias por suscribirte!");
  };

  return (
    <section id="contacto" className="py-8">
      <div className="mx-auto px-2 sm:px-4 md:px-6">
        <div className="max-w-[750px] mx-auto">
          <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/50 border border-[var(--secondary)]/30 rounded-2xl px-4 py-6 md:p-12 backdrop-blur-sm">
            <div className="text-center space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-2">
                <h2 className="!text-3xl md:!text-4xl font-heading text-[var(--white)]">
                  Mantenete Conectado
                </h2>
                <Newspaper
                  height={"fill"}
                  className="hidden sm:inline size-6 text-[var(--white)]"
                />
              </div>
              <p className="text-base sm:text-lg text-[var(--gray)] leading-relaxed">
                Sé el primero en conocer nuestras novedades y actualizaciones
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 max-w-[600px] mx-auto">
                <input
                  type="email"
                  placeholder="Ingresa aquí tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-[var(--black)]/50 border border-[var(--secondary)]/30 text-[var(--white)] placeholder:text-[var(--gray)] focus:border-[var(--secondary)] focus:outline-none h-12 !rounded-xl p-3"
                />
                <button
                  type="submit"
                  className="bg-[var(--white)]/10 cursor-pointer border border-[var(--tertiary)]/30 backdrop-blur-sm text-[var(--tertiary)] px-8 h-12 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--white)]/20"
                >
                  Enviar
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[var(--gray)] text-center italic">
                Al suscribirte, aceptas recibir actualizaciones sobre nuestro
                probador virtual.
              </p>
            </form>
          </div>
        </div>
      </div>
      <ThemedToast />
    </section>
  );
}
