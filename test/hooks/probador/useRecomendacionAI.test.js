import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRecomendacionAI } from '../../../src/hooks/probador/useRecomendacionAI.jsx'
import { sugerenciasIAService } from '../../../src/services/probador/sugerenciasIAService.js'

// Mock del servicio
vi.mock('../../../src/services/probador/sugerenciasIAService', () => ({
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

  describe('estado inicial', () => {
    it('debe inicializar con valores por defecto', () => {
      // when
      const { result } = renderHook(() => useRecomendacionAI('user123'))

      // then
      expect(result.current.categories).toBe(null)
      expect(result.current.loadingCategories).toBe(false)
      expect(result.current.recommendations).toBe(null)
      expect(result.current.loadingAI).toBe(false)
      expect(result.current.errorAI).toBe(null)
      expect(result.current.conversationHistory).toEqual([])
    })
  })

  describe('solicitarRecomendacionAI', () => {
    it('debe solicitar recomendación exitosamente y actualizar historial', async () => {
      // given
      const mockRecommendations = [
        { id: 1, nombre: 'Camisa' },
        { id: 2, nombre: 'Pantalón' }
      ]
      sugerenciasIAService.obtenerRecomendacionesPorTexto.mockResolvedValueOnce(mockRecommendations)

      const { result } = renderHook(() => useRecomendacionAI('user123'))

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
      expect(result.current.errorAI).toBe(null)

      // Verificar historial de conversación
      expect(result.current.conversationHistory).toHaveLength(2)
      expect(result.current.conversationHistory[0]).toMatchObject({
        role: 'user',
        content: 'Quiero ropa casual'
      })
      expect(result.current.conversationHistory[1]).toMatchObject({
        role: 'ai',
        content: mockRecommendations,
        originalQuery: 'Quiero ropa casual'
      })
    })

    it('no debe solicitar recomendación con texto vacío', async () => {
      // given
      const { result } = renderHook(() => useRecomendacionAI('user123'))

      // when
      await act(async () => {
        await result.current.solicitarRecomendacionAI('   ')
      })

      // then
      expect(sugerenciasIAService.obtenerRecomendacionesPorTexto).not.toHaveBeenCalled()
      expect(result.current.conversationHistory).toHaveLength(0)
    })

    it('debe limpiar recommendations y errorAI antes de nueva solicitud', async () => {
      // given
      const mockRecommendations = [{ id: 1, nombre: 'Camisa' }]
      sugerenciasIAService.obtenerRecomendacionesPorTexto
        .mockResolvedValueOnce(mockRecommendations)
        .mockResolvedValueOnce([{ id: 2, nombre: 'Pantalón' }])

      const { result } = renderHook(() => useRecomendacionAI('user123'))

      // when - primera solicitud
      await act(async () => {
        await result.current.solicitarRecomendacionAI('primera consulta')
      })

      expect(result.current.recommendations).toEqual(mockRecommendations)

      // when - segunda solicitud
      await act(async () => {
        await result.current.solicitarRecomendacionAI('segunda consulta')
      })

      // then
      expect(result.current.recommendations).toEqual([{ id: 2, nombre: 'Pantalón' }])
      expect(result.current.conversationHistory).toHaveLength(4) // 2 user + 2 ai
    })

    it('debe agregar el mensaje del usuario al historial', async () => {
      // given
      let resolvePromise
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      sugerenciasIAService.obtenerRecomendacionesPorTexto.mockReturnValueOnce(promise)

      const { result } = renderHook(() => useRecomendacionAI('user123'))

      // when - iniciar solicitud sin esperar
      act(() => {
        result.current.solicitarRecomendacionAI('test')
      })

      // then - el mensaje del usuario debe estar en el historial inmediatamente
      await waitFor(() => {
        expect(result.current.conversationHistory).toHaveLength(1)
        expect(result.current.conversationHistory[0]).toMatchObject({
          role: 'user',
          content: 'test'
        })
      })

      // cleanup
      await act(async () => {
        resolvePromise([])
        await promise
      })
    })
  })

  describe('limpiarRecomendaciones', () => {
    it('debe limpiar recomendaciones pero mantener historial', async () => {
      // given
      const mockRecommendations = [{ id: 1, nombre: 'Camisa' }]
      sugerenciasIAService.obtenerRecomendacionesPorTexto.mockResolvedValueOnce(mockRecommendations)

      const { result } = renderHook(() => useRecomendacionAI('user123'))

      await act(async () => {
        await result.current.solicitarRecomendacionAI('test')
      })

      expect(result.current.recommendations).toEqual(mockRecommendations)
      expect(result.current.conversationHistory).toHaveLength(2)

      // when
      act(() => {
        result.current.limpiarRecomendaciones()
      })

      // then
      expect(result.current.recommendations).toBe(null)
      expect(result.current.conversationHistory).toHaveLength(2) // Se mantiene el historial
    })
  })

})
