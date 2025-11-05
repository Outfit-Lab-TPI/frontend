import { describe, it, expect, vi, beforeEach } from 'vitest'
import { favoritosService } from '../../src/services/favoritosService.js'
import apiClient from '../../src/services/api.js'

// Mock de apiClient
vi.mock('../../src/services/api.js', () => ({
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
      const mockResponse = { data: { success: true } }
      apiClient.post.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.agregarPrendaFavorita('ABC123')

      expect(apiClient.post).toHaveBeenCalledWith('/api/garments/favourites/add/ABC123')
      expect(result).toEqual({ success: true })
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      const mockError = {
        response: { data: { message: 'Error al agregar prenda a favoritos' } }
      }
      apiClient.post.mockRejectedValueOnce(mockError)

      await expect(favoritosService.agregarPrendaFavorita('ABC123'))
        .rejects.toThrow('Error al agregar prenda a favoritos')
    })
  })

  describe('quitarPrendaFavorita', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      const mockResponse = { data: { success: true } }
      apiClient.delete.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.quitarPrendaFavorita('ABC123')

      expect(apiClient.delete).toHaveBeenCalledWith('/api/garments/favourites/delete/ABC123')
      expect(result).toEqual({ success: true })
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      const mockError = {
        response: { data: { message: 'Error al quitar prenda de favoritos' } }
      }
      apiClient.delete.mockRejectedValueOnce(mockError)

      await expect(favoritosService.quitarPrendaFavorita('ABC123'))
        .rejects.toThrow('Error al quitar prenda de favoritos')
    })
  })

  describe('obtenerPrendasFavoritas', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      const mockResponse = { data: [{ garmentCode: 'ABC123', name: 'Camiseta' }] }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.obtenerPrendasFavoritas()

      expect(apiClient.get).toHaveBeenCalledWith('/api/garments/favourites')
      expect(result).toEqual([{ garmentCode: 'ABC123', name: 'Camiseta' }])
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      const mockError = {
        response: { data: { message: 'Error al obtener prendas favoritas' } }
      }
      apiClient.get.mockRejectedValueOnce(mockError)

      await expect(favoritosService.obtenerPrendasFavoritas())
        .rejects.toThrow('Error al obtener prendas favoritas')
    })
  })

  describe('togglePrendaFavorita', () => {
    it('debe quitar favorito cuando esFavorita es true', async () => {
      const mockResponse = { data: { success: true } }
      apiClient.delete.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.togglePrendaFavorita('ABC123', true)

      expect(apiClient.delete).toHaveBeenCalledWith('/api/garments/favourites/delete/ABC123')
      expect(result).toEqual({ success: true })
    })

    it('debe agregar favorito cuando esFavorita es false', async () => {
      const mockResponse = { data: { success: true } }
      apiClient.post.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.togglePrendaFavorita('ABC123', false)

      expect(apiClient.post).toHaveBeenCalledWith('/api/garments/favourites/add/ABC123')
      expect(result).toEqual({ success: true })
    })
  })

  describe('agregarCombinacionFavorita', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      const mockResponse = { data: { success: true } }
      apiClient.post.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.agregarCombinacionFavorita('COMB456')

      expect(apiClient.post).toHaveBeenCalledWith('/api/combinations/favourites/add/COMB456')
      expect(result).toEqual({ success: true })
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      const mockError = {
        response: { data: { message: 'Error al agregar combinación a favoritos' } }
      }
      apiClient.post.mockRejectedValueOnce(mockError)

      await expect(favoritosService.agregarCombinacionFavorita('COMB456'))
        .rejects.toThrow('Error al agregar combinación a favoritos')
    })
  })

  describe('quitarCombinacionFavorita', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      const mockResponse = { data: { success: true } }
      apiClient.delete.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.quitarCombinacionFavorita('COMB456')

      expect(apiClient.delete).toHaveBeenCalledWith('/api/combinations/favourites/delete/COMB456')
      expect(result).toEqual({ success: true })
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      const mockError = {
        response: { data: { message: 'Error al quitar combinación de favoritos' } }
      }
      apiClient.delete.mockRejectedValueOnce(mockError)

      await expect(favoritosService.quitarCombinacionFavorita('COMB456'))
        .rejects.toThrow('Error al quitar combinación de favoritos')
    })
  })

  describe('obtenerCombinacionesFavoritas', () => {
    it('debe llamar a la API correctamente y devolver los datos', async () => {
      const mockResponse = { data: [{ combinationCode: 'COMB456', name: 'Outfit casual' }] }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.obtenerCombinacionesFavoritas()

      expect(apiClient.get).toHaveBeenCalledWith('/api/combinations/favourites')
      expect(result).toEqual([{ combinationCode: 'COMB456', name: 'Outfit casual' }])
    })

    it('debe lanzar un error con mensaje del servidor si existe', async () => {
      const mockError = {
        response: { data: { message: 'Error al obtener combinaciones favoritas' } }
      }
      apiClient.get.mockRejectedValueOnce(mockError)

      await expect(favoritosService.obtenerCombinacionesFavoritas())
        .rejects.toThrow('Error al obtener combinaciones favoritas')
    })
  })

  describe('toggleCombinacionFavorita', () => {
    it('debe quitar favorito cuando esFavorita es true', async () => {
      const mockResponse = { data: { success: true } }
      apiClient.delete.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.toggleCombinacionFavorita('COMB456', true)

      expect(apiClient.delete).toHaveBeenCalledWith('/api/combinations/favourites/delete/COMB456')
      expect(result).toEqual({ success: true })
    })

    it('debe agregar favorito cuando esFavorita es false', async () => {
      const mockResponse = { data: { success: true } }
      apiClient.post.mockResolvedValueOnce(mockResponse)

      const result = await favoritosService.toggleCombinacionFavorita('COMB456', false)

      expect(apiClient.post).toHaveBeenCalledWith('/api/combinations/favourites/add/COMB456')
      expect(result).toEqual({ success: true })
    })
  })
})
