import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from './useAuth'
import { mockUser, simulateNetworkDelay, validateMockLogin } from '../../utils/mockData'
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
      // En desarrollo, usar datos mock con validación
      if (process.env.NODE_ENV === 'development') {
        await simulateNetworkDelay()

        // Validar credenciales mock
        if (validateMockLogin(data.email, data.password)) {
          console.log('Login exitoso (mock):', mockUser)
          login(mockUser)
        } else {
          // Simular error de credenciales inválidas
          throw new Error('Credenciales inválidas')
        }
      } else {
        // En producción, hacer la llamada real
        const loginData = {
          email: data.email,
          password: data.password
        }

        const response = await axios.post('/api/auth/login', loginData)
        console.log('Login exitoso:', response.data)

        login({
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          token: response.data.token
        })
      }

    } catch (error) {
      console.error('Error en login:', error)

      // Manejar diferentes tipos de errores
      if (error.message === 'Credenciales inválidas' || error.response?.status === 401) {
        setError('submit', {
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