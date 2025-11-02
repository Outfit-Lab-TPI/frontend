import apiClient from './api'

export const sugerenciasService = {
  getSugerencias: async (garmentCode) => {
    try {
      if (!garmentCode) {
        throw new Error('El código de prenda es requerido')
      }

      console.log('Obteniendo sugerencias para prenda:', garmentCode)

      const response = await apiClient.get(`/garment-recomendation/${garmentCode}`)

      return response
    } catch (error) {
      console.error('Error en sugerenciasService.getSugerencias:', error)
      throw error
    }
  }
}