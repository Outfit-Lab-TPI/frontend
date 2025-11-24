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
      // given
      const mockData = { imageUrl: 'https://example.com/combinacion1.png' }
      apiClient.post.mockResolvedValueOnce({ data: mockData })

      const avatar = 'man'
      const top = 'camisa azul'
      const bottom = 'pantalón negro'

      // when
      const result = await combinacionService.combinarPrendas(avatar, top, bottom)

      // then
      // Verifica que el endpoint se llamó correctamente
      expect(apiClient.post).toHaveBeenCalledWith(
        '/fashion/combinar-prendas',
        { avatarType: 'man', top, bottom },
        { timeout: 60000 }
      )

      // Verifica que tu servicio devuelve exactamente lo que Axios entrega
      expect(result).toEqual(mockData)
    })

    it('debe usar avatarGenero del usuario cuando no hay imagen personalizada', async () => {
      // given
      const mockData = { imageUrl: 'https://example.com/combinacion1.png' }
      apiClient.post.mockResolvedValueOnce({ data: mockData })

      const avatar = 'woman'
      const top = 'camisa azul'
      const bottom = 'pantalón negro'
      const usuario = { avatarGenero: 'mujer', avatarUrl: null }

      // when
      const result = await combinacionService.combinarPrendas(avatar, top, bottom, usuario)

      // then
      expect(apiClient.post).toHaveBeenCalledWith(
        '/fashion/combinar-prendas',
        { avatarType: 'woman', top, bottom },  // Debe usar 'woman' por la preferencia del usuario
        { timeout: 60000 }
      )
    })

    it('debe usar avatar personalizado cuando usuario tiene avatarUrl', async () => {
      // given
      const mockData = { imageUrl: 'https://example.com/combinacion1.png' }
      apiClient.post.mockResolvedValueOnce({ data: mockData })

      const avatar = 'custom'
      const top = 'camisa azul'
      const bottom = 'pantalón negro'
      const usuario = { avatarGenero: 'hombre', avatarUrl: 'https://example.com/user-avatar.jpg' }

      // when
      const result = await combinacionService.combinarPrendas(avatar, top, bottom, usuario)

      // then
      expect(apiClient.post).toHaveBeenCalledWith(
        '/fashion/combinar-prendas',
        { avatarType: 'custom', top, bottom },
        { timeout: 60000 }
      )
    })

    it('debe lanzar error si apiClient.post falla', async () => {
      // given
      const error = new Error('Servidor caído')
      apiClient.post.mockRejectedValueOnce(error)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // when / then
      await expect(
        combinacionService.combinarPrendas('man', 'camisa azul', 'pantalón negro')
      ).rejects.toThrow('Servidor caído')

      // then
      // Verifica que el error se registró en consola
      expect(consoleSpy).toHaveBeenCalledWith('Error en combinacionService:', error)
      consoleSpy.mockRestore()
    })
  })
})
