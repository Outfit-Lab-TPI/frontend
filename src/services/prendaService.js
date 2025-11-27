import apiClient from './api'

export const prendaService = {
  crearPrenda: async (formData) => {
    try {
      validarFormDataPrenda(formData)

      const response = await apiClient.post('/garments/new', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    } catch (error) {
      console.error('Error en prendaService.crearPrenda:', error)
      throw error
    }
  },

  editarPrenda: async (id, formData) => {
    try {
      console.log('Editando prenda en servicio:', { id, formData })
      console.log(formData)
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      // TODO: Implementar endpoint para editar prenda
      const response = await apiClient.patch(`/garments/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    } catch (error) {
      console.error('Error en prendaService.editarPrenda:', error)
      throw error
    }
  },

  eliminarPrenda: async (id) => {
    try {
      console.log('Eliminando prenda en servicio:', { id })

      const response = await apiClient.delete(`/garments/delete/${id}`)
      return response
    } catch (error) {
      console.error('Error en prendaService.eliminarPrenda:', error)
      throw error
    }
  },


  getFiltros: async () => {
    try {
      const response = await apiClient.get("/categories/recommendation");
      return response.data; // viene: { climas, ocasiones, colores }
    } catch (error) {
      console.error("Error al obtener filtros:", error);
      throw error;
    }
  },
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