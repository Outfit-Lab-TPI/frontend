import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/tripo';

const tripoClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 segundos
});

// API de Tripo3D (a través de nuestro backend)
export const tripoAPI = {
  // Crear tarea de multiview-to-model (múltiples imágenes)
  createMultiviewToModel: async (imageUrls, options = {}) => {
    try {
      const response = await tripoClient.post('/multiview-to-model', {
        imageUrls: imageUrls,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('Error creating multiview-to-model task:', error);
      throw error;
    }
  },

  // Consultar estado de tarea
  getTaskStatus: async (taskId) => {
    try {
      const response = await tripoClient.get(`/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting task status:', error);
      throw error;
    }
  },

  // Función helper para esperar a que se complete una tarea
  waitForTaskCompletion: async (taskId, maxAttempts = 60, interval = 3000) => {
    for (let i = 0; i < maxAttempts; i++) {
      const result = await tripoAPI.getTaskStatus(taskId);
      const status = result.data?.status;

      console.log(`⏳ Intento ${i + 1}/${maxAttempts} - Estado: ${status}`);

      if (status === 'success') {
        console.log('✅ ¡Modelo generado exitosamente!');
        return result.data;
      } else if (status === 'failed') {
        console.error('❌ La tarea falló');
        throw new Error('Task failed');
      }

      // Esperar 3 segundos antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    console.error('⏱️ Timeout: La tarea tomó demasiado tiempo');
    throw new Error('Task timeout - max attempts reached');
  },

  // Subir imágenes al backend
  uploadImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post('http://localhost:8080/api/garments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Generar modelo directamente desde archivos
  generateFromFiles: async (filesWithPositions) => {
    try {
      const formData = new FormData();

      // Si recibimos un objeto con posiciones, las enviamos identificadas
      if (typeof filesWithPositions === 'object' && !Array.isArray(filesWithPositions)) {
        Object.entries(filesWithPositions).forEach(([position, file]) => {
          formData.append(position, file);
        });
      } else {
        // Compatibilidad con el formato anterior (array)
        filesWithPositions.forEach((file) => {
          formData.append('files', file);
        });
      }

      const response = await axios.post('http://localhost:8080/api/garments/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error generating model:', error);
      throw error;
    }
  },
  downloadModel: async (modelUrl) => {
    try {
      const response = await axios.get(modelUrl, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading model:', error);
      throw error;
    }
  }
};

export default tripoAPI;