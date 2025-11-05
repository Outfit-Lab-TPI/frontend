"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface SubscriptionData {
  userId: number
  status: "FREE" | "PREMIUM_MONTHLY" | "PREMIUM_YEARLY"
  expiresAt: string | null
  maxFavorites: number
  currentFavorites: number
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TODO: Obtener del contexto de autenticación
  const userId = 1
  const userEmail = "usuario@example.com"

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/users/${userId}/subscription`)

      if (!response.ok) {
        throw new Error("Error al obtener suscripción")
      }

      const data = await response.json()
      setSubscription(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const handlePurchasePremium = async () => {
    try {
      setPurchasing(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/mp/purchase/PREMIUM_MONTHLY`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: userEmail,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al procesar compra")
      }

      const data = await response.json()

      // Redirigir a MercadoPago
      window.location.href = data.initPoint
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--black)]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-12 h-12 text-[var(--secondary)]" />
          <p className="text-[var(--white)] font-secondary">Cargando planes...</p>
        </div>
      </div>
    )
  }

  const isPremium = subscription?.status === "PREMIUM_MONTHLY" || subscription?.status === "PREMIUM_YEARLY"

  return (
    <div className="min-h-screen bg-[var(--black)] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--white)] mb-4">PLANES DE SUSCRIPCIÓN</h1>
          <p className="text-xl text-[var(--gray)] font-secondary">Elige el plan perfecto para ti</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400 text-center font-secondary">⚠️ {error}</p>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* FREE Plan */}
          <div
            className={`relative rounded-2xl p-8 backdrop-blur-sm border-2 transition-all duration-300 ${
              !isPremium
                ? "bg-[var(--black)]/60 border-[var(--tertiary)] shadow-lg shadow-[var(--tertiary)]/20"
                : "bg-[var(--black)]/40 border-[var(--gray)]/30 hover:border-[var(--gray)]/50"
            }`}
          >
            {!isPremium && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--tertiary)] text-[var(--black)] px-6 py-2 rounded-full font-bold text-sm">
                TU PLAN ACTUAL
              </div>
            )}

            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-[var(--white)] mb-2">PLAN FREE</h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-[var(--white)]">$0</span>
                <span className="text-xl text-[var(--gray)] font-secondary">/mes</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-[var(--tertiary)] text-xl flex-shrink-0">✓</span>
                <span className="text-[var(--white)] font-secondary">Hasta 2 favoritos máximo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--tertiary)] text-xl flex-shrink-0">✓</span>
                <span className="text-[var(--white)] font-secondary">Funciones básicas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--tertiary)] text-xl flex-shrink-0">✓</span>
                <span className="text-[var(--white)] font-secondary">Acceso al probador virtual</span>
              </li>
            </ul>

            {!isPremium && (
              <div className="text-center text-[var(--gray)] font-secondary text-sm">Plan gratuito por defecto</div>
            )}
          </div>

          {/* PREMIUM Plan */}
          <div
            className={`relative rounded-2xl p-8 backdrop-blur-sm border-2 transition-all duration-300 ${
              isPremium
                ? "bg-gradient-to-br from-[var(--secondary)]/20 to-[var(--primary)]/20 border-[var(--secondary)] shadow-2xl shadow-[var(--secondary)]/40"
                : "bg-gradient-to-br from-[var(--secondary)]/10 to-[var(--primary)]/10 border-[var(--secondary)]/50 hover:border-[var(--secondary)] hover:shadow-xl hover:shadow-[var(--secondary)]/30"
            }`}
            style={{
              boxShadow: isPremium
                ? "0 0 40px rgba(143, 93, 141, 0.4), inset 0 0 20px rgba(143, 93, 141, 0.1)"
                : undefined,
            }}
          >
            {/* Popular Badge */}
            {!isPremium && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] text-[var(--white)] px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                ⭐ RECOMENDADO
              </div>
            )}

            {/* Current Plan Badge */}
            {isPremium && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--secondary)] text-[var(--white)] px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-[var(--secondary)]/50">
                TU PLAN ACTUAL
              </div>
            )}

            <div className="text-center mb-8">
              <h2
                className="text-4xl font-bold text-[var(--white)] mb-2"
                style={{
                  textShadow: "0 0 20px rgba(143, 93, 141, 0.6)",
                }}
              >
                PREMIUM MONTHLY
              </h2>
              <div className="flex items-baseline justify-center gap-2">
                <span
                  className="text-5xl font-bold text-[var(--secondary)]"
                  style={{
                    textShadow: "0 0 30px rgba(143, 93, 141, 0.8)",
                  }}
                >
                  $5000
                </span>
                <span className="text-xl text-[var(--gray)] font-secondary">/mes</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-[var(--secondary)] text-xl flex-shrink-0">✓</span>
                <span className="text-[var(--white)] font-secondary">Hasta 20 favoritos disponibles</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--secondary)] text-xl flex-shrink-0">✓</span>
                <span className="text-[var(--white)] font-secondary">Soporte prioritario</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--secondary)] text-xl flex-shrink-0">✓</span>
                <span className="text-[var(--white)] font-secondary">Sin anuncios</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--secondary)] text-xl flex-shrink-0">✓</span>
                <span className="text-[var(--white)] font-secondary">Acceso anticipado a nuevas funciones</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--secondary)] text-xl flex-shrink-0">✓</span>
                <span className="text-[var(--white)] font-secondary">Recomendaciones personalizadas</span>
              </li>
            </ul>

            {isPremium ? (
              <div className="space-y-3">
                <div className="text-center bg-[var(--secondary)]/20 border border-[var(--secondary)]/30 rounded-lg p-3">
                  <p className="text-[var(--white)] font-secondary text-sm">
                    {subscription?.expiresAt && (
                      <>
                        Vence el:{" "}
                        <span className="font-bold text-[var(--secondary)]">
                          {new Date(subscription.expiresAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <Button
                onClick={handlePurchasePremium}
                disabled={purchasing}
                className="w-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] hover:from-[var(--secondary)]/90 hover:to-[var(--primary)]/90 text-[var(--white)] font-bold py-6 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-[var(--secondary)]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: "0 0 20px rgba(143, 93, 141, 0.4)",
                }}
              >
                {purchasing ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Spinner className="w-5 h-5" />
                    Procesando...
                  </span>
                ) : (
                  "COMPRAR AHORA"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Favorites Indicator */}
        {subscription && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-[var(--black)]/60 backdrop-blur-sm border border-[var(--secondary)]/30 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-3xl">📌</span>
                <p className="text-xl text-[var(--white)] font-secondary">
                  Usando <span className="font-bold text-[var(--secondary)]">{subscription.currentFavorites}</span> de{" "}
                  <span className="font-bold text-[var(--tertiary)]">{subscription.maxFavorites}</span> favoritos
                  disponibles
                </p>
              </div>
              <div className="w-full bg-[var(--gray)]/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[var(--secondary)] to-[var(--tertiary)] h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(subscription.currentFavorites / subscription.maxFavorites) * 100}%`,
                    boxShadow: "0 0 10px rgba(143, 93, 141, 0.6)",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
