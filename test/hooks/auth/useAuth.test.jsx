import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuth } from '../../../src/hooks/auth/useAuth.jsx'
import { AuthContext } from '../../../src/context/AuthContext.jsx'

describe('useAuth', () => {
  it('debe retornar el contexto cuando está dentro de AuthProvider', () => {
    // given
    const mockContextValue = {
      user: { email: 'test@example.com', name: 'Test User', roles: 'USER' },
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      isLoading: false
    }

    const wrapper = ({ children }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    )

    // when
    const { result } = renderHook(() => useAuth(), { wrapper })

    // then
    expect(result.current).toEqual(mockContextValue)
  })

  it('debe lanzar error cuando se usa fuera de AuthProvider', () => {
    // given
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // when / then
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth debe usarse dentro de AuthProvider')

    consoleError.mockRestore()
  })
})
