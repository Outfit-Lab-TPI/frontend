import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { prendaService } from '../services/prendaService'

export function usePrendaCRUD() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({ mode: 'onChange' })
  const { register, handleSubmit, formState: { errors }, setError, watch, reset, setValue } = form

  const crearPrenda = useCallback(async (data) => {
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
      formData.append('codigoMarca', 'puma') // TODO: obtener del auth context
      formData.append('nombre', data.nombre)
      formData.append('tipo', data.tipo)
      formData.append('color', data.color)
      formData.append('evento', data.evento)
      formData.append('imagen', data.imagen[0])

      console.log('Creando prenda:', { codigoMarca: 'puma', nombre: data.nombre, tipo: data.tipo })
      const response = await prendaService.crearPrenda(formData)
      return true
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
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [setError])

  const editarPrenda = useCallback(async (id, data) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('nombre', data.nombre)
      formData.append('tipo', data.tipo)
      if (data.imagen && data.imagen[0]) {
        formData.append('imagen', data.imagen[0])
      }

      console.log('Editando prenda:', { id, nombre: data.nombre, tipo: data.tipo })
      // const response = await prendaService.editarPrenda(id, formData)
      return true
    } catch (error) {
      console.error('Error al editar prenda:', error)

      setError('submit', {
        type: 'manual',
        message: 'Error al actualizar la prenda.'
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [setError])

  const eliminarPrenda = useCallback(async (id) => {
    try {
      console.log('Eliminando prenda:', { id })
      // await prendaService.eliminarPrenda(id)
      return true
    } catch (error) {
      console.error('Error al eliminar prenda:', error)
      return false
    }
  }, [])

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watch,
    reset,
    setValue,
    crearPrenda,
    editarPrenda,
    eliminarPrenda,
  }
}