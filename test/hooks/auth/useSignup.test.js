import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSignup } from '../../../src/hooks/auth/useSignup.js'
import { signupService } from '../../../src/services/auth/signupService'
import { useNavigate } from 'react-router-dom'

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}))

// Mock del servicio de signup
vi.mock('../../../src/services/auth/signupService', () => ({
  signupService: vi.fn()
}))

// Mock de react-hook-form
const mockSetError = vi.fn()
const mockRegister = vi.fn()
const mockHandleSubmit = vi.fn((fn) => fn)
const mockTrigger = vi.fn()
const mockGetValues = vi.fn()

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    trigger: mockTrigger,
    formState: { errors: {}, isValid: true, isSubmitting: false },
    setError: mockSetError,
    getValues: mockGetValues
  })
}))

// Mock de validaciones
vi.mock('../../../src/lib/validations', () => ({
  validationRules: {
    email: { required: 'Email requerido' },
    password: { required: 'Password requerido' }
  }
}))

describe('useSignup', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
    global.alert = vi.fn()
    global.localStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn()
    }
    useNavigate.mockReturnValue(mockNavigate)
  })

  it('debe registrar usuario exitosamente', async () => {
    // given
    const mockSuccessData = { message: 'Registro exitoso' }
    signupService.mockResolvedValueOnce(mockSuccessData)

    const { result } = renderHook(() => useSignup())

    const formData = {
      email: 'newuser@test.com',
      name: 'New',
      lastName: 'User',
      password: 'password123',
      confirmPassword: 'password123'
    }

    // when
    await act(async () => {
      const submitHandler = result.current.handleSubmit(false) // isBrand = false
      await submitHandler(formData)
    })

    // then
    expect(signupService).toHaveBeenCalledWith(
      {
        email: 'newuser@test.com',
        name: 'New',
        lastName: 'User',
        password: 'password123'
      },
      false
    )
    expect(global.localStorage.setItem).toHaveBeenCalledWith('pendingVerificationEmail', 'newuser@test.com')
    expect(mockNavigate).toHaveBeenCalledWith('/pending-verification?email=newuser%40test.com')
  })

  it('debe registrar marca exitosamente con FormData', async () => {
    // given
    const mockSuccessData = { message: 'Registro de marca exitoso' }
    signupService.mockResolvedValueOnce(mockSuccessData)

    const { result } = renderHook(() => useSignup())

    const mockLogoFile = new File(['logo'], 'logo.png', { type: 'image/png' })
    const formData = {
      email: 'brand@test.com',
      name: 'Brand',
      lastName: 'Company',
      password: 'password123',
      confirmPassword: 'password123',
      nombreMarca: 'My Brand',
      sitioUrl: 'https://mybrand.com',
      logoImage: [mockLogoFile]
    }

    // when
    await act(async () => {
      const submitHandler = result.current.handleSubmit(true) // isBrand = true
      await submitHandler(formData)
    })

    // then
    expect(signupService).toHaveBeenCalled()
    const callArgs = signupService.mock.calls[0]
    expect(callArgs[0]).toBeInstanceOf(FormData)
    expect(callArgs[1]).toBe(true) // isBrand
  })

  it('debe manejar error cuando las contraseñas no coinciden', async () => {
    // given
    const { result } = renderHook(() => useSignup())

    const formData = {
      email: 'user@test.com',
      name: 'User',
      lastName: 'Test',
      password: 'password123',
      confirmPassword: 'differentpassword'
    }

    // when
    await act(async () => {
      const submitHandler = result.current.handleSubmit(false)
      await submitHandler(formData)
    })

    // then
    expect(mockSetError).toHaveBeenCalledWith('confirmPassword', {
      type: 'manual',
      message: 'Las contraseñas no coinciden.'
    })
    expect(signupService).not.toHaveBeenCalled()
  })

  it('debe manejar error 400 con errores de campo del servidor', async () => {
    // given
    const error = {
      response: {
        status: 400,
        data: {
          email: 'El email ya está registrado',
          password: 'La contraseña es muy débil'
        }
      }
    }
    signupService.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useSignup())

    const formData = {
      email: 'existing@test.com',
      name: 'User',
      lastName: 'Test',
      password: 'weak',
      confirmPassword: 'weak'
    }

    // when
    await act(async () => {
      const submitHandler = result.current.handleSubmit(false)
      await submitHandler(formData)
    })

    // then
    expect(mockSetError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'El email ya está registrado'
    })
    expect(mockSetError).toHaveBeenCalledWith('password', {
      type: 'server',
      message: 'La contraseña es muy débil'
    })
  })

  it('debe manejar error de conexión', async () => {
    // given
    const error = new Error('Network error')
    signupService.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useSignup())

    const formData = {
      email: 'user@test.com',
      name: 'User',
      lastName: 'Test',
      password: 'password123',
      confirmPassword: 'password123'
    }

    // when
    await act(async () => {
      const submitHandler = result.current.handleSubmit(false)
      await submitHandler(formData)
    })

    // then
    expect(mockSetError).toHaveBeenCalledWith('submit', {
      type: 'network',
      message: 'Error de conexión con el servidor. Verifica tu conexión.'
    })
  })

})
