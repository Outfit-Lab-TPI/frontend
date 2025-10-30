import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMarcas } from '../../src/hooks/useMarcas.jsx'
import { marcaService } from '../../src/services/marcaService.js'

describe('useMarcas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe cargar las marcas exitosamente al inicializar', async () => {
    const mockData = [
      { codigo: 'nike', nombre: 'Nike' },
      { codigo: 'adidas', nombre: 'Adidas' }
    ]

    vi.spyOn(marcaService, 'getAllMarcas').mockResolvedValueOnce({ data: mockData })

    // Se ejecuta fetchMarcas gracias al useEffect dentro del hook
    const { result } = renderHook(() => useMarcas())

    // Antes del obtener marcas
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
    expect(result.current.marcas).toEqual([])

    // Espera la respuesta del servicio
    await waitFor(() => expect(result.current.loading).toBe(false))

    // Luego de obtener un resultado
    expect(result.current.marcas).toEqual(mockData)
    expect(result.current.error).toBeNull()
    expect(result.current.criticalError).toBeNull()
  })

  it('debe manejar un error no crítico', async () => {
    const mockError = new Error('Error al obtener marcas')
    vi.spyOn(marcaService, 'getAllMarcas').mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useMarcas())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.marcas).toEqual([])
    expect(result.current.error).toBe('Error al obtener marcas')
    expect(result.current.criticalError).toBeNull()
  })

  it('debe manejar un error crítico', async () => {
    const criticalError = new Error('Error grave en servidor')
    criticalError.isCritical = true
    vi.spyOn(marcaService, 'getAllMarcas').mockRejectedValueOnce(criticalError)

    const { result } = renderHook(() => useMarcas())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.criticalError).toEqual(criticalError)
    expect(result.current.error).toBeNull()
    expect(result.current.marcas).toEqual([])
  })

  it('debe permitir recargar las marcas con refetch()', async () => {
    const mockData1 = [{ codigo: 'nike', nombre: 'Nike' }]
    const mockData2 = [{ codigo: 'puma', nombre: 'Puma' }]

    // Se controla la respuesta del servicio
    const mock = vi.spyOn(marcaService, 'getAllMarcas')
    mock.mockResolvedValueOnce({ data: mockData1 }) // primera carga
    mock.mockResolvedValueOnce({ data: mockData2 }) // refetch

    const { result } = renderHook(() => useMarcas())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.marcas).toEqual(mockData1) //[{ codigo: 'nike', nombre: 'Nike' }]

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.marcas).toEqual(mockData2) //[{ codigo: 'puma', nombre: 'Puma' }]
  })
})
