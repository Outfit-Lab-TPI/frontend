import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from './useAuth'
import axios from 'axios'

export function useSignup() {
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    watch
  } = useForm({ mode: 'onChange' })

  const password = watch('password')

  const onSubmit = useCallback(async (data) => {
    setIsSubmitting(true)

    try {
      // Preparar datos para el backend
      const signupData = {
        name: data.name,
        email: data.email,
        password: data.password
      }

      // TODO: Reemplazar con endpoint real del backend
      const response = await axios.post('/api/auth/signup', signupData)

      // Simular respuesta exitosa por ahora
      console.log('Signup exitoso:', response.data)

      // Auto-login después del registro exitoso
      login({
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        token: response.data.token
      })

    } catch (error) {
      console.error('Error en signup:', error)

      // Manejar diferentes tipos de errores
      if (error.response?.status === 409) {
        setError('email', {
          type: 'manual',
          message: 'Este email ya está registrado'
        })
      } else {
        setError('submit', {
          type: 'manual',
          message: 'Error al crear la cuenta. Intenta nuevamente.'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [login, setError])

  // Validaciones para los campos
  const validationRules = {
    name: {
      required: 'El nombre es requerido',
      minLength: {
        value: 2,
        message: 'El nombre debe tener al menos 2 caracteres'
      }
    },
    email: {
      required: 'El email es requerido',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Email inválido'
      }
    },
    password: {
      required: 'La contraseña es requerida',
      minLength: {
        value: 6,
        message: 'La contraseña debe tener al menos 6 caracteres'
      }
    },
    confirmPassword: {
      required: 'Confirma tu contraseña',
      validate: (value) =>
        value === password || 'Las contraseñas no coinciden'
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isSubmitting,
    validationRules
  }
}