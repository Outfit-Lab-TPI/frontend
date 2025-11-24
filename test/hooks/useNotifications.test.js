import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useNotifications } from '../../src/hooks/useNotifications.jsx'
import { notificationService } from '../../src/services/notificationService.js'

// Mock del servicio
vi.mock('../../src/services/notificationService.js', () => ({
  notificationService: {
    getNotifications: vi.fn(),
    approveBrand: vi.fn()
  }
}))

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
  })

  it('debe cargar notificaciones al inicializar', async () => {
    // given
    const mockNotifications = [
      { id: 1, brand: { codigoMarca: 'NIKE', nombre: 'Nike' } },
      { id: 2, brand: { codigoMarca: 'ADIDAS', nombre: 'Adidas' } }
    ]
    notificationService.getNotifications.mockResolvedValueOnce(mockNotifications)

    // when
    const { result } = renderHook(() => useNotifications())

    // then
    await waitFor(() => {
      expect(result.current.notifications).toEqual(mockNotifications)
    })
    expect(notificationService.getNotifications).toHaveBeenCalledTimes(1)
  })

  it('debe manejar error al cargar notificaciones', async () => {
    // given
    const error = new Error('Network error')
    notificationService.getNotifications.mockRejectedValueOnce(error)

    // when
    const { result } = renderHook(() => useNotifications())

    // then
    await waitFor(() => {
      expect(result.current.notifications).toEqual([])
    })
    expect(console.error).toHaveBeenCalledWith('Network error')
  })

  it('debe aprobar marca exitosamente', async () => {
    // given
    const mockNotifications = [
      { id: 1, brand: { codigoMarca: 'NIKE', nombre: 'Nike' } },
      { id: 2, brand: { codigoMarca: 'ADIDAS', nombre: 'Adidas' } }
    ]
    notificationService.getNotifications.mockResolvedValue(mockNotifications)
    notificationService.approveBrand.mockResolvedValueOnce({ success: true })

    const { result } = renderHook(() => useNotifications())

    await waitFor(() => {
      expect(result.current.notifications).toEqual(mockNotifications)
    })

    // when
    await act(async () => {
      await result.current.approveBrand('NIKE')
    })

    // then
    expect(notificationService.approveBrand).toHaveBeenCalledWith('NIKE')
    expect(notificationService.getNotifications).toHaveBeenCalledTimes(2) // inicial + refresh
  })

  it('debe manejar error al aprobar marca', async () => {
    // given
    const mockNotifications = [{ id: 1, brand: { codigoMarca: 'NIKE' } }]
    notificationService.getNotifications.mockResolvedValueOnce(mockNotifications)
    notificationService.approveBrand.mockRejectedValueOnce(new Error('Approval failed'))

    const { result } = renderHook(() => useNotifications())

    await waitFor(() => {
      expect(result.current.notifications).toEqual(mockNotifications)
    })

    // when
    await act(async () => {
      await result.current.approveBrand('NIKE')
    })

    // then
    expect(console.error).toHaveBeenCalledWith('Approval failed')
  })

})
