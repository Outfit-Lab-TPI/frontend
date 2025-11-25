import axios from "axios";
import { refreshToken } from "./auth/refreshTokenService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 500000,
});

let isRefreshingToken = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const getAccessToken = () => sessionStorage.getItem("access_token");
const getRefreshToken = () => sessionStorage.getItem("refresh_token");

// Helper para debugging - eliminar en producción
window.debugTokens = () => {
  const access = sessionStorage.getItem("access_token");
  const refresh = sessionStorage.getItem("refresh_token");
  const user = sessionStorage.getItem("outfitlab-user");

  return { access, refresh, user: user ? JSON.parse(user) : null };
};

apiClient.interceptors.request.use(
  config => {
    const access_token = getAccessToken();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor - Maneja errores y refresh automático
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
      return Promise.reject(error);
    }

    if (error.request && !error.response) {
      console.error("Network error: No response received");
      return Promise.reject(error);
    }

    // Manejo de error 401 (token expirado/inválido)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // No intentar refresh para rutas de autenticación (login, signup, etc.)
      const isAuthEndpoint = originalRequest.url?.includes('/login') ||
                             originalRequest.url?.includes('/signup') ||
                             originalRequest.url?.includes('/register');

      if (isAuthEndpoint) {
        // Para endpoints de autenticación, solo rechazar el error sin hacer logout
        return Promise.reject(error);
      }

      if (isRefreshingToken) {
        // Si ya se está refrescando, agregar a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            console.log("Request de la cola falló:", err);
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshingToken = true;

      const refresh_token = getRefreshToken();

      if (!refresh_token) {
        processQueue(error, null);
        isRefreshingToken = false;
        handleLogout();
        return Promise.reject(error);
      }

      try {
        const response = await refreshToken(refresh_token);

        const {
          access_token,
          refresh_token: new_refresh_token,
          user,
        } = response;

        sessionStorage.setItem("access_token", access_token);
        sessionStorage.setItem("refresh_token", new_refresh_token);
        sessionStorage.setItem("outfitlab-user", JSON.stringify(user));

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);

        // Disparar evento personalizado para actualizar AuthContext
        window.dispatchEvent(
          new CustomEvent("tokenRefreshed", {
            detail: {
              access_token,
              refresh_token: new_refresh_token,
              user,
            },
          })
        );

        isRefreshingToken = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshingToken = false;
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    // Manejo de error 500 relacionado con JWT
    if (error.response?.status === 500) {
      const errorMessage = error.response?.data?.message || error.message || "";
      if (
        errorMessage.toLowerCase().includes("jwt") ||
        errorMessage.toLowerCase().includes("token")
      ) {
        handleLogout();
      } else {
        console.error("Server error:", error.response.status);
      }
    }

    return Promise.reject(error);
  }
);

const handleLogout = () => {
  // Disparar evento personalizado para que AuthContext maneje el logout completo
  window.dispatchEvent(new CustomEvent("authLogout"));
};

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

