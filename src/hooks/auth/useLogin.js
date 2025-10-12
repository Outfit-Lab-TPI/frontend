import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from './useAuth'
import axios from 'axios'

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
      // Preparar datos para el backend
      const loginData = {
        email: data.email,
        password: data.password
      }

      // TODO: Reemplazar con endpoint real del backend
      const response = await axios.post('/api/auth/login', loginData)

      // Simular respuesta exitosa por ahora
      console.log('Login exitoso:', response.data)

      // Llamar al login del contexto con los datos del usuario
      login({
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        token: response.data.token
      })

    } catch (error) {
      console.error('Error en login:', error)

      // Manejar diferentes tipos de errores
      if (error.response?.status === 401) {
        setError('email', {
          type: 'manual',
          message: 'Email o contraseña incorrectos'
        })
      } else {
        setError('submit', {
          type: 'manual',
          message: 'Error al iniciar sesión. Intenta nuevamente.'
        })
      }
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