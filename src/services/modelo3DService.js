import apiClient from './api.js';

const getRandomModel = () => {
  const randomIndex = Math.floor(Math.random() * MODELOS_MOCK.length);
  return MODELOS_MOCK[randomIndex];
};

export const modelo3DService = {
  generarModelo: async (imageUrl) => {

    try {
      const response = await apiClient.post('/tripo/upload/image', {
        imageUrl
      });
      //return response.data;
      return {
        modeloUrl: response.data.tripoModelUrl
      };
    } catch (error) {
      console.error('Error en modelo3DService.generarModelo:', error);
      throw new Error('Error de conexión al generar modelo 3D');
    }
  },

  downloadModel: async (modelUrl) => {
    try {
      return await fetch(
        `http://localhost:8080/api/tripo/models/download?url=${encodeURIComponent(modelUrl)}`
      );
    }catch (error) {
      console.error('Error en modelo3DService.generarModelo:', error);
      throw new Error('Error de conexión al generar modelo 3D');
    }
  }
};