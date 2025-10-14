import { useMarcas } from '../hooks/useMarcas.jsx';
import MarcaCard from '../components/MarcaCard.jsx';
import { useEffect } from 'react';

function Marcas() {
  const { marcas, loading, error, criticalError } = useMarcas();

  // Lanzar excepción para errores críticos para que sea capturada por ErrorBoundary
  useEffect(() => {
    if (criticalError) {
      throw new Error(`Error crítico del servidor: ${criticalError.message || 'No se pudo conectar con el servidor'}`);
    }
  }, [criticalError]);

  if (loading) {
    return (
      <div className="text-white py-10 px-5">
        <div className="text-center py-10 text-lg text-gray">Cargando marcas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white py-10 px-5">
        <div className="text-center py-10 text-lg text-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="py-10 px-5">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold tracking-wide">Marcas más populares</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto justify-items-center">
        {marcas.map((marca) => (
          <MarcaCard key={marca.codigoMarca} marca={marca} />
        ))}
      </div>
    </div>
  );
}

export default Marcas;