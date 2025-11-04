import apiClient from './api.js';

export const favoritosService = {
  // Prendas favoritas
  agregarPrendaFavorita: async (garmentCode) => {
    try {
      const response = await apiClient.get(`/garments/favorite/add/${garmentCode}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Error al agregar prenda a favoritos'
      );
    }
  },

  quitarPrendaFavorita: async (garmentCode) => {
    try {
      const response = await apiClient.get(`/garments/favorite/delete/${garmentCode}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Error al quitar prenda de favoritos'
      );
    }
  },

  obtenerPrendasFavoritas: async () => {
    try {
      const response = await apiClient.get('/garments/favorite');
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Error al obtener prendas favoritas'
      );
    }
  },

  togglePrendaFavorita: async (garmentCode, esFavorita) => {
    try {
      if (esFavorita) {
        return await favoritosService.quitarPrendaFavorita(garmentCode);
      } else {
        return await favoritosService.agregarPrendaFavorita(garmentCode);
      }
    } catch (error) {
      throw error;
    }
  },

  // Combinaciones favoritas
  agregarCombinacionFavorita: async (combinationCode) => {
    try {
      const response = await apiClient.get(`/combinations/favorite/add/${combinationCode}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Error al agregar combinación a favoritos'
      );
    }
  },

  quitarCombinacionFavorita: async (combinationCode) => {
    try {
      const response = await apiClient.get(`/combinations/favorite/delete/${combinationCode}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Error al quitar combinación de favoritos'
      );
    }
  },

  obtenerCombinacionesFavoritas: async () => {
    try {
      const response = await apiClient.get('/combinations/favorite');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Error al obtener combinaciones favoritas'
      );
    }
  },

  toggleCombinacionFavorita: async (combinationCode, esFavorita) => {
    try {
      if (esFavorita) {
        return await favoritosService.quitarCombinacionFavorita(combinationCode);
      } else {
        return await favoritosService.agregarCombinacionFavorita(combinationCode);
      }
    } catch (error) {
      throw error;
    }
  }
};