import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from './useAuth'
import { validationRules, createOptionalPasswordConfirmValidation } from '../../utils/validations'
import { perfilService } from '../../services/perfilService'

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

      // Usar el perfilService para actualizar el perfil
      response = await perfilService.actualizarPerfil(user.id, formData)

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
      console.error('Error al actualizar perfil:', error)

      // Manejar diferentes tipos de errores del servicio
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
      } else if (error.isCritical) {
        setError('submit', {
          type: 'manual',
          message: 'Error de conexión. Revisa tu conexión a internet e inténtalo nuevamente.'
        })
      } else {
        setError('submit', {
          type: 'manual',
          message: error.message || 'Error al actualizar el perfil. Intenta nuevamente.'
        })
      }

      return { success: false, error: error.message }
    } finally {
      setIsSubmitting(false)
    }
  }, [user, updateUser, setError, reset, data])

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