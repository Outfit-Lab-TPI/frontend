import { useState } from "react";
import { Link } from 'react-router-dom';
import ProbadorVirtual from "../components/Probador";
import TestProbadorVirtual from "../components/TestProbador";
import PrendaCard from "../components/PrendaCard";

function Home() {
  const [prendasSeleccionadas, setPrendasSeleccionadas] = useState([]);

  const prendas = [
    {
      id: "remera",
      nombre: "remera azul casual",
      tipo: "Conjunto",
      imagen: null,
      modelUrl: "/prendas/traje-1.glb",
    },
    {
      id: "pantalon",
      nombre: "pantalon deportivo",
      tipo: "Conjunto",
      imagen: null,
      modelUrl: null,
    },
    {
      id: "buzo",
      nombre: "Business",
      tipo: "Formal",
      imagen: null,
      modelUrl: null,
    },
  ];

  const handlePrendaSelect = prendaId => {
    setPrendasSeleccionadas(prevSeleccion => {
      if (prevSeleccion.includes(prendaId)) {
        return prevSeleccion.filter(id => id !== prendaId);
      } else {
        return [...prevSeleccion, prendaId];
      }
    });
  };

  return (
    <div className="home-container">
      <div className="prendas-section gap-2">
        <h2>Selecciona tu outfit</h2>
        <Link 
            to="/avatars-showroom"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-2"
          >
            👕 Avatars Showroom
          </Link>
        <div className="prendas-grid">
          {prendas.map(prenda => (
            <PrendaCard
              key={prenda.id}
              prenda={prenda}
              isSelected={prendasSeleccionadas.includes(prenda.id)}
              onSelect={handlePrendaSelect}
            />
          ))}
        </div>
      </div>

      <div className="avatar-section">
        <ProbadorVirtual prendaSeleccionada={prendasSeleccionadas} />
      </div>
      <div className="avatar-section">
        <TestProbadorVirtual />
      </div>
    </div>
  );
}

export default Home;
