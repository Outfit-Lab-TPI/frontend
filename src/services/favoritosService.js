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
  agregarCombinacionFavorita: async (combinationUrl) => {
    try {
      // Encode the URL to handle special characters like dots, slashes, etc.
      const encodedUrl = encodeURIComponent(combinationUrl);
      const response = await apiClient.get(`/combinations/favorite/add?combinationUrl=${encodedUrl}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Error al agregar combinación a favoritos'
      );
    }
  },

  quitarCombinacionFavorita: async (combinationUrl) => {
    try {
      // Encode the URL to handle special characters like dots, slashes, etc.
      const encodedUrl = encodeURIComponent(combinationUrl);
      const response = await apiClient.get(`/combinations/favorite/delete?combinationUrl=${encodedUrl}`);
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

  toggleCombinacionFavorita: async (combinationUrl) => {
      try {
        const { content = [] } = await favoritosService.obtenerCombinacionesFavoritas();
        const esFavorita = content.some(c => c.combinationUrl === combinationUrl);
        console.log('ESTADO DE FAVORITA: ----- ', esFavorita);
        
        return esFavorita? await favoritosService.quitarCombinacionFavorita(combinationUrl) : await favoritosService.agregarCombinacionFavorita(combinationUrl);
      } catch (error) {
        throw new Error('Error al alternar favorito: ' + (error.message || error));
      }
  }
};