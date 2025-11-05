import { useState, useEffect } from 'react';
import { marcaService } from '../services/marcaService.js';
import { favoritosService } from '../services/favoritosService.js';

export const useMarcaDetail = (codigoMarca) => {
  const [marcaDetail, setMarcaDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [criticalError, setCriticalError] = useState(null);

  const fetchMarcaDetail = async () => {
    if (!codigoMarca) return;

    setLoading(true);
    setError(null);
    setCriticalError(null);
    try {
      // Cargar marca y favoritas en paralelo
      const [responseMarca, responseFavoritas] = await Promise.all([
        marcaService.getMarcaByCode(codigoMarca),
        favoritosService.obtenerPrendasFavoritas().catch(() => ({ data: { content: [] } })) // Si falla, continuar sin favoritas
      ]);

      const marcaData = responseMarca.data;
      const prendasFavoritas = responseFavoritas.data?.content || responseFavoritas.data || [];
      const codigosFavoritas = new Set(prendasFavoritas.map(prenda => prenda.garmentCode));

      // Función helper para marcar prendas como favoritas
      const marcarPrendasComoFavoritas = (prendas) => {
        if (!prendas || !Array.isArray(prendas)) return prendas;
        return prendas.map(prenda => ({
          ...prenda,
          esFavorita: codigosFavoritas.has(prenda.garmentCode)
        }));
      };

      // Marcar prendas como favoritas en todas las categorías
      const marcaConFavoritas = {
        ...marcaData,
        garmentTop: {
          ...marcaData.garmentTop,
          content: marcarPrendasComoFavoritas(marcaData.garmentTop?.content)
        },
        garmentBottom: {
          ...marcaData.garmentBottom,
          content: marcarPrendasComoFavoritas(marcaData.garmentBottom?.content)
        }
      };

      setMarcaDetail(marcaConFavoritas);
    } catch (err) {
      if (err.isCritical) {
        setCriticalError(err);
      } else {
        setError(err.message || 'Error al cargar los detalles de la marca');
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar favorito localmente
  const actualizarFavoritoLocal = (codigoPrenda, esFavorita) => {
    setMarcaDetail(prev => {
      if (!prev) return prev;

      const actualizarPrendas = (prendas) => {
        if (!prendas || !Array.isArray(prendas)) return prendas;
        return prendas.map(prenda =>
          prenda.garmentCode === codigoPrenda
            ? { ...prenda, esFavorita }
            : prenda
        );
      };

      return {
        ...prev,
        garmentTop: {
          ...prev.garmentTop,
          content: actualizarPrendas(prev.garmentTop?.content)
        },
        garmentBottom: {
          ...prev.garmentBottom,
          content: actualizarPrendas(prev.garmentBottom?.content)
        }
      };
    });
  };

  useEffect(() => {
    fetchMarcaDetail();
  }, [codigoMarca]);

  return {
    marcaDetail,
    loading,
    error,
    criticalError,
    refetch: fetchMarcaDetail,
    actualizarFavoritoLocal
  };
};