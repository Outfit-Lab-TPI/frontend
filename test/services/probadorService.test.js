import { describe, it, expect, vi, beforeEach } from 'vitest'
import { probadorService } from '../../src/services/probadorService.js'
import apiClient from '../../src/services/api.js'

// Mock de apiClient
vi.mock('../../src/services/api.js', () => ({
  default: {
    get: vi.fn()
  }
}))

describe('probadorService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('obtenerPrendasSuperiores', () => {
    it('debe llamar a la API sin filtros y devolver response completo', async () => {
      // given
      const mockResponse = {
        data: {
          content: [
            { garmentCode: 'SUP001', name: 'Camisa Azul' },
            { garmentCode: 'SUP002', name: 'Polo Blanco' }
          ]
        }
      }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await probadorService.obtenerPrendasSuperiores()

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garments/superior')
      expect(result).toEqual(mockResponse)
    })

    it('debe llamar a la API con filtros y devolver response completo', async () => {
      // given
      const mockResponse = {
        data: {
          content: [
            { garmentCode: 'SUP001', name: 'Camisa Azul', brand: 'Nike' }
          ]
        }
      }
      const filtros = { brand: 'Nike', color: 'azul' }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await probadorService.obtenerPrendasSuperiores(filtros)

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garments/superior?brand=Nike&color=azul')
      expect(result).toEqual(mockResponse)
    })

    it('debe marcar error como crítico cuando es error de servidor 5xx', async () => {
      // given
      const error = new Error('Server Error')
      error.response = { status: 500 }
      apiClient.get.mockRejectedValueOnce(error)

      // when / then
      await expect(probadorService.obtenerPrendasSuperiores()).rejects.toThrow('Server Error')
      expect(error.isCritical).toBe(true)
    })

    it('debe marcar error como crítico cuando no hay respuesta del servidor', async () => {
      // given
      const error = new Error('Network Error')
      error.request = {}
      apiClient.get.mockRejectedValueOnce(error)

      // when / then
      await expect(probadorService.obtenerPrendasSuperiores()).rejects.toThrow('Network Error')
      expect(error.isCritical).toBe(true)
    })

    it('debe marcar error como no crítico para errores 4xx', async () => {
      // given
      const error = new Error('Not Found')
      error.response = { status: 404 }
      apiClient.get.mockRejectedValueOnce(error)

      // when / then
      await expect(probadorService.obtenerPrendasSuperiores()).rejects.toThrow('Not Found')
      expect(error.isCritical).toBe(false)
    })
  })

  describe('obtenerPrendasInferiores', () => {
    it('debe llamar a la API sin filtros y devolver response completo', async () => {
      // given
      const mockResponse = {
        data: {
          content: [
            { garmentCode: 'INF001', name: 'Pantalón Negro' },
            { garmentCode: 'INF002', name: 'Jeans Azul' }
          ]
        }
      }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await probadorService.obtenerPrendasInferiores()

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garments/inferior')
      expect(result).toEqual(mockResponse)
    })

    it('debe llamar a la API con filtros y devolver response completo', async () => {
      // given
      const mockResponse = {
        data: {
          content: [
            { garmentCode: 'INF001', name: 'Pantalón Negro', brand: 'Adidas' }
          ]
        }
      }
      const filtros = { brand: 'Adidas', talla: 'M' }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await probadorService.obtenerPrendasInferiores(filtros)

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garments/inferior?brand=Adidas&talla=M')
      expect(result).toEqual(mockResponse)
    })

    it('debe marcar error como crítico cuando es error de servidor 5xx', async () => {
      // given
      const error = new Error('Internal Server Error')
      error.response = { status: 503 }
      apiClient.get.mockRejectedValueOnce(error)

      // when / then
      await expect(probadorService.obtenerPrendasInferiores()).rejects.toThrow('Internal Server Error')
      expect(error.isCritical).toBe(true)
    })

    it('debe marcar error como crítico cuando no hay respuesta del servidor', async () => {
      // given
      const error = new Error('Connection Timeout')
      error.request = { timeout: true }
      apiClient.get.mockRejectedValueOnce(error)

      // when / then
      await expect(probadorService.obtenerPrendasInferiores()).rejects.toThrow('Connection Timeout')
      expect(error.isCritical).toBe(true)
    })

    it('debe marcar error como no crítico para errores 4xx', async () => {
      // given
      const error = new Error('Bad Request')
      error.response = { status: 400 }
      apiClient.get.mockRejectedValueOnce(error)

      // when / then
      await expect(probadorService.obtenerPrendasInferiores()).rejects.toThrow('Bad Request')
      expect(error.isCritical).toBe(false)
    })

    it('debe manejar filtros vacíos correctamente', async () => {
      // given
      const mockResponse = { data: { content: [] } }
      const filtros = {}
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await probadorService.obtenerPrendasInferiores(filtros)

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garments/inferior')
      expect(result).toEqual(mockResponse)
    })
  })
})