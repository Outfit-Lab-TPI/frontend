import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { prendaService } from '../services/prendaService'

export function useNuevaPrenda() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({ mode: 'onChange' })
  const { register, handleSubmit, formState: { errors }, setError, watch } = form

  const onSubmit = useCallback(async (data) => {
    if (!data.imagen || !data.imagen[0]) {
      setError('imagen', {
        type: 'manual',
        message: 'Debe seleccionar una imagen'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('codigoMarca', 'OUTFIT_LAB') // codigo hardcodeado
      formData.append('nombre', data.nombre)
      formData.append('tipo', data.tipo)
      formData.append('imagen', data.imagen[0])

      const response = await prendaService.crearPrenda(formData)
      console.log('Prenda creada exitosamente:', response.data)
      navigate('/home')
    } catch (error) {
      console.error('Error al crear prenda:', error)

      let errorMessage = 'Error al crear la prenda.'

      if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos. Verifica la información ingresada.'
      } else if (error.response?.status === 413) {
        errorMessage = 'La imagen es demasiado grande. Intenta con una imagen más pequeña.'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Ha ocurrido un error. Por favor intenta más tarde.'
      }

      setError('submit', {
        type: 'manual',
        message: errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [navigate, setError])

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    watch
  }
}