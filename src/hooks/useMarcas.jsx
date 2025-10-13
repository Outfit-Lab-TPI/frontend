import { useState, useEffect } from 'react';
import { marcaService } from '../services/marcaService.js';
import { fetchMockMarcas } from '../services/mockData.js';

// Configuración para usar mock data temporalmente
const USE_MOCK_DATA = false;

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
      if (USE_MOCK_DATA) {
        // Usar datos de mock mientras el backend no esté disponible
        response = await fetchMockMarcas();
      } else {
        // Usar servicio real
        response = await marcaService.getAllMarcas();
      }
      setMarcas(response.data);
    } catch (err) {
      if (!USE_MOCK_DATA && err.isCritical) {
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