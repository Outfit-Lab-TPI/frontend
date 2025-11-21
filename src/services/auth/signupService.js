import apiClient from '../api.js';

export async function signupService(userData, isBrand) {


   if (isBrand) {
    // REGISTRO DE MARCA (FormData)
    const response = await apiClient.post("/users/register-brand", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  // REGISTRO NORMAL
  const response = await apiClient.post("/users/register", userData);
  return response.data;


  /*
  const response = await apiClient.post('/users/register', {
    email: userData.email,
    name: userData.name,
    lastName: userData.lastName,
    password: userData.password,
  });
  
  return response.data;*/
}
