"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { marcaService } from "../../services/marcaService"

export default function BrandsCarousel() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar marcas desde la API
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        setLoading(true)
        const response = await marcaService.getAllMarcas()
        // Transformar los datos de la API al formato que necesita el carousel
        const marcasData = response.data.map(marca => ({
          id: marca.codigoMarca,
          name: marca.nombre,
          image: marca.logoUrl
        }))
        setBrands(marcasData)
        setError(null)
      } catch (err) {
        console.error("Error al cargar marcas:", err)
        setError("No se pudieron cargar las marcas")
        // Mantener algunas marcas de ejemplo en caso de error
        setBrands([
          { id: 1, name: "Marca 1", image: "/isotipo.svg" },
          { id: 2, name: "Marca 2", image: "/isotipo.svg" },
          { id: 3, name: "Marca 3", image: "/isotipo.svg" },
          { id: 4, name: "Marca 4", image: "/isotipo.svg" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMarcas()
  }, [])

  // Auto-rotate carousel every 3 seconds
  useEffect(() => {
    if (brands.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % brands.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [brands.length])

  // Handler para navegar a la página de detalle de la marca
  const handleBrandClick = (brandId) => {
    navigate(`/marcas/${brandId}`)
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="!text-3xl md:!text-4xl font-bold text-center mb-12 text-[var(--white)]">
            Marcas que <span className="text-[var(--tertiary)]">confían</span> en nosotros
          </h2>
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-[var(--secondary)] text-lg">
              Cargando marcas...
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="marcas" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="!text-3xl md:!text-4xl font-bold text-center mb-12 text-[var(--white)]">
          Marcas que <span className="text-[var(--tertiary)]">confían</span> en nosotros
        </h2>
        {error && (
          <div className="text-center text-[var(--tertiary)] mb-4 text-sm opacity-80">
            {error}
          </div>
        )}

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {brands.map((brand) => (
              <div key={brand.id} className="min-w-full flex items-center justify-center">
                <button
                  onClick={() => handleBrandClick(brand.id)}
                  className="relative bg-[var(--white)]/10 backdrop-blur-sm border-2 rounded-xl p-12 transition-all duration-300 cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--tertiary)] focus:ring-offset-2 focus:ring-offset-[var(--black)]"
                  style={{
                    borderColor: 'var(--secondary)',
                    boxShadow: `
                      0 0 20px rgba(143, 93, 141, 0.4),
                      0 0 40px rgba(143, 93, 141, 0.3),
                      0 0 60px rgba(35, 6, 54, 0.2),
                      inset 0 0 20px rgba(143, 93, 141, 0.1)
                    `,
                  }}
                  aria-label={`Ver detalles de ${brand.name}`}
                >
                  {/* Resplandor de fondo adicional */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-50 blur-2xl pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(143, 93, 141, 0.3) 0%, rgba(35, 6, 54, 0.2) 50%, transparent 70%)',
                      zIndex: -1,
                    }}
                  />
                  <img
                    src={brand.image || "/isotipo.svg"}
                    alt={brand.name}
                    className="h-32 w-auto mx-auto object-contain filter brightness-0 invert opacity-90 drop-shadow-[0_0_8px_rgba(227,193,138,0.5)] pointer-events-none"
                    onError={(e) => {
                      e.target.src = '/isotipo.svg';
                    }}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {brands.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-[var(--tertiary)] w-8 shadow-[0_0_10px_rgba(227,193,138,0.6)]" 
                    : "bg-[var(--gray)] w-3 hover:bg-[var(--secondary)]"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Grid view for larger screens */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 mt-12">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleBrandClick(brand.id)}
              className="relative bg-[var(--white)]/10 backdrop-blur-sm border-2 rounded-xl p-6 transition-all duration-300 hover:scale-105 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--tertiary)] focus:ring-offset-2 focus:ring-offset-[var(--black)]"
              style={{
                borderColor: 'rgba(143, 93, 141, 0.3)',
                boxShadow: '0 0 10px rgba(143, 93, 141, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--secondary)';
                e.currentTarget.style.boxShadow = `
                  0 0 15px rgba(143, 93, 141, 0.5),
                  0 0 30px rgba(143, 93, 141, 0.3),
                  inset 0 0 15px rgba(143, 93, 141, 0.1)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(143, 93, 141, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(143, 93, 141, 0.2)';
              }}
              aria-label={`Ver detalles de ${brand.name}`}
            >
              {/* Resplandor sutil en hover */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(143, 93, 141, 0.4) 0%, transparent 70%)',
                  zIndex: -1,
                }}
              />
              <img
                src={brand.image || "/isotipo.svg"}
                alt={brand.name}
                className="h-20 w-auto mx-auto object-contain filter brightness-0 invert opacity-80 group-hover:opacity-95 transition-opacity duration-300 group-hover:drop-shadow-[0_0_5px_rgba(227,193,138,0.4)] pointer-events-none"
                onError={(e) => {
                  e.target.src = '/isotipo.svg';
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}