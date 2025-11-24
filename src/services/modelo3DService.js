import apiClient from './api.js';

const buildUpgradeError = (error) => {
  const data = error.response?.data || {};
  if (error.response?.status === 403 && data.upgradeRequired) {
    const err = new Error(data.error || 'Has alcanzado el límite de modelos 3D de tu plan');
    err.upgradeRequired = true;
    err.limitType = data.limitType;
    err.currentUsage = data.currentUsage;
    err.maxAllowed = data.maxAllowed;
    return err;
  }
  return null;
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
      const response = await apiClient.get(
        `/tripo/models/download?url=${encodeURIComponent(modelUrl)}`,
        { responseType: 'blob' }
      );
      return response.data;
    }catch (error) {
      const upgradeError = buildUpgradeError(error);
      if (upgradeError) throw upgradeError;
      console.error('Error en modelo3DService.downloadModel:', error);
      throw new Error(error.response?.data?.message || 'Error de conexión al descargar modelo 3D');
    }
  }
};
