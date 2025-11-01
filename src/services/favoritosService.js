import apiClient from './api.js';
import { mockTogglePrendaFavorita, mockToggleCombinacionFavorita } from './mockData.js';

// Configuración para usar mock data temporalmente
const USE_MOCK_DATA = true;

export const favoritosService = {
  togglePrendaFavorita: async (codigoPrenda) => {
    try {
      if (USE_MOCK_DATA) {
        return await mockTogglePrendaFavorita(codigoPrenda);
      }

      const response = await apiClient.post(`/api/prenda/favorita/${codigoPrenda}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Error al marcar/desmarcar prenda como favorita'
      );
    }
  },

  toggleCombinacionFavorita: async (codigoCombinacion) => {
    try {
      if (USE_MOCK_DATA) {
        return await mockToggleCombinacionFavorita(codigoCombinacion);
      }

      const response = await apiClient.post(`/api/combinacion/favorita/${codigoCombinacion}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Error al marcar/desmarcar combinación como favorita'
      );
    }
  }
};