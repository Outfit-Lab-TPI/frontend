import { useState } from 'react';
import { sugerenciasService } from '../../services/shared/sugerenciasService';

export const useSugerencias = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sugerencias, setSugerencias] = useState(null);

  const obtenerSugerencias = async (garmentCode) => {
    try {
      setLoading(true);
      setError(null);
      setSugerencias(null);

      const response = await sugerenciasService.getSugerencias(garmentCode);
      setSugerencias(response.data);

      return response.data;
    } catch (err) {
      let errorMessage = 'Error al obtener sugerencias';

      if (err.response?.status === 404) {
        errorMessage = 'No se encontraron sugerencias para esta prenda';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Error del servidor. Intenta de nuevo más tarde';
      } else if (err.message?.includes('Network Error') || err.code === 'ECONNABORTED') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      }

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const limpiarSugerencias = () => {
    setSugerencias(null);
    setError(null);
  };

  const limpiarError = () => {
    setError(null);
  };

  return {
    obtenerSugerencias,
    limpiarSugerencias,
    sugerencias,
    loading,
    error,
    limpiarError
  };
};