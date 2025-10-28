import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from 'lucide-react';
import Button from '../components/shared/Button';

export default function Home() {
  const navigate = useNavigate();
  const [prendasSeleccionadas, setPrendasSeleccionadas] = useState([]);

  return (
    <div className="home-container">
      <div className="prendas-section">
        <div className="flex justify-between mb-4">
        <h3>Selecciona tu outfit</h3>
        <Button 
        width='fit'
        onClick={() => navigate('/nueva-prenda')}>
          <Plus />
          Nueva prenda
        </Button>

        </div>
        {/* <div className="prendas-grid">
          {prendas.map((prenda) => (
            <PrendaCard
              key={prenda.id}
              prenda={prenda}
              isSelected={prendasSeleccionadas.includes(prenda.id)}
              onSelect={handlePrendaSelect}
            />
          ))}
        </div> */}
      </div>

      <div className="avatar-section">
        {/* <ProbadorVirtual prendaSeleccionada={prendasSeleccionadas} /> */}
      </div>
    </div>
  );
}
