import { describe, it, expect } from 'vitest'
import { searchGarments } from '../../src/lib/searchUtils.js'

describe('searchUtils', () => {
  const mockGarments = [
    {
      nombre: 'Camiseta Nike',
      marcaNombre: 'Nike',
      garmentCode: 'NK001',
      color: 'Rojo'
    },
    {
      nombre: 'Pantalón Adidas',
      marcaNombre: 'Adidas',
      garmentCode: 'AD002',
      color: 'Azul'
    },
    {
      nombre: 'Zapatos Puma',
      marcaNombre: 'Puma',
      garmentCode: 'PM003',
      color: 'Negro'
    },
    {
      nombre: 'Camisa élite',
      marcaNombre: 'Élite Brand',
      garmentCode: 'EL004',
      color: 'Café'
    }
  ]

  describe('searchGarments', () => {
    it('debe retornar todas las prendas si no hay texto de búsqueda', () => {
      // given / when
      const result = searchGarments(mockGarments, '')

      // then
      expect(result).toEqual(mockGarments)
    })

    it('debe buscar por nombre', () => {
      // given / when
      const result = searchGarments(mockGarments, 'camiseta')

      // then
      expect(result).toHaveLength(1)
      expect(result[0].nombre).toBe('Camiseta Nike')
    })

    it('debe buscar por marca', () => {
      // given / when
      const result = searchGarments(mockGarments, 'adidas')

      // then
      expect(result).toHaveLength(1)
      expect(result[0].marcaNombre).toBe('Adidas')
    })

    it('debe buscar por código', () => {
      // given / when
      const result = searchGarments(mockGarments, 'PM003')

      // then
      expect(result).toHaveLength(1)
      expect(result[0].garmentCode).toBe('PM003')
    })

    it('debe buscar por color', () => {
      // given / when
      const result = searchGarments(mockGarments, 'azul')

      // then
      expect(result).toHaveLength(1)
      expect(result[0].color).toBe('Azul')
    })

    it('debe ser case-insensitive', () => {
      // given / when
      const result = searchGarments(mockGarments, 'NIKE')

      // then
      expect(result).toHaveLength(1)
      expect(result[0].marcaNombre).toBe('Nike')
    })

    it('debe normalizar acentos', () => {
      // given / when
      const result = searchGarments(mockGarments, 'elite')

      // then
      expect(result).toHaveLength(1)
      expect(result[0].nombre).toBe('Camisa élite')
    })

    it('debe retornar array vacío si no hay coincidencias', () => {
      // given / when
      const result = searchGarments(mockGarments, 'inexistente')

      // then
      expect(result).toHaveLength(0)
    })

    it('debe buscar coincidencias parciales', () => {
      // given / when
      const result = searchGarments(mockGarments, 'cam')

      // then
      expect(result).toHaveLength(2) // Camiseta y Camisa
    })
  })
})
