import { describe, it, expect, vi, beforeEach } from 'vitest'
import { notificationService } from '../../src/services/notificationService.js'
import apiClient from '../../src/services/api.js'

vi.mock('../../src/services/api.js', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn()
  }
}))

describe('notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getNotifications', () => {
    it('debe obtener notificaciones exitosamente', async () => {
      // given
      const mockNotifications = [
        { id: 1, brand: { codigoMarca: 'NIKE', nombre: 'Nike' } },
        { id: 2, brand: { codigoMarca: 'ADIDAS', nombre: 'Adidas' } }
      ]
      apiClient.get.mockResolvedValueOnce({
        data: { notifications: mockNotifications }
      })

      // when
      const result = await notificationService.getNotifications()

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/marcas/notifications-new-brands')
      expect(result).toEqual(mockNotifications)
    })

    it('debe retornar array vacío si notifications es null', async () => {
      // given
      apiClient.get.mockResolvedValueOnce({
        data: { notifications: null }
      })

      // when
      const result = await notificationService.getNotifications()

      // then
      expect(result).toEqual([])
    })

    it('debe manejar error al obtener notificaciones', async () => {
      // given
      const error = {
        response: {
          data: { message: 'Error del servidor' }
        }
      }
      apiClient.get.mockRejectedValueOnce(error)

      // when / then
      await expect(notificationService.getNotifications()).rejects.toThrow('Error del servidor')
    })

  })

  describe('approveBrand', () => {
    it('debe aprobar marca exitosamente', async () => {
      // given
      const mockResponse = { success: true, message: 'Marca aprobada' }
      apiClient.patch.mockResolvedValueOnce({ data: mockResponse })

      // when
      const result = await notificationService.approveBrand('NIKE')

      // then
      expect(apiClient.patch).toHaveBeenCalledWith('/marcas/activate/NIKE')
      expect(result).toEqual(mockResponse)
    })

    it('debe manejar error al aprobar marca', async () => {
      // given
      const error = {
        response: {
          data: { message: 'Marca no encontrada' }
        }
      }
      apiClient.patch.mockRejectedValueOnce(error)

      // when / then
      await expect(notificationService.approveBrand('INVALID')).rejects.toThrow('Marca no encontrada')
    })
  })
})
