import { useState, useEffect } from 'react';
import { perfilService } from '../services/perfilService.js';

export const usePerfil = () => {
  const [combinaciones, setCombinaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCombinaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await perfilService.obtenerCombinacionesFavoritas();
      setCombinaciones(response.data || []);
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
        combinacion.codigo === codigoCombinacion
          ? { ...combinacion, esFavorita }
          : combinacion
      )
    );
  };

  // Función para eliminar combinación localmente (cuando se desmarca definitivamente)
  const eliminarCombinacionLocal = (codigoCombinacion) => {
    setCombinaciones(prevCombinaciones =>
      prevCombinaciones.filter(combinacion => combinacion.codigo !== codigoCombinacion)
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