import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { usePerfil } from "../hooks/usePerfil.jsx";
import { useFavoritos } from "../hooks/useFavoritos.jsx";
import { useCombinacion } from "../hooks/useCombinacion.jsx";
import { useModelo3D } from "../hooks/useModelo3D.jsx";
import CombinacionCard from "../components/CombinacionCard.jsx";
import Panel from "../components/Panel.jsx";
import Button from "../components/shared/Button.jsx";
import ConfirmDialog from "../components/shared/ConfirmDialog.jsx";

function Combinaciones() {
  // Hooks
  const { combinaciones, loading, error, actualizarFavoritoLocal, eliminarCombinacionLocal, refetch } = usePerfil();
  const { toggleCombinacionFavorita } = useFavoritos();
  const { loading: loadingCombinacion, error: errorCombinacion, resultado, limpiarResultado } =
    useCombinacion();
  const { generarModelo3D, loading: loadingModelo3D, error: errorModelo3D, modeloUrl, limpiarModelo } =
    useModelo3D();

  // Estado para combinación seleccionada para probar
  const [combinacionSeleccionada, setCombinacionSeleccionada] = useState(null);

  // Estados para el dialog de confirmación
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [combinacionAEliminar, setCombinacionAEliminar] = useState(null);

  // Manejar toggle de favoritos con confirmación para eliminación
  const handleToggleFavorita = async (combinacion) => {
    const codigoCombinacion = combinacion.codigo || combinacion.id;
    const esActualmenteFavorita = combinacion.esFavorita;

    // Si está marcada como favorita y se va a desmarcar (eliminar)
    if (esActualmenteFavorita) {
      // Mostrar dialog de confirmación
      setCombinacionAEliminar(combinacion);
      setShowConfirmDialog(true);
    } else {
      // Si no está marcada como favorita, agregarla (sin confirmación)
      try {
        // Actualizar inmediatamente en el estado local para UX instantánea
        actualizarFavoritoLocal(codigoCombinacion, true);

        // Hacer la llamada al backend en segundo plano
        await toggleCombinacionFavorita(codigoCombinacion);
      } catch (error) {
        console.error('Error al marcar combinación como favorita:', error);
        // Si falla, revertir el cambio local
        actualizarFavoritoLocal(codigoCombinacion, false);
      }
    }
  };

  // Confirmar eliminación de combinación
  const confirmarEliminacion = async () => {
    if (!combinacionAEliminar) return;

    const codigoCombinacion = combinacionAEliminar.codigo || combinacionAEliminar.id;

    try {
      // Eliminar inmediatamente de la UI para UX instantánea
      eliminarCombinacionLocal(codigoCombinacion);

      // Cerrar dialog
      setShowConfirmDialog(false);
      setCombinacionAEliminar(null);

      // Hacer la llamada al backend en segundo plano
      await toggleCombinacionFavorita(codigoCombinacion);
    } catch (error) {
      console.error('Error al eliminar combinación de favoritos:', error);
      // Si falla, restaurar la combinación en la UI
      refetch(); // En este caso necesitamos refetch para restaurar
    }
  };

  // Cancelar eliminación
  const cancelarEliminacion = () => {
    setShowConfirmDialog(false);
    setCombinacionAEliminar(null);
  };

  // Ver detalle de combinación en el probador
  const handleVerDetalle = (combinacion) => {
    setCombinacionSeleccionada(combinacion);
    limpiarResultado();
    limpiarModelo();
  };

  // Probar combinación seleccionada
  const handleProbarCombinacion = async () => {
    if (combinacionSeleccionada) {
      limpiarResultado();
      limpiarModelo();

      // Simular el "probado" de la combinación usando la imagen existente
      // En una implementación real, aquí llamarías al endpoint correspondiente
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Establecer resultado directamente con la imagen de la combinación
      limpiarResultado();
      setTimeout(() => {
        // Simular resultado usando la imagen de la combinación
        const resultadoSimulado = {
          imageUrl: combinacionSeleccionada.imageUrl,
          nombre: combinacionSeleccionada.nombre
        };
        // Aquí necesitarías llamar a una función que establezca el resultado
        // Por ahora solo limpiamos
      }, 1500);
    }
  };

  // Manejar generación de modelo 3D
  const handleGenerarModelo3D = async () => {
    if (resultado) {
      await generarModelo3D(resultado);
    }
  };

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
          <div className="text-lg mb-4">Por favor intenta de nuevo más tarde.</div>
          <Button
            onClick={() => navigate('/perfil')}
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

      {/* Galería de combinaciones */}
      <div className="w-full lg:w-2/3 flex flex-col">

        {/* Header */}
        <div className="flex gap-2">
          <Link to="/perfil">
            <ChevronLeft className="h-5 w-5 m-1" color="gray" />
          </Link>
          <div className="p-2 bg-gray/10 w-full">
            <div className="flex flex-col lg:flex-row flex-wrap justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray rounded-xl flex items-center justify-center p-1">
                  <img
                    src="/isotipo.svg"
                    alt="Mis Combinaciones"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="h-14 flex flex-col justify-center">
                  <h4>Mis Combinaciones Favoritas</h4>
                  <p className="text-sm text-gray">Tus outfits guardados</p>
                </div>
              </div>

              <div className="flex not-sm:flex-col not-sm:items-start not-lg:w-full items-center gap-4">
                {combinacionSeleccionada ? (
                  <Button
                    onClick={handleProbarCombinacion}
                    disabled={loadingCombinacion}
                    width="full"
                    className="text-nowrap"
                  >
                    {loadingCombinacion ? 'Probando...' : 'Probar combinación'}
                  </Button>
                ) : (
                  <span className="text-sm text-gray whitespace-nowrap">Selecciona una combinación</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Galería */}
        <div className="flex-1 overflow-y-auto mt-4 modern-scrollbar">
          {combinaciones && combinaciones.length > 0 ? (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h5 className="bg-gray/5 py-1 px-2 rounded-sm font-semibold mb-4">
                  Tus Combinaciones ({combinaciones.length})
                </h5>
                <div className="flex flex-wrap gap-4">
                  {combinaciones.map((combinacion, index) => (
                    <div
                      key={`combinacion-${index}`}
                      className={`${
                        combinacionSeleccionada?.id === combinacion.id ? 'ring-2 ring-primary' : ''
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
              <div className="text-lg mb-4">No tienes combinaciones favoritas aún</div>
              <p className="text-sm">Combina prendas en el probador y guárdalas como favoritas</p>
              <Link to="/home" className="inline-block mt-4">
                <Button>
                  Ir al probador
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Panel del probador */}
      {combinaciones && combinaciones.length > 0 && (
        <Panel
          loadingCombinacion={loadingCombinacion}
          resultado={resultado}
          errorCombinacion={errorCombinacion}
          errorModelo3D={errorModelo3D}
          modeloUrl={modeloUrl}
          loadingModelo3D={loadingModelo3D}
          onGenerarModelo3D={handleGenerarModelo3D}
        />
      )}

      {/* Dialog de confirmación para eliminación */}
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

export default Combinaciones;