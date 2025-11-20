import apiClient from '../api.js';

export async function signupService(userData) {
  const response = await apiClient.post('/users/register', {
    email: userData.email,
    name: userData.name,
    lastName: userData.lastName,
    password: userData.password,
  });

  return response.data;
}
