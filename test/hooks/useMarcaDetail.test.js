import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useMarcaDetail } from '../../src/hooks/useMarcaDetail.jsx'
import { marcaService } from '../../src/services/marcaService.js'

// Mock del servicio
vi.mock('../../src/services/marcaService.js', () => ({
  marcaService: {
    getMarcaByCode: vi.fn()
  }
}))

describe('useMarcaDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe cargar el detalle de la marca al montar el hook', async () => {
    const mockData = { codigo: 'nike', nombre: 'Nike', descripcion: 'Marca deportiva' }
    marcaService.getMarcaByCode.mockResolvedValueOnce({ data: mockData })

    const { result } = renderHook(() => useMarcaDetail('nike'))

    // Espera hasta que loading sea false
    await waitFor(() => expect(result.current.loading).toBe(false))

    // Verifica el resultado
    expect(marcaService.getMarcaByCode).toHaveBeenCalledWith('nike')
    expect(result.current.marcaDetail).toEqual(mockData)
    expect(result.current.error).toBeNull()
    expect(result.current.criticalError).toBeNull()
  })

  it('no debe llamar al servicio si no hay codigoMarca', async () => {
    renderHook(() => useMarcaDetail(null))
    expect(marcaService.getMarcaByCode).not.toHaveBeenCalled()
  })

  it('debe manejar errores no críticos', async () => {
    const error = new Error('Error normal')
    error.isCritical = false
    marcaService.getMarcaByCode.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useMarcaDetail(2))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Error normal')
    expect(result.current.criticalError).toBeNull()
  })

  it('debe manejar errores críticos', async () => {
    const error = new Error('Error crítico')
    error.isCritical = true
    marcaService.getMarcaByCode.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useMarcaDetail('nike'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.criticalError).toBe(error)
  })
})
