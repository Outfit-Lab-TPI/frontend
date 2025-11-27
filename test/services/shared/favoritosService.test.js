import { describe, it, expect, vi, beforeEach } from 'vitest'
import { favoritosService } from '../../../src/services/shared/favoritosService.js'
import apiClient from '../../../src/services/api.js'

// Mock de apiClient
vi.mock('../../../src/services/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}))

describe('favoritosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('agregarPrendaFavorita', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      // given
      const mockResponse = { data: { success: true } }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await favoritosService.agregarPrendaFavorita('ABC123')

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garments/favorite/add/ABC123')
      expect(result).toEqual({ success: true })
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      // given
      const mockError = {
        response: { data: { message: 'Error al agregar prenda a favoritos' } }
      }
      apiClient.get.mockRejectedValueOnce(mockError)

      // when / then
      await expect(favoritosService.agregarPrendaFavorita('ABC123'))
        .rejects.toThrow('Error al agregar prenda a favoritos')
    })
  })

  describe('quitarPrendaFavorita', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      // given
      const mockResponse = { data: { success: true } }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await favoritosService.quitarPrendaFavorita('ABC123')

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garments/favorite/delete/ABC123')
      expect(result).toEqual({ success: true })
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      // given
      const mockError = {
        response: { data: { message: 'Error al quitar prenda de favoritos' } }
      }
      apiClient.get.mockRejectedValueOnce(mockError)

      // when / then
      await expect(favoritosService.quitarPrendaFavorita('ABC123'))
        .rejects.toThrow('Error al quitar prenda de favoritos')
    })
  })

  describe('obtenerPrendasFavoritas', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      // given
      const mockResponse = { data: [{ garmentCode: 'ABC123', name: 'Camiseta' }] }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await favoritosService.obtenerPrendasFavoritas()

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garments/favorite')
      expect(result).toEqual(mockResponse)
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      // given
      const mockError = {
        response: { data: { message: 'Error al obtener prendas favoritas' } }
      }
      apiClient.get.mockRejectedValueOnce(mockError)

      // when / then
      await expect(favoritosService.obtenerPrendasFavoritas())
        .rejects.toThrow('Error al obtener prendas favoritas')
    })
  })

  describe('togglePrendaFavorita', () => {
    it('debe quitar favorito cuando esFavorita es true', async () => {
      // given
      const mockResponse = { data: { success: true } }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await favoritosService.togglePrendaFavorita('ABC123', true)

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garments/favorite/delete/ABC123')
      expect(result).toEqual({ success: true })
    })

    it('debe agregar favorito cuando esFavorita es false', async () => {
      // given
      const mockResponse = { data: { success: true } }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await favoritosService.togglePrendaFavorita('ABC123', false)

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/garments/favorite/add/ABC123')
      expect(result).toEqual({ success: true })
    })
  })

  describe('agregarCombinacionFavorita', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      // given
      const mockResponse = { data: { success: true } }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await favoritosService.agregarCombinacionFavorita('COMB456')

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/combinations/favorite/add?combinationUrl=COMB456')
      expect(result).toEqual({ success: true })
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      // given
      const mockError = {
        response: { data: { message: 'Error al agregar combinación a favoritos' } }
      }
      apiClient.get.mockRejectedValueOnce(mockError)

      // when / then
      await expect(favoritosService.agregarCombinacionFavorita('COMB456'))
        .rejects.toThrow('Error al agregar combinación a favoritos')
    })
  })

  describe('quitarCombinacionFavorita', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      // given
      const mockResponse = { data: { success: true } }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await favoritosService.quitarCombinacionFavorita('COMB456')

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/combinations/favorite/delete?combinationUrl=COMB456')
      expect(result).toEqual({ success: true })
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      // given
      const mockError = {
        response: { data: { message: 'Error al quitar combinación de favoritos' } }
      }
      apiClient.get.mockRejectedValueOnce(mockError)

      // when / then
      await expect(favoritosService.quitarCombinacionFavorita('COMB456'))
        .rejects.toThrow('Error al quitar combinación de favoritos')
    })
  })

  describe('obtenerCombinacionesFavoritas', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      // given
      const mockResponse = { data: [{ combinationCode: 'COMB456', name: 'Outfit casual' }] }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await favoritosService.obtenerCombinacionesFavoritas()

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/combinations/favorite')
      expect(result).toEqual([{ combinationCode: 'COMB456', name: 'Outfit casual' }])
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      // given
      const mockError = {
        response: { data: { message: 'Error al obtener combinaciones favoritas' } }
      }
      apiClient.get.mockRejectedValueOnce(mockError)

      // when / then
      await expect(favoritosService.obtenerCombinacionesFavoritas())
        .rejects.toThrow('Error al obtener combinaciones favoritas')
    })
  })

  describe('toggleCombinacionFavorita', () => {
    it('debe quitar favorito cuando la combinación ya está en favoritas', async () => {
      // given
      const mockFavoritas = { content: [{ combinationUrl: 'COMB456' }] }
      const mockDeleteResponse = { data: { success: true } }
      apiClient.get.mockResolvedValueOnce({ data: mockFavoritas }) // obtenerCombinacionesFavoritas
      apiClient.get.mockResolvedValueOnce(mockDeleteResponse) // quitarCombinacionFavorita

      // when
      const result = await favoritosService.toggleCombinacionFavorita('COMB456')

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/combinations/favorite')
      expect(apiClient.get).toHaveBeenCalledWith('/combinations/favorite/delete?combinationUrl=COMB456')
      expect(result).toEqual({ success: true })
    })

    it('debe agregar favorito cuando la combinación no está en favoritas', async () => {
      // given
      const mockFavoritas = { content: [] }
      const mockAddResponse = { data: { success: true } }
      apiClient.get.mockResolvedValueOnce({ data: mockFavoritas }) // obtenerCombinacionesFavoritas
      apiClient.get.mockResolvedValueOnce(mockAddResponse) // agregarCombinacionFavorita

      // when
      const result = await favoritosService.toggleCombinacionFavorita('COMB456')

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/combinations/favorite')
      expect(apiClient.get).toHaveBeenCalledWith('/combinations/favorite/add?combinationUrl=COMB456')
      expect(result).toEqual({ success: true })
    })
  })
})
