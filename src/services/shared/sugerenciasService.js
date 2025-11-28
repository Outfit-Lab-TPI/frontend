import apiClient from '../api.js'

export const sugerenciasService = {
  getSugerencias: async (garmentCode) => {
    try {
      if (!garmentCode) {
        throw new Error('El código de prenda es requerido')
      }

      const response = await apiClient.get(`/garment-recomendation/${garmentCode}`)

      return response
    } catch (error) {
      console.error('Error en sugerenciasService.getSugerencias:', error)
      throw error
    }
  }
}