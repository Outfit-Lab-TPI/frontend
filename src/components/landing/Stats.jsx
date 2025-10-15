import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

export default function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    { 
      number: 1000, 
      suffix: "+", 
      label: "Prendas Virtualizadas",
      color: "var(--tertiary)"
    },
    { 
      number: 500, 
      suffix: "+", 
      label: "Marcas Confían",
      color: "var(--secondary)"
    },
    { 
      number: 98, 
      suffix: "%", 
      label: "Satisfacción del Cliente",
      color: "var(--tertiary)"
    },
    { 
      number: 24, 
      suffix: "/7", 
      label: "Soporte Disponible",
      color: "var(--secondary)"
    },
  ]

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary)]/30 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="!text-3xl md:!text-4xl font-bold text-[var(--white)] mb-4">
            Números que <span className="text-[var(--tertiary)]">hablan</span> por nosotros
          </h2>
          <p className="text-[var(--gray)] text-lg max-w-2xl mx-auto">
            Miles de marcas ya confían en nuestra tecnología para transformar su experiencia de compra
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              stat={stat} 
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat, index, isInView }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const increment = stat.number / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= stat.number) {
        setCount(stat.number)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, stat.number])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className="relative group"
    >
      {/* Card */}
      <div 
        className="relative bg-[var(--white)]/5 backdrop-blur-sm border-2 rounded-2xl p-8 transition-all duration-500 hover:scale-105"
        style={{
          borderColor: 'rgba(143, 93, 141, 0.3)',
          boxShadow: '0 0 20px rgba(143, 93, 141, 0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = stat.color
          e.currentTarget.style.boxShadow = `
            0 0 30px ${stat.color}40,
            0 0 60px ${stat.color}20,
            inset 0 0 20px ${stat.color}10
          `
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(143, 93, 141, 0.3)'
          e.currentTarget.style.boxShadow = '0 0 20px rgba(143, 93, 141, 0.1)'
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${stat.color}60 0%, transparent 70%)`,
            zIndex: -1,
          }}
        />

        {/* Number */}
        <div className="text-center">
          <div 
            className="text-5xl md:text-6xl font-bold mb-2 transition-colors duration-300"
            style={{ color: stat.color }}
          >
            {count}{stat.suffix}
          </div>
          
          {/* Label */}
          <div className="text-[var(--white)] text-base md:text-lg font-medium tracking-wide">
            {stat.label}
          </div>
        </div>

        {/* Animated circle decoration */}
        <motion.div
          className="absolute top-4 right-4 w-12 h-12 rounded-full opacity-20"
          style={{ backgroundColor: stat.color }}
          animate={isInView ? {
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      </div>
    </motion.div>
  )
}
