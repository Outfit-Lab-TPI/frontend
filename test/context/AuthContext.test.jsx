import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, AuthContext } from '../../src/context/AuthContext.jsx'
import { useContext } from 'react'

describe('AuthContext', () => {
  let mockSessionStorage

  beforeEach(() => {
    // Mock sessionStorage
    mockSessionStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
    global.sessionStorage = mockSessionStorage

    // Mock window.location
    delete window.location
    window.location = { href: '' }

    // Mock window.addEventListener/removeEventListener
    global.addEventListener = vi.fn()
    global.removeEventListener = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const useAuth = () => useContext(AuthContext)

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

  describe('AuthProvider initialization', () => {
    it('debe inicializar con usuario null cuando no hay datos en sessionStorage', async () => {
      // given
      mockSessionStorage.getItem.mockReturnValue(null)

      // when
      const { result } = renderHook(() => useAuth(), { wrapper })

      // then
      await waitFor(() => {
        expect(result.current.user).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('debe cargar usuario desde sessionStorage al iniciar', async () => {
      // given
      const storedUser = { email: 'test@example.com', name: 'Test User', role: 'USER' }
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(storedUser))

      // when
      const { result } = renderHook(() => useAuth(), { wrapper })

      // then
      await waitFor(() => {
        expect(result.current.user).toEqual(storedUser)
        expect(result.current.isAuthenticated).toBe(true)
      })
    })

    it('debe manejar JSON inválido en sessionStorage', async () => {
      // given
      mockSessionStorage.getItem.mockReturnValue('invalid-json')
      console.error = vi.fn()

      // when
      const { result } = renderHook(() => useAuth(), { wrapper })

      // then
      await waitFor(() => {
        expect(result.current.user).toBeNull()
        expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('outfitlab-user')
      })
    })
  })

  describe('login', () => {
    it('debe guardar usuario y tokens al hacer login', async () => {
      // given
      const { result } = renderHook(() => useAuth(), { wrapper })

      const userData = {
        access_token: 'token123',
        refresh_token: 'refresh123',
        user: {
          email: 'user@example.com',
          name: 'User',
          role: 'USER'
        }
      }

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // when
      act(() => {
        result.current.login(userData)
      })

      // then
      expect(result.current.user).toEqual(userData.user)
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('access_token', 'token123')
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('refresh_token', 'refresh123')
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'outfitlab-user',
        JSON.stringify(userData.user)
      )
    })
  })

  describe('logout', () => {
    it('debe limpiar usuario y tokens al hacer logout', async () => {
      // given
      mockSessionStorage.getItem.mockReturnValue(
        JSON.stringify({ email: 'test@example.com', name: 'Test', role: 'USER' })
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.user).toBeTruthy()
      })

      const mockNavigate = vi.fn()

      // when
      act(() => {
        result.current.logout(mockNavigate)
      })

      // then
      expect(result.current.user).toBeNull()
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('outfitlab-user')
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('access_token')
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('refresh_token')
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  describe('updateUser', () => {
    it('debe actualizar datos del usuario', async () => {
      // given
      const initialUser = { email: 'test@example.com', name: 'Test', role: 'USER' }
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(initialUser))

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.user).toEqual(initialUser)
      })

      // when
      act(() => {
        result.current.updateUser({ name: 'Updated Name' })
      })

      // then
      expect(result.current.user.name).toBe('Updated Name')
      expect(result.current.user.email).toBe('test@example.com')
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'outfitlab-user',
        JSON.stringify({ ...initialUser, name: 'Updated Name' })
      )
    })
  })

  describe('updateUserSubscription', () => {
    it('debe actualizar suscripción del usuario', async () => {
      // given
      const initialUser = { email: 'test@example.com', name: 'Test', role: 'USER' }
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(initialUser))

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.user).toEqual(initialUser)
      })

      const subscriptionData = { planCode: 'USER_PRO', status: 'ACTIVE' }

      // when
      act(() => {
        result.current.updateUserSubscription(subscriptionData)
      })

      // then
      expect(result.current.user.subscription).toEqual(subscriptionData)
    })
  })

  describe('refreshAuth', () => {
    it('debe refrescar tokens y usuario', async () => {
      // given
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const tokenData = {
        access_token: 'new_token',
        refresh_token: 'new_refresh',
        user: {
          email: 'refresh@example.com',
          name: 'Refreshed',
          role: 'USER'
        }
      }

      // when
      act(() => {
        result.current.refreshAuth(tokenData)
      })

      // then
      expect(result.current.user).toEqual(tokenData.user)
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('access_token', 'new_token')
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('refresh_token', 'new_refresh')
    })
  })

  describe('role checks', () => {
    it('debe identificar usuario ADMIN', async () => {
      // given
      const adminUser = { email: 'admin@example.com', name: 'Admin', role: 'ADMIN' }
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(adminUser))

      // when
      const { result } = renderHook(() => useAuth(), { wrapper })

      // then
      await waitFor(() => {
        expect(result.current.isAdmin).toBe(true)
        expect(result.current.isBrand).toBe(false)
        expect(result.current.isUser).toBe(false)
      })
    })

    it('debe identificar usuario BRAND', async () => {
      // given
      const brandUser = { email: 'brand@example.com', name: 'Brand', role: 'BRAND' }
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(brandUser))

      // when
      const { result } = renderHook(() => useAuth(), { wrapper })

      // then
      await waitFor(() => {
        expect(result.current.isAdmin).toBe(false)
        expect(result.current.isBrand).toBe(true)
        expect(result.current.isUser).toBe(false)
      })
    })

    it('debe identificar usuario USER', async () => {
      // given
      const regularUser = { email: 'user@example.com', name: 'User', role: 'USER' }
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(regularUser))

      // when
      const { result } = renderHook(() => useAuth(), { wrapper })

      // then
      await waitFor(() => {
        expect(result.current.isAdmin).toBe(false)
        expect(result.current.isBrand).toBe(false)
        expect(result.current.isUser).toBe(true)
      })
    })
  })
})
