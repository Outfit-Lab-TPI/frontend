import { describe, it, expect, beforeEach, vi } from 'vitest'
import apiClient from '../../../src/services/api.js'
import { prendaService } from '../../../src/services/marca/prendaService.js'

// Mock de apiClient
vi.mock('../../../src/services/api.js', () => ({
  default: { post: vi.fn() }
}))

describe('prendaService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createFormData = (overrides = {}) => {
    const data = new FormData()
    data.append('codigoMarca', overrides.codigoMarca || 'M1')
    data.append('nombre', overrides.nombre || 'Prenda Test')
    data.append('tipo', overrides.tipo || 'superior')
    data.append('imagen', overrides.imagen || new File(['dummy'], 'imagen.png', { type: 'image/png' }))
    return data
  }

  describe('Validaciones', () => {
    it('debe lanzar error si falta codigoMarca', async () => {
      const data = createFormData({ codigoMarca: null })
      data.delete('codigoMarca')

      await expect(prendaService.crearPrenda(data)).rejects.toThrow('FormData debe contener codigoMarca')
    })

    it('debe lanzar error si falta nombre', async () => {
      const data = createFormData()
      data.delete('nombre')

      await expect(prendaService.crearPrenda(data)).rejects.toThrow('FormData debe contener nombre')
    })

    it('debe lanzar error si tipo es inválido', async () => {
      const data = createFormData({ tipo: 'zapato' })

      await expect(prendaService.crearPrenda(data)).rejects.toThrow('El tipo debe ser "superior" o "inferior"')
    })
  })

  describe('Llamada al backend', () => {
    it('debe llamar a apiClient.post con FormData y headers correctos', async () => {
      const data = createFormData()
      const mockResponse = { data: { success: true } }
      apiClient.post.mockResolvedValueOnce(mockResponse)

      const result = await prendaService.crearPrenda(data)

      expect(apiClient.post).toHaveBeenCalledWith(
        '/garments/new',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(result).toEqual(mockResponse)
    })

    it('debe propagar el error si apiClient.post falla', async () => {
      const data = createFormData()
      const error = new Error('Servidor caído')
      apiClient.post.mockRejectedValueOnce(error)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(prendaService.crearPrenda(data)).rejects.toThrow('Servidor caído')
      expect(consoleSpy).toHaveBeenCalledWith('Error en prendaService.crearPrenda:', error)

      consoleSpy.mockRestore()
    })
  })
})
