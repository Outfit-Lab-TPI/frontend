import apiClient from './api.js';

const isCriticalError = (error) => {
  // Errores críticos que deben disparar ErrorBoundary
  if (error.code === 'ECONNABORTED') return true; // Timeout
  if (error.code === 'ECONNREFUSED') return true; // Conexión rechazada
  if (error.code === 'ENETUNREACH') return true; // Red no alcanzable
  if (error.code === 'ENOTFOUND') return true; // DNS no encontrado

  // Errores de servidor 5xx
  if (error.response && error.response.status >= 500) return true;

  // Sin respuesta del servidor
  if (error.request && !error.response) return true;

  return false;
};

export const marcaService = {
  getAllMarcas: async () => {
    try {
      return await apiClient.get('/marcas');
    } catch (error) {
      // Agregar información sobre si es un error crítico
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },

  getMarcaByCode: async (codigoMarca) => {
    try {
      return await apiClient.get(`/marcas/${codigoMarca}`);
    } catch (error) {
      // Agregar información sobre si es un error crítico
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },
};