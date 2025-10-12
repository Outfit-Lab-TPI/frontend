import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from './useAuth'
import { validationRules, createPasswordConfirmValidation } from '../../utils/validations'
import { mockUser, simulateNetworkDelay } from '../../utils/mockData'
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
      // En desarrollo, usar datos mock
      if (process.env.NODE_ENV === 'development') {
        await simulateNetworkDelay()

        // Simular registro exitoso con datos del formulario
        const mockResponse = {
          user: {
            id: Date.now().toString(),
            name: data.name,
            email: data.email
          },
          token: `mock-token-${Date.now()}`
        }

        console.log('Signup exitoso (mock):', mockResponse)

        // Auto-login después del registro exitoso
        login(mockResponse)
      } else {
        // En producción, hacer la llamada real
        const signupData = {
          name: data.name,
          email: data.email,
          password: data.password
        }

        const response = await axios.post('/api/auth/signup', signupData)
        console.log('Signup exitoso:', response.data)

        login({
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          token: response.data.token
        })
      }

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

  // Validaciones para los campos usando validaciones centralizadas
  const signupValidationRules = {
    name: validationRules.name,
    email: validationRules.email,
    password: validationRules.password,
    confirmPassword: createPasswordConfirmValidation(password)
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isSubmitting,
    validationRules: signupValidationRules
  }
}