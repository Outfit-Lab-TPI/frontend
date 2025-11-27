import { describe, it, expect, beforeEach, vi } from 'vitest'
import apiClient from '../../../src/services/api.js'
import { marcaService } from '../../../src/services/marca/marcaService.js'

// Mock de apiClient
vi.mock('../../../src/services/api.js', () => ({
  default: {
    get: vi.fn()
  }
}))

describe('marcaService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllMarcas', () => {
    it('debe devolver un array de marcas cuando la request es exitosa', async () => {
      const mockData = [{ codigo: 'M1', nombre: 'Marca 1' }]
      apiClient.get.mockResolvedValueOnce({ data: mockData })

      const result = await marcaService.getAllMarcas()

      expect(apiClient.get).toHaveBeenCalledWith('/marcas')
      expect(result.data).toEqual(mockData)
    })

    it('debe lanzar un error crítico si ocurre un error de servidor 500', async () => {
      const error = { response: { status: 500 } }
      apiClient.get.mockRejectedValueOnce(error)

      await expect(marcaService.getAllMarcas()).rejects.toMatchObject({ isCritical: true })
    })

    it('debe lanzar un error no crítico si ocurre un error 400', async () => {
      const error = { response: { status: 400 } }
      apiClient.get.mockRejectedValueOnce(error)

      await expect(marcaService.getAllMarcas()).rejects.toMatchObject({ isCritical: false })
    })
  })

  describe('getMarcaByCode', () => {
    it('debe devolver los detalles de la marca correctamente', async () => {
      const codigo = 'M1'
      const mockData = { codigo, nombre: 'Marca 1' }
      apiClient.get.mockResolvedValueOnce({ data: mockData })

      const result = await marcaService.getMarcaByCode(codigo)

      expect(apiClient.get).toHaveBeenCalledWith(`/marcas/${codigo}`)
      expect(result.data).toEqual(mockData)
    })

    it.each([
      [{ response: { status: 500 } }, true],
      [{ response: { status: 400 } }, false],
      [{ request: {} }, true],
      [{}, false]
    ])('debe establecer isCritical=%p para error %p', async (errorInput, expectedCritical) => {
      apiClient.get.mockRejectedValueOnce(errorInput)

      await expect(marcaService.getMarcaByCode('M1')).rejects.toMatchObject({
        isCritical: expectedCritical
      })
    })
  })
})
