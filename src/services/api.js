import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.response) {
      console.error('Server error:', error.response.status);
    } else if (error.request) {
      console.error('Network error: No response received');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const userAPI = {
  getUserById: (id) => apiClient.get(`/users/${id}`),
};

export const prendaAPI = {
  crearNuevaPrenda: (formData) => {
    console.log('Enviando FormData:', formData);
    // Validar que FormData tenga los campos requeridos
    if (!formData.has('nombre') || !formData.has('tipo')) {
      return Promise.reject(new Error('FormData debe contener nombre y tipo'));
    }

    // Para FormData, necesitamos configurar headers específicos
    return apiClient.post('/nueva-prenda', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default apiClient;
