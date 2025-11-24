import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { prendaService } from '../services/prendaService'
import { useAuth } from './auth/useAuth'

export function usePrendaCRUD() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm({ mode: 'onChange' })
  const { register, handleSubmit, formState: { errors }, setError, watch, reset, setValue } = form
  const { user } = useAuth()



//----------------------------------------------------------------------------------------------------------
// --- NUEVO: estados para colores y ocasiones ---
  const [colores, setColores] = useState([]);
  const [ocaciones, setOcaciones] = useState([]);
  const [climas, setClimas] = useState([]);

  const fetchFiltros = useCallback(async () => {
    try {
      const { colores, ocasiones, climas } = await prendaService.getFiltros();

      setColores(colores || []);
      setOcaciones(ocasiones || []);
      setClimas(climas || []);
    } catch (error) {
      console.error("Error cargando filtros:", error);
      setColores([]);
      setOcaciones([]);
      setClimas([]);
    }
  }, []);

  useEffect(() => {
    fetchFiltros();
  }, [fetchFiltros]);
  //----------------------------------------------------------------------------------------------------------















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

      console.log("MARCA DEL USER LOGUEADO:" + user.brand?.codigoMarca);
      let codigoMarcaDeUserDeSession = user.brand.codigoMarca; 

      formData.append('codigoMarca', codigoMarcaDeUserDeSession) //'puma'  TODO: obtener del auth context
      formData.append('nombre', data.nombre)
      formData.append('tipo', data.tipo)
      formData.append('colorNombre', data.color)
      formData.append('ocasionesNombres', data.ocacion)
      formData.append('climaNombre', data.clima)
      formData.append('imagen', data.imagen[0])


      console.log('codigoMarca', 'puma') // TODO: obtener del auth context
      console.log('nombre', data.nombre)
      console.log('tipo', data.tipo)
      console.log('colorNombre', data.color)
      console.log('ocasionesNombres', data.ocacion)
      console.log('climaNombre', data.clima)

      const response = await prendaService.crearPrenda(formData)
      toast.success('Prenda creada exitosamente')
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
      formData.append('colorNombre', data.color)
      formData.append('ocasionesNombres', data.ocacion)
      formData.append('climaNombre', data.clima)

      if (data.imagen && data.imagen[0]) {
        formData.append('imagen', data.imagen[0])
      }

      console.log('Editando prenda:', { id, nombre: data.nombre, tipo: data.tipo })
      const response = await prendaService.editarPrenda(id, formData)
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
      await prendaService.eliminarPrenda(id)
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
    colores,
    ocaciones,
    climas,
  }
}