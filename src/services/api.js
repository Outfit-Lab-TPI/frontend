import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
/*
export const userAPI = {
  getUserById: (id) => apiClient.get(`/users/${id}`),
};
*/

//Endpoints para mercado pago
export const subscriptionAPI = {
  /**
   * Solicita al backend de Java que cree una Preferencia de Pago Único.
   * @param {string} planId - El ID interno de tu plan
   * @param {string} userEmail - Email del pagador
   * @param {number} price - El precio del item
   * @param {string} currency - La moneda (ej. "USD" o "ARS")
   * @returns {Promise<string>} Retorna la URL de redirección (initPoint) de Mercado Pago.
   */
  createPreference: (planId, userEmail, price, currency) => {
    const payload = {
      planId,
      userEmail,
      price,
      currency
    };

    console.log("Enviando payload a Java:", payload);

    return apiClient.post(
      '/mp/crear-suscripcion',
      payload
    )
    .then(response => {
        return response.data.initPoint; 
    });
  }
};


export default apiClient;
