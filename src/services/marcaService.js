import apiClient from './api.js';
import {fetchMockMarcas, fetchMockMarcaDetail} from "../utils/mockData.js"

const isCriticalError = (error) => {
  // Errores de servidor 5xx
  if (error.response && error.response.status >= 500) return true;

  // Sin respuesta del servidor
  if (error.request && !error.response) return true;

  return false;
};

export const marcaService = {
  getAllMarcas: async () => {
    try {
      //return await apiClient.get('/marcas');
       return fetchMockMarcas();
    } catch (error) {
      // Agregar información sobre si es un error crítico
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },

  getMarcaByCode: async (codigoMarca) => {
    try {
      //return await apiClient.get(`/marcas/${codigoMarca}`);
      return fetchMockMarcaDetail(codigoMarca);
    } catch (error) {
      // Agregar información sobre si es un error crítico
      error.isCritical = isCriticalError(error);
      throw error;
    }
  },
};