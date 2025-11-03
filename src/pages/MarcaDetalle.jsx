import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useMarcaDetail } from "../hooks/useMarcaDetail.jsx";
import { useCombinacion } from "../hooks/useCombinacion.jsx";
import { useModelo3D } from "../hooks/useModelo3D.jsx";
import { useSugerencias } from "../hooks/useSugerencias.jsx";
import { useFavoritos } from "../hooks/useFavoritos.jsx";
import MarcaContenido from "../components/MarcaContenido.jsx";
import Panel from "../components/Panel.jsx";
import SugerenciasModal from "../components/shared/SugerenciasModal.jsx";

function MarcaDetalle() {
  const { codigoMarca } = useParams();
  const { marcaDetail, loading, error, criticalError } =
    useMarcaDetail(codigoMarca);
  const { combinarPrendas, loading: loadingCombinacion, error: errorCombinacion, resultado, limpiarResultado } =
    useCombinacion();
  const { generarModelo3D, loading: loadingModelo3D, error: errorModelo3D, modeloUrl, limpiarModelo } =
    useModelo3D();
  const { obtenerSugerencias, sugerencias, loading: loadingSugerencias, error: errorSugerencias, limpiarSugerencias } = useSugerencias();
  const { togglePrendaFavorita, toggleCombinacionFavorita } = useFavoritos();

  // Estados para selección de prendas
  const [selectedSuperior, setSelectedSuperior] = useState(null);
  const [selectedInferior, setSelectedInferior] = useState(null);
  const [esHombre, setEsHombre] = useState(true);
  const [lastCombination, setLastCombination] = useState(null);
  const [modalSugerenciasAbierto, setModalSugerenciasAbierto] = useState(false);
  const [prendaParaSugerencias, setPrendaParaSugerencias] = useState(null);


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
  const canCombine = useMemo(() => {
    // Debe haber AMBAS prendas seleccionadas (superior Y inferior)
    if (!selectedSuperior || !selectedInferior) return false;

    // Si no hay combinación previa, permitir combinar
    if (!lastCombination) return true;

    // Si cambió el avatar, permitir combinar
    if (esHombre !== lastCombination.esHombre) return true;

    // Si las prendas actuales son diferentes a la última combinación, permitir combinar
    return !(selectedSuperior.nombre === lastCombination.superior &&
             selectedInferior.nombre === lastCombination.inferior);
  }, [selectedSuperior, selectedInferior, esHombre, lastCombination]);

  // Limpiar resultado solo al iniciar una nueva combinación
  const handleCombinarPrendas = async () => {
    if (canCombine) {
      // Limpiar resultado anterior antes de generar uno nuevo
      limpiarResultado();
      limpiarModelo(); // También limpiar modelo 3D anterior

      // Guardar la combinación actual antes de enviarla
      setLastCombination({
        superior: selectedSuperior?.nombre,
        inferior: selectedInferior?.nombre,
        esHombre: esHombre
      });

      await combinarPrendas(esHombre, selectedSuperior, selectedInferior);
    }
  };

  // Manejar generación de modelo 3D
  const handleGenerarModelo3D = async () => {
    if (resultado) {
      await generarModelo3D(resultado);
    }
  };

  // Manejar solicitud de sugerencias
  const handleSugerencias = async (prenda) => {
    try {
      setPrendaParaSugerencias(prenda);
      setModalSugerenciasAbierto(true);
      await obtenerSugerencias(prenda.garmentCode || prenda.codigo);
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    }
  };

  // Manejar solicitud de combinación desde sugerencias
  const handleSolicitarCombinacion = async (sugerencia) => {
    try {
      // Limpiar resultado anterior
      limpiarResultado();
      limpiarModelo();

      // Establecer prendas seleccionadas basadas en la sugerencia
      setSelectedSuperior(sugerencia.topGarment);
      setSelectedInferior(sugerencia.bottomGarment);

      // Guardar combinación y ejecutar
      setLastCombination({
        superior: sugerencia.topGarment.nombre,
        inferior: sugerencia.bottomGarment.nombre,
        esHombre: esHombre
      });

      await combinarPrendas(esHombre, sugerencia.topGarment, sugerencia.bottomGarment);
    } catch (error) {
      console.error('Error al aplicar sugerencia:', error);
    }
  };

  // Cerrar modal de sugerencias
  const handleCerrarModalSugerencias = () => {
    setModalSugerenciasAbierto(false);
    setPrendaParaSugerencias(null);
    limpiarSugerencias();
  };

  // Manejar toggle de favoritos de prendas
  const handleToggleFavorita = async (prenda) => {
    try {
      await togglePrendaFavorita(prenda.garmentCode || prenda.codigo);
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    }
  };

  // Manejar toggle de favoritos de combinaciones
  const handleToggleFavoritoCombinacion = async (combinacion) => {
    try {
      await toggleCombinacionFavorita(combinacion.codigoCombinacion || combinacion.id);
    } catch (error) {
      console.error('Error al cambiar favorito de combinación:', error);
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
    <div className="flex-1 flex flex-col md:flex-row px-4 sm:px-6 lg:px-24 gap-4 lg:gap-8" style={{height: 'calc(100vh - 70px)'}}>
      <MarcaContenido
        marcaDetail={marcaDetail}
        selectedSuperior={selectedSuperior}
        selectedInferior={selectedInferior}
        onSelectPrenda={handleSelectPrenda}
        onToggleFavorita={handleToggleFavorita}
        onSugerencias={handleSugerencias}
        canCombine={canCombine}
        esHombre={esHombre}
        setEsHombre={setEsHombre}
        onCombinarPrendas={handleCombinarPrendas}
        loadingCombinacion={loadingCombinacion}
      />

      {marcaDetail.prendas && marcaDetail.prendas.length > 0 && (
      <Panel
        loadingCombinacion={loadingCombinacion}
        resultado={resultado}
        errorCombinacion={errorCombinacion}
        errorModelo3D={errorModelo3D}
        modeloUrl={modeloUrl}
        loadingModelo3D={loadingModelo3D}
        onGenerarModelo3D={handleGenerarModelo3D}
        onToggleFavoritoCombinacion={handleToggleFavoritoCombinacion}
      />
      )}

      {/* Modal de Sugerencias */}
      <SugerenciasModal
        isOpen={modalSugerenciasAbierto}
        onClose={handleCerrarModalSugerencias}
        onSolicitarCombinacion={handleSolicitarCombinacion}
        sugerencias={sugerencias}
        loading={loadingSugerencias}
        error={errorSugerencias}
        prendaOriginal={prendaParaSugerencias}
      />
    </div>
  );
}

export default MarcaDetalle;
