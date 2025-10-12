import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { prendaAPI } from '../services/api'

export function useNuevaPrenda() {
  const navigate = useNavigate()
  const [images, setImages] = useState({ frente: null, atras: null })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({ mode: 'onChange' })
  const { register, handleSubmit, formState: { errors, isValid }, setError, setValue } = form

  const handleImagesChange = useCallback((newImages) => {
    setImages(newImages)
    const hasImages = newImages.frente && newImages.atras
    setValue('imagenes', hasImages ? 'valid' : '', { shouldValidate: true })
  }, [setValue])

  const handleImageError = useCallback((error) => {
    setError('imagenes', { type: 'manual', message: error })
  }, [setError])

  const handleCancel = useCallback(() => {
    navigate('/home')
  }, [navigate])

  const onSubmit = useCallback(async (data) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('nombre', data.nombre)
      formData.append('tipo', data.tipo)
      formData.append('image', images.frente)
    //   formData.append('imageFrente', images.frente)
      formData.append('imagenAtras', images.atras)

      const response = await prendaAPI.crearNuevaPrenda(formData)
      console.log('Prenda creada exitosamente:', response.data)
      navigate('/home')
    } catch (error) {
      console.error('Error al crear prenda:', error)
      setError('submit', {
        type: 'manual',
        message: 'Error al crear la prenda.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [images, navigate, setError])

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isSubmitting,
    handleImagesChange,
    handleImageError,
    handleCancel
  }
}