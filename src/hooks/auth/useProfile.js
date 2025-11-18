import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from './useAuth'
import { validationRules, createOptionalPasswordConfirmValidation } from '../../lib/validations'
import { perfilService } from '../../services/perfilService'
import { validateCustomImageLogic, VALIDATION_STATUS } from '../../lib/imageBodyValidation'

export function useProfile(onSuccess) {
  const { user, updateUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isValidatingImage, setIsValidatingImage] = useState(false)
  const [avatarValidationSuccess, setAvatarValidationSuccess] = useState(null)

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

  // DEBUG: Deshabilitado para producción
  // React.useEffect(() => {
  //   console.log('🐛 useProfile DEBUG:', { isValid, errors, ... })
  // }, [errors, isValid, isDirty, watch])

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

      // No incluir avatarGenero ya que se maneja solo en los probadores

      // TODO: Reemplazar con endpoint real del backend
      let response

      // Usar el perfilService para actualizar el perfil
      response = await perfilService.actualizarPerfil(user.id, formData)

      // Actualizar los datos del usuario en el contexto
      updateUser({
        ...user,
        name: response.data.user.name,
        email: response.data.user.email,
        avatarUrl: response.data.user.avatarUrl,
        // Preservar avatarGenero existente si lo hay
        avatarGenero: response.data.user.avatarGenero || user.avatarGenero
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

      // Manejo de errores siguiendo el patrón estándar de la app
      if (error.isCritical) {
        // Error crítico - delegamos al Error Boundary
        throw error;
      } else {
        // Error no crítico - manejar en el formulario
        if (error.message?.includes('email ya está en uso')) {
          setError('email', {
            type: 'manual',
            message: error.message
          })
        } else {
          setError('submit', {
            type: 'manual',
            message: error.message || 'Error al actualizar el perfil. Intenta nuevamente.'
          })
        }
      }

      return { success: false, error: error.message }
    } finally {
      setIsSubmitting(false)
    }
  }, [user, updateUser, setError, reset])

  // Constantes de validación de archivos
  const FILE_VALIDATION = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MESSAGES: {
      SIZE_ERROR: 'La imagen no debe superar los 5MB',
      TYPE_ERROR: 'Solo se permiten archivos JPG, PNG o WebP'
    }
  }

  // Helper para validaciones de archivo
  const validateFile = {
    size: (files) => {
      if (!files?.[0]) return true
      return files[0].size <= FILE_VALIDATION.MAX_SIZE || FILE_VALIDATION.MESSAGES.SIZE_ERROR
    },

    type: (files) => {
      if (!files?.[0]) return true
      return FILE_VALIDATION.ALLOWED_TYPES.includes(files[0].type) || FILE_VALIDATION.MESSAGES.TYPE_ERROR
    },

    bodyValidation: async (files) => {
      if (!files?.[0]) {
        setIsValidatingImage(false)
        setAvatarValidationSuccess(null)
        return true
      }

      setIsValidatingImage(true)
      setAvatarValidationSuccess(null)

      try {
        const validationResult = await validateCustomImageLogic(files[0])

        if (validationResult.status === VALIDATION_STATUS.SUCCESS) {
          setAvatarValidationSuccess(validationResult.message)
          return true // ✅ Solo true para éxito, no strings
        } else {
          setAvatarValidationSuccess(null)
          return validationResult.message // ❌ Solo errores van al objeto errors
        }
      } catch (error) {
        console.error('Error en validación de imagen:', error)
        setAvatarValidationSuccess(null)
        return 'Error procesando la imagen. Intenta nuevamente.'
      } finally {
        setIsValidatingImage(false)
      }
    }
  }

  // Validaciones para los campos usando validaciones centralizadas
  const profileValidationRules = {
    name: validationRules.name,
    email: validationRules.email,
    password: validationRules.passwordOptional,
    confirmPassword: createOptionalPasswordConfirmValidation(password),
    avatar: {
      validate: {
        fileSize: validateFile.size,
        fileType: validateFile.type,
        customBodyValidation: validateFile.bodyValidation
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
    isValidatingImage,
    avatarValidationSuccess,
    validationRules: profileValidationRules,
    cancelEdit,
    selectedImage,
    handleImageChange,
    removeImage
  }
}