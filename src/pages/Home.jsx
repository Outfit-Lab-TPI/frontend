import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProbador } from "../hooks/useProbador.jsx";
import { useCombinacion } from "../hooks/useCombinacion.jsx";
import { useModelo3D } from "../hooks/useModelo3D.jsx";
import { useFavoritos } from "../hooks/useFavoritos.jsx";
import { useSugerencias } from "../hooks/useSugerencias.jsx";
import { useAuth } from "../hooks/auth/useAuth.jsx";
import ProbadorContenido from "../components/ProbadorContenido.jsx";
import Panel from "../components/Panel.jsx";
import SugerenciasModal from "../components/shared/SugerenciasModal";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const {
    combinarPrendas,
    loading: loadingCombinacion,
    error: errorCombinacion,
    resultado,
    limpiarResultado,
  } = useCombinacion();
  const {
    generarModelo3D,
    loading: loadingModelo3D,
    error: errorModelo3D,
    modeloUrl,
    limpiarModelo,
  } = useModelo3D();
  const { togglePrendaFavorita, toggleCombinacionFavorita } = useFavoritos();
  const {
    obtenerSugerencias,
    sugerencias,
    loading: loadingSugerencias,
    error: errorSugerencias,
    limpiarSugerencias,
  } = useSugerencias();

  const [selectedSuperior, setSelectedSuperior] = useState(null);
  const [selectedInferior, setSelectedInferior] = useState(null);
  // Estado para el tipo de avatar seleccionado por el usuario
  const [avatarType, setAvatarType] = useState(() => {
    // Default basado en preferencias del usuario
    if (user?.avatarUrl) return 'custom';
    return user?.avatarGenero === 'mujer' ? 'woman' : 'man';
  });
  const [lastCombination, setLastCombination] = useState(null);
  const [modalSugerenciasAbierto, setModalSugerenciasAbierto] = useState(false);
  const [prendaParaSugerencias, setPrendaParaSugerencias] = useState(null);

  const handleSelectPrenda = (prenda) => {
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

  const handleToggleFavorita = async (prenda) => {
    try {
      const nuevoEstadoFavorita = !prenda.esFavorita;
      actualizarFavoritoLocal(
        prenda.garmentCode || prenda.codigo || prenda.id,
        nuevoEstadoFavorita
      );

      await togglePrendaFavorita(
        prenda.garmentCode || prenda.codigo || prenda.id,
        prenda.esFavorita
      );
    } catch (error) {
      console.error("Error al cambiar favorito:", error);
      actualizarFavoritoLocal(
        prenda.garmentCode || prenda.codigo || prenda.id,
        prenda.esFavorita
      );
    }
  };

  const handleToggleFavoritoCombinacion = async (combinacion) => {
    try {
      await toggleCombinacionFavorita(combinacion, combinacion.esFavorita);
    } catch (error) {
      console.error("Error al cambiar favorito de combinación:", error);
    }
  };

  const handleSugerencias = async (prenda) => {
    try {
      setPrendaParaSugerencias(prenda);
      setModalSugerenciasAbierto(true);
      await obtenerSugerencias(prenda.garmentCode || prenda.codigo);
    } catch (error) {
      console.error("Error al obtener sugerencias:", error);
    }
  };

  const handleSolicitarCombinacion = async (sugerencia) => {
    try {
      limpiarResultado();
      limpiarModelo();

      setSelectedSuperior(sugerencia.topGarment);
      setSelectedInferior(sugerencia.bottomGarment);

      setLastCombination({
        superior: sugerencia.topGarment.nombre,
        inferior: sugerencia.bottomGarment.nombre,
        avatarType: avatarType,
      });

      await combinarPrendas(
        avatarType,
        sugerencia.topGarment,
        sugerencia.bottomGarment,
        user
      );
    } catch (error) {
      console.error("Error al aplicar sugerencia:", error);
    }
  };

  const handleCerrarModalSugerencias = () => {
    setModalSugerenciasAbierto(false);
    setPrendaParaSugerencias(null);
    limpiarSugerencias();
  };

  const canCombine = useMemo(() => {
    if (!selectedSuperior || !selectedInferior) return false;
    if (!lastCombination) return true;
    if (avatarType !== lastCombination.avatarType) return true;
    return !(
      selectedSuperior.nombre === lastCombination.superior &&
      selectedInferior.nombre === lastCombination.inferior
    );
  }, [selectedSuperior, selectedInferior, avatarType, lastCombination]);

  const handleCombinarPrendas = async (selectedAvatarType = avatarType) => {
    if (canCombine) {
      limpiarResultado();
      limpiarModelo();

      setLastCombination({
        superior: selectedSuperior?.nombre,
        inferior: selectedInferior?.nombre,
        avatarType: selectedAvatarType,
      });

      await combinarPrendas(selectedAvatarType, selectedSuperior, selectedInferior, user);
    }
  };

  const handleGenerarModelo3D = async () => {
    if (resultado) {
      await generarModelo3D(resultado);
    }
  };

  const handleAvatarTypeChange = (newAvatarType) => {
    setAvatarType(newAvatarType);
  };

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
          <div className="text-lg mb-4">
            Por favor intenta de nuevo más tarde.
          </div>
          <Button onClick={() => navigate("/")} width="fit">
            ⭠ Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col md:flex-row py-2 px-4 sm:px-6 gap-4 h-[calc(100vh-60px)]"
    >
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
        onCombinarPrendas={handleCombinarPrendas}
        loadingCombinacion={loadingCombinacion}
        resultado={resultado}
        errorCombinacion={errorCombinacion}
        errorModelo3D={errorModelo3D}
        modeloUrl={modeloUrl}
        loadingModelo3D={loadingModelo3D}
        handleGenerarModelo3D={handleGenerarModelo3D}
        avatarType={avatarType}
        onAvatarTypeChange={handleAvatarTypeChange}
        user={user}
      />

      {prendas && prendas.length > 0 && (
        <div className="hidden flex-1 lg:flex items-center justify-center overflow-hidden">
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
        </div>
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
