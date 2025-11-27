import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sugerenciasService } from '../../../src/services/shared/sugerenciasService'
import apiClient from '../../../src/services/api.js'

// Mock de apiClient
vi.mock('../../../src/services/api.js', () => ({
  default: {
    get: vi.fn()
  }
}))

describe('sugerenciasService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSugerencias', () => {
    it('debe llamar a la API con el código de prenda y devolver response completo', async () => {
      // given
      const mockResponse = {
        data: {
          recomendations: [
            {
              garmentCode: 'REC001',
              name: 'Pantalón recomendado',
              score: 0.95,
              reason: 'Combina perfectamente'
            },
            {
              garmentCode: 'REC002',
              name: 'Zapatos recomendados',
              score: 0.88,
              reason: 'Estilo casual'
            }
          ]
        }
      }
      const garmentCode = '123'
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await sugerenciasService.getSugerencias(garmentCode)

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garment-recomendation/123')
      expect(result).toEqual(mockResponse)
    })

    it('debe lanzar error cuando no se proporciona garmentCode', async () => {
      // given
      const garmentCode = null

      // when / then
      await expect(sugerenciasService.getSugerencias(garmentCode))
        .rejects.toThrow('El código de prenda es requerido')
    })

    it('debe propagar errores de la API y loguear el error', async () => {
      // given
      const error = new Error('API Error')
      const garmentCode = '123'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      apiClient.get.mockRejectedValueOnce(error)

      // when / then
      await expect(sugerenciasService.getSugerencias(garmentCode))
        .rejects.toThrow('API Error')

      // then
      expect(consoleSpy).toHaveBeenCalledWith('Error en sugerenciasService.getSugerencias:', error)
      consoleSpy.mockRestore()
    })

    it('debe manejar respuesta vacía de la API', async () => {
      // given
      const mockResponse = {
        data: {
          recomendations: []
        }
      }
      const garmentCode = 'GAR999'
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await sugerenciasService.getSugerencias(garmentCode)

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garment-recomendation/GAR999')
      expect(result).toEqual(mockResponse)
    })

    it('debe manejar errores de red y loguear el error', async () => {
      // given
      const networkError = new Error('Network Error')
      networkError.code = 'ECONNREFUSED'
      const garmentCode = '123'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      apiClient.get.mockRejectedValueOnce(networkError)

      // when / then
      await expect(sugerenciasService.getSugerencias(garmentCode))
        .rejects.toThrow('Network Error')

      // then
      expect(consoleSpy).toHaveBeenCalledWith('Error en sugerenciasService.getSugerencias:', networkError)
      consoleSpy.mockRestore()
    })

    it('debe manejar códigos de prenda con caracteres especiales', async () => {
      // given
      const mockResponse = {
        data: {
          recomendations: [
            {
              garmentCode: 'REC001',
              name: 'Prenda recomendada',
              score: 0.9
            }
          ]
        }
      }
      const garmentCode = 'GAR-123_SPECIAL'
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await sugerenciasService.getSugerencias(garmentCode)

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garment-recomendation/GAR-123_SPECIAL')
      expect(result).toEqual(mockResponse)
    })

    it('debe manejar errores del servidor con status 500', async () => {
      // given
      const serverError = new Error('Internal Server Error')
      serverError.response = { status: 500, data: { message: 'Server Error' } }
      const garmentCode = '123'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      apiClient.get.mockRejectedValueOnce(serverError)

      // when / then
      await expect(sugerenciasService.getSugerencias(garmentCode))
        .rejects.toThrow('Internal Server Error')

      // then
      expect(consoleSpy).toHaveBeenCalledWith('Error en sugerenciasService.getSugerencias:', serverError)
      consoleSpy.mockRestore()
    })
  })
})