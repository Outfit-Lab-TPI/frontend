import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Servicio para refrescar el access token usando el refresh token
 * @param {string} refreshToken - El refresh token actual
 * @returns {Promise<Object>} - Objeto con access_token, refresh_token y user
 */
export const refreshToken = async (refreshToken) => {
  try {
    const url = `${API_BASE_URL}/users/refresh-token`;

    const response = await axios.post(
      url,
      { refresh_token: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 segundos de timeout
      }
    );

    return response.data;
  } catch (error) {
      throw error;
  }
};
