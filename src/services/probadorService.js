import apiClient from './api.js';

const isCriticalError = (error) => {
  // Errores de servidor 5xx
  if (error.response && error.response.status >= 500) return true;

  // Sin respuesta del servidor
  if (error.request && !error.response) return true;

  return false;
};

export const probadorService = {
  obtenerPrendasSuperiores: async (filtros = {}) => {
    try {
      const params = new URLSearchParams(filtros);
      const url = `/garments/superior${Object.keys(filtros).length ? `?${params}` : ''}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },

  obtenerPrendasInferiores: async (filtros = {}) => {
    try {
      const params = new URLSearchParams(filtros);
      const url = `/garments/inferior${Object.keys(filtros).length ? `?${params}` : ''}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      error.isCritical = isCriticalError(error);
      throw error;
    }
  }
};