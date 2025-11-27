import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useProbador } from '../../../src/hooks/probador/useProbador.jsx'
import { probadorService } from '../../../src/services/probador/probadorService.js'
import { favoritosService } from '../../../src/services/shared/favoritosService.js'

// Mocks de los servicios
vi.mock('../../../src/services/probador/probadorService.js', () => ({
  probadorService: {
    obtenerPrendasSuperiores: vi.fn(),
    obtenerPrendasInferiores: vi.fn()
  }
}))

vi.mock('../../../src/services/shared/favoritosService.js', () => ({
  favoritosService: {
    obtenerPrendasFavoritas: vi.fn()
  }
}))

describe('useProbador', () => {
  const mockPrendasSuperiores = {
    data: {
      content: [
        { garmentCode: 'SUP001', name: 'Camisa Azul', marcaNombre: 'Nike', color: 'azul' },
        { garmentCode: 'SUP002', name: 'Polo Blanco', marcaNombre: 'Adidas', color: 'blanco' }
      ]
    }
  }

  const mockPrendasInferiores = {
    data: {
      content: [
        { garmentCode: 'INF001', name: 'Pantalón Negro', marcaNombre: 'Nike', color: 'negro' },
        { garmentCode: 'INF002', name: 'Jeans Azul', marcaNombre: 'Levi\'s', color: 'azul' }
      ]
    }
  }

  const mockFavoritas = {
    data: {
      content: [
        { garmentCode: 'SUP001' }
      ]
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial load', () => {
    it('debe cargar prendas superiores, inferiores y favoritas al montar', async () => {
      // given
      probadorService.obtenerPrendasSuperiores.mockResolvedValueOnce(mockPrendasSuperiores)
      probadorService.obtenerPrendasInferiores.mockResolvedValueOnce(mockPrendasInferiores)
      favoritosService.obtenerPrendasFavoritas.mockResolvedValueOnce(mockFavoritas)

      // when
      const { result } = renderHook(() => useProbador())

      // then
      expect(result.current.loading).toBe(true)

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(probadorService.obtenerPrendasSuperiores).toHaveBeenCalledWith({}, 0, 10)
      expect(probadorService.obtenerPrendasInferiores).toHaveBeenCalledWith({}, 0, 10)
      expect(favoritosService.obtenerPrendasFavoritas).toHaveBeenCalledWith()

      expect(result.current.prendasCategorizadas.superiores).toHaveLength(2)
      expect(result.current.prendasCategorizadas.inferiores).toHaveLength(2)
      expect(result.current.prendasCategorizadas.superiores[0].esFavorita).toBe(true) // SUP001 está en favoritas
      expect(result.current.prendasCategorizadas.superiores[1].esFavorita).toBe(false)
    })

    it('debe manejar error al cargar favoritas y continuar sin ellas', async () => {
      // given
      probadorService.obtenerPrendasSuperiores.mockResolvedValueOnce(mockPrendasSuperiores)
      probadorService.obtenerPrendasInferiores.mockResolvedValueOnce(mockPrendasInferiores)
      favoritosService.obtenerPrendasFavoritas.mockRejectedValueOnce(new Error('Error favoritas'))

      // when
      const { result } = renderHook(() => useProbador())

      // then
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.prendasCategorizadas.superiores).toHaveLength(2)
      expect(result.current.prendasCategorizadas.inferiores).toHaveLength(2)
      expect(result.current.prendasCategorizadas.superiores[0].esFavorita).toBe(false) // Sin favoritas
      expect(result.current.error).toBe(null)
      expect(result.current.criticalError).toBe(null)
    })

    it('debe manejar errores críticos correctamente', async () => {
      // given
      const criticalError = new Error('Server Error')
      criticalError.isCritical = true
      probadorService.obtenerPrendasSuperiores.mockRejectedValueOnce(criticalError)
      probadorService.obtenerPrendasInferiores.mockResolvedValueOnce(mockPrendasInferiores)
      favoritosService.obtenerPrendasFavoritas.mockResolvedValueOnce(mockFavoritas)

      // when
      const { result } = renderHook(() => useProbador())

      // then
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.criticalError).toBe(criticalError)
      expect(result.current.error).toBe(null)
    })

    it('debe manejar errores no críticos correctamente', async () => {
      // given
      const nonCriticalError = new Error('Bad Request')
      nonCriticalError.isCritical = false
      nonCriticalError.response = { data: { message: 'Error personalizado' } }
      probadorService.obtenerPrendasSuperiores.mockRejectedValueOnce(nonCriticalError)
      probadorService.obtenerPrendasInferiores.mockResolvedValueOnce(mockPrendasInferiores)
      favoritosService.obtenerPrendasFavoritas.mockResolvedValueOnce(mockFavoritas)

      // when
      const { result } = renderHook(() => useProbador())

      // then
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBe('Error personalizado')
      expect(result.current.criticalError).toBe(null)
    })
  })

  describe('filtros', () => {
    beforeEach(() => {
      probadorService.obtenerPrendasSuperiores.mockResolvedValue(mockPrendasSuperiores)
      probadorService.obtenerPrendasInferiores.mockResolvedValue(mockPrendasInferiores)
      favoritosService.obtenerPrendasFavoritas.mockResolvedValue(mockFavoritas)
    })

    it('debe filtrar por marca correctamente', async () => {
      // given
      const { result } = renderHook(() => useProbador())

      await waitFor(() => expect(result.current.loading).toBe(false))

      // when
      act(() => {
        result.current.actualizarFiltros({ marca: 'Nike' })
      })

      // then
      expect(result.current.filtros.marca).toBe('Nike')
      expect(result.current.prendasCategorizadas.superiores).toHaveLength(1)
      expect(result.current.prendasCategorizadas.superiores[0].marcaNombre).toBe('Nike')
      expect(result.current.prendasCategorizadas.inferiores).toHaveLength(1)
      expect(result.current.prendasCategorizadas.inferiores[0].marcaNombre).toBe('Nike')
    })

    it('debe filtrar solo favoritas correctamente', async () => {
      // given
      const { result } = renderHook(() => useProbador())

      await waitFor(() => expect(result.current.loading).toBe(false))

      // when
      act(() => {
        result.current.actualizarFiltros({ soloFavoritas: true })
      })

      // then
      expect(result.current.filtros.soloFavoritas).toBe(true)
      expect(result.current.prendasCategorizadas.superiores).toHaveLength(1)
      expect(result.current.prendasCategorizadas.superiores[0].esFavorita).toBe(true)
      expect(result.current.prendasCategorizadas.inferiores).toHaveLength(0) // No hay inferiores favoritas
    })

    it('debe combinar múltiples filtros', async () => {
      // given
      const { result } = renderHook(() => useProbador())

      await waitFor(() => expect(result.current.loading).toBe(false))

      // when
      act(() => {
        result.current.actualizarFiltros({ marca: 'Nike', color: 'azul' })
      })

      // then
      expect(result.current.prendasCategorizadas.superiores).toHaveLength(1)
      expect(result.current.prendasCategorizadas.superiores[0].marcaNombre).toBe('Nike')
      expect(result.current.prendasCategorizadas.superiores[0].color).toBe('azul')
    })

    it('debe limpiar filtros correctamente', async () => {
      // given
      const { result } = renderHook(() => useProbador())

      await waitFor(() => expect(result.current.loading).toBe(false))

      act(() => {
        result.current.actualizarFiltros({ marca: 'Nike', color: 'azul', soloFavoritas: true })
      })

      // when
      act(() => {
        result.current.limpiarFiltros()
      })

      // then
      expect(result.current.filtros).toEqual({
        marca: '',
        color: '',
        genero: '',
        soloFavoritas: false
      })
      expect(result.current.prendasCategorizadas.superiores).toHaveLength(2)
      expect(result.current.prendasCategorizadas.inferiores).toHaveLength(2)
    })
  })

  describe('marcas disponibles', () => {
    beforeEach(() => {
      probadorService.obtenerPrendasSuperiores.mockResolvedValue(mockPrendasSuperiores)
      probadorService.obtenerPrendasInferiores.mockResolvedValue(mockPrendasInferiores)
      favoritosService.obtenerPrendasFavoritas.mockResolvedValue(mockFavoritas)
    })

    it('debe calcular marcas disponibles correctamente', async () => {
      // given
      const { result } = renderHook(() => useProbador())

      // when
      await waitFor(() => expect(result.current.loading).toBe(false))

      // then
      expect(result.current.marcasDisponibles).toEqual(['Adidas', 'Levi\'s', 'Nike'])
    })
  })

  describe('actualizar favorito local', () => {
    beforeEach(() => {
      probadorService.obtenerPrendasSuperiores.mockResolvedValue(mockPrendasSuperiores)
      probadorService.obtenerPrendasInferiores.mockResolvedValue(mockPrendasInferiores)
      favoritosService.obtenerPrendasFavoritas.mockResolvedValue(mockFavoritas)
    })

    it('debe actualizar estado de favorito localmente', async () => {
      // given
      const { result } = renderHook(() => useProbador())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.prendasCategorizadas.superiores[1].esFavorita).toBe(false) // SUP002 inicialmente no es favorita

      // when
      act(() => {
        result.current.actualizarFavoritoLocal('SUP002', true)
      })

      // then
      expect(result.current.prendasCategorizadas.superiores[1].esFavorita).toBe(true)
    })

    it('debe actualizar favorito en prendas inferiores', async () => {
      // given
      const { result } = renderHook(() => useProbador())

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.prendasCategorizadas.inferiores[0].esFavorita).toBe(false) // INF001 inicialmente no es favorita

      // when
      act(() => {
        result.current.actualizarFavoritoLocal('INF001', true)
      })

      // then
      expect(result.current.prendasCategorizadas.inferiores[0].esFavorita).toBe(true)
    })
  })

})