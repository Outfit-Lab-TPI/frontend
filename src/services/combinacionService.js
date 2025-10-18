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
  },

  getCombinacion: async (nombreCombinacion) => {
    try {
      // delay de 2000ms para simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await apiClient.get(`/fashion/combinacion/${nombreCombinacion}`);

      console.log("back getCombinacion:", response);
      return response.data;
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }
};