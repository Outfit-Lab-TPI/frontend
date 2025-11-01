import { useState, useEffect } from 'react';
import { marcaService } from '../services/marcaService.js';

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
      response = await marcaService.getMarcaByCode(codigoMarca);
      setMarcaDetail(response.data);
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