import apiClient from '../api.js';

export async function loginService(email, password) {
  /*const response = await apiClient.post('/users/login', {
    email,
    password
  })

  // El backend debe devolver algo como { nombre, role }
  return response.data*/

  try {
    const response = await apiClient.post('/users/login', {
      email,
      password
    })
    return response.data
  } catch (error) {
    throw error//error.response?.data || { message: "Error desconocido" }
  }
}
