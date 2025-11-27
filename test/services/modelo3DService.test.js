import { describe, it, expect, beforeEach, vi } from 'vitest'
import apiClient from '../../src/services/api.js'
import { modelo3DService } from '../../src/services/modelo3DService.js'

// Mock de apiClient
vi.mock('../../src/services/api.js', () => ({
  default: { post: vi.fn() }
}))

describe('modelo3DService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generarModelo', () => {
    it('debe llamar al endpoint con el conjuntoUrl y devolver response.data', async () => {
      // given
      const mockData = {
        tripoModelUrl: '/avatars/avatar-test.glb'
      }
      const expectedResult = {
        modeloUrl: '/avatars/avatar-test.glb'
      }
      apiClient.post.mockResolvedValueOnce({ data: mockData })

      // when
      const imageUrl = ['url1.png', 'url2.png']
      const result = await modelo3DService.generarModelo(imageUrl)

      // then
      expect(apiClient.post).toHaveBeenCalledWith('/tripo/upload/image', { imageUrl })
      expect(result).toEqual(expectedResult)
    })

    it('debe propagar el error si apiClient.post falla', async () => {
      // given
      const error = new Error('Servidor caído')
      apiClient.post.mockRejectedValueOnce(error)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // when / then
      await expect(modelo3DService.generarModelo(['url1.png'])).rejects.toThrow(
        'Error de conexión al generar modelo 3D'
      )

      // then
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error en modelo3DService.generarModelo:',
        error
      )

      consoleSpy.mockRestore()
    })
  })
})
