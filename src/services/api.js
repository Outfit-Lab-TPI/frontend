import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 500000,
});

// Request interceptor for adding auth token   ----- dejo este de cami por las dudas
/*apiClient.interceptors.request.use(
  (config) => {
    // Agregar token de autorización si existe en sessionStorage
    const accessToken = sessionStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;    
  },
  (error) => {
    return Promise.reject(error);
  }
);*/
apiClient.interceptors.request.use(
  (config) => {
    const outfitlab_user_str = localStorage.getItem('outfitlab-user');
    if (outfitlab_user_str) {
      try {
        const outfitlab_user = JSON.parse(outfitlab_user_str); // lo parseo pq en el local hay un string
        const access_token = outfitlab_user.access_token; // desp si que accedo al token para mandarlo
        if (access_token) {
          console.log('Token encontrado:', access_token);
          config.headers.Authorization = `Bearer ${access_token}`;
        }
      } catch (err) {
        console.error('Error parseando outfitlab-user', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

// Funciones de utilidad para manejo de tokens
export const authUtils = {
  /**
   * Almacena los tokens de autenticación en sessionStorage
   * @param {Object} authResponse - Objeto con access_token y refresh_token
   */
  setTokens: (authResponse) => {
    if (authResponse.access_token) {
      sessionStorage.setItem('access_token', authResponse.access_token);
    }
    if (authResponse.refresh_token) {
      sessionStorage.setItem('refresh_token', authResponse.refresh_token);
    }
  },

  /**
   * Obtiene el access token del sessionStorage
   * @returns {string|null} El access token o null si no existe
   */
  getAccessToken: () => {
    return sessionStorage.getItem('access_token');
  },

  /**
   * Obtiene el refresh token del sessionStorage
   * @returns {string|null} El refresh token o null si no existe
   */
  getRefreshToken: () => {
    return sessionStorage.getItem('refresh_token');
  },

  /**
   * Limpia todos los tokens del sessionStorage
   */
  clearTokens: () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  },

  /**
   * Verifica si hay un token válido
   * @returns {boolean} True si existe un access token
   */
  isAuthenticated: () => {
    return !!sessionStorage.getItem('access_token');
  }
};


export default apiClient;

