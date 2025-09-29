import { useState } from 'react';
import ProbadorVirtual from "../components/Probador";
import PrendaCard from "../components/PrendaCard";

function Home() {
  const [prendaSeleccionada, setPrendaSeleccionada] = useState(null);

  const prendas = [
    {
      id: 'traje-1',
      nombre: 'Traje Formal',
      tipo: 'Conjunto',
      imagen: null,
      modelUrl: '/prendas/traje-1.glb'
    },
    {
      id: 'outfit-2',
      nombre: 'Casual Verano',
      tipo: 'Conjunto',
      imagen: null,
      modelUrl: null
    },
    {
      id: 'outfit-3',
      nombre: 'Business',
      tipo: 'Formal',
      imagen: null,
      modelUrl: null
    },
    
  ];

  const handlePrendaSelect = (prendaId) => {
    if (prendaSeleccionada === prendaId) {
      setPrendaSeleccionada(null);
    } else {
      setPrendaSeleccionada(prendaId);
    }
  };

  return (
    <div className="home-container">
      <div className="prendas-section">
        <h2>Selecciona tu outfit</h2>
        <div className="prendas-grid">
          {prendas.map(prenda => (
            <PrendaCard
              key={prenda.id}
              prenda={prenda}
              isSelected={prendaSeleccionada === prenda.id}
              onSelect={handlePrendaSelect}
            />
          ))}
        </div>
      </div>

      <div className="avatar-section">
        <ProbadorVirtual prendaSeleccionada={prendaSeleccionada} />
      </div>
    </div>
  );
}

export default Home;