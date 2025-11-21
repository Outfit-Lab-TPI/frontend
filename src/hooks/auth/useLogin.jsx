import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from './useAuth'
import { loginService } from '../../services/auth/loginService'
import { useNavigate } from 'react-router-dom'


export function useLogin() {
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

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
      navigate("/home")
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
    isSubmitting
  }
}
