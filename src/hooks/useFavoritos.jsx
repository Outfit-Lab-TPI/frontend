import { useState } from 'react';
import { favoritosService } from '../services/favoritosService.js';

export const useFavoritos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const togglePrendaFavorita = async (codigoPrenda, onSuccess) => {
    try {
      setLoading(true);
      setError(null);

      const resultado = await favoritosService.togglePrendaFavorita(codigoPrenda);

      if (onSuccess) {
        onSuccess(resultado);
      }

      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleCombinacionFavorita = async (codigoCombinacion, onSuccess) => {
    try {
      setLoading(true);
      setError(null);

      const resultado = await favoritosService.toggleCombinacionFavorita(codigoCombinacion);

      if (onSuccess) {
        onSuccess(resultado);
      }

      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const limpiarError = () => {
    setError(null);
  };

  return {
    togglePrendaFavorita,
    toggleCombinacionFavorita,
    loading,
    error,
    limpiarError
  };
};