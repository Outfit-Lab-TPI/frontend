import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useMarcaDetail } from "../hooks/useMarcaDetail.jsx";
import { useCombinacion } from "../hooks/useCombinacion.jsx";
import { useModelo3D } from "../hooks/useModelo3D.jsx";
import MarcaContenido from "../components/MarcaContenido.jsx";
import Panel from "../components/Panel.jsx";

function MarcaDetalle() {
  const { codigoMarca } = useParams();
  const { marcaDetail, loading, error, criticalError } =
    useMarcaDetail(codigoMarca);
  const { combinarPrendas, getCombinacion, loading: loadingCombinacion, error: errorCombinacion, resultado, limpiarResultado } =
    useCombinacion();
  const { generarModelo3D, loading: loadingModelo3D, error: errorModelo3D, modeloUrl, limpiarModelo } =
    useModelo3D();

  // Estados para selección de prendas
  const [selectedSuperior, setSelectedSuperior] = useState(null);
  const [selectedInferior, setSelectedInferior] = useState(null);
  const [esHombre, setEsHombre] = useState(true);
  const [lastCombination, setLastCombination] = useState(null);


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
    // Debe haber prendas seleccionadas
    if (!selectedSuperior || !selectedInferior) return false;

    // Si no hay combinación previa, permitir combinar
    if (!lastCombination) return true;

    // Si las prendas actuales son diferentes a la última combinación, permitir combinar
    return !(selectedSuperior.nombre === lastCombination.superior &&
             selectedInferior.nombre === lastCombination.inferior);
  }, [selectedSuperior, selectedInferior, lastCombination]);

  // Limpiar resultado solo al iniciar una nueva combinación
  const handleCombinarPrendas = async () => {
    if (canCombine) {
      // Limpiar resultado anterior antes de generar uno nuevo
      limpiarResultado();
      limpiarModelo(); // También limpiar modelo 3D anterior

      // Guardar la combinación actual antes de enviarla
      setLastCombination({
        superior: selectedSuperior.nombre,
        inferior: selectedInferior.nombre
      });

      console.log('marca detail:' , marcaDetail);

      const sexoAvatar = esHombre ? 'h' : 'm';
      const nombreCombinacion = `${codigoMarca}-${sexoAvatar}-${selectedSuperior.nombre}-${selectedInferior.nombre}`;

      // await combinarPrendas(esHombre, selectedSuperior, selectedInferior);
      await getCombinacion(nombreCombinacion)
      console.log('resultado after getCombinacion:', resultado);
    }
  };

  // Manejar generación de modelo 3D
  const handleGenerarModelo3D = async () => {
    if (resultado) {
      await generarModelo3D(resultado);
    }
  };

  const getButtonText = () => {
    if (loadingCombinacion) return 'Combinando...';
    if (!canCombine) return 'Elige prendas para combinar';
    return 'Combinar prendas';
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
    <div className="flex-1 flex px-24 gap-8" style={{height: 'calc(100vh - 70px)'}}>
      <MarcaContenido
        marcaDetail={marcaDetail}
        selectedSuperior={selectedSuperior}
        selectedInferior={selectedInferior}
        onSelectPrenda={handleSelectPrenda}
      />

      <Panel
        loadingCombinacion={loadingCombinacion}
        resultado={resultado}
        errorCombinacion={errorCombinacion}
        errorModelo3D={errorModelo3D}
        modeloUrl={modeloUrl}
        loadingModelo3D={loadingModelo3D}
        canCombine={canCombine}
        esHombre={esHombre}
        setEsHombre={setEsHombre}
        onCombinarPrendas={handleCombinarPrendas}
        onGenerarModelo3D={handleGenerarModelo3D}
        getButtonText={getButtonText}
      />
    </div>
  );
}

export default MarcaDetalle;
