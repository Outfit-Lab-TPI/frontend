import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sugerenciasIAService } from '../../../src/services/probador/sugerenciasIAService.js'
import apiClient from '../../../src/services/api.js'

vi.mock('../../../src/services/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

describe('sugerenciasIAService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
  })

  describe('obtenerCategoriasRecomendacion', () => {
    it('debe obtener categorías exitosamente', async () => {
      // given
      const mockCategories = {
        climates: ['Cálido', 'Frío', 'Templado'],
        occasions: ['Casual', 'Formal', 'Deportivo']
      }
      apiClient.get.mockResolvedValueOnce({ data: mockCategories })

      // when
      const result = await sugerenciasIAService.obtenerCategoriasRecomendacion()

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/categories/recommendation')
      expect(result).toEqual(mockCategories)
    })

    it('debe manejar error al obtener categorías', async () => {
      // given
      const error = {
        response: {
          data: { message: 'Error al cargar categorías' }
        }
      }
      apiClient.get.mockRejectedValueOnce(error)

      // when / then
      await expect(
        sugerenciasIAService.obtenerCategoriasRecomendacion()
      ).rejects.toThrow('Error al cargar categorías')
    })
  })

  describe('obtenerRecomendacionesPorTexto', () => {
    it('debe obtener recomendaciones exitosamente', async () => {
      // given
      const mockRecommendations = [
        { id: 1, nombre: 'Camisa Azul', tipo: 'SUPERIOR' },
        { id: 2, nombre: 'Pantalón Negro', tipo: 'INFERIOR' }
      ]
      apiClient.post.mockResolvedValueOnce({
        status: 200,
        data: mockRecommendations
      })

      // when
      const result = await sugerenciasIAService.obtenerRecomendacionesPorTexto(
        'user123',
        'Quiero ropa casual para clima cálido'
      )

      // then
      expect(apiClient.post).toHaveBeenCalledWith('/outfits/recommend', {
        idUsuario: 'user123',
        peticionUsuario: 'Quiero ropa casual para clima cálido'
      })
      expect(result).toEqual(mockRecommendations)
    })

    it('debe retornar array vacío si data es null', async () => {
      // given
      apiClient.post.mockResolvedValueOnce({
        status: 204,
        data: null
      })

      // when
      const result = await sugerenciasIAService.obtenerRecomendacionesPorTexto(
        'user123',
        'test'
      )

      // then
      expect(result).toEqual([])
    })

    it('debe manejar error 404 con mensaje específico', async () => {
      // given
      const error = { response: { status: 404 } }
      apiClient.post.mockRejectedValueOnce(error)

      // when / then
      await expect(
        sugerenciasIAService.obtenerRecomendacionesPorTexto('user123', 'test')
      ).rejects.toThrow('No se encontraron prendas para esa combinación de clima/ocasión.')
    })

    it('debe manejar otros errores', async () => {
      // given
      const error = {
        response: {
          status: 500,
          data: { message: 'Error del servidor' }
        }
      }
      apiClient.post.mockRejectedValueOnce(error)

      // when / then
      await expect(
        sugerenciasIAService.obtenerRecomendacionesPorTexto('user123', 'test')
      ).rejects.toThrow('Error del servidor')
    })
  })
})
