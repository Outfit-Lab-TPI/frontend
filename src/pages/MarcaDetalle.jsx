import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useMarcaDetail } from "../hooks/useMarcaDetail.jsx";
import { useCombinacion } from "../hooks/useCombinacion.jsx";
import { useModelo3D } from "../hooks/useModelo3D.jsx";
import { useSugerencias } from "../hooks/useSugerencias.jsx";
import { useFavoritos } from "../hooks/useFavoritos.jsx";
import { useAuth } from "../hooks/auth/useAuth.jsx";
import MarcaContenido from "../components/MarcaContenido.jsx";
import Panel from "../components/Panel.jsx";
import SugerenciasModal from "../components/shared/SugerenciasModal.jsx";

function MarcaDetalle() {
  const { codigoMarca } = useParams();
  const { user } = useAuth();
  const {
    marcaDetail,
    loading,
    error,
    criticalError,
    actualizarFavoritoLocal,
  } = useMarcaDetail(codigoMarca);
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
  const {
    obtenerSugerencias,
    sugerencias,
    loading: loadingSugerencias,
    error: errorSugerencias,
    limpiarSugerencias,
  } = useSugerencias();
  const { togglePrendaFavorita, toggleCombinacionFavorita } = useFavoritos();
  const [selectedSuperior, setSelectedSuperior] = useState(null);
  const [selectedInferior, setSelectedInferior] = useState(null);
  const [avatarType, setAvatarType] = useState(() => {
    if (user?.avatarUrl) return "custom";
    return user?.avatarGenero === "mujer" ? "woman" : "man";
  });
  const [lastCombination, setLastCombination] = useState(null);
  const [modalSugerenciasAbierto, setModalSugerenciasAbierto] = useState(false);
  const [prendaParaSugerencias, setPrendaParaSugerencias] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [autoOpenDisabled, setAutoOpenDisabled] = useState(false);

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

      await combinarPrendas(
        selectedAvatarType,
        selectedSuperior,
        selectedInferior,
        user
      );
    }
  };

  const handleGenerarModelo3D = async () => {
    if (resultado) {
      await generarModelo3D(resultado);
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
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error al aplicar sugerencia:", error);
    }
  };

  const handleCerrarModalSugerencias = () => {
    setModalSugerenciasAbierto(false);
    setPrendaParaSugerencias(null);
    limpiarSugerencias();
  };

  const handleAvatarTypeChange = (newAvatarType) => {
    setAvatarType(newAvatarType);
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
      // Si falla, revertir el cambio local
      actualizarFavoritoLocal(
        prenda.garmentCode || prenda.codigo || prenda.id,
        prenda.esFavorita
      );
    }
  };

  const handleToggleFavoritoCombinacion = async (combinacion) => {
    try {
      await toggleCombinacionFavorita(
        combinacion.codigoCombinacion || combinacion.id,
        combinacion.esFavorita
      );
    } catch (error) {
      console.error("Error al cambiar favorito de combinación:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;

      if (isMobile && (resultado || modeloUrl) && !autoOpenDisabled) {
        setIsDrawerOpen(true);
        setAutoOpenDisabled(true);
      }

      if (!isMobile) {
        if (isDrawerOpen) setIsDrawerOpen(false);
        if (autoOpenDisabled) setAutoOpenDisabled(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resultado, modeloUrl, autoOpenDisabled, isDrawerOpen]);

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
    <div
      className="flex-1 flex flex-col md:flex-row py-2 px-4 sm:px-6 gap-2"
      style={{ height: "calc(100vh - 70px)" }}
    >
      <MarcaContenido
        marcaDetail={marcaDetail}
        selectedSuperior={selectedSuperior}
        selectedInferior={selectedInferior}
        onSelectPrenda={handleSelectPrenda}
        onToggleFavorita={handleToggleFavorita}
        onSugerencias={handleSugerencias}
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
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        setAutoOpenDisabled={setAutoOpenDisabled}
      />

      {(marcaDetail.garmentTop?.content?.length > 0 ||
        marcaDetail.garmentBottom?.content?.length > 0) && (
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

export default MarcaDetalle;
