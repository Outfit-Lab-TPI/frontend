import apiClient from './api.js';
import { fetchMockCombinacionesFavoritas } from '../utils/mockData.js';

// Configuración para usar mock data temporalmente
const USE_MOCK_DATA = false;

export const perfilService = {
  obtenerCombinacionesFavoritas: async () => {
    try {
      if (USE_MOCK_DATA) {
        return await fetchMockCombinacionesFavoritas();
      }

      const response = await apiClient.get('/api/perfil/combinaciones');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Error al obtener las combinaciones favoritas'
      );
    }
  }
};