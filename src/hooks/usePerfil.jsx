import { useState, useEffect } from 'react';
import { favoritosService } from '@/services/favoritosService.js';

export const usePerfil = () => {
  const [combinaciones, setCombinaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCombinaciones = async () => {
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
  };

  useEffect(() => {
    fetchCombinaciones();
  }, []);

  // Función para actualizar favorito localmente sin refetch
  const actualizarFavoritoLocal = (codigoCombinacion, esFavorita) => {
    setCombinaciones(prevCombinaciones =>
      prevCombinaciones.map(combinacion =>
        combinacion.combinationUrl === codigoCombinacion
          ? { ...combinacion, esFavorita }
          : combinacion
      )
    );
  };

  // Función para eliminar combinación localmente (cuando se desmarca definitivamente)
  const eliminarCombinacionLocal = (codigoCombinacion) => {
    setCombinaciones(prevCombinaciones =>
      prevCombinaciones.filter(combinacion => combinacion.combinationUrl !== codigoCombinacion)
    );
  };

  return {
    combinaciones,
    loading,
    error,
    actualizarFavoritoLocal,
    eliminarCombinacionLocal,
    refetch: fetchCombinaciones
  };
};