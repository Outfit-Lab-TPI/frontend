import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFavoritos } from '../../src/hooks/useFavoritos.jsx'
import { favoritosService } from '../../src/services/favoritosService.js'

// Mock del servicio
vi.mock('../../src/services/favoritosService.js', () => ({
  favoritosService: {
    togglePrendaFavorita: vi.fn(),
    toggleCombinacionFavorita: vi.fn(),
    obtenerPrendasFavoritas: vi.fn(),
    obtenerCombinacionesFavoritas: vi.fn()
  }
}))

describe('useFavoritos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('togglePrendaFavorita', () => {
    it('debe manejar toggle exitoso de prenda favorita', async () => {
      // given
      const mockResponse = { success: true }
      const mockCallback = vi.fn()
      favoritosService.togglePrendaFavorita.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFavoritos())

      // when
      let response
      await act(async () => {
        response = await result.current.togglePrendaFavorita('ABC123', true, mockCallback)
      })

      // then
      expect(favoritosService.togglePrendaFavorita).toHaveBeenCalledWith('ABC123', true)
      expect(mockCallback).toHaveBeenCalledWith(mockResponse)
      expect(response).toEqual(mockResponse)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('debe manejar errores en togglePrendaFavorita', async () => {
      // given
      const error = new Error('Error al actualizar favorito')
      favoritosService.togglePrendaFavorita.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useFavoritos())

      // when / then
      await act(async () => {
        await expect(result.current.togglePrendaFavorita('ABC123', true))
          .rejects.toThrow('Error al actualizar favorito')
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Error al actualizar favorito')
    })
  })

  describe('toggleCombinacionFavorita', () => {
    it('debe manejar toggle exitoso de combinación favorita', async () => {
      // given
      const mockResponse = { success: true }
      const mockCallback = vi.fn()
      favoritosService.toggleCombinacionFavorita.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFavoritos())

      // when
      let response
      await act(async () => {
        response = await result.current.toggleCombinacionFavorita('COMB456', mockCallback)
      })

      // then
      expect(favoritosService.toggleCombinacionFavorita).toHaveBeenCalledWith('COMB456')
      expect(mockCallback).toHaveBeenCalledWith(mockResponse)
      expect(response).toEqual(mockResponse)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('debe manejar errores en toggleCombinacionFavorita', async () => {
      // given
      const error = new Error('Error al actualizar combinación favorita')
      favoritosService.toggleCombinacionFavorita.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useFavoritos())

      // when / then
      await act(async () => {
        await expect(result.current.toggleCombinacionFavorita('COMB456'))
          .rejects.toThrow('Error al actualizar combinación favorita')
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Error al actualizar combinación favorita')
    })
  })

  describe('obtenerPrendasFavoritas', () => {
    it('debe obtener prendas favoritas exitosamente', async () => {
      // given
      const mockResponse = { data: [{ garmentCode: 'ABC123', name: 'Camisa' }] }
      favoritosService.obtenerPrendasFavoritas.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFavoritos())

      // when
      let response
      await act(async () => {
        response = await result.current.obtenerPrendasFavoritas()
      })

      // then
      expect(favoritosService.obtenerPrendasFavoritas).toHaveBeenCalled()
      expect(response).toEqual(mockResponse)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('debe manejar errores al obtener prendas favoritas', async () => {
      // given
      const error = new Error('Error al obtener prendas favoritas')
      favoritosService.obtenerPrendasFavoritas.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useFavoritos())

      // when / then
      await act(async () => {
        await expect(result.current.obtenerPrendasFavoritas())
          .rejects.toThrow('Error al obtener prendas favoritas')
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Error al obtener prendas favoritas')
    })
  })

  describe('obtenerCombinacionesFavoritas', () => {
    it('debe obtener combinaciones favoritas exitosamente', async () => {
      // given
      const mockResponse = [{ combinationCode: 'COMB456', name: 'Outfit casual' }]
      favoritosService.obtenerCombinacionesFavoritas.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFavoritos())

      // when
      let response
      await act(async () => {
        response = await result.current.obtenerCombinacionesFavoritas()
      })

      // then
      expect(favoritosService.obtenerCombinacionesFavoritas).toHaveBeenCalled()
      expect(response).toEqual(mockResponse)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('debe manejar errores al obtener combinaciones favoritas', async () => {
      // given
      const error = new Error('Error al obtener combinaciones favoritas')
      favoritosService.obtenerCombinacionesFavoritas.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useFavoritos())

      // when / then
      await act(async () => {
        await expect(result.current.obtenerCombinacionesFavoritas())
          .rejects.toThrow('Error al obtener combinaciones favoritas')
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Error al obtener combinaciones favoritas')
    })
  })

  describe('limpiarError', () => {
    it('debe limpiar el error', async () => {
      // given
      const error = new Error('Test error')
      favoritosService.togglePrendaFavorita.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useFavoritos())

      // Establecer un error primero
      await act(async () => {
        try {
          await result.current.togglePrendaFavorita('ABC123', true)
        } catch (e) {
          // Ignorar el error, solo queremos que se establezca
        }
      })

      expect(result.current.error).toBe('Test error')

      // when
      act(() => {
        result.current.limpiarError()
      })

      // then
      expect(result.current.error).toBe(null)
    })
  })

  describe('multiple operations', () => {
    it('debe manejar múltiples operaciones secuenciales', async () => {
      // given
      const mockResponse1 = { success: true }
      const mockResponse2 = [{ garmentCode: 'ABC123' }]

      favoritosService.togglePrendaFavorita.mockResolvedValueOnce(mockResponse1)
      favoritosService.obtenerPrendasFavoritas.mockResolvedValueOnce(mockResponse2)

      const { result } = renderHook(() => useFavoritos())

      // when
      await act(async () => {
        await result.current.togglePrendaFavorita('ABC123', true)
      })

      await act(async () => {
        await result.current.obtenerPrendasFavoritas()
      })

      // then
      expect(favoritosService.togglePrendaFavorita).toHaveBeenCalledWith('ABC123', true)
      expect(favoritosService.obtenerPrendasFavoritas).toHaveBeenCalled()
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })
  })
})