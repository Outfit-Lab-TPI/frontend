import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRecomendacionAI } from '../../src/hooks/useRecomendacionAI.jsx'
import { sugerenciasIAService } from '../../src/services/sugerenciasIAService'

// Mock del servicio
vi.mock('../../src/services/sugerenciasIAService', () => ({
  sugerenciasIAService: {
    obtenerCategoriasRecomendacion: vi.fn(),
    obtenerRecomendacionesPorTexto: vi.fn()
  }
}))

describe('useRecomendacionAI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
    console.log = vi.fn()
  })

  it('debe cargar categorías al inicializar', async () => {
    // given
    const mockCategories = ['Casual', 'Formal', 'Deportivo']
    sugerenciasIAService.obtenerCategoriasRecomendacion.mockResolvedValueOnce(mockCategories)

    // when
    const { result } = renderHook(() => useRecomendacionAI('user123'))

    // then
    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories)
    })
    expect(result.current.loadingCategories).toBe(false)
  })

  it('debe manejar error al cargar categorías', async () => {
    // given
    const error = new Error('Failed to load categories')
    sugerenciasIAService.obtenerCategoriasRecomendacion.mockRejectedValueOnce(error)

    // when
    const { result } = renderHook(() => useRecomendacionAI('user123'))

    // then
    await waitFor(() => {
      expect(result.current.errorAI).toBe('Fallo al cargar categorías. El chat podría no ser preciso.')
    })
    expect(result.current.loadingCategories).toBe(false)
  })

  it('debe solicitar recomendación exitosamente', async () => {
    // given
    const mockCategories = ['Casual']
    const mockRecommendations = [
      { id: 1, nombre: 'Camisa' },
      { id: 2, nombre: 'Pantalón' }
    ]
    sugerenciasIAService.obtenerCategoriasRecomendacion.mockResolvedValueOnce(mockCategories)
    sugerenciasIAService.obtenerRecomendacionesPorTexto.mockResolvedValueOnce(mockRecommendations)

    const { result } = renderHook(() => useRecomendacionAI('user123'))

    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories)
    })

    // when
    let recommendations
    await act(async () => {
      recommendations = await result.current.solicitarRecomendacionAI('Quiero ropa casual')
    })

    // then
    expect(sugerenciasIAService.obtenerRecomendacionesPorTexto).toHaveBeenCalledWith(
      'user123',
      'Quiero ropa casual'
    )
    expect(recommendations).toEqual(mockRecommendations)
    expect(result.current.recommendations).toEqual(mockRecommendations)
    expect(result.current.loadingAI).toBe(false)
  })

  it('no debe solicitar recomendación con texto vacío', async () => {
    // given
    sugerenciasIAService.obtenerCategoriasRecomendacion.mockResolvedValueOnce([])

    const { result } = renderHook(() => useRecomendacionAI('user123'))

    // when
    await act(async () => {
      await result.current.solicitarRecomendacionAI('   ')
    })

    // then
    expect(sugerenciasIAService.obtenerRecomendacionesPorTexto).not.toHaveBeenCalled()
  })

  it('debe manejar error al solicitar recomendación', async () => {
    // given
    const error = new Error('AI service failed')
    sugerenciasIAService.obtenerCategoriasRecomendacion.mockResolvedValueOnce([])
    sugerenciasIAService.obtenerRecomendacionesPorTexto.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useRecomendacionAI('user123'))

    // when
    await act(async () => {
      await result.current.solicitarRecomendacionAI('test')
    })

    // then
    expect(result.current.errorAI).toBe('AI service failed')
    expect(result.current.loadingAI).toBe(false)
  })

  it('debe limpiar recomendaciones', async () => {
    // given
    const mockCategories = ['Casual']
    const mockRecommendations = [{ id: 1, nombre: 'Camisa' }]
    sugerenciasIAService.obtenerCategoriasRecomendacion.mockResolvedValueOnce(mockCategories)
    sugerenciasIAService.obtenerRecomendacionesPorTexto.mockResolvedValueOnce(mockRecommendations)

    const { result } = renderHook(() => useRecomendacionAI('user123'))

    await act(async () => {
      await result.current.solicitarRecomendacionAI('test')
    })

    expect(result.current.recommendations).toEqual(mockRecommendations)

    // when
    act(() => {
      result.current.limpiarRecomendaciones()
    })

    // then
    expect(result.current.recommendations).toBe(null)
  })
})
