import apiClient from './api.js';

export const combinacionService = {
  combinarPrendas: async (esHombre, superior, inferior) => {
    try {
      const response = await apiClient.post('/fashion/combinar-prendas', {
        esHombre,
        superior,
        inferior
      },
      {
        timeout: 60000
      });
      console.log("back:", response);
      return response.data;
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }
};