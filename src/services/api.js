import axios from 'axios';

// En producción usa /api (nginx hace proxy al backend)
// En desarrollo usa localhost:8080
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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


export default apiClient;
