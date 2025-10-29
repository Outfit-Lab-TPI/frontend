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
      const mockData = {
        modeloUrl: '/avatars/avatar-test.glb',
        status: 'success',
        message: 'Modelo 3D generado exitosamente'
      }
      apiClient.post.mockResolvedValueOnce({ data: mockData })

      const conjuntoUrl = ['url1.png', 'url2.png']
      const result = await modelo3DService.generarModelo(conjuntoUrl)

      expect(apiClient.post).toHaveBeenCalledWith('/generar-modelo', { conjuntoUrl })
      expect(result).toEqual(mockData)
    })

    it('debe propagar el error si apiClient.post falla', async () => {
      const error = new Error('Servidor caído')
      apiClient.post.mockRejectedValueOnce(error)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(modelo3DService.generarModelo(['url1.png'])).rejects.toThrow(
        'Error de conexión al generar modelo 3D'
      )

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error en modelo3DService.generarModelo:',
        error
      )

      consoleSpy.mockRestore()
    })
  })
})
