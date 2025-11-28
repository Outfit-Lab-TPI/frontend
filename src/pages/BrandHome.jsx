import { useState, useEffect } from "react";
import { useMarcaDetail } from "../hooks/marca/useMarcaDetail.jsx";
import BrandContenido from "../components/BrandContenido.jsx";
import PrendaModal from "../components/PrendaModal.jsx";
import { useAuth } from '../hooks/auth/useAuth.jsx'

export default function BrandHome() {
   const { user } = useAuth();
   const codigoMarca = user.brand.codigoMarca;

  const {
    marcaDetail,
    loading,
    error,
    criticalError,
    refetch
  } = useMarcaDetail(codigoMarca);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [prendaParaEditar, setPrendaParaEditar] = useState(null);

  const handleAgregarPrenda = () => {
    setPrendaParaEditar(null);
    setModalAbierto(true);
  };

  const handleEditarPrenda = (prenda) => {
    setPrendaParaEditar(prenda);
    setModalAbierto(true);
  };

  const handleEliminarPrenda = async (prenda) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${prenda.nombre}"?`)) {
      try {
        await refetch(); 
        // await eliminarPrenda(prenda.garmentCode || prenda.codigo);
      } catch (error) {
        console.error("Error al eliminar prenda:", error);
      }
    }
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setPrendaParaEditar(null);
  };

  const handleGuardarPrenda = async () => {
    // El modal se encargará de la lógica de guardado
    handleCerrarModal();
    await refetch(); 
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
          Cargando prendas de la marca...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white py-10 px-5">
        <div className="text-center py-10">
          <div className="text-lg text-error mb-4">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!marcaDetail) {
    return (
      <div className="text-white py-10 px-5">
        <div className="text-center py-10">
          <div className="text-lg text-gray mb-4">Marca no encontrada</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col py-2 px-4 sm:px-6"
      style={{ height: "calc(100vh - 70px)" }}
    >
      <BrandContenido
        marcaDetail={marcaDetail}
        onAgregarPrenda={handleAgregarPrenda}
        onEditarPrenda={handleEditarPrenda}
      />

      <PrendaModal
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        onGuardar={handleGuardarPrenda}
        onEliminar={handleEliminarPrenda}
        prendaParaEditar={prendaParaEditar}
        marcaDetail={marcaDetail}
      />
    </div>
  );
}
