import apiClient from './api.js';

export const favoritosService = {
  togglePrendaFavorita: async (codigoPrenda) => {
    try {
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