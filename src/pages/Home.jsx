import { useState } from 'react';
import ProbadorVirtual from "../components/Probador";
import PrendaCard from "../components/PrendaCard";

function Home() {

  const [prendasSeleccionadas, setPrendasSeleccionadas] = useState([]);

 const prendas = [
    {
      id: 'remera',
      nombre: 'remera azul casual',
      tipo: 'Conjunto',
      imagen: null,
      modelUrl: '/prendas/traje-1.glb'
    },
    {
      id: 'pantalon',
      nombre: 'pantalon deportivo',
      tipo: 'Conjunto',
      imagen: null,
      modelUrl: null
    },
    {
      id: 'buzo',
      nombre: 'Business',
      tipo: 'Formal',
      imagen: null,
      modelUrl: null
    },

  ];



  const handlePrendaSelect = (prendaId) => {
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
      <div className="prendas-section">
        <h2>Selecciona tu outfit</h2>
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
    </div>
  );
}

export default Home;