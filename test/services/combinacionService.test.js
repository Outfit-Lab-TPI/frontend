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
    it('debe llamar al endpoint con los parámetros correctos y devolver response.data', async () => {
      const mockData = { imageUrl: 'https://example.com/combinacion1.png' }
      apiClient.post.mockResolvedValueOnce({ data: mockData })

      const esHombre = true
      const superior = 'camisa azul'
      const inferior = 'pantalón negro'

      const result = await combinacionService.combinarPrendas(esHombre, superior, inferior)

      // Verifica que el endpoint se llamó correctamente
      expect(apiClient.post).toHaveBeenCalledWith(
        '/fashion/combinar-prendas',
        { esHombre, superior, inferior },
        { timeout: 60000 }
      )

      // Verifica que tu servicio devuelve exactamente lo que Axios entrega
      expect(result).toEqual(mockData)
    })

    it('debe lanzar error si apiClient.post falla', async () => {
      const error = new Error('Servidor caído')
      apiClient.post.mockRejectedValueOnce(error)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(
        combinacionService.combinarPrendas(true, 'camisa azul', 'pantalón negro')
      ).rejects.toThrow('Servidor caído')

      // Verifica que el error se registró en consola
      expect(consoleSpy).toHaveBeenCalledWith('error:', error)
      consoleSpy.mockRestore()
    })
  })
})
