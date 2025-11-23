import apiClient from '../api.js';

export async function loginService(email, password) {
  try {
    const response = await apiClient.post('/users/login', {
      email,
      password
    })
    return response.data
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error
  }
}
