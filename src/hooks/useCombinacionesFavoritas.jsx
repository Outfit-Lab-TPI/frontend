import { useState, useEffect, useCallback } from 'react';
import { favoritosService } from '@/services/favoritosService.js';

export const useCombinacionesFavoritas = (autoLoad = false) => {
  // Estados para combinaciones favoritas
  const [combinaciones, setCombinaciones] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState(null);

  // Cargar combinaciones favoritas
  const fetchCombinaciones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await favoritosService.obtenerCombinacionesFavoritas();
      setCombinaciones(response.content || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      fetchCombinaciones();
    }
  }, [autoLoad, fetchCombinaciones]);

  // Función para actualizar favorito localmente sin refetch
  const actualizarFavoritoLocal = useCallback((codigoCombinacion, esFavorita) => {
    setCombinaciones(prevCombinaciones =>
      prevCombinaciones.map(combinacion =>
        combinacion.combinationUrl === codigoCombinacion
          ? { ...combinacion, esFavorita }
          : combinacion
      )
    );
  }, []);

  // Función para eliminar combinación localmente (cuando se desmarca definitivamente)
  const eliminarCombinacionLocal = useCallback((codigoCombinacion) => {
    setCombinaciones(prevCombinaciones =>
      prevCombinaciones.filter(combinacion => combinacion.combinationUrl !== codigoCombinacion)
    );
  }, []);

  return {
    combinaciones,
    loading,
    error,
    actualizarFavoritoLocal,
    eliminarCombinacionLocal,
    refetch: fetchCombinaciones
  };
};
