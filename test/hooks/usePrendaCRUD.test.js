import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { usePrendaCRUD } from '../../src/hooks/usePrendaCRUD.jsx'
import { prendaService } from '../../src/services/prendaService'
import { toast } from 'react-toastify'

// Mock de prendaService
vi.mock('../../src/services/prendaService', () => ({
  prendaService: {
    crearPrenda: vi.fn(),
    editarPrenda: vi.fn(),
    eliminarPrenda: vi.fn(),
    getFiltros: vi.fn()
  }
}))

// Mock de react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock de useAuth
const mockUser = {
  email: 'brand@test.com',
  name: 'Test Brand',
  role: 'BRAND',
  brand: {
    codigoMarca: 'nike'
  }
}

vi.mock('../../src/hooks/auth/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: mockUser
  }))
}))

// Mock de react-hook-form
const mockSetError = vi.fn()
const mockReset = vi.fn()
const mockSetValue = vi.fn()
const mockWatch = vi.fn()
const mockRegister = vi.fn(() => ({
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
  name: 'field'
}))
const mockHandleSubmit = vi.fn((fn) => fn)

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    formState: { errors: {} },
    setError: mockSetError,
    watch: mockWatch,
    reset: mockReset,
    setValue: mockSetValue
  })
}))

describe('usePrendaCRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
    console.log = vi.fn()
  })

  describe('fetchFiltros', () => {
    it('debe cargar filtros exitosamente al inicializar', async () => {
      // given
      const mockFiltros = {
        colores: ['ROJO', 'AZUL', 'VERDE'],
        ocasiones: ['CASUAL', 'FORMAL'],
        climas: ['CALIDO', 'FRIO']
      }
      prendaService.getFiltros.mockResolvedValueOnce(mockFiltros)

      // when
      const { result } = renderHook(() => usePrendaCRUD())

      // then
      await waitFor(() => {
        expect(prendaService.getFiltros).toHaveBeenCalled()
        expect(result.current.colores).toEqual(mockFiltros.colores)
        expect(result.current.ocaciones).toEqual(mockFiltros.ocasiones)
        expect(result.current.climas).toEqual(mockFiltros.climas)
      })
    })

    it('debe manejar error al cargar filtros', async () => {
      // given
      prendaService.getFiltros.mockRejectedValueOnce(new Error('Error de red'))

      // when
      const { result } = renderHook(() => usePrendaCRUD())

      // then
      await waitFor(() => {
        expect(result.current.colores).toEqual([])
        expect(result.current.ocaciones).toEqual([])
        expect(result.current.climas).toEqual([])
      })
    })

    it('debe manejar respuesta con valores undefined', async () => {
      // given
      prendaService.getFiltros.mockResolvedValueOnce({
        colores: undefined,
        ocasiones: undefined,
        climas: undefined
      })

      // when
      const { result } = renderHook(() => usePrendaCRUD())

      // then
      await waitFor(() => {
        expect(result.current.colores).toEqual([])
        expect(result.current.ocaciones).toEqual([])
        expect(result.current.climas).toEqual([])
      })
    })
  })

  describe('crearPrenda', () => {
    it('debe crear prenda exitosamente', async () => {
      // given
      prendaService.getFiltros.mockResolvedValueOnce({
        colores: ['ROJO'],
        ocasiones: ['CASUAL'],
        climas: ['CALIDO']
      })
      prendaService.crearPrenda.mockResolvedValueOnce({ id: 1 })

      const { result } = renderHook(() => usePrendaCRUD())

      await waitFor(() => {
        expect(result.current.colores).toBeDefined()
      })

      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const formData = {
        nombre: 'Camiseta Test',
        tipo: 'superior',
        color: 'ROJO',
        ocacion: 'CASUAL',
        clima: 'CALIDO',
        imagen: [mockFile]
      }

      // when
      let createResult
      await act(async () => {
        createResult = await result.current.crearPrenda(formData)
      })

      // then
      expect(createResult).toBe(true)
      expect(prendaService.crearPrenda).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith('Prenda creada exitosamente')
      expect(result.current.isSubmitting).toBe(false)
    })

    it('debe validar que se proporcione imagen', async () => {
      // given
      prendaService.getFiltros.mockResolvedValueOnce({
        colores: [],
        ocasiones: [],
        climas: []
      })

      const { result } = renderHook(() => usePrendaCRUD())

      await waitFor(() => {
        expect(result.current.colores).toBeDefined()
      })

      const formData = {
        nombre: 'Camiseta Test',
        tipo: 'superior',
        color: 'ROJO',
        ocacion: 'CASUAL',
        clima: 'CALIDO',
        imagen: null
      }

      // when
      let createResult
      await act(async () => {
        createResult = await result.current.crearPrenda(formData)
      })

      // then
      expect(createResult).toBeUndefined()
      expect(mockSetError).toHaveBeenCalledWith('imagen', {
        type: 'manual',
        message: 'Debe seleccionar una imagen'
      })
      expect(prendaService.crearPrenda).not.toHaveBeenCalled()
    })

    it('debe manejar error 400 (datos inválidos)', async () => {
      // given
      prendaService.getFiltros.mockResolvedValueOnce({
        colores: [],
        ocasiones: [],
        climas: []
      })
      prendaService.crearPrenda.mockRejectedValueOnce({
        response: { status: 400 }
      })

      const { result } = renderHook(() => usePrendaCRUD())

      await waitFor(() => {
        expect(result.current.colores).toBeDefined()
      })

      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const formData = {
        nombre: 'Camiseta Test',
        tipo: 'superior',
        color: 'ROJO',
        ocacion: 'CASUAL',
        clima: 'CALIDO',
        imagen: [mockFile]
      }

      // when
      let createResult
      await act(async () => {
        createResult = await result.current.crearPrenda(formData)
      })

      // then
      expect(createResult).toBe(false)
      expect(mockSetError).toHaveBeenCalledWith('submit', {
        type: 'manual',
        message: 'Datos inválidos. Verifica la información ingresada.'
      })
    })

    it('debe manejar error 413 (imagen demasiado grande)', async () => {
      // given
      prendaService.getFiltros.mockResolvedValueOnce({
        colores: [],
        ocasiones: [],
        climas: []
      })
      prendaService.crearPrenda.mockRejectedValueOnce({
        response: { status: 413 }
      })

      const { result } = renderHook(() => usePrendaCRUD())

      await waitFor(() => {
        expect(result.current.colores).toBeDefined()
      })

      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const formData = {
        nombre: 'Camiseta Test',
        tipo: 'superior',
        color: 'ROJO',
        ocacion: 'CASUAL',
        clima: 'CALIDO',
        imagen: [mockFile]
      }

      // when
      let createResult
      await act(async () => {
        createResult = await result.current.crearPrenda(formData)
      })

      // then
      expect(createResult).toBe(false)
      expect(mockSetError).toHaveBeenCalledWith('submit', {
        type: 'manual',
        message: 'La imagen es demasiado grande. Intenta con una imagen más pequeña.'
      })
    })

    it('debe manejar error 5xx (error de servidor)', async () => {
      // given
      prendaService.getFiltros.mockResolvedValueOnce({
        colores: [],
        ocasiones: [],
        climas: []
      })
      prendaService.crearPrenda.mockRejectedValueOnce({
        response: { status: 500 }
      })

      const { result } = renderHook(() => usePrendaCRUD())

      await waitFor(() => {
        expect(result.current.colores).toBeDefined()
      })

      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const formData = {
        nombre: 'Camiseta Test',
        tipo: 'superior',
        color: 'ROJO',
        ocacion: 'CASUAL',
        clima: 'CALIDO',
        imagen: [mockFile]
      }

      // when
      let createResult
      await act(async () => {
        createResult = await result.current.crearPrenda(formData)
      })

      // then
      expect(createResult).toBe(false)
      expect(mockSetError).toHaveBeenCalledWith('submit', {
        type: 'manual',
        message: 'Ha ocurrido un error. Por favor intenta más tarde.'
      })
    })
  })

  describe('editarPrenda', () => {
    it('debe editar prenda exitosamente sin cambiar imagen', async () => {
      // given
      prendaService.getFiltros.mockResolvedValueOnce({
        colores: [],
        ocasiones: [],
        climas: []
      })
      prendaService.editarPrenda.mockResolvedValueOnce({ success: true })

      const { result } = renderHook(() => usePrendaCRUD())

      await waitFor(() => {
        expect(result.current.colores).toBeDefined()
      })

      const formData = {
        nombre: 'Camiseta Editada',
        tipo: 'superior',
        color: 'AZUL',
        ocacion: 'FORMAL',
        clima: 'FRIO',
        imagen: null
      }

      // when
      let editResult
      await act(async () => {
        editResult = await result.current.editarPrenda(1, formData)
      })

      // then
      expect(editResult).toBe(true)
      expect(prendaService.editarPrenda).toHaveBeenCalledWith(1, expect.any(FormData))
      expect(result.current.isSubmitting).toBe(false)
    })

    it('debe editar prenda exitosamente con nueva imagen', async () => {
      // given
      prendaService.getFiltros.mockResolvedValueOnce({
        colores: [],
        ocasiones: [],
        climas: []
      })
      prendaService.editarPrenda.mockResolvedValueOnce({ success: true })

      const { result } = renderHook(() => usePrendaCRUD())

      await waitFor(() => {
        expect(result.current.colores).toBeDefined()
      })

      const mockFile = new File(['new-content'], 'new-image.jpg', { type: 'image/jpeg' })
      const formData = {
        nombre: 'Camiseta Editada',
        tipo: 'superior',
        color: 'AZUL',
        ocacion: 'FORMAL',
        clima: 'FRIO',
        imagen: [mockFile]
      }

      // when
      let editResult
      await act(async () => {
        editResult = await result.current.editarPrenda(1, formData)
      })

      // then
      expect(editResult).toBe(true)
      expect(prendaService.editarPrenda).toHaveBeenCalled()
    })

    it('debe manejar error al editar prenda', async () => {
      // given
      prendaService.getFiltros.mockResolvedValueOnce({
        colores: [],
        ocasiones: [],
        climas: []
      })
      prendaService.editarPrenda.mockRejectedValueOnce(new Error('Error al editar'))

      const { result } = renderHook(() => usePrendaCRUD())

      await waitFor(() => {
        expect(result.current.colores).toBeDefined()
      })

      const formData = {
        nombre: 'Camiseta Editada',
        tipo: 'superior',
        color: 'AZUL',
        ocacion: 'FORMAL',
        clima: 'FRIO',
        imagen: null
      }

      // when
      let editResult
      await act(async () => {
        editResult = await result.current.editarPrenda(1, formData)
      })

      // then
      expect(editResult).toBe(false)
      expect(mockSetError).toHaveBeenCalledWith('submit', {
        type: 'manual',
        message: 'Error al actualizar la prenda.'
      })
    })
  })

  describe('eliminarPrenda', () => {
    it('debe eliminar prenda exitosamente', async () => {
      // given
      prendaService.getFiltros.mockResolvedValueOnce({
        colores: [],
        ocasiones: [],
        climas: []
      })
      prendaService.eliminarPrenda.mockResolvedValueOnce({ success: true })

      const { result } = renderHook(() => usePrendaCRUD())

      await waitFor(() => {
        expect(result.current.colores).toBeDefined()
      })

      // when
      let deleteResult
      await act(async () => {
        deleteResult = await result.current.eliminarPrenda(1)
      })

      // then
      expect(deleteResult).toBe(true)
      expect(prendaService.eliminarPrenda).toHaveBeenCalledWith(1)
    })

    it('debe manejar error al eliminar prenda', async () => {
      // given
      prendaService.getFiltros.mockResolvedValueOnce({
        colores: [],
        ocasiones: [],
        climas: []
      })
      prendaService.eliminarPrenda.mockRejectedValueOnce(new Error('Error al eliminar'))

      const { result } = renderHook(() => usePrendaCRUD())

      await waitFor(() => {
        expect(result.current.colores).toBeDefined()
      })

      // when
      let deleteResult
      await act(async () => {
        deleteResult = await result.current.eliminarPrenda(1)
      })

      // then
      expect(deleteResult).toBe(false)
    })
  })

})
