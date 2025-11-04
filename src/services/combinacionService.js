import apiClient from './api.js';

export const combinacionService = {
  combinarPrendas: async (top, bottom, isMan, avatarType) => {
    try {
      const response = await apiClient.post('/fashion/combinar-prendas', {
        top,
        bottom,
        isMan,
        avatarType
      });

      const data = response.data;

      if (data.status === 'OK') {
        return data.imageUrl;
      } else {
        // Handle error status responses
        throw new Error(data.errorMessage || 'Error combinando prendas');
      }
    } catch (error) {
      console.error("Error combinando prendas:", error);

      // If it's a response error, check for error structure
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.status && errorData.errorMessage) {
          throw new Error(errorData.errorMessage);
        }
      }

      throw error;
    }
  }
};