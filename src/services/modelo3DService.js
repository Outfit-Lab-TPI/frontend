import apiClient from './api.js';

const USE_MOCK_DATA = true;

// URLs mockeadas para modelos 3D - usando archivos existentes del proyecto
const MODELOS_MOCK = [
  '/avatars/avatar-masculino-1.glb',
  '/avatars/blue+shirted+person+3d+model.glb'
];

const getRandomModel = () => {
  const randomIndex = Math.floor(Math.random() * MODELOS_MOCK.length);
  return MODELOS_MOCK[randomIndex];
};

export const modelo3DService = {
  generarModelo: async (conjuntoUrl) => {
    if (USE_MOCK_DATA) {
      // MOCK: Simular delay del servidor y respuesta
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos de delay

      // Simular posible error (10% de probabilidad)
      if (Math.random() < 0.1) {
        throw new Error('Error simulado del servidor al generar modelo 3D');
      }

      // Respuesta mockeada exitosa
      return {
        modeloUrl: getRandomModel(),
        status: 'success',
        message: 'Modelo 3D generado exitosamente'
      };
    }

    try {
      // Llamada real al endpoint cuando esté listo
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