import apiClient from './api.js';

export const combinacionService = {
  combinarPrendas: async (esHombre, superior, inferior) => {
    try {
      const response = await apiClient.post('/combinar-prendas', {
        esHombre,
        superior,
        inferior
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};