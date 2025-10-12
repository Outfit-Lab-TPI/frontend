import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <section id="contacto" className="py-16 relative">
      <div className="container mx-auto px-3 md:px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-[#230636] to-[#230636]/50 border border-[#926490]/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl md:text-4xl font-heading text-[var(--white)]">
                MANTENETE CONECTADO
              </h2>
              <p className="text-lg text-[var(--gray)] leading-relaxed">
                Sé el primero en conocer nuestras novedades y actualizaciones
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="juandiaz@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-[#0a050e]/50 border border-[#926490]/30 text-[#fffcf5] placeholder:text-[var(--gray)] focus:border-[#926490] focus:outline-none h-12 rounded-md px-3"
                />
                <button
                  type="submit"
                  className="bg-[#926490] hover:bg-[#926490]/90 text-[#fffcf5] px-8 h-12 rounded-md flex items-center justify-center transition-colors"
                >
                  Enviar
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-[var(--gray)] text-center">
                Al suscribirte, aceptas recibir actualizaciones sobre nuestro
                probador virtual
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
