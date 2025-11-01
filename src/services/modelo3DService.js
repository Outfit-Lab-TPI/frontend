import apiClient from './api.js';

const getRandomModel = () => {
  const randomIndex = Math.floor(Math.random() * MODELOS_MOCK.length);
  return MODELOS_MOCK[randomIndex];
};

export const modelo3DService = {
  generarModelo: async (conjuntoUrl) => {

    try {
      const response = await apiClient.post('/generar-modelo', {
        conjuntoUrl
      });
      return response.data;
    } catch (error) {
      console.error('Error en modelo3DService.generarModelo:', error);
      throw new Error('Error de conexión al generar modelo 3D');
    }
  }
};