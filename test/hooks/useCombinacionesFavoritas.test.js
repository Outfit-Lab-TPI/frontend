import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCombinacionesFavoritas } from '../../src/hooks/useCombinacionesFavoritas.jsx'
import { favoritosService } from '../../src/services/favoritosService.js'

// Mock del servicio de favoritos
vi.mock('../../src/services/favoritosService.js', () => ({
  favoritosService: {
    obtenerCombinacionesFavoritas: vi.fn()
  }
}))

describe('useCombinacionesFavoritas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Carga de combinaciones', () => {
    it('debe inicializar con loading true y cargar combinaciones cuando autoLoad es true', async () => {
      // given
      const mockCombinaciones = [
        { combinationUrl: 'combo1.jpg', esFavorita: true },
        { combinationUrl: 'combo2.jpg', esFavorita: true }
      ]
      favoritosService.obtenerCombinacionesFavoritas.mockResolvedValueOnce({
        content: mockCombinaciones
      })

      // when
      const { result } = renderHook(() => useCombinacionesFavoritas(true))

      // Estado inicial
      expect(result.current.loading).toBe(true)
      expect(result.current.combinaciones).toEqual([])

      // then
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.combinaciones).toEqual(mockCombinaciones)
      expect(result.current.error).toBe(null)
      expect(favoritosService.obtenerCombinacionesFavoritas).toHaveBeenCalledTimes(1)
    })

    it('no debe cargar combinaciones automáticamente cuando autoLoad es false', async () => {
      // when
      const { result } = renderHook(() => useCombinacionesFavoritas(false))

      // then
      expect(result.current.loading).toBe(false)
      expect(result.current.combinaciones).toEqual([])
      expect(favoritosService.obtenerCombinacionesFavoritas).not.toHaveBeenCalled()
    })

    it('debe manejar respuesta sin content', async () => {
      // given
      favoritosService.obtenerCombinacionesFavoritas.mockResolvedValueOnce({})

      // when
      const { result } = renderHook(() => useCombinacionesFavoritas(true))

      // then
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.combinaciones).toEqual([])
      expect(result.current.error).toBe(null)
    })

    it('debe manejar error al cargar combinaciones', async () => {
      // given
      const error = new Error('Error al obtener combinaciones')
      favoritosService.obtenerCombinacionesFavoritas.mockRejectedValueOnce(error)

      // when
      const { result } = renderHook(() => useCombinacionesFavoritas(true))

      // then
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.combinaciones).toEqual([])
      expect(result.current.error).toBe('Error al obtener combinaciones')
    })
  })

  describe('Refetch manual', () => {
    it('debe permitir refetch manual de combinaciones', async () => {
      // given
      const mockCombinaciones = [
        { combinationUrl: 'combo1.jpg', esFavorita: true }
      ]
      favoritosService.obtenerCombinacionesFavoritas.mockResolvedValueOnce({
        content: mockCombinaciones
      })

      const { result } = renderHook(() => useCombinacionesFavoritas(false))

      // when
      await act(async () => {
        await result.current.refetch()
      })

      // then
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.combinaciones).toEqual(mockCombinaciones)
      expect(favoritosService.obtenerCombinacionesFavoritas).toHaveBeenCalledTimes(1)
    })
  })

  describe('Actualización local de favoritos', () => {
    it('debe actualizar el estado de favorito de una combinación', async () => {
      // given
      const mockCombinaciones = [
        { combinationUrl: 'combo1.jpg', esFavorita: true },
        { combinationUrl: 'combo2.jpg', esFavorita: true }
      ]
      favoritosService.obtenerCombinacionesFavoritas.mockResolvedValueOnce({
        content: mockCombinaciones
      })

      const { result } = renderHook(() => useCombinacionesFavoritas(true))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // when
      act(() => {
        result.current.actualizarFavoritoLocal('combo1.jpg', false)
      })

      // then
      expect(result.current.combinaciones).toEqual([
        { combinationUrl: 'combo1.jpg', esFavorita: false },
        { combinationUrl: 'combo2.jpg', esFavorita: true }
      ])
    })

    it('no debe modificar combinaciones que no coinciden', async () => {
      // given
      const mockCombinaciones = [
        { combinationUrl: 'combo1.jpg', esFavorita: true },
        { combinationUrl: 'combo2.jpg', esFavorita: true }
      ]
      favoritosService.obtenerCombinacionesFavoritas.mockResolvedValueOnce({
        content: mockCombinaciones
      })

      const { result } = renderHook(() => useCombinacionesFavoritas(true))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // when
      act(() => {
        result.current.actualizarFavoritoLocal('combo-inexistente.jpg', false)
      })

      // then
      expect(result.current.combinaciones).toEqual(mockCombinaciones)
    })
  })

  describe('Eliminación local de combinaciones', () => {
    it('debe eliminar una combinación del estado local', async () => {
      // given
      const mockCombinaciones = [
        { combinationUrl: 'combo1.jpg', esFavorita: true },
        { combinationUrl: 'combo2.jpg', esFavorita: true },
        { combinationUrl: 'combo3.jpg', esFavorita: true }
      ]
      favoritosService.obtenerCombinacionesFavoritas.mockResolvedValueOnce({
        content: mockCombinaciones
      })

      const { result } = renderHook(() => useCombinacionesFavoritas(true))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // when
      act(() => {
        result.current.eliminarCombinacionLocal('combo2.jpg')
      })

      // then
      expect(result.current.combinaciones).toEqual([
        { combinationUrl: 'combo1.jpg', esFavorita: true },
        { combinationUrl: 'combo3.jpg', esFavorita: true }
      ])
    })

    it('debe eliminar todas las instancias de una combinación', async () => {
      // given
      const mockCombinaciones = [
        { combinationUrl: 'combo1.jpg', esFavorita: true },
        { combinationUrl: 'combo2.jpg', esFavorita: true }
      ]
      favoritosService.obtenerCombinacionesFavoritas.mockResolvedValueOnce({
        content: mockCombinaciones
      })

      const { result } = renderHook(() => useCombinacionesFavoritas(true))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // when
      act(() => {
        result.current.eliminarCombinacionLocal('combo1.jpg')
      })

      // then
      expect(result.current.combinaciones).toEqual([
        { combinationUrl: 'combo2.jpg', esFavorita: true }
      ])
    })

    it('no debe hacer nada si la combinación no existe', async () => {
      // given
      const mockCombinaciones = [
        { combinationUrl: 'combo1.jpg', esFavorita: true }
      ]
      favoritosService.obtenerCombinacionesFavoritas.mockResolvedValueOnce({
        content: mockCombinaciones
      })

      const { result } = renderHook(() => useCombinacionesFavoritas(true))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // when
      act(() => {
        result.current.eliminarCombinacionLocal('combo-inexistente.jpg')
      })

      // then
      expect(result.current.combinaciones).toEqual(mockCombinaciones)
    })
  })
})
