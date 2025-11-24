import { useState } from 'react';
import { favoritosService } from '../services/favoritosService.js';

export const useFavoritos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const manejarLimite = (err) => {
    if (err.upgradeRequired) {
      const detalle = err.currentUsage !== undefined && err.maxAllowed !== undefined
        ? ` (${err.currentUsage}/${err.maxAllowed})`
        : '';
      const mensaje = err.message || 'Has alcanzado el límite de tu plan';
      setError(`${mensaje}${detalle}`);
      // Notificación simple para que el usuario reciba feedback inmediato
      alert(`${mensaje}${detalle}. Actualiza tu plan para continuar.`);
      return true;
    }
    return false;
  };

  const togglePrendaFavorita = async (codigoPrenda, esFavorita, onSuccess) => {
    try {
      setLoading(true);
      setError(null);

      const resultado = await favoritosService.togglePrendaFavorita(codigoPrenda, esFavorita);

      if (onSuccess) {
        onSuccess(resultado);
      }

      return resultado;
    } catch (err) {
      if (manejarLimite(err)) throw err;
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
      // Debug: revisar qué usuario/token tenemos antes de llamar al backend
      const rawUser = localStorage.getItem('outfitlab-user');
      console.log('[Favorito][Hook] Usuario almacenado localmente:', rawUser);
      const resultado = await favoritosService.toggleCombinacionFavorita(codigoCombinacion);

      if (onSuccess) {
        onSuccess(resultado);
      }

      return resultado;
    } catch (err) {
      if (manejarLimite(err)) throw err;
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerPrendasFavoritas = async () => {
    try {
      setLoading(true);
      setError(null);

      const resultado = await favoritosService.obtenerPrendasFavoritas();
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerCombinacionesFavoritas = async () => {
    try {
      setLoading(true);
      setError(null);

      const resultado = await favoritosService.obtenerCombinacionesFavoritas();
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
    obtenerPrendasFavoritas,
    obtenerCombinacionesFavoritas,
    loading,
    error,
    limpiarError
  };
};
