import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProbador } from "../hooks/useProbador.jsx";
import { useCombinacion } from "../hooks/useCombinacion.jsx";
import { useModelo3D } from "../hooks/useModelo3D.jsx";
import { useFavoritos } from "../hooks/useFavoritos.jsx";
import { useSugerencias } from "../hooks/useSugerencias.jsx";
import ProbadorContenido from "../components/ProbadorContenido.jsx";
import Panel from "../components/Panel.jsx";
import Button from '../components/shared/Button';
import SugerenciasModal from '../components/shared/SugerenciasModal';

export default function Home() {
  const navigate = useNavigate();

  // Hooks
  const {
    prendas,
    prendasCategorizadas,
    loading,
    error,
    criticalError,
    filtros,
    marcasDisponibles,
    coloresDisponibles,
    actualizarFiltros,
    limpiarFiltros,
    actualizarFavoritoLocal,
  } = useProbador();

  const { combinarPrendas, loading: loadingCombinacion, error: errorCombinacion, resultado, limpiarResultado } =
    useCombinacion();
  const { generarModelo3D, loading: loadingModelo3D, error: errorModelo3D, modeloUrl, limpiarModelo } =
    useModelo3D();
  const { togglePrendaFavorita, toggleCombinacionFavorita } = useFavoritos();
  const { obtenerSugerencias, sugerencias, loading: loadingSugerencias, error: errorSugerencias, limpiarSugerencias } = useSugerencias();

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

  // Manejar toggle de favoritos de prendas
  const handleToggleFavorita = async (prenda) => {
    try {
      // Actualizar inmediatamente en el estado local para UX instantánea
      const nuevoEstadoFavorita = !prenda.esFavorita;
      actualizarFavoritoLocal(prenda.garmentCode || prenda.codigo || prenda.id, nuevoEstadoFavorita);
      // Hacer la llamada al backend en segundo plano
      await togglePrendaFavorita(prenda.garmentCode || prenda.codigo || prenda.id, prenda.esFavorita);
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
      // Si falla, revertir el cambio local
      actualizarFavoritoLocal(prenda.garmentCode || prenda.codigo || prenda.id, prenda.esFavorita);
    }
  };

  // Manejar toggle de favoritos de combinaciones
  const handleToggleFavoritoCombinacion = async (combinacion) => {
    try {
      await toggleCombinacionFavorita(combinacion, combinacion.esFavorita);
    } catch (error) {
      console.error('Error al cambiar favorito de combinación:', error);
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

  // Verificar si se puede combinar
  const canCombine = useMemo(() => {
    if (!selectedSuperior || !selectedInferior) return false;
    if (!lastCombination) return true;
    if (esHombre !== lastCombination.esHombre) return true;
    return !(selectedSuperior.nombre === lastCombination.superior &&
             selectedInferior.nombre === lastCombination.inferior);
  }, [selectedSuperior, selectedInferior, esHombre, lastCombination]);

  // Limpiar resultado y combinar prendas
  const handleCombinarPrendas = async () => {
    if (canCombine) {
      limpiarResultado();
      limpiarModelo();

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

  // Lanzar excepción para errores críticos
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
          Cargando prendas del probador...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white py-10 px-5">
        <div className="text-center py-10">
          <div className="text-lg mb-4">Lo sentimos, hubo un error.</div>
          <div className="text-lg mb-4">Por favor intenta de nuevo más tarde.</div>
          <Button
            onClick={() => navigate('/')}
            width="fit"
          >
            ⭠ Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row px-4 sm:px-6 lg:px-24 gap-4 lg:gap-8" style={{height: 'calc(100vh - 70px)'}}>
      <ProbadorContenido
        prendas={prendas}
        prendasCategorizadas={prendasCategorizadas}
        filtros={filtros}
        marcasDisponibles={marcasDisponibles}
        coloresDisponibles={coloresDisponibles}
        onActualizarFiltros={actualizarFiltros}
        onLimpiarFiltros={limpiarFiltros}
        onToggleFavorita={handleToggleFavorita}
        onSugerencias={handleSugerencias}
        selectedSuperior={selectedSuperior}
        selectedInferior={selectedInferior}
        onSelectPrenda={handleSelectPrenda}
        canCombine={canCombine}
        esHombre={esHombre}
        setEsHombre={setEsHombre}
        onCombinarPrendas={handleCombinarPrendas}
        loadingCombinacion={loadingCombinacion}
      />

      {prendas && prendas.length > 0 && (
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