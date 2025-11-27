import { describe, it, expect, vi, beforeEach } from 'vitest'
import { perfilService } from '../../src/services/perfilService.js'
import apiClient from '../../src/services/api.js'

vi.mock('../../src/services/api.js', () => ({
  default: {
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    get: vi.fn()
  }
}))

describe('perfilService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
    console.log = vi.fn()
  })

  describe('actualizarPerfil', () => {
    it('debe actualizar perfil exitosamente', async () => {
      // given
      const formData = new FormData()
      formData.append('name', 'Test User')
      formData.append('email', 'test@example.com')
      formData.append('lastname', 'User')

      const mockResponse = {
        user: { name: 'Test User', email: 'test@example.com' },
        message: 'Perfil actualizado'
      }
      apiClient.put.mockResolvedValueOnce({ data: mockResponse })

      // when
      const result = await perfilService.actualizarPerfil('test@example.com', formData)

      // then
      expect(apiClient.put).toHaveBeenCalledWith(
        '/users/update/test@example.com',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(result).toEqual(mockResponse)
    })

    it('debe validar que FormData contenga name', async () => {
      // given
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      // when / then
      // La validación falla pero el catch lo transforma en mensaje genérico
      await expect(
        perfilService.actualizarPerfil('user123', formData)
      ).rejects.toThrow('Error al actualizar el perfil')
    })

    it('debe validar que FormData contenga email', async () => {
      // given
      const formData = new FormData()
      formData.append('name', 'Test User')

      // when / then
      // La validación falla pero el catch lo transforma en mensaje genérico
      await expect(
        perfilService.actualizarPerfil('user123', formData)
      ).rejects.toThrow('Error al actualizar el perfil')
    })

    it('debe manejar error 409 (email duplicado)', async () => {
      // given
      const formData = new FormData()
      formData.append('name', 'Test User')
      formData.append('email', 'duplicate@example.com')

      const error = { response: { status: 409 } }
      apiClient.put.mockRejectedValueOnce(error)

      // when / then
      await expect(
        perfilService.actualizarPerfil('user123', formData)
      ).rejects.toThrow('Este email ya está en uso por otra cuenta')
    })

    it('debe manejar error 400 (datos inválidos)', async () => {
      // given
      const formData = new FormData()
      formData.append('name', 'Test User')
      formData.append('email', 'invalid-email')

      const error = { response: { status: 400 } }
      apiClient.put.mockRejectedValueOnce(error)

      // when / then
      await expect(
        perfilService.actualizarPerfil('user123', formData)
      ).rejects.toThrow('Datos inválidos. Revisa los campos y vuelve a intentar.')
    })

    it('debe manejar errores del servidor 5xx', async () => {
      // given
      const formData = new FormData()
      formData.append('name', 'Test User')
      formData.append('email', 'test@example.com')

      const error = { response: { status: 500 } }
      apiClient.put.mockRejectedValueOnce(error)

      // when / then
      await expect(
        perfilService.actualizarPerfil('user123', formData)
      ).rejects.toThrow('Error al actualizar el perfil')
    })
  })

})
