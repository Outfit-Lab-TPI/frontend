import { describe, it, expect, vi, beforeEach } from 'vitest'
import { favoritosService } from '../../src/services/favoritosService.js'
import apiClient from '../../src/services/api.js'

// Mock de apiClient
vi.mock('../../src/services/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

describe('favoritosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('togglePrendaFavorita', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      const mockResponse = { data: { success: true } }
      apiClient.post.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.togglePrendaFavorita(123)

      expect(apiClient.post).toHaveBeenCalledWith('/api/prenda/favorita/123')
      expect(result).toEqual({ success: true })
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      const mockError = {
        response: { data: { message: 'Error al marcar/desmarcar prenda como favorita' } }
      }
      apiClient.post.mockRejectedValueOnce(mockError)

      await expect(favoritosService.togglePrendaFavorita(999))
        .rejects.toThrow('Error al marcar/desmarcar prenda como favorita')
    })

    it('debe lanzar un error genérico si no hay mensaje del servidor', async () => {
      apiClient.post.mockRejectedValueOnce(new Error('Falla desconocida'))

      await expect(favoritosService.togglePrendaFavorita(999))
        .rejects.toThrow('Error al marcar/desmarcar prenda como favorita')
    })
  })

  describe('toggleCombinacionFavorita', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      const mockResponse = { data: { success: true } }
      apiClient.post.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.toggleCombinacionFavorita(456)

      expect(apiClient.post).toHaveBeenCalledWith('/api/combinacion/favorita/456')
      expect(result).toEqual({ success: true })
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      const mockError = {
        response: { data: { message: 'Error al marcar/desmarcar combinación como favorita' } }
      }
      apiClient.post.mockRejectedValueOnce(mockError)

      await expect(favoritosService.toggleCombinacionFavorita(888))
        .rejects.toThrow('Error al marcar/desmarcar combinación como favorita')
    })

    it('debe lanzar un error genérico si no hay mensaje del servidor', async () => {
      apiClient.post.mockRejectedValueOnce({})

      await expect(favoritosService.toggleCombinacionFavorita(888))
        .rejects.toThrow('Error al marcar/desmarcar combinación como favorita')
    })
  })
})
