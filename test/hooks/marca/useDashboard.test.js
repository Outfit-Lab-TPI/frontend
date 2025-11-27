import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import {
  useTopPrendas,
  useActividadPorDias,
  useTopCombos,
  useColorConversion
} from '../../../src/hooks/marca/useDashboard.jsx'
import apiClient from '../../../src/services/api.js'

vi.mock('../../../src/services/api.js', () => ({
  default: {
    get: vi.fn()
  }
}))

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useTopPrendas', () => {
    it('debe cargar top prendas exitosamente', async () => {
      // given
      const mockData = [
        { id: 1, nombre: 'Prenda 1', usos: 100 },
        { id: 2, nombre: 'Prenda 2', usos: 80 }
      ]
      apiClient.get.mockResolvedValueOnce({ data: mockData })

      // when
      const { result } = renderHook(() => useTopPrendas(5, 'BRAND123'))

      // then
      await waitFor(() => {
        expect(result.current.data).toEqual(mockData)
      })
      expect(apiClient.get).toHaveBeenCalledWith('/dashboard/top-prendas', {
        params: { topN: 5, brandCode: 'BRAND123' }
      })
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('debe manejar error al cargar top prendas', async () => {
      // given
      const error = {
        response: { data: { message: 'Error del servidor' } }
      }
      apiClient.get.mockRejectedValueOnce(error)

      // when
      const { result } = renderHook(() => useTopPrendas())

      // then
      await waitFor(() => {
        expect(result.current.error).toBe('Error del servidor')
      })
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual([])
    })
  })

  describe('useActividadPorDias', () => {
    it('debe cargar actividad por días exitosamente', async () => {
      // given
      const mockData = [
        { dia: '2024-01-01', actividad: 50 },
        { dia: '2024-01-02', actividad: 75 }
      ]
      apiClient.get.mockResolvedValueOnce({ data: mockData })

      // when
      const { result } = renderHook(() => useActividadPorDias())

      // then
      await waitFor(() => {
        expect(result.current.data).toEqual(mockData)
      })
      expect(apiClient.get).toHaveBeenCalledWith('/dashboard/actividad-por-dias')
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('debe manejar error al cargar actividad', async () => {
      // given
      const error = new Error('Network error')
      apiClient.get.mockRejectedValueOnce(error)

      // when
      const { result } = renderHook(() => useActividadPorDias())

      // then
      await waitFor(() => {
        expect(result.current.error).toBe('Network error')
      })
      expect(result.current.loading).toBe(false)
    })
  })

  describe('useTopCombos', () => {
    it('debe cargar top combos exitosamente', async () => {
      // given
      const mockData = [
        { id: 1, combo: 'Combo 1', popularidad: 100 },
        { id: 2, combo: 'Combo 2', popularidad: 90 }
      ]
      apiClient.get.mockResolvedValueOnce({ data: mockData })

      // when
      const { result } = renderHook(() => useTopCombos(10, 'BRAND456'))

      // then
      await waitFor(() => {
        expect(result.current.data).toEqual(mockData)
      })
      expect(apiClient.get).toHaveBeenCalledWith('/dashboard/top-combos', {
        params: { topN: 10, brandCode: 'BRAND456' }
      })
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('debe manejar error al cargar top combos', async () => {
      // given
      const error = {
        response: { data: { message: 'Error al cargar combos' } }
      }
      apiClient.get.mockRejectedValueOnce(error)

      // when
      const { result } = renderHook(() => useTopCombos())

      // then
      await waitFor(() => {
        expect(result.current.error).toBe('Error al cargar combos')
      })
      expect(result.current.loading).toBe(false)
    })
  })

  describe('useColorConversion', () => {
    it('debe cargar color conversion exitosamente', async () => {
      // given
      const mockData = [
        { color: 'Rojo', conversion: 45 },
        { color: 'Azul', conversion: 30 }
      ]
      apiClient.get.mockResolvedValueOnce({ data: mockData })

      // when
      const { result } = renderHook(() => useColorConversion())

      // then
      await waitFor(() => {
        expect(result.current.data).toEqual(mockData)
      })
      expect(apiClient.get).toHaveBeenCalledWith('/dashboard/color-conversion', {
        params: { brandCode: '' }
      })
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('debe manejar error al cargar color conversion', async () => {
      // given
      const error = new Error('Failed to fetch')
      apiClient.get.mockRejectedValueOnce(error)

      // when
      const { result } = renderHook(() => useColorConversion())

      // then
      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch')
      })
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual([])
    })
  })
})
