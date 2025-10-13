import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useMarcaDetail } from "../hooks/useMarcaDetail.jsx";
import PrendaGalleryCard from "../components/PrendaGalleryCard.jsx";
import Button from "../components/shared/Button.jsx";
import { SquareArrowOutUpRight } from "lucide-react";

function MarcaDetalle() {
  const { codigoMarca } = useParams();
  const { marcaDetail, loading, error, criticalError } =
    useMarcaDetail(codigoMarca);

  // Estados para selección de prendas
  const [selectedSuperior, setSelectedSuperior] = useState(null);
  const [selectedInferior, setSelectedInferior] = useState(null);

  // Categorizar prendas por tipo
  const prendasCategorizadas = useMemo(() => {
    if (!marcaDetail?.prendas) return { superiores: [], inferiores: [] };

    return {
      superiores: marcaDetail.prendas.filter(
        prenda => prenda.tipo === "superior"
      ),
      inferiores: marcaDetail.prendas.filter(
        prenda => prenda.tipo === "inferior"
      ),
    };
  }, [marcaDetail?.prendas]);

  // Manejar selección de prendas
  const handleSelectPrenda = prenda => {
    if (prenda.tipo === "superior") {
      setSelectedSuperior(
        selectedSuperior?.nombre === prenda.nombre ? null : prenda
      );
    } else if (prenda.tipo === "inferior") {
      setSelectedInferior(
        selectedInferior?.nombre === prenda.nombre ? null : prenda
      );
    }
  };

  // Verificar si se puede combinar
  const canCombine = selectedSuperior && selectedInferior;

  // Manejar combinación de prendas
  const handleCombinarPrendas = () => {
    if (canCombine) {
      console.log("Prendas seleccionadas:", {
        superior: selectedSuperior,
        inferior: selectedInferior,
      });
    }
  };

  // Lanzar excepción para errores críticos para que sea capturada por ErrorBoundary
  useEffect(() => {
    if (criticalError) {
      throw new Error(
        `Error crítico del servidor: ${
          criticalError.message || "No se pudo conectar con el servidor"
        }`
      );
    }
  }, [criticalError]);

  if (loading) {
    return (
      <div className="text-white py-10 px-5">
        <div className="text-center py-10 text-lg text-gray">
          Cargando detalles de la marca...
        </div>
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

      <div className="flex-1 flex overflow-hidden px-24 gap-8" style={{height: 'calc(100vh - 60px)'}}>
        {/* Columna izquierda - Galería de prendas (2/3) */}
        <div className="w-2/3 flex flex-col">
          {/* Área scrolleable de prendas */}
      {/* Header fijo */}
      <div className="flex-shrink-0 p-4 bg-gray/10">
        {/* Header de la marca */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Logo de la marca */}
          <div className="w-20 h-20 bg-gray rounded-xl flex items-center justify-center p-4">
            <img
              src={marcaDetail.logoUrl || "/isotipo.svg"}
              alt={marcaDetail.nombre}
              className="max-w-full max-h-full object-contain"
              onError={e => {
                e.target.src = "/isotipo.svg";
              }}
            />
          </div>

          {/* Información de la marca */}
          <div className="h-20 flex flex-col justify-center gap-2">
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
          <div className="flex-1 overflow-y-auto my-6 modern-scrollbar">
            {marcaDetail.prendas && marcaDetail.prendas.length > 0 ? (
              <div className="space-y-12 max-w-5xl mx-auto">
                {/* Prendas Superiores */}
                <div>
                  <h4 className="text-xl font-semibold mb-3">
                    Prendas Superiores
                  </h4>
                  <div className="flex flex-wrap gap-8">
                    {prendasCategorizadas.superiores.map((prenda, index) => (
                      <PrendaGalleryCard
                        key={`superior-${index}`}
                        prenda={prenda}
                        isSelected={selectedSuperior?.nombre === prenda.nombre}
                        onSelect={handleSelectPrenda}
                      />
                    ))}
                  </div>
                  {prendasCategorizadas.superiores.length === 0 && (
                    <div className="text-center py-8 text-gray">
                      No hay prendas superiores disponibles
                    </div>
                  )}
                </div>

                {/* Prendas Inferiores */}
                <div>
                  <h4 className="text-xl font-semibold mb-3">
                    Prendas Inferiores
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {prendasCategorizadas.inferiores.map((prenda, index) => (
                      <PrendaGalleryCard
                        key={`inferior-${index}`}
                        prenda={prenda}
                        isSelected={selectedInferior?.nombre === prenda.nombre}
                        onSelect={handleSelectPrenda}
                      />
                    ))}
                  </div>
                  {prendasCategorizadas.inferiores.length === 0 && (
                    <div className="text-center py-8 text-gray">
                      No hay prendas inferiores disponibles
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray">
                No hay productos disponibles para esta marca
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha - Panel de combinación (1/3) */}
        <div className="w-1/3 flex flex-col border border-gray/20">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-lg text-white leading-relaxed">
                Selecciona dos prendas y combina tu outfit
              </div>
            </div>
          </div>

          {/* Botón en el panel lateral */}
            <div className="relative group p-4">
              <Button
                onClick={handleCombinarPrendas}
                disabled={!canCombine}
              >
                Combinar prendas
              </Button>

              {/* Tooltip */}
              {!canCombine && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Selecciona una prenda superior y una inferior para combinar
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>
        </div>
      </div>
  );
}

export default MarcaDetalle;
