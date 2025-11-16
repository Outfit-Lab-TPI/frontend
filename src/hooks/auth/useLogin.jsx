import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from './useAuth'
import { loginService } from '../../services/auth/loginService'

export function useLogin() {
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError
  } = useForm({ mode: 'onChange' })

  const onSubmit = useCallback(async (data) => {
    setIsSubmitting(true)
    try {
      const userData = await loginService(data.email, data.password)
      login(userData)
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
  }, [login, setError])

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isSubmitting
  }
}
