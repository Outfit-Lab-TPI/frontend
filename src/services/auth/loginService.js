import apiClient from '../api.js';

export async function loginService(email, password) {
  const response = await apiClient.post('/login', {
    email,
    password
  })

  // El backend debe devolver algo como { nombre, role }
  return response.data
}
