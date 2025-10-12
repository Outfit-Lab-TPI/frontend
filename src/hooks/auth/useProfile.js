import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from './useAuth'
import { validationRules, createOptionalPasswordConfirmValidation } from '../../utils/validations'
import axios from 'axios'

export function useProfile(onSuccess) {
  const { user, updateUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setError,
    watch,
    reset
  } = useForm({
    mode: 'onChange'
  })

  const password = watch('password')

  // Inicializar valores del formulario cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      })
    }
  }, [user, reset])

  const onSubmit = useCallback(async (data) => {
    setIsSubmitting(true)

    try {
      // Preparar datos para el backend
      const profileData = {
        name: data.name,
        email: data.email
      }

      // Solo incluir password si se está cambiando
      if (data.password && data.password.trim() !== '') {
        profileData.password = data.password
      }

      // TODO: Reemplazar con endpoint real del backend
      let response

      // Por ahora simulamos la respuesta ya que el backend no está implementado
      if (process.env.NODE_ENV === 'development') {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Simular respuesta exitosa
        response = {
          data: {
            user: {
              id: user.id,
              name: profileData.name,
              email: profileData.email
            }
          }
        }
        console.log('Profile actualizado exitosamente (simulado):', response.data)
      } else {
        // En producción, hacer la llamada real
        response = await axios.put('/api/auth/profile', profileData, {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        })
        console.log('Profile actualizado exitosamente:', response.data)
      }

      // Actualizar los datos del usuario en el contexto
      updateUser({
        ...user,
        name: response.data.user.name,
        email: response.data.user.email
      })

      // Limpiar campos de contraseña después de guardar
      reset({
        name: response.data.user.name,
        email: response.data.user.email,
        password: '',
        confirmPassword: ''
      })

      // Llamar callback de éxito si se proporciona
      if (onSuccess) {
        onSuccess()
      }

      return { success: true, message: 'Perfil actualizado correctamente' }

    } catch (error) {
      // Solo mostrar errores de red en producción
      if (process.env.NODE_ENV !== 'development') {
        console.error('Error al actualizar perfil:', error)
      }

      // Manejar diferentes tipos de errores
      if (error.response?.status === 409) {
        setError('email', {
          type: 'manual',
          message: 'Este email ya está en uso por otra cuenta'
        })
      } else if (error.response?.status === 401) {
        setError('submit', {
          type: 'manual',
          message: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
        })
      } else if (error.response?.status === 400) {
        setError('submit', {
          type: 'manual',
          message: 'Datos inválidos. Revisa los campos y vuelve a intentar.'
        })
      } else if (error.response?.status === 404 && process.env.NODE_ENV === 'development') {
        // En desarrollo, el 404 es esperado porque el backend no está implementado
        console.log('Endpoint no implementado aún (esperado en desarrollo)')
        setError('submit', {
          type: 'manual',
          message: 'Funcionalidad no implementada en el backend aún.'
        })
      } else {
        setError('submit', {
          type: 'manual',
          message: 'Error al actualizar el perfil. Intenta nuevamente.'
        })
      }

      return { success: false, error: error.message }
    } finally {
      setIsSubmitting(false)
    }
  }, [user, updateUser, setError, reset])

  // Validaciones para los campos usando validaciones centralizadas
  const profileValidationRules = {
    name: validationRules.name,
    email: validationRules.email,
    password: validationRules.passwordOptional,
    confirmPassword: createOptionalPasswordConfirmValidation(password)
  }

  // Función para cancelar edición y resetear formulario
  const cancelEdit = useCallback(() => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: ''
    })
  }, [user, reset])

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isDirty,
    isSubmitting,
    validationRules: profileValidationRules,
    cancelEdit
  }
}