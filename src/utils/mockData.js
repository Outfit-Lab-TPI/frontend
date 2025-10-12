// Mock data para desarrollo

// Usuario mock para testing
export const mockUser = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan@test.com',
  token: 'mock-jwt-token-123'
}

// Credenciales válidas para login mock
export const validMockCredentials = {
  email: 'juan@test.com',
  password: '123456'
}

// Función para simular delay de red
export const simulateNetworkDelay = (delay = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Función para validar login mock
export const validateMockLogin = (email, password) => {
  return email === validMockCredentials.email && password === validMockCredentials.password
}