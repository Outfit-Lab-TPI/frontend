import { describe, it, expect, vi, beforeEach } from 'vitest'
import { adminService } from '../../../src/services/admin/adminService.js'
import apiClient from '../../../src/services/api.js'

vi.mock('../../../src/services/api.js', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn()
  }
}))

describe('adminService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.log = vi.fn()
  })

  describe('obtenerUsuarios', () => {
    it('debe obtener usuarios exitosamente', async () => {
      // given
      const mockUsuarios = [
        { email: 'user1@test.com', name: 'User 1', role: 'USER' },
        { email: 'user2@test.com', name: 'User 2', role: 'ADMIN' }
      ]
      apiClient.get.mockResolvedValueOnce({ data: mockUsuarios })

      // when
      const result = await adminService.obtenerUsuarios()

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/users/all')
      expect(result.data.content).toHaveLength(2)
      expect(result.data.content[0]).toHaveProperty('_tempId')
      expect(result.data.totalElements).toBe(2)
    })

    it('debe reconocer errores críticos', async () => {
      // given
      const error = { response: { status: 500 } }
      apiClient.get.mockRejectedValueOnce(error)

      // when / then
      try {
        await adminService.obtenerUsuarios()
      } catch (err) {
        expect(err.isCritical).toBe(true)
      }
    })
  })

  describe('obtenerMarcasAdmin', () => {
    it('debe obtener marcas exitosamente', async () => {
      // given
      const mockMarcas = {
        data: {
          content: [
            { codigoMarca: 'NIKE', nombre: 'Nike' },
            { codigoMarca: 'ADIDAS', nombre: 'Adidas' }
          ]
        }
      }
      apiClient.get.mockResolvedValueOnce(mockMarcas)

      // when
      const result = await adminService.obtenerMarcasAdmin()

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/marcas/all')
      expect(result).toEqual(mockMarcas)
    })
  })

  describe('cambiarRolUsuario', () => {
    it('debe cambiar rol a ADMIN exitosamente', async () => {
      // given
      const mockResponse = { data: { message: 'Rol actualizado' } }
      apiClient.put.mockResolvedValueOnce(mockResponse)

      // when
      const result = await adminService.cambiarRolUsuario('user@test.com', 'ADMIN')

      // then
      expect(apiClient.put).toHaveBeenCalledWith('/users/convert-to-admin/user@test.com')
      expect(result).toEqual(mockResponse)
    })

    it('debe cambiar rol a USER exitosamente', async () => {
      // given
      const mockResponse = { data: { message: 'Rol actualizado' } }
      apiClient.put.mockResolvedValueOnce(mockResponse)

      // when
      const result = await adminService.cambiarRolUsuario('admin@test.com', 'USER')

      // then
      expect(apiClient.put).toHaveBeenCalledWith('/users/convert-to-user/admin@test.com')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('toggleUsuarioActivo', () => {
    it('debe desactivar usuario exitosamente', async () => {
      // given
      const mockResponse = { data: { message: 'Usuario desactivado' } }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await adminService.toggleUsuarioActivo('user@test.com', false)

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/users/desactivate', {
        params: { email: 'user@test.com' }
      })
      expect(result).toEqual(mockResponse)
    })

    it('debe activar usuario exitosamente', async () => {
      // given
      const mockResponse = { data: { message: 'Usuario activado' } }
      apiClient.get.mockResolvedValueOnce(mockResponse)

      // when
      const result = await adminService.toggleUsuarioActivo('user@test.com', true)

      // then
      expect(apiClient.get).toHaveBeenCalledWith('/users/activate', {
        params: { email: 'user@test.com' }
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('toggleMarcaActiva', () => {
    it('debe desactivar marca exitosamente', async () => {
      // given
      const mockResponse = { data: { message: 'Marca desactivada' } }
      apiClient.patch.mockResolvedValueOnce(mockResponse)

      // when
      const result = await adminService.toggleMarcaActiva('NIKE', false)

      // then
      // La lógica del servicio usa !activa, entonces false → desactivate
      expect(apiClient.patch).toHaveBeenCalledWith('/marcas/desactivate/NIKE')
      expect(result).toEqual(mockResponse)
    })

    it('debe activar marca exitosamente', async () => {
      // given
      const mockResponse = { data: { message: 'Marca activada' } }
      apiClient.patch.mockResolvedValueOnce(mockResponse)

      // when
      const result = await adminService.toggleMarcaActiva('NIKE', true)

      // then
      // La lógica del servicio usa !activa, entonces true → activate
      expect(apiClient.patch).toHaveBeenCalledWith('/marcas/activate/NIKE')
      expect(result).toEqual(mockResponse)
    })
  })
})
