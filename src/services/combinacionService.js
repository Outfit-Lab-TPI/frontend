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
      console.log("Fetching combination:", nombreCombinacion);
      const response = await apiClient.get(`/fashion/combinacion/vulk-h-s1-i1`);
      // const response = await apiClient.get(`/fashion/combinacion/${nombreCombinacion}`);
      console.log("Response:", response);
      return response.data;
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }
};