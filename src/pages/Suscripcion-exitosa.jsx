"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    // Esperar unos segundos para que el webhook procese
    const timer = setTimeout(() => {
      setVerifying(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    router.push("/subscription")
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-[var(--black)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8 flex justify-center">
            <Spinner className="w-16 h-16 text-[var(--secondary)]" />
          </div>
          <h2 className="text-3xl font-bold text-[var(--white)] mb-4">Verificando tu pago...</h2>
          <p className="text-[var(--gray)] font-secondary text-lg">
            Por favor espera mientras confirmamos tu suscripción
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--black)] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Success Icon */}
        <div
          className="mb-8 inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)]"
          style={{
            boxShadow: "0 0 60px rgba(143, 93, 141, 0.6)",
          }}
        >
          <span className="text-7xl">✅</span>
        </div>

        {/* Success Message */}
        <h1
          className="text-5xl md:text-6xl font-bold text-[var(--white)] mb-6"
          style={{
            textShadow: "0 0 30px rgba(143, 93, 141, 0.5)",
          }}
        >
          ¡PAGO EXITOSO!
        </h1>

        <p className="text-xl text-[var(--white)] font-secondary mb-4">
          Tu suscripción Premium ha sido activada correctamente
        </p>

        <p className="text-lg text-[var(--gray)] font-secondary mb-12">
          Ahora tienes acceso a 20 favoritos y todas las funciones premium
        </p>

        {/* Features List */}
        <div className="bg-[var(--black)]/60 backdrop-blur-sm border border-[var(--secondary)]/30 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-[var(--white)] mb-6">Beneficios Desbloqueados:</h3>
          <ul className="space-y-3 text-left max-w-md mx-auto">
            <li className="flex items-center gap-3">
              <span className="text-[var(--secondary)] text-xl">✓</span>
              <span className="text-[var(--white)] font-secondary">20 favoritos disponibles</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[var(--secondary)] text-xl">✓</span>
              <span className="text-[var(--white)] font-secondary">Soporte prioritario</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[var(--secondary)] text-xl">✓</span>
              <span className="text-[var(--white)] font-secondary">Sin anuncios</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[var(--secondary)] text-xl">✓</span>
              <span className="text-[var(--white)] font-secondary">Acceso anticipado a nuevas funciones</span>
            </li>
          </ul>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          className="bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] hover:from-[var(--secondary)]/90 hover:to-[var(--primary)]/90 text-[var(--white)] font-bold py-6 px-12 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-[var(--secondary)]/50"
          style={{
            boxShadow: "0 0 20px rgba(143, 93, 141, 0.4)",
          }}
        >
          CONTINUAR
        </Button>
      </div>
    </div>
  )
}
