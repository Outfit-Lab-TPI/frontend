import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

// Crear el objeto mock que simula una instancia de axios
// Este objeto tiene la misma estructura que axios pero con funciones falsas
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    response: {
      use: vi.fn()
    }
  }
}

// Las importaciones de axios en todo el proyecto serán reemplazadas por el mock
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance)
  }
}))

const mockedAxios = vi.mocked(axios)

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Configuracion', () => {
    it('Debe crear una instancia de axios con la configuración correcta', async () => {
      // Import the module to trigger axios.create
      await import('../../src/services/api')

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:8080/api',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })
    })
  })

})

// Integration-style tests (still mocked but testing the full flow)
describe('API Service Integracion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe manejar el ciclo completo de solicitud-respuesta', async () => {
    const mockUserData = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }

    const mockResponse = {
      data: mockUserData,
      status: 200
    }

    // Mock la instancia de metodo get de axios
    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse)

    // Importa el servicio API
    const { userAPI } = await import('../../src/services/api')

    const result = await userAPI.getUserById(1)

    expect(result.data).toEqual(mockUserData)
    expect(result.status).toBe(200)
  })
})