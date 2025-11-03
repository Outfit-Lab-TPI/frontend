import apiClient from './api.js';
import { fetchMockProbadorPrendas } from '../utils/mockData.js';

// Configuración para usar mock data temporalmente
const USE_MOCK_DATA = true;

export const probadorService = {
  obtenerPrendas: async () => {
    try {
      if (USE_MOCK_DATA) {
        return await fetchMockProbadorPrendas();
      }

      const response = await apiClient.get('/prendas');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Error al obtener las prendas del probador'
      );
    }
  }
};