import { describe, it, expect, vi, beforeEach } from 'vitest'
import { subscriptionService } from '../../src/services/subscriptionService.js'
import apiClient from '../../src/services/api.js'

vi.mock('../../src/services/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

describe('subscriptionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllPlans', () => {
    it('debe obtener planes exitosamente', async () => {
      // given
      const mockPlans = [
        { plan_code: 'USER_BASIC', name: 'Básico', price: 1000 },
        { plan_code: 'USER_PRO', name: 'Pro', price: 2000 }
      ]
      apiClient.get.mockResolvedValueOnce({ data: { data: mockPlans } })

      // when
      const result = await subscriptionService.getAllPlans('user@test.com')

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/mp/subscriptions', {
        params: { email: 'user@test.com' }
      })
      expect(result).toEqual(mockPlans)
    })

    it('debe retornar array vacío si data es null', async () => {
      // given
      apiClient.get.mockResolvedValueOnce({ data: null })

      // when
      const result = await subscriptionService.getAllPlans()

      // then
      expect(result).toEqual([])
    })

    it('debe manejar error al obtener planes', async () => {
      // given
      const error = {
        response: {
          data: { error: 'Error del servidor' }
        }
      }
      apiClient.get.mockRejectedValueOnce(error)

      // when / then
      await expect(subscriptionService.getAllPlans()).rejects.toThrow('Error del servidor')
    })
  })

  describe('getUserSubscription', () => {
    it('debe obtener suscripción del usuario exitosamente', async () => {
      // given
      const mockSubscription = {
        planCode: 'USER_BASIC',
        status: 'ACTIVE'
      }
      apiClient.get.mockResolvedValueOnce({ data: mockSubscription })

      // when
      const result = await subscriptionService.getUserSubscription('user@test.com')

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/mp/user-subscription', {
        params: { email: 'user@test.com' }
      })
      expect(result).toEqual(mockSubscription)
    })

    it('debe retornar null si usuario no tiene suscripción', async () => {
      // given
      const error = { response: { status: 404 } }
      apiClient.get.mockRejectedValueOnce(error)

      // when
      const result = await subscriptionService.getUserSubscription('user@test.com')

      // then
      expect(result).toBe(null)
    })
  })

  describe('createSubscription', () => {
    it('debe crear suscripción exitosamente', async () => {
      // given
      const mockInitPoint = 'https://mercadopago.com/checkout/123'
      apiClient.post.mockResolvedValueOnce({ data: { initPoint: mockInitPoint } })

      // when
      const result = await subscriptionService.createSubscription(
        'USER_PRO',
        'user@test.com',
        2000,
        'ARS'
      )

      // then
      expect(apiClient.post).toHaveBeenCalledWith('/mp/crear-suscripcion', {
        planId: 'USER_PRO',
        userEmail: 'user@test.com',
        price: 2000,
        currency: 'ARS'
      })
      expect(result).toBe(mockInitPoint)
    })

    it('debe manejar error al crear suscripción', async () => {
      // given
      const error = {
        response: {
          data: { error: 'Error al crear preferencia' }
        }
      }
      apiClient.post.mockRejectedValueOnce(error)

      // when / then
      await expect(
        subscriptionService.createSubscription('USER_PRO', 'user@test.com', 2000, 'ARS')
      ).rejects.toThrow('Error al crear preferencia')
    })
  })
})
