import { describe, it, expect, vi, beforeEach } from 'vitest'
import { refreshToken } from '../../../src/services/auth/refreshTokenService.js'
import axios from 'axios'

vi.mock('axios')

describe('refreshTokenService', () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe refrescar token exitosamente', async () => {
    // given
    const mockRefreshToken = 'old-refresh-token-123'
    const mockResponse = {
      access_token: 'new-access-token-456',
      refresh_token: 'new-refresh-token-789',
      user: { email: 'test@example.com', name: 'Test User' }
    }
    axios.post.mockResolvedValueOnce({ data: mockResponse })

    // when
    const result = await refreshToken(mockRefreshToken)

    // then
    expect(axios.post).toHaveBeenCalledWith(
      `${API_BASE_URL}/users/refresh-token`,
      { refresh_token: mockRefreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    )
    expect(result).toEqual(mockResponse)
  })

  it('debe manejar error cuando el refresh token es inválido', async () => {
    // given
    const mockRefreshToken = 'invalid-token'
    const error = {
      response: {
        status: 401,
        data: { message: 'Token inválido o expirado' }
      }
    }
    axios.post.mockRejectedValueOnce(error)

    // when / then
    await expect(refreshToken(mockRefreshToken)).rejects.toMatchObject({
      response: { status: 401 }
    })
  })

  it('debe manejar error de timeout', async () => {
    // given
    const mockRefreshToken = 'some-token'
    const error = {
      code: 'ECONNABORTED',
      message: 'timeout of 10000ms exceeded'
    }
    axios.post.mockRejectedValueOnce(error)

    // when / then
    await expect(refreshToken(mockRefreshToken)).rejects.toMatchObject({
      code: 'ECONNABORTED'
    })
  })

  it('debe manejar error de red', async () => {
    // given
    const mockRefreshToken = 'some-token'
    const error = new Error('Network Error')
    axios.post.mockRejectedValueOnce(error)

    // when / then
    await expect(refreshToken(mockRefreshToken)).rejects.toThrow('Network Error')
  })
})
