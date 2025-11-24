import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookHeart, CircleArrowLeft } from "lucide-react";
import { useCombinacionesFavoritas } from "../hooks/useCombinacionesFavoritas.jsx";
import { useFavoritos } from "../hooks/useFavoritos.jsx";
import { useCombinacion } from "../hooks/useCombinacion.jsx";
import { useModelo3D } from "../hooks/useModelo3D.jsx";
import { useNavigate } from "react-router-dom";
import CombinacionCard from "../components/CombinacionCard.jsx";
import Panel from "../components/Panel.jsx";
import Button from "../components/shared/Button.jsx";
import ConfirmDialog from "../components/shared/ConfirmDialog.jsx";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { handleBack } from "@/lib/utils.js";

export default function Combinaciones() {
  const {
    combinaciones,
    loading,
    error,
    actualizarFavoritoLocal,
    eliminarCombinacionLocal,
    refetch,
  } = useCombinacionesFavoritas(true);
  const { toggleCombinacionFavorita } = useFavoritos();
  const {
    loading: loadingCombinacion,
    error: errorCombinacion,
    resultado,
    limpiarResultado,
    setResultado,
  } = useCombinacion();
  const {
    generarModelo3D,
    loading: loadingModelo3D,
    error: errorModelo3D,
    modeloUrl,
    limpiarModelo,
  } = useModelo3D();
  const [combinacionSeleccionada, setCombinacionSeleccionada] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [combinacionAEliminar, setCombinacionAEliminar] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [autoOpenDisabled, setAutoOpenDisabled] = useState(false);
  const [highlightButton, setHighlightButton] = useState(false);
  const navigate = useNavigate();

  const handleToggleFavorita = async (combinacion) => {
    setCombinacionAEliminar(combinacion);
    setShowConfirmDialog(true);
  };

  const confirmarEliminacion = async () => {
    if (!combinacionAEliminar) return;

    const codigoCombinacion = combinacionAEliminar.combinationUrl;

    try {
      // Primero hacer la llamada al servidor
      await toggleCombinacionFavorita(codigoCombinacion);

      // Solo si la operación fue exitosa, actualizar el estado local
      eliminarCombinacionLocal(codigoCombinacion);

      // Si la combinación eliminada era la seleccionada, deseleccionarla
      if (combinacionSeleccionada?.id === combinacionAEliminar.id) {
        setCombinacionSeleccionada(null);
      }

      setShowConfirmDialog(false);
      setCombinacionAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar combinación de favoritos:", error);
      // Si falla, cerrar el diálogo pero mantener el estado
      setShowConfirmDialog(false);
      setCombinacionAEliminar(null);
    }
  };

  const cancelarEliminacion = () => {
    setShowConfirmDialog(false);
    setCombinacionAEliminar(null);
  };

  const handleVerDetalle = (combinacion) => {
    if (combinacion == combinacionSeleccionada) {
      setCombinacionSeleccionada(null);
    } else {
      setCombinacionSeleccionada(combinacion);

      setHighlightButton(true);
      setTimeout(() => setHighlightButton(false), 800);
    }

    limpiarResultado();
    limpiarModelo();
  };

  function handleOnOpenChange(open) {
    setIsDrawerOpen(open);
    if (!open) setAutoOpenDisabled(true);
  }

  function handleCombineInDrawer() {
    setIsDrawerOpen(true);
    setAutoOpenDisabled(true);
    handleProbarCombinacion();
  }

  const handleProbarCombinacion = async () => {
    if (combinacionSeleccionada) {
      limpiarResultado();
      limpiarModelo();

      // Establecer resultado usando la imagen de la combinación favorita
      const resultadoCombinacion = {
        imageUrl: combinacionSeleccionada.combinationUrl,
        esFavorita: true, // Ya es favorita por estar en esta página
      };

      setResultado(resultadoCombinacion);
    }
  };

  const handleGenerarModelo3D = async () => {
    if (resultado) {
      await generarModelo3D(resultado);
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

  if (loading) {
    return (
      <div className="text-white py-10 px-5">
        <div className="text-center py-10 text-lg text-gray">
          Cargando tus combinaciones favoritas...
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
          <Button onClick={() => handleBack(navigate)} width="fit">
            ⭠ Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col md:flex-row px-4 sm:px-6 gap-4"
      style={{ height: "calc(100vh - 70px)" }}
    >
      <div className="w-full lg:w-2/3 flex flex-col p-2">
        <div className="flex gap-2 flex-col">
          <Button
            onClick={() => handleBack(navigate)}
            width="fit"
            variant="ghost"
            color={"gray"}
          >
            <CircleArrowLeft className="size-7 m-1" color="gray" />
          </Button>

          <div className="p-2 sm:p-4 bg-gray/10 w-full max-w-[600px] rounded-md">
            <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center gap-3 gap-y-6">
              <div className="flex items-center justify-center sm:justify-start gap-4 flex-wrap">
                <div className="size-13 bg-primary/60 border-[0.5px] border-white/30 rounded-xl flex items-center justify-center p-1">
                  <BookHeart className="size-7 text-tertiary/70" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4>Combinaciones Favoritas</h4>
                  <p className="text-sm text-gray">Tus outfits guardados</p>
                </div>
              </div>

              <div className="flex not-sm:flex-col not-lg:w-full items-center gap-4">
                <div className="hidden lg:inline-flex">
                  <Button
                    onClick={handleProbarCombinacion}
                    disabled={loadingCombinacion || !combinacionSeleccionada}
                    width="full"
                    className={`text-nowrap transition-all duration-300 ${
                      highlightButton
                        ? "animate-pulse scale-103 border border-primary/40"
                        : ""
                    }`}
                  >
                    {loadingCombinacion ? "Cargando..." : "Ver combinación"}
                  </Button>
                </div>

                <Drawer open={isDrawerOpen} onOpenChange={handleOnOpenChange}>
                  <DrawerTrigger asChild>
                    <Button
                      onClick={handleCombineInDrawer}
                      disabled={loadingCombinacion || !combinacionSeleccionada}
                      className={`lg:hidden text-nowrap transition-all duration-300 ${
                        highlightButton
                          ? "animate-pulse scale-102 border border-primary/40"
                          : ""
                      }`}
                    >
                      {loadingCombinacion ? "Cargando..." : "Ver combinación"}{" "}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="h-[90dvh] flex flex-col bg-black/95 lg:hidden">
                    <div className="flex-1 overflow-y-auto pb-2">
                      <Panel
                        loadingCombinacion={loadingCombinacion}
                        resultado={resultado}
                        errorCombinacion={errorCombinacion}
                        errorModelo3D={errorModelo3D}
                        modeloUrl={modeloUrl}
                        loadingModelo3D={loadingModelo3D}
                        onGenerarModelo3D={handleGenerarModelo3D}
                      />
                    </div>

                    <div className="p-4 border-t text-white border-gray/20 bg-background flex justify-end">
                      <DrawerClose asChild>
                        <Button onClick={() => setIsDrawerOpen(false)}>
                          Cerrar
                        </Button>
                      </DrawerClose>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray">
            * Hacé clic en el outfit para poder visualizarlo
          </p>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 modern-scrollbar">
          {combinaciones && combinaciones.length > 0 ? (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h5 className="bg-gray/5 py-0 px-2 rounded-sm font-semibold mb-4">
                  Tus Combinaciones ({combinaciones.length})
                </h5>

                <div className="grid justify-center grid-cols-[repeat(auto-fit,192px)] mx-4 my-8 gap-6 md:gap-8">
                  {combinaciones.map((combinacion, index) => (
                    <div
                      key={`combinacion-${index}`}
                      className={`rounded-md ${
                        combinacionSeleccionada?.id === combinacion.id
                          ? "ring-2 ring-transparent bg-tertiary"
                          : ""
                      }`}
                    >
                      <CombinacionCard
                        combinacion={combinacion}
                        onVerDetalle={handleVerDetalle}
                        onToggleFavorita={handleToggleFavorita}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray">
              <div className="text-lg mb-4">
                No tienes combinaciones favoritas aún
              </div>
              <p className="text-sm">
                Combina prendas en el probador y guárdalas como favoritas
              </p>
              <Link to="/home" className="inline-block mt-4">
                <Button>Ir al probador</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {combinaciones && combinaciones.length > 0 && (
        <div className="hidden flex-1 lg:flex items-center justify-center overflow-hidden">
          <Panel
            loadingCombinacion={loadingCombinacion}
            resultado={resultado}
            errorCombinacion={errorCombinacion}
            errorModelo3D={errorModelo3D}
            modeloUrl={modeloUrl}
            loadingModelo3D={loadingModelo3D}
            onGenerarModelo3D={handleGenerarModelo3D}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Eliminar favorito"
        message="Esta acción no se puede deshacer y la combinación se eliminará definitivamente de tu galería."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmarEliminacion}
        onCancel={cancelarEliminacion}
      />
    </div>
  );
}
