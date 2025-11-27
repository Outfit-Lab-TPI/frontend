import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAdmin } from '../../../src/hooks/admin/useAdmin'
import { adminService } from '../../../src/services/admin/adminService.js'

// Mock del servicio
vi.mock('../../../src/services/admin/adminService.js', () => ({
  adminService: {
    obtenerUsuarios: vi.fn(),
    obtenerMarcasAdmin: vi.fn(),
    cambiarRolUsuario: vi.fn(),
    toggleUsuarioActivo: vi.fn(),
    toggleMarcaActiva: vi.fn()
  }
}))

describe('useAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
    console.log = vi.fn()
  })

  it('debe cargar usuarios y marcas al inicializar', async () => {
    // given
    const mockUsuarios = [
      { email: 'user1@test.com', name: 'User', lastName: 'One', role: 'USER', status: true }
    ]
    const mockMarcas = [
      { name: 'Brand', lastname: 'One', email: 'brand@test.com', brand: { codigoMarca: 'B1', nombre: 'Brand1' }, status: true, brandApproved: true }
    ]

    adminService.obtenerUsuarios.mockResolvedValueOnce({ data: { content: mockUsuarios } })
    adminService.obtenerMarcasAdmin.mockResolvedValueOnce({ data: { content: mockMarcas } })

    // when
    const { result } = renderHook(() => useAdmin())

    // then
    await waitFor(() => {
      expect(result.current.usuarios).toEqual(mockUsuarios)
      expect(result.current.marcas).toEqual(mockMarcas)
    })
    expect(result.current.loadingUsuarios).toBe(false)
    expect(result.current.loadingMarcas).toBe(false)
  })

  it('debe filtrar usuarios por búsqueda', async () => {
    // given
    const mockUsuarios = [
      { email: 'john@test.com', name: 'John', lastName: 'Doe', role: 'USER', status: true },
      { email: 'jane@test.com', name: 'Jane', lastName: 'Smith', role: 'USER', status: true }
    ]

    adminService.obtenerUsuarios.mockResolvedValueOnce({ data: { content: mockUsuarios } })
    adminService.obtenerMarcasAdmin.mockResolvedValueOnce({ data: { content: [] } })

    const { result } = renderHook(() => useAdmin())

    await waitFor(() => {
      expect(result.current.usuarios).toHaveLength(2)
    })

    // when
    act(() => {
      result.current.setBusquedaUsuarios('john')
    })

    // then
    expect(result.current.usuarios).toHaveLength(1)
    expect(result.current.usuarios[0].name).toBe('John')
  })

  it('debe cambiar rol de usuario exitosamente', async () => {
    // given
    const mockUsuarios = [
      { email: 'user@test.com', name: 'User', lastName: 'Test', role: 'USER', status: true }
    ]

    adminService.obtenerUsuarios.mockResolvedValueOnce({ data: { content: mockUsuarios } })
    adminService.obtenerMarcasAdmin.mockResolvedValueOnce({ data: { content: [] } })
    adminService.cambiarRolUsuario.mockResolvedValueOnce({ success: true })

    const { result } = renderHook(() => useAdmin())

    await waitFor(() => {
      expect(result.current.usuarios).toHaveLength(1)
    })

    // when
    let response
    await act(async () => {
      response = await result.current.cambiarRolUsuario('user@test.com', 'ADMIN')
    })

    // then
    expect(response).toEqual({ success: true })
    expect(result.current.usuarios[0].role).toBe('ADMIN')
  })

  it('debe cambiar estado activo de usuario', async () => {
    // given
    const mockUsuarios = [
      { email: 'user@test.com', name: 'User', lastName: 'Test', role: 'USER', status: true }
    ]

    adminService.obtenerUsuarios.mockResolvedValueOnce({ data: { content: mockUsuarios } })
    adminService.obtenerMarcasAdmin.mockResolvedValueOnce({ data: { content: [] } })
    adminService.toggleUsuarioActivo.mockResolvedValueOnce({ success: true })

    const { result } = renderHook(() => useAdmin())

    await waitFor(() => {
      expect(result.current.usuarios).toHaveLength(1)
    })

    // when
    let response
    await act(async () => {
      response = await result.current.toggleUsuarioActivo('user@test.com', false)
    })

    // then
    expect(response).toEqual({ success: true })
    expect(result.current.usuarios[0].status).toBe(false)
  })

  it('debe cambiar estado activo de marca', async () => {
    // given
    const mockMarcas = [
      { name: 'Brand', lastname: 'One', email: 'brand@test.com', brand: { codigoMarca: 'B1', nombre: 'Brand1' }, status: true, brandApproved: true }
    ]

    adminService.obtenerUsuarios.mockResolvedValueOnce({ data: { content: [] } })
    adminService.obtenerMarcasAdmin.mockResolvedValueOnce({ data: { content: mockMarcas } })
    adminService.toggleMarcaActiva.mockResolvedValueOnce({ success: true })

    const { result } = renderHook(() => useAdmin())

    await waitFor(() => {
      expect(result.current.marcas).toHaveLength(1)
    })

    // when
    let response
    await act(async () => {
      response = await result.current.toggleMarcaActiva('B1', false)
    })

    // then
    expect(response).toEqual({ success: true })
    expect(result.current.marcas[0].status).toBe(false)
  })

})
