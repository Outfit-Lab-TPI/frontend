import { describe, it, expect, beforeEach, vi } from 'vitest'
import apiClient from '../../src/services/api.js'
import { combinacionService } from '../../src/services/combinacionService.js'

// Mock de apiClient
vi.mock('../../src/services/api.js', () => ({
  default: { post: vi.fn() }
}))

describe('combinacionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('combinarPrendas', () => {
    it('debe llamar al endpoint con los parámetros correctos y devolver imageUrl cuando status es OK', async () => {
      const mockData = { status: 'OK', imageUrl: 'https://example.com/combinacion1.png', errorMessage: null }
      apiClient.post.mockResolvedValueOnce({ data: mockData })

      const top = 'camisa azul'
      const bottom = 'pantalón negro'
      const isMan = true
      const avatarType = 'MAN'

      const result = await combinacionService.combinarPrendas(top, bottom, isMan, avatarType)

      // Verifica que el endpoint se llamó correctamente
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/fashion/combinar-prendas',
        { top, bottom, isMan, avatarType },
        { timeout: 60000 }
      )

      // Verifica que devuelve solo la imageUrl
      expect(result).toEqual('https://example.com/combinacion1.png')
    })

    it('debe lanzar error cuando status es FAILED', async () => {
      const mockData = { status: 'FAILED', imageUrl: null, errorMessage: 'Error en la generación de imagen' }
      apiClient.post.mockResolvedValueOnce({ data: mockData })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(
        combinacionService.combinarPrendas('camisa azul', 'pantalón negro', true, 'MAN')
      ).rejects.toThrow('Error en la generación de imagen')

      expect(consoleSpy).toHaveBeenCalledWith('Error combinando prendas:', expect.any(Error))
      consoleSpy.mockRestore()
    })

    it('debe lanzar error cuando status es ERROR', async () => {
      const mockData = { status: 'ERROR', imageUrl: null, errorMessage: 'Error interno del servidor' }
      apiClient.post.mockResolvedValueOnce({ data: mockData })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(
        combinacionService.combinarPrendas('camisa azul', 'pantalón negro', true, 'MAN')
      ).rejects.toThrow('Error interno del servidor')

      expect(consoleSpy).toHaveBeenCalledWith('Error combinando prendas:', expect.any(Error))
      consoleSpy.mockRestore()
    })

    it('debe lanzar error si apiClient.post falla', async () => {
      const error = new Error('Servidor caído')
      apiClient.post.mockRejectedValueOnce(error)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(
        combinacionService.combinarPrendas('camisa azul', 'pantalón negro', true, 'MAN')
      ).rejects.toThrow('Servidor caído')

      // Verifica que el error se registró en consola
      expect(consoleSpy).toHaveBeenCalledWith('Error combinando prendas:', error)
      consoleSpy.mockRestore()
    })

    it('debe manejar errores de respuesta con estructura de error', async () => {
      const errorResponse = {
        response: {
          data: {
            status: 'TIMEOUT',
            errorMessage: 'Timeout en la generación'
          }
        }
      }
      apiClient.post.mockRejectedValueOnce(errorResponse)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(
        combinacionService.combinarPrendas('camisa azul', 'pantalón negro', true, 'MAN')
      ).rejects.toThrow('Timeout en la generación')

      expect(consoleSpy).toHaveBeenCalledWith('Error combinando prendas:', errorResponse)
      consoleSpy.mockRestore()
    })
  })
})
