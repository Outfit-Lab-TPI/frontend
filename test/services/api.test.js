import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

// Objeto mock de axios
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

// Creacion mock de axios
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

    it('Debe crear una instancia de axios con la configuración correcta', async () => {
      // given
      // Import the module to trigger axios.create

      // when
      await import('../../src/services/api')

      // then
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:8080/api',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 500000,
      })
    })

})