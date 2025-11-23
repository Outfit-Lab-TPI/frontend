import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from './useAuth'
import { loginService } from '../../services/auth/loginService'
import { useNavigate } from 'react-router-dom'
import { validationRules } from '../../lib/validations'


export function useLogin() {
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const loginValidationRules = {
    email: validationRules.email,
    password: validationRules.passwordLogin
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors
  } = useForm({ mode: 'onChange' })

  const onSubmit = useCallback(async (data) => {
    clearErrors('submit')
    setIsSubmitting(true)
    try {
      const userData = await loginService(data.email, data.password)
      login(userData)

      // Redirect based on user role
      const userRole = userData?.user?.role || userData?.role

      switch (userRole) {
        case 'ADMIN':
          navigate('/dashboard')
          break
        case 'BRAND':
          navigate('/brand-home')
          break
        case 'USER':
        default:
          navigate('/home')
          break
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      setError('submit', {
        type: 'manual',
        message:
          error.response?.status === 401
            ? 'Email o contraseña incorrectos'
            : 'Error al iniciar sesión. Intenta nuevamente.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [login, navigate, setError, clearErrors]
)

  return {
    //register,
    register: (name, options) =>
      register(name, {
        ...options,
        onChange: () => clearErrors("submit")
      }),
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isSubmitting,
    validationRules: loginValidationRules
  }
}
