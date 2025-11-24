import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cn, handleBack } from '../../src/lib/utils.js'

describe('utils', () => {
  describe('handleBack', () => {
    let mockNavigate

    beforeEach(() => {
      mockNavigate = vi.fn()
      // Mock window.history
      Object.defineProperty(window, 'history', {
        writable: true,
        value: { length: 1 }
      })
    })

    it('debe navegar a URL específica si se proporciona', () => {
      // given / when
      handleBack(mockNavigate, '/custom-url')

      // then
      expect(mockNavigate).toHaveBeenCalledWith('/custom-url')
    })

    it('debe navegar hacia atrás si hay historial', () => {
      // given
      window.history.length = 3

      // when
      handleBack(mockNavigate)

      // then
      expect(mockNavigate).toHaveBeenCalledWith(-1)
    })

    it('debe navegar a /perfil si no hay historial', () => {
      // given
      window.history.length = 1

      // when
      handleBack(mockNavigate)

      // then
      expect(mockNavigate).toHaveBeenCalledWith('/perfil')
    })

    it('debe priorizar URL sobre historial', () => {
      // given
      window.history.length = 5

      // when
      handleBack(mockNavigate, '/priority-url')

      // then
      expect(mockNavigate).toHaveBeenCalledWith('/priority-url')
      expect(mockNavigate).not.toHaveBeenCalledWith(-1)
    })
  })
})
