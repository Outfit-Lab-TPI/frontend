import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProbadorVirtual from "../components/Probador";
import PrendaCard from "../components/PrendaCard";
import { Plus } from 'lucide-react';
import Button from '../components/shared/Button';

export default function Home() {
  const navigate = useNavigate();
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

  const handlePrendaSelect = (prendaId) => {
    setPrendasSeleccionadas((prevSeleccion) => {
      if (prevSeleccion.includes(prendaId)) {
        return prevSeleccion.filter((id) => id !== prendaId);
      } else {
        return [...prevSeleccion, prendaId];
      }
    });
  };

  return (
    <div className="home-container">
      <div className="prendas-section">
        <div className="flex justify-between mb-4">
        <h2>Selecciona tu outfit</h2>
        <Button 
        width='fit'
        onClick={() => navigate('/nueva-prenda')}>
          <Plus />
          Nueva prenda
        </Button>

        </div>
        <div className="prendas-grid">
          {prendas.map((prenda) => (
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
    </div>
  );
}
