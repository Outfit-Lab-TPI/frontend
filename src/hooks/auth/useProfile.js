import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from './useAuth'
import { validationRules, createOptionalPasswordConfirmValidation } from '../../utils/validations'
import axios from 'axios'

export function useProfile(onSuccess) {
  const { user, updateUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

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
      // Cargar imagen de perfil existente si la hay
      setSelectedImage(user.avatarUrl || null)
    }
  }, [user, reset])

  const onSubmit = useCallback(async (data) => {
    setIsSubmitting(true)

    try {
      // Preparar FormData para enviar archivos
      const formData = new FormData()

      // Agregar campos básicos
      formData.append('name', data.name)
      formData.append('email', data.email)

      // Solo incluir password si se está cambiando
      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password)
      }

      // Incluir imagen si hay una nueva seleccionada
      if (data.avatar && data.avatar[0]) {
        formData.append('avatar', data.avatar[0])
      }

      // TODO: Reemplazar con endpoint real del backend
      let response

      // Por ahora simulamos la respuesta ya que el backend no está implementado
      if (process.env.NODE_ENV === 'development') {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Simular URL de avatar si se subió una imagen
        let avatarUrl = user.avatarUrl
        if (data.avatar && data.avatar[0]) {
          // En desarrollo, simular URL de la imagen subida
          avatarUrl = URL.createObjectURL(data.avatar[0])
        }

        // Simular respuesta exitosa
        response = {
          data: {
            user: {
              id: user.id,
              name: formData.get('name'),
              email: formData.get('email'),
              avatarUrl: avatarUrl
            }
          }
        }
        console.log('Profile actualizado exitosamente (simulado):', response.data)
      } else {
        // En producción, hacer la llamada real
        response = await axios.put('/api/auth/profile', formData, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        console.log('Profile actualizado exitosamente:', response.data)
      }

      // Actualizar los datos del usuario en el contexto
      updateUser({
        ...user,
        name: response.data.user.name,
        email: response.data.user.email,
        avatarUrl: response.data.user.avatarUrl
      })

      // Actualizar imagen local
      setSelectedImage(response.data.user.avatarUrl)

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
    confirmPassword: createOptionalPasswordConfirmValidation(password),
    avatar: {
      validate: {
        fileSize: files => {
          if (!files || !files[0]) return true // Opcional
          const maxSize = 5 * 1024 * 1024 // 5MB
          return files[0].size <= maxSize || 'La imagen no debe superar los 5MB'
        },
        fileType: files => {
          if (!files || !files[0]) return true // Opcional
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
          return allowedTypes.includes(files[0].type) || 'Solo se permiten archivos JPG, PNG o WebP'
        }
      }
    }
  }

  // Función para cancelar edición y resetear formulario
  const cancelEdit = useCallback(() => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: ''
    })
    setSelectedImage(user?.avatarUrl || null)
  }, [user, reset])

  // Función para manejar cambio de imagen
  const handleImageChange = useCallback((event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // Función para eliminar imagen
  const removeImage = useCallback(() => {
    setSelectedImage(user?.avatarUrl || null)
    const fileInput = document.getElementById('avatar')
    if (fileInput) {
      fileInput.value = ''
    }
  }, [user?.avatarUrl])

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isDirty,
    isSubmitting,
    validationRules: profileValidationRules,
    cancelEdit,
    selectedImage,
    handleImageChange,
    removeImage
  }
}