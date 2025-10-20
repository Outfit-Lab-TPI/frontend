import { useState } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const prizes = [
  { id: 1, name: "20% OFF", color: "#8f5d8d" },
  { id: 2, name: "SORPRESA", color: "#230636" },
  { id: 3, name: "10% OFF", color: "#e3c18a" },
  { id: 4, name: "DESCUENTO", color: "#8f5d8d" },
  { id: 5, name: "30% OFF", color: "#230636" },
  { id: 6, name: "PRENDA GRATIS", color: "#e3c18a" },
  { id: 7, name: "15% OFF", color: "#8f5d8d" },
  { id: 8, name: "REGALO", color: "#230636" },
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

    // Random number of full rotations (5-10) plus random position
    const fullRotations = Math.floor(Math.random() * 6) + 5;
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = fullRotations * 360 + randomDegree;

    // Calculate which prize was won
    const normalizedDegree = (360 - (randomDegree % 360)) % 360;
    const prizeIndex = Math.floor((normalizedDegree / 360) * prizes.length);
    const wonPrize = prizes[prizeIndex];

    setRotation(rotation + totalRotation);

    // Show winner after animation
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(wonPrize);
    }, 4000);
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
            RULETA DE
          </h1>
          <h1 className="text-5xl md:text-7xl text-[var(--tertiary)] mb-4 tracking-wider font-bold">
            REGALOS
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
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
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
                    className="absolute top-[20%] left-[60%] transform -translate-x-1/2 -rotate-0"
                    style={{
                      transform: `rotate(${360 / prizes.length / 2}deg)`,
                    }}
                  >
                    <p className="text-[var(--white)] text-xs md:text-sm font-bold tracking-wider whitespace-nowrap">
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
          className={`relative px-12 py-5 bg-gradient-to-r from-[var(--tertiary)] to-[#d4a868] text-[var(--black)] text-2xl md:text-3xl font-bold tracking-widest rounded-full shadow-2xl transition-all duration-300 ${
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
              <h3 className="text-3xl text-[var(--tertiary)] mb-3 tracking-wider">
                ¡FELICITACIONES!
              </h3>
              <p className="text-[var(--white)] text-xl mb-2">
                Ganaste:
              </p>
              <p className="text-4xl text-[var(--tertiary)] font-bold tracking-widest">
                {winner.name}
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-[var(--white)]/50 text-sm max-w-md mt-4">
          <p className="tracking-wide">
            * Hacé click en el botón para girar la ruleta y descubrí qué premio te toca
          </p>
        </div>
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
