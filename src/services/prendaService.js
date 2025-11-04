import apiClient from './api'

export const prendaService = {
  crearPrenda: async (formData) => {
    try {
      validarFormDataPrenda(formData)
      
      const response = await apiClient.post('/crear-prenda', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response
    } catch (error) {
      console.error('Error en prendaService.crearPrenda:', error)
      throw error
    }
  }
}
          
const validarFormDataPrenda = (formData) => {
  if (!formData.has('codigoMarca')) {
    throw new Error('FormData debe contener codigoMarca')
  }
  if (!formData.has('nombre')) {
    throw new Error('FormData debe contener nombre')
  }
  if (!formData.has('tipo')) {
    throw new Error('FormData debe contener tipo')
  }
  if (!formData.has('imagen')) {
    throw new Error('FormData debe contener imagen')
  }

  const tipo = formData.get('tipo')
  if (tipo !== 'superior' && tipo !== 'inferior') {
    throw new Error('El tipo debe ser "superior" o "inferior"')
  }
}