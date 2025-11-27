import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSubscription } from '../../../src/hooks/shared/useSubscription.jsx'
import { subscriptionService } from '../../../src/services/shared/subscriptionService.js'

// Mock del servicio
vi.mock('../../../src/services/shared/subscriptionService.js', () => ({
  subscriptionService: {
    getAllPlans: vi.fn(),
    getUserSubscription: vi.fn(),
    createSubscription: vi.fn()
  }
}))

// Mock de useAuth
vi.mock('../../../src/hooks/auth/useAuth.jsx', () => ({
  useAuth: vi.fn(() => ({
    user: { email: 'test@example.com', name: 'Test User', role: 'USER' }
  }))
}))

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
    delete window.location
    window.location = { href: '' }
  })

  it('debe cargar planes exitosamente', async () => {
    // given
    const backendPlans = [
      {
        plan_code: 'USER_BASIC',
        name: 'Plan Básico',
        price: 1000,
        currency: 'ARS',
        planType: 'USER',
        feature1: 'Feature 1',
        feature2: 'Feature 2'
      }
    ]
    subscriptionService.getAllPlans.mockResolvedValueOnce(backendPlans)
    subscriptionService.getUserSubscription.mockResolvedValueOnce(null)

    // when
    const { result } = renderHook(() => useSubscription())

    // then
    await waitFor(() => {
      expect(result.current.plans.length).toBeGreaterThan(0)
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('debe cargar suscripción del usuario', async () => {
    // given
    const mockSubscription = { planCode: 'USER_BASIC', status: 'ACTIVE' }
    subscriptionService.getAllPlans.mockResolvedValueOnce([])
    subscriptionService.getUserSubscription.mockResolvedValueOnce(mockSubscription)

    // when
    const { result } = renderHook(() => useSubscription())

    // then
    await waitFor(() => {
      expect(result.current.userSubscription).toEqual(mockSubscription)
    })
  })

  it('debe verificar si usuario tiene plan activo', async () => {
    // given
    const mockSubscription = { planCode: 'USER_BASIC', status: 'ACTIVE' }
    subscriptionService.getAllPlans.mockResolvedValueOnce([])
    subscriptionService.getUserSubscription.mockResolvedValueOnce(mockSubscription)

    const { result } = renderHook(() => useSubscription())

    await waitFor(() => {
      expect(result.current.userSubscription).toEqual(mockSubscription)
    })

    // when / then
    expect(result.current.hasActivePlan('USER_BASIC')).toBe(true)
    expect(result.current.hasActivePlan('USER_PREMIUM')).toBe(false)
  })

  it('debe crear suscripción exitosamente', async () => {
    // given
    const mockPlans = [
      {
        plan_code: 'USER_BASIC',
        name: 'Plan Básico',
        price: 1000,
        currency: 'ARS',
        planType: 'USER',
        feature1: 'Feature 1'
      }
    ]
    const mockInitPoint = 'https://mercadopago.com/checkout/123'

    subscriptionService.getAllPlans.mockResolvedValueOnce(mockPlans)
    subscriptionService.getUserSubscription.mockResolvedValueOnce(null)
    subscriptionService.createSubscription.mockResolvedValueOnce(mockInitPoint)

    const { result } = renderHook(() => useSubscription())

    await waitFor(() => {
      expect(result.current.plans.length).toBeGreaterThan(0)
    })

    // when
    await act(async () => {
      const planId = result.current.plans[0].id
      await result.current.subscribe(planId)
    })

    // then
    expect(subscriptionService.createSubscription).toHaveBeenCalled()
    expect(window.location.href).toBe(mockInitPoint)
  })

  it('debe manejar error al cargar planes', async () => {
    // given
    const error = new Error('Error al cargar planes')
    subscriptionService.getAllPlans.mockRejectedValueOnce(error)
    subscriptionService.getUserSubscription.mockResolvedValueOnce(null)

    // when
    const { result } = renderHook(() => useSubscription())

    // then
    await waitFor(() => {
      expect(result.current.error).toBe('Error al cargar planes')
    })
    expect(result.current.plans).toEqual([])
  })

})
