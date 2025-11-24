import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signupService } from '../../../src/services/auth/signupService.js'
import apiClient from '../../../src/services/api.js'

vi.mock('../../../src/services/api.js', () => ({
  default: {
    post: vi.fn()
  }
}))

describe('signupService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('registro de usuario (USER)', () => {
    it('debe registrar usuario exitosamente', async () => {
      // given
      const userData = {
        email: 'newuser@example.com',
        name: 'New',
        lastName: 'User',
        password: 'password123'
      }
      const mockResponse = {
        message: 'Usuario registrado exitosamente',
        user: { email: 'newuser@example.com' }
      }
      apiClient.post.mockResolvedValueOnce({ data: mockResponse })

      // when
      const result = await signupService(userData, false)

      // then
      expect(apiClient.post).toHaveBeenCalledWith('/users/register', userData)
      expect(result).toEqual(mockResponse)
    })

    it('debe manejar error al registrar usuario', async () => {
      // given
      const userData = {
        email: 'existing@example.com',
        name: 'User',
        lastName: 'Test',
        password: 'password123'
      }
      const error = {
        response: {
          status: 400,
          data: { email: 'Email ya registrado' }
        }
      }
      apiClient.post.mockRejectedValueOnce(error)

      // when / then
      await expect(signupService(userData, false)).rejects.toMatchObject({
        response: { status: 400 }
      })
    })
  })

  describe('registro de usuario (BRAND)', () => {
    it('debe registrar marca exitosamente con FormData', async () => {
      // given
      const formData = new FormData()
      formData.append('email', 'brand@example.com')
      formData.append('name', 'Brand')
      formData.append('lastName', 'Company')
      formData.append('password', 'password123')
      formData.append('brandName', 'My Brand')
      formData.append('urlSite', 'https://mybrand.com')

      const mockResponse = {
        message: 'Marca registrada exitosamente',
        user: { email: 'brand@example.com', role: 'BRAND' }
      }
      apiClient.post.mockResolvedValueOnce({ data: mockResponse })

      // when
      const result = await signupService(formData, true)

      // then
      expect(apiClient.post).toHaveBeenCalledWith(
        '/users/register-brand',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(result).toEqual(mockResponse)
    })

    it('debe manejar error al registrar marca', async () => {
      // given
      const formData = new FormData()
      formData.append('email', 'brand@example.com')

      const error = {
        response: {
          status: 400,
          data: { message: 'Datos incompletos' }
        }
      }
      apiClient.post.mockRejectedValueOnce(error)

      // when / then
      await expect(signupService(formData, true)).rejects.toMatchObject({
        response: { status: 400 }
      })
    })
  })
})
