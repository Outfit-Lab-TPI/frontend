import { Sparkles, Zap, Shield, TrendingUp } from "lucide-react"

const benefits = [
  {
    icon: Sparkles,
    title: "Tecnología 3D Avanzada",
    description:
      "Modelos 3D hiperrealistas que muestran cada detalle de las prendas con precisión fotográfica.",
  },
  {
    icon: Zap,
    title: "Prueba Instantánea",
    description:
      "Visualiza cómo te queda cualquier prenda en segundos, sin necesidad de probadores físicos.",
  },
  {
    icon: Shield,
    title: "Compra Segura",
    description:
      "Reduce devoluciones y aumenta tu confianza al saber exactamente cómo te quedará la ropa.",
  },
  {
    icon: TrendingUp,
    title: "Siempre Actualizado",
    description:
      "Accede a las últimas colecciones de tus marcas favoritas en tiempo real.",
  },
]

export function BenefitsSection() {
  return (
    <section id="beneficios" className="relative min-h-[110vh] flex flex-col items-center justify-center py-24">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a050e] via-[#230636]/20 to-[#0a050e]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-6xl font-heading text-[#fffcf5]">
            ¿POR QUÉ ELEGIRNOS?
          </h2>
          <p className="text-lg text-[#fffcf5]/70 max-w-2xl mx-auto leading-relaxed">
            Revolucionamos la forma en que compras ropa online con tecnología de
            vanguardia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-[#230636]/50 border border-[#926490]/30 backdrop-blur-sm p-6 rounded-2xl hover:bg-[#230636]/70 transition-all duration-300 hover:scale-105 hover:border-[#926490]/60"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#926490]/20 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-[#e3c18a]" />
                </div>
                <h3 className="text-xl font-heading text-[#fffcf5]">
                  {benefit.title}
                </h3>
                <p className="text-[#fffcf5]/70 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
