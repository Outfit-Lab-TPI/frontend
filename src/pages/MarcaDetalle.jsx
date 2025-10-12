import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useMarcaDetail } from '../hooks/useMarcaDetail.jsx';
import PrendaGalleryCard from '../components/PrendaGalleryCard.jsx';
import Button from '../components/shared/Button.jsx';
import { ChevronLeft, SquareArrowOutUpRight  } from 'lucide-react';

function MarcaDetalle() {
  const { codigoMarca } = useParams();
  const { marcaDetail, loading, error, criticalError } = useMarcaDetail(codigoMarca);

  // Lanzar excepción para errores críticos para que sea capturada por ErrorBoundary
  useEffect(() => {
    if (criticalError) {
      throw new Error(`Error crítico del servidor: ${criticalError.message || 'No se pudo conectar con el servidor'}`);
    }
  }, [criticalError]);

  if (loading) {
    return (
      <div className="text-white py-10 px-5">
        <div className="text-center py-10 text-lg text-gray">Cargando detalles de la marca...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white py-10 px-5">
        <div className="text-center py-10">
          <div className="text-lg text-error mb-4">Error: {error}</div>
          <Link
            to="/marcas"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Volver a Marcas
          </Link>
        </div>
      </div>
    );
  }

  if (!marcaDetail) {
    return (
      <div className="text-white py-10 px-5">
        <div className="text-center py-10">
          <div className="text-lg text-gray mb-4">Marca no encontrada</div>
          <Link
            to="/marcas"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Volver a Marcas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white py-10 px-5">
      {/* Botón de volver */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link
          to="/marcas"
          className="inline-flex gap-2 items-center text-gray-500 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Volver a Marcas
        </Link>
      </div>

      {/* Header de la marca */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Logo de la marca */}
          <div className="w-24 h-24 bg-gray rounded-xl flex items-center justify-center p-4">
            <img
              src={marcaDetail.logoUrl || '/isotipo.svg'}
              alt={marcaDetail.nombre}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.src = '/isotipo.svg';
              }}
            />
          </div>

          {/* Información de la marca */}
          <div className="h-24 flex flex-col justify-center gap-2">
            <h2>{marcaDetail.nombre}</h2>
            {marcaDetail.sitioUrl && (
              <a
                href={marcaDetail.sitioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray hover:text-white transition-colors"
              >
                <SquareArrowOutUpRight className="w-4 h-4" />
                Visitar sitio web
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Galería de prendas */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Productos</h2>

        {marcaDetail.prendas && marcaDetail.prendas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {marcaDetail.prendas.map((prenda, index) => (
              <PrendaGalleryCard key={index} prenda={prenda} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No hay productos disponibles para esta marca
          </div>
        )}
      </div>
    </div>
  );
}

export default MarcaDetalle;