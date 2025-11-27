import apiClient from '../api.js';

const isCriticalError = (error) => {
  // Errores de servidor 5xx
  if (error.response && error.response.status >= 500) return true;

  // Sin respuesta del servidor
  if (error.request && !error.response) return true;

  return false;
};

export const probadorService = {
  obtenerPrendasSuperiores: async (filtros = {}, page = 0, size = 10) => {
    try {
      const params = new URLSearchParams({
        ...filtros,
        page,
        size
      });
      const url = `/garments/superior?${params}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },

  obtenerPrendasInferiores: async (filtros = {}, page = 0, size = 10) => {
    try {
      const params = new URLSearchParams({
        ...filtros,
        page,
        size
      });
      const url = `/garments/inferior?${params}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  }
};