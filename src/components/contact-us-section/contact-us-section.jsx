import { useState } from "react"
import { Send } from "lucide-react"

export function ContactSection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Email submitted:", email)
    setEmail("")
  }

  return (
    <section id="contacto" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-[#230636] to-[#230636]/50 border border-[#926490]/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-4xl md:text-5xl font-heading text-[#fffcf5]">
                MANTENTE CONECTADO
              </h2>
              <p className="text-lg text-[#fffcf5]/70 leading-relaxed">
                Sé el primero en conocer nuestras novedades y actualizaciones
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-[#0a050e]/50 border border-[#926490]/30 text-[#fffcf5] placeholder:text-[#fffcf5]/40 focus:border-[#926490] focus:outline-none h-12 rounded-md px-3"
                />
                <button
                  type="submit"
                  className="bg-[#926490] hover:bg-[#926490]/90 text-[#fffcf5] px-8 h-12 rounded-md flex items-center justify-center transition-colors"
                >
                  Enviar
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-[#fffcf5]/50 text-center">
                Al suscribirte, aceptas recibir actualizaciones sobre nuestro probador virtual
              </p>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center space-y-4">
            <div className="flex justify-center gap-6">
              <a href="#" className="text-[#fffcf5]/60 hover:text-[#e3c18a] transition-colors text-sm">
                Términos
              </a>
              <a href="#" className="text-[#fffcf5]/60 hover:text-[#e3c18a] transition-colors text-sm">
                Privacidad
              </a>
              <a href="#" className="text-[#fffcf5]/60 hover:text-[#e3c18a] transition-colors text-sm">
                Soporte
              </a>
            </div>
            <p className="text-[#fffcf5]/40 text-sm">
              © 2025 Probador Virtual. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
