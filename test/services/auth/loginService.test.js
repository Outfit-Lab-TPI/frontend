import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginService } from '../../../src/services/auth/loginService.js'
import apiClient from '../../../src/services/api.js'

vi.mock('../../../src/services/api.js', () => ({
  default: {
    post: vi.fn()
  }
}))

describe('loginService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
  })

  it('debe hacer login exitosamente', async () => {
    // given
    const mockResponse = {
      user: { email: 'test@example.com', name: 'Test User', role: 'USER' },
      token: 'mock-token-123'
    }
    apiClient.post.mockResolvedValueOnce({ data: mockResponse })

    // when
    const result = await loginService('test@example.com', 'password123')

    // then
    expect(apiClient.post).toHaveBeenCalledWith('/users/login', {
      email: 'test@example.com',
      password: 'password123'
    })
    expect(result).toEqual(mockResponse)
  })

  it('debe manejar error de credenciales incorrectas', async () => {
    // given
    const error = {
      response: {
        status: 401,
        data: { message: 'Credenciales incorrectas' }
      }
    }
    apiClient.post.mockRejectedValueOnce(error)

    // when / then
    await expect(
      loginService('wrong@example.com', 'wrongpassword')
    ).rejects.toMatchObject({
      response: { status: 401 }
    })
    expect(console.error).toHaveBeenCalled()
  })

  it('debe manejar error de red', async () => {
    // given
    const error = new Error('Network error')
    apiClient.post.mockRejectedValueOnce(error)

    // when / then
    await expect(
      loginService('test@example.com', 'password123')
    ).rejects.toThrow('Network error')
    expect(console.error).toHaveBeenCalled()
  })
})
