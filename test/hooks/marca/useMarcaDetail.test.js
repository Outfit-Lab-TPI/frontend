import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useMarcaDetail } from '../../../src/hooks/marca/useMarcaDetail'
import { marcaService } from '../../../src/services/marca/marcaService'
import { favoritosService } from '../../../src/services/shared/favoritosService.js'

// Mock del servicio
vi.mock('../../../src/services/marca/marcaService.js', () => ({
  marcaService: {
    getMarcaByCode: vi.fn()
  }
}))

vi.mock('../../../src/services/shared/favoritosService.js', () => ({
  favoritosService: {
    obtenerPrendasFavoritas: vi.fn()
  }
}))

describe('useMarcaDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe cargar el detalle de la marca al montar el hook', async () => {
    // given
    const mockData = { codigo: 'nike', nombre: 'Nike', descripcion: 'Marca deportiva' }
    const expectedResult = {
      codigo: 'nike',
      nombre: 'Nike',
      descripcion: 'Marca deportiva',
      garmentTop: {
        content: undefined
      },
      garmentBottom: {
        content: undefined
      }
    }

    marcaService.getMarcaByCode.mockResolvedValueOnce({ data: mockData })
    favoritosService.obtenerPrendasFavoritas.mockResolvedValueOnce({ data: { content: [] } })

    // when
    const { result } = renderHook(() => useMarcaDetail('nike'))

    // then
    // Espera hasta que loading sea false
    await waitFor(() => expect(result.current.loading).toBe(false))

    // Verifica el resultado
    expect(marcaService.getMarcaByCode).toHaveBeenCalledWith('nike')
    expect(result.current.marcaDetail).toEqual(expectedResult)
    expect(result.current.error).toBeNull()
    expect(result.current.criticalError).toBeNull()
  })

  it('no debe llamar al servicio si no hay codigoMarca', async () => {
    // given / when
    renderHook(() => useMarcaDetail(null))

    // then
    expect(marcaService.getMarcaByCode).not.toHaveBeenCalled()
  })

  it('debe manejar errores no críticos', async () => {
    // given
    const error = new Error('Error normal')
    error.isCritical = false
    marcaService.getMarcaByCode.mockRejectedValueOnce(error)
    favoritosService.obtenerPrendasFavoritas.mockResolvedValueOnce({ data: { content: [] } })

    // when
    const { result } = renderHook(() => useMarcaDetail(2))

    // then
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Error normal')
    expect(result.current.criticalError).toBeNull()
  })

  it('debe manejar errores críticos', async () => {
    // given
    const error = new Error('Error crítico')
    error.isCritical = true
    marcaService.getMarcaByCode.mockRejectedValueOnce(error)
    favoritosService.obtenerPrendasFavoritas.mockResolvedValueOnce({ data: { content: [] } })

    // when
    const { result } = renderHook(() => useMarcaDetail('nike'))

    // then
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.criticalError).toBe(error)
  })
})
