import { useState, useEffect } from 'react';
import { marcaService } from '../services/marcaService.js';
import { fetchMockMarcaDetail } from '../services/mockData.js';

// Configuración para usar mock data temporalmente (misma que useMarcas)
const USE_MOCK_DATA = false;

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
      let response;
      if (USE_MOCK_DATA) {
        // Usar datos de mock mientras el backend no esté disponible
        response = await fetchMockMarcaDetail(codigoMarca);
      } else {
        // Usar servicio real
        response = await marcaService.getMarcaByCode(codigoMarca);
      }
      setMarcaDetail(response.data);
    } catch (err) {
      if (!USE_MOCK_DATA && err.isCritical) {
        // Para errores críticos, los guardamos para ser lanzados en el componente
        setCriticalError(err);
      } else {
        // Para errores no críticos, los mostramos inline
        setError(err.message || 'Error al cargar los detalles de la marca');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarcaDetail();
  }, [codigoMarca]);

  return {
    marcaDetail,
    loading,
    error,
    criticalError,
    refetch: fetchMarcaDetail
  };
};