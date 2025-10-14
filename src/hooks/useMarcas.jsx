import { useState, useEffect } from 'react';
import { marcaService } from '../services/marcaService.js';

export const useMarcas = () => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [criticalError, setCriticalError] = useState(null);

  const fetchMarcas = async () => {
    setLoading(true);
    setError(null);
    setCriticalError(null);
    try {
      let response;
      response = await marcaService.getAllMarcas();
      setMarcas(response.data);
    } catch (err) {
      if (err.isCritical) {
        // Para errores críticos, los guardamos para ser lanzados en el componente
        setCriticalError(err);
      } else {
        // Para errores no críticos, los mostramos inline
        setError(err.message || 'Error al cargar las marcas');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  return {
    marcas,
    loading,
    error,
    criticalError,
    refetch: fetchMarcas
  };
};