import apiClient from './api.js';

export const combinacionService = {
  combinarPrendas: async (esHombre, top, bottom) => {
    let avatarType = esHombre ? 'man' : 'woman';

    try {
      const response = await apiClient.post('/fashion/combinar-prendas', {
        avatarType,
        top,
        bottom
      },
      {
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }
};