// test/hooks/useNuevaPrenda.test.js
import { renderHook, act, waitFor } from '@testing-library/react'
import { useNuevaPrenda } from '../../src/hooks/useNuevaPrenda'

// Mock de navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

// Mock del servicio
vi.mock('../../src/services/prendaService', () => ({
  prendaService: {
    crearPrenda: vi.fn()
  }
}))

import { prendaService } from '../../src/services/prendaService'

describe('useNuevaPrenda', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe mostrar error si no se selecciona imagen', async () => {
    const { result } = renderHook(() => useNuevaPrenda())

    await act(async () => {
      await result.current.handleSubmit({
        nombre: 'Campera',
        tipo: 'Ropa'
      })
    })

    expect(result.current.errors.imagen?.message).toBe('Debe seleccionar una imagen')
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('debe crear la prenda y navegar al home si la respuesta es exitosa', async () => {
    prendaService.crearPrenda.mockResolvedValueOnce({ data: { ok: true } })

    const { result } = renderHook(() => useNuevaPrenda())

    await act(async () => {
      await result.current.onSubmit({
        nombre: 'Remera',
        tipo: 'Ropa',
        imagen: [new File([''], 'foto.jpg')]
      })
    })

    expect(prendaService.crearPrenda).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('debe manejar error 400 con mensaje de datos inválidos', async () => {
    prendaService.crearPrenda.mockRejectedValueOnce({
      response: { status: 400 }
    })

    const { result } = renderHook(() => useNuevaPrenda())

    await act(async () => {
      await result.current.onSubmit({
        nombre: 'Remera',
        tipo: 'Ropa',
        imagen: [new File([''], 'foto.jpg')]
      })
    })

    await waitFor(() => {
      expect(result.current.errors.submit?.message)
        .toBe('Datos inválidos. Verifica la información ingresada.')
    })
  })


  it('debe manejar error 413 con mensaje de imagen demasiado grande', async () => {
    prendaService.crearPrenda.mockRejectedValueOnce({
      response: { status: 413 }
    })

    const { result } = renderHook(() => useNuevaPrenda())

    await act(async () => {
      await result.current.onSubmit({
        nombre: 'Remera',
        tipo: 'Ropa',
        imagen: [new File([''], 'foto.jpg')]
      })
    })

    await waitFor(() => {
      expect(result.current.errors.submit?.message)
        .toBe('La imagen es demasiado grande. Intenta con una imagen más pequeña.')
    })
  })


  it('debe manejar error 500 con mensaje', async () => {
    prendaService.crearPrenda.mockRejectedValueOnce({
      response: { status: 500 }
    })

    const { result } = renderHook(() => useNuevaPrenda())

    await act(async () => {
      await result.current.onSubmit({
        nombre: 'Camisa',
        tipo: 'Ropa',
        imagen: [new File([''], 'foto.jpg')]
      })
    })

    await waitFor(() => {
      expect(result.current.errors.submit?.message)
        .toBe('Ha ocurrido un error. Por favor intenta más tarde.')
    })
  })

  it('debe cambiar isSubmitting a true durante la creación', async () => {
    prendaService.crearPrenda.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: { ok: true } }), 1000))
    )

    const { result } = renderHook(() => useNuevaPrenda())

    act(() => {
      result.current.onSubmit({
        nombre: 'Pantalón',
        tipo: 'Ropa',
        imagen: [new File([''], 'foto.jpg')]
      })
    })

    await waitFor(() => expect(result.current.isSubmitting).toBe(true))
    //Espera a que termine el timeout
    await waitFor(() => expect(result.current.isSubmitting).toBe(false), { timeout: 1500 })
  })
})
