import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePerfil } from '../../../src/hooks/usuario/usePerfil'
import { perfilService } from '../../../src/services/usuario/perfilService.js'

// Mock de react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    register: vi.fn(),
    handleSubmit: vi.fn((fn) => fn),
    formState: { errors: {}, isValid: true, isDirty: false },
    setError: vi.fn(),
    watch: vi.fn(() => ''),
    reset: vi.fn()
  }))
}))

// Mock del hook useAuth
vi.mock('../../../src/hooks/auth/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'user123', name: 'Test User', email: 'test@example.com', avatarUrl: null },
    updateUser: vi.fn()
  }))
}))

// Mock de validaciones
vi.mock('../../../src/lib/validations', () => ({
  validationRules: {
    name: {},
    email: {},
    passwordOptional: {}
  },
  createOptionalPasswordConfirmValidation: vi.fn(() => ({}))
}))

// Mock de validación de imagen
vi.mock('../../../src/lib/imageBodyValidation', () => ({
  validateCustomImageLogic: vi.fn(),
  VALIDATION_STATUS: {
    SUCCESS: 'success',
    ERROR: 'error'
  }
}))

// Mock del servicio de perfil
vi.mock('../../../src/services/usuario/perfilService.js', () => ({
  perfilService: {
    actualizarPerfil: vi.fn()
  }
}))

describe('usePerfil', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Actualización de perfil (onSubmit)', () => {
    it('debe actualizar perfil exitosamente', async () => {
      // given
      const mockUser = { id: 'user123', name: 'Test User', email: 'test@example.com', lastName: 'Old', userImg: null }
      const mockUpdatedUser = {
        id: 'user123',
        name: 'Updated User',
        email: 'updated@example.com',
        lastName: 'Test',
        userImg: '/avatar.jpg'
      }
      const mockUpdateUser = vi.fn()
      const mockOnSuccess = vi.fn()

      const { useAuth } = await import('../../../src/hooks/auth/useAuth')
      useAuth.mockReturnValue({
        user: mockUser,
        updateUser: mockUpdateUser
      })

      perfilService.actualizarPerfil.mockResolvedValueOnce({
        user: mockUpdatedUser,
        message: 'Perfil actualizado correctamente'
      })

      const { result } = renderHook(() => usePerfil(mockOnSuccess))

      const formData = {
        name: 'Updated User',
        lastName: 'Test',
        email: 'updated@example.com',
        password: '',
        avatar: null
      }

      // when
      let response
      await act(async () => {
        response = await result.current.handleSubmit(formData)
      })

      // then
      expect(perfilService.actualizarPerfil).toHaveBeenCalled()
      expect(mockUpdateUser).toHaveBeenCalledWith({
        name: 'Updated User',
        email: 'updated@example.com',
        lastName: 'Test',
        userImg: '/avatar.jpg'
      })
      expect(mockOnSuccess).toHaveBeenCalled()
      expect(response).toEqual({ success: true, message: 'Perfil actualizado correctamente' })
      expect(result.current.isSubmitting).toBe(false)
    })

    it('debe incluir avatar en FormData cuando se proporciona', async () => {
      // given
      const mockUser = { id: 'user123', name: 'Test User', email: 'test@example.com' }
      const mockUpdateUser = vi.fn()
      const avatarFile = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' })

      const { useAuth } = await import('../../../src/hooks/auth/useAuth')
      useAuth.mockReturnValue({
        user: mockUser,
        updateUser: mockUpdateUser
      })

      perfilService.actualizarPerfil.mockResolvedValueOnce({
        user: { ...mockUser, userImg: '/new-avatar.jpg' },
        message: 'Perfil actualizado correctamente'
      })

      const { result } = renderHook(() => usePerfil(null))

      const formData = {
        name: 'Test User',
        lastName: 'Test',
        email: 'test@example.com',
        password: '',
        avatar: [avatarFile]
      }

      // when
      await act(async () => {
        await result.current.handleSubmit(formData)
      })

      // then
      expect(perfilService.actualizarPerfil).toHaveBeenCalled()
      const callArgs = perfilService.actualizarPerfil.mock.calls[0]
      expect(callArgs[0]).toBe('test@example.com')
      expect(callArgs[1]).toBeInstanceOf(FormData)
    })

    it('debe manejar error al actualizar perfil', async () => {
      // given
      const mockUser = { id: 'user123', name: 'Test User', email: 'test@example.com' }
      const error = new Error('Error al actualizar perfil')
      error.isCritical = false

      const { useAuth } = await import('../../../src/hooks/auth/useAuth')
      useAuth.mockReturnValue({
        user: mockUser,
        updateUser: vi.fn()
      })

      perfilService.actualizarPerfil.mockRejectedValueOnce(error)

      const { result } = renderHook(() => usePerfil(null))

      const formData = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: ''
      }

      // when
      let response
      await act(async () => {
        response = await result.current.handleSubmit(formData)
      })

      // then
      expect(response).toEqual({ success: false, error: 'Error al actualizar perfil' })
      expect(result.current.isSubmitting).toBe(false)
    })

    it('debe manejar error de email duplicado', async () => {
      // given
      const mockUser = { id: 'user123', name: 'Test User', email: 'test@example.com' }
      const error = new Error('Este email ya está en uso')
      error.isCritical = false

      const { useAuth } = await import('../../../src/hooks/auth/useAuth')
      const { useForm } = await import('react-hook-form')
      const mockSetError = vi.fn()

      useForm.mockReturnValue({
        register: vi.fn(),
        handleSubmit: vi.fn((fn) => fn),
        formState: { errors: {}, isValid: true, isDirty: false },
        setError: mockSetError,
        watch: vi.fn(() => ''),
        reset: vi.fn()
      })

      useAuth.mockReturnValue({
        user: mockUser,
        updateUser: vi.fn()
      })

      perfilService.actualizarPerfil.mockRejectedValueOnce(error)

      const { result } = renderHook(() => usePerfil(null))

      const formData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: ''
      }

      // when
      await act(async () => {
        await result.current.handleSubmit(formData)
      })

      // then
      expect(mockSetError).toHaveBeenCalledWith('email', {
        type: 'manual',
        message: 'Este email ya está en uso'
      })
    })
  })
})
