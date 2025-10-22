import { useState } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const prizes = [
  { id: 1, name: "Sticker", color: "#8f5d8d" },
  { id: 2, name: "Golosina", color: "#230636" },
  { id: 3, name: "Perchas ×3", color: "#5d3a5e" },
  { id: 4, name: "Otro intento", color: "#8f5d8d" },
  { id: 5, name: "Sticker", color: "#230636" },
  { id: 6, name: "Golosina", color: "#5d3a5e" },
  { id: 7, name: "Premio sorpresa", color: "#8f5d8d" },
  { id: 8, name: "Otro intento", color: "#230636" },
];

export default function Ruleta() {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // 1. Selección con pesos - "Perchas x3" (índice 2) y "Premio sorpresa" (índice 6) tienen menos chances
    const weightedPrizes = [];
    prizes.forEach((prize, index) => {
      // Índice 2 (Perchas x3) y 6 (Premio sorpresa) se agregan solo 1 vez, otros 3 veces
      const repetitions = (index === 2 || index === 6) ? 1 : 3;
      for (let i = 0; i < repetitions; i++) {
        weightedPrizes.push(index);
      }
    });

    // 2. Seleccionar premio aleatoriamente del array con pesos
    const randomIndex = Math.floor(Math.random() * weightedPrizes.length);
    const winnerIndex = weightedPrizes[randomIndex];

    // 3. Calcular rotación para que la flecha quede exactamente en el centro del premio
    const degreesPerSegment = 360 / prizes.length; // 45° por segmento
    const minRotations = 20;
    const maxRotations = 30;
    const extraRotations = Math.floor(Math.random() * (maxRotations - minRotations + 1)) + minRotations;

    // La flecha apunta hacia arriba (0°). Para que un segmento específico quede bajo la flecha,
    // necesitamos calcular cuánto rotar la ruleta.
    // El primer segmento (índice 0) está centrado en 22.5° (la mitad del primer segmento)
    // El segmento ganador está centrado en: (winnerIndex * degreesPerSegment) + (degreesPerSegment / 2)
    const segmentCenterAngle = (winnerIndex * degreesPerSegment) + (degreesPerSegment / 2);

    // Para que el centro del segmento ganador quede en 0° (donde apunta la flecha),
    // necesitamos rotar la ruleta en sentido contrario al ángulo del centro del segmento
    const targetFinalAngle = -segmentCenterAngle;

    // Normalizar el ángulo a un valor positivo entre 0 y 360
    const normalizedTargetAngle = ((targetFinalAngle % 360) + 360) % 360;

    // La rotación final incluye las vueltas extra más el ángulo exacto para centrar el premio
    const newRotation = extraRotations * 360 + normalizedTargetAngle;

    setRotation(newRotation);

    // Guardamos el premio después de calcular la rotación
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(prizes[winnerIndex]);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-[var(--black)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--secondary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--tertiary)]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-[var(--white)]/70 hover:text-[var(--tertiary)] transition-colors duration-300"
      >
        <ArrowLeft size={24} />
        <span className="text-sm tracking-widest">VOLVER</span>
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl w-full">
        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-5xl md:text-7xl text-[var(--tertiary)] mb-4 tracking-wider font-bold">
            RULETA DE REGALOS
          </h1>
          <p className="text-[var(--white)]/70 text-lg tracking-widest">
            Girá la ruleta y ganá premios increíbles
          </p>
        </div>

        {/* Wheel container */}
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
          {/* Pointer/Arrow */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-[var(--tertiary)] drop-shadow-lg" />
          </div>

          {/* Wheel */}
          <div
            className="relative w-full h-full rounded-full shadow-2xl overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 6s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
              border: "8px solid var(--tertiary)",
            }}
          >
            {prizes.map((prize, index) => {
              const angle = (360 / prizes.length) * index;
              return (
                <div
                  key={prize.id}
                  className="absolute w-full h-full origin-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath:
                      "polygon(50% 50%, 50% 0%, 100% 0%, 50% 50%)",
                    backgroundColor: prize.color,
                  }}
                >
                  <div
                    className="absolute top-[15%] left-[63%] transform -translate-x-1/2 w-16 text-center"
                    style={{
                      transform: `rotate(${360 / prizes.length / 2}deg)`,
                    }}
                  >
                    <p className="text-[var(--white)] text-xs md:text-sm font-bold tracking-wider leading-tight break-words">
                      {prize.name}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[var(--black)] rounded-full border-4 border-[var(--tertiary)] flex items-center justify-center shadow-xl">
              <Trophy className="text-[var(--tertiary)]" size={32} />
            </div>
          </div>
        </div>

        {/* Spin button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className={`relative px-16 py-5 bg-gradient-to-r from-[var(--tertiary)] to-[#d4a868] text-[var(--black)] text-xl md:text-2xl font-bold tracking-widest rounded-full shadow-2xl transition-all duration-300 ${
            isSpinning
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-105 hover:shadow-[0_0_30px_rgba(227,193,138,0.5)] active:scale-95"
          }`}
        >
          {isSpinning ? (
            <span className="animate-pulse">GIRANDO...</span>
          ) : (
            "¡PROBÁ TU SUERTE!"
          )}
        </button>

        {/* Winner display */}
        {winner && !isSpinning && (
          <div className="mt-6 text-center animate-[fadeIn_0.5s_ease-in]">
            <div className="bg-[var(--primary)] border-2 border-[var(--tertiary)] rounded-2xl p-8 shadow-2xl">
              {winner.id !== 4 && winner.id !== 8 && (
                <>
                  <h3 className="text-3xl text-[var(--tertiary)] mb-3 tracking-wider">
                    ¡FELICITACIONES!
                  </h3>
                  <p className="text-[var(--white)] text-xl mb-2">
                    Ganaste:
                  </p>
                </>
              )}
              <p className="text-4xl text-[var(--tertiary)] font-bold tracking-widest">
                {winner.name}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
