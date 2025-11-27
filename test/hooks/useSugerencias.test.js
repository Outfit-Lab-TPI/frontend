import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSugerencias } from '../../src/hooks/useSugerencias.jsx'
import { sugerenciasService } from '../../src/services/sugerenciasService.js'

// Mock del servicio
vi.mock('../../src/services/sugerenciasService.js', () => ({
  sugerenciasService: {
    getSugerencias: vi.fn()
  }
}))

describe('useSugerencias', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('debe tener estados iniciales correctos', () => {
      // given / when
      const { result } = renderHook(() => useSugerencias())

      // then
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.sugerencias).toBe(null)
      expect(typeof result.current.obtenerSugerencias).toBe('function')
      expect(typeof result.current.limpiarSugerencias).toBe('function')
      expect(typeof result.current.limpiarError).toBe('function')
    })
  })

  describe('obtenerSugerencias', () => {
    it('debe obtener sugerencias exitosamente', async () => {
      // given
      const mockResponse = {
        data: {
          recomendations: [
            { garmentCode: 'REC001', name: 'Pantalón recomendado', score: 0.95 },
            { garmentCode: 'REC002', name: 'Zapatos recomendados', score: 0.88 }
          ]
        }
      }
      sugerenciasService.getSugerencias.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useSugerencias())

      // when
      let response
      await act(async () => {
        response = await result.current.obtenerSugerencias('GAR123')
      })

      // then
      expect(sugerenciasService.getSugerencias).toHaveBeenCalledWith('GAR123')
      expect(response).toEqual(mockResponse.data)
      expect(result.current.sugerencias).toEqual(mockResponse.data)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('debe manejar error 404 con mensaje personalizado', async () => {
      // given
      const error = new Error('Not Found')
      error.response = { status: 404 }
      sugerenciasService.getSugerencias.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useSugerencias())

      // when / then
      await act(async () => {
        await expect(result.current.obtenerSugerencias('GAR123'))
          .rejects.toThrow('Not Found')
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('No se encontraron sugerencias para esta prenda')
      expect(result.current.sugerencias).toBe(null)
    })

    it('debe manejar errores del servidor (5xx) con mensaje personalizado', async () => {
      // given
      const error = new Error('Internal Server Error')
      error.response = { status: 500 }
      sugerenciasService.getSugerencias.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useSugerencias())

      // when / then
      await act(async () => {
        await expect(result.current.obtenerSugerencias('GAR123'))
          .rejects.toThrow('Internal Server Error')
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Error del servidor. Intenta de nuevo más tarde')
      expect(result.current.sugerencias).toBe(null)
    })

    it('debe manejar otros errores con mensaje genérico', async () => {
      // given
      const error = new Error('Generic Error')
      error.response = { status: 400 }
      sugerenciasService.getSugerencias.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useSugerencias())

      // when / then
      await act(async () => {
        await expect(result.current.obtenerSugerencias('GAR123'))
          .rejects.toThrow('Generic Error')
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Error al obtener sugerencias')
      expect(result.current.sugerencias).toBe(null)
    })

    it('debe mostrar loading durante la operación', async () => {
      // given
      let resolvePromise
      sugerenciasService.getSugerencias.mockImplementation(
        () => new Promise(resolve => { resolvePromise = resolve })
      )

      const { result } = renderHook(() => useSugerencias())

      // when
      act(() => {
        result.current.obtenerSugerencias('GAR123')
      })

      // then
      expect(result.current.loading).toBe(true)
      expect(result.current.sugerencias).toBe(null)

      await act(async () => {
        resolvePromise({ data: { recomendations: [] } })
      })

      expect(result.current.loading).toBe(false)
    })

    it('debe limpiar sugerencias anterior al hacer nueva consulta', async () => {
      // given
      const firstResponse = { data: { recomendations: [{ garmentCode: 'OLD001' }] } }
      sugerenciasService.getSugerencias.mockResolvedValueOnce(firstResponse)

      const { result } = renderHook(() => useSugerencias())

      await act(async () => {
        await result.current.obtenerSugerencias('GAR123')
      })

      expect(result.current.sugerencias).toEqual(firstResponse.data)

      // when
      const secondResponse = { data: { recomendations: [{ garmentCode: 'NEW001' }] } }
      sugerenciasService.getSugerencias.mockResolvedValueOnce(secondResponse)

      await act(async () => {
        await result.current.obtenerSugerencias('GAR456')
      })

      // then
      expect(result.current.sugerencias).toEqual(secondResponse.data)
    })
  })

  describe('limpiarSugerencias', () => {
    it('debe limpiar sugerencias y error', async () => {
      // given
      const mockResponse = { data: { recomendations: [{ garmentCode: 'REC001' }] } }
      sugerenciasService.getSugerencias.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useSugerencias())

      await act(async () => {
        await result.current.obtenerSugerencias('GAR123')
      })

      expect(result.current.sugerencias).toEqual(mockResponse.data)

      // when
      act(() => {
        result.current.limpiarSugerencias()
      })

      // then
      expect(result.current.sugerencias).toBe(null)
      expect(result.current.error).toBe(null)
    })

    it('debe limpiar error sin afectar estado de loading', async () => {
      // given
      const error = new Error('Test error')
      sugerenciasService.getSugerencias.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useSugerencias())

      await act(async () => {
        try {
          await result.current.obtenerSugerencias('GAR123')
        } catch (e) {
          // Ignorar el error
        }
      })

      expect(result.current.error).toBe('Error al obtener sugerencias')
      expect(result.current.loading).toBe(false)

      // when
      act(() => {
        result.current.limpiarSugerencias()
      })

      // then
      expect(result.current.sugerencias).toBe(null)
      expect(result.current.error).toBe(null)
      expect(result.current.loading).toBe(false)
    })
  })
})