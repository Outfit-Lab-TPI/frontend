import { describe, it, expect } from 'vitest'
import {
  validationRules,
  createPasswordConfirmValidation,
  createOptionalPasswordConfirmValidation,
  patterns,
  errorMessages
} from '../../src/lib/validations.js'

describe('validations', () => {
  describe('patterns', () => {
    it('debe validar formato de email', () => {
      expect(patterns.email.test('test@example.com')).toBe(true)
      expect(patterns.email.test('user.name@domain.co.uk')).toBe(true)
      expect(patterns.email.test('invalid-email')).toBe(false)
      expect(patterns.email.test('missing@domain')).toBe(false)
    })

    it('debe validar contraseña fuerte', () => {
      expect(patterns.strongPassword.test('Password123')).toBe(true)
      expect(patterns.strongPassword.test('UPPER123lower')).toBe(true)
      expect(patterns.strongPassword.test('password')).toBe(false)
      expect(patterns.strongPassword.test('Pass123')).toBe(false) // muy corta
    })

    it('debe validar número de teléfono', () => {
      expect(patterns.phone.test('+5491123456789')).toBe(true)
      expect(patterns.phone.test('5491123456789')).toBe(true)
      expect(patterns.phone.test('123456')).toBe(true)
      expect(patterns.phone.test('abc123')).toBe(false)
    })
  })

  describe('validationRules', () => {
    describe('email', () => {
      it('debe requerir campo', () => {
        expect(validationRules.email.required).toBe('El correo electrónico es obligatorio.')
      })

      it('debe validar patrón de email', () => {
        const { pattern } = validationRules.email

        expect(pattern.value.test('valid@email.com')).toBe(true)
        expect(pattern.value.test('invalid')).toBe(false)
        expect(pattern.message).toBe('Correo electrónico inválido.')
      })
    })

    describe('password', () => {
      it('debe requerir campo', () => {
        expect(validationRules.password.required).toBe('La contraseña es obligatoria.')
      })

      it('debe validar longitud mínima', () => {
        const { minLength } = validationRules.password

        expect(minLength.value).toBe(8)
        expect(minLength.message).toBe('La contraseña debe tener al menos 8 caracteres.')
      })

      it('debe validar mayúscula y número', () => {
        const { pattern } = validationRules.password

        expect(pattern.value.test('Password123')).toBe(true)
        expect(pattern.value.test('weak')).toBe(false)
        expect(pattern.message).toContain('mayúscula')
        expect(pattern.message).toContain('número')
      })
    })

    describe('name', () => {
      it('debe requerir campo', () => {
        expect(validationRules.name.required).toBe('El nombre es obligatorio.')
      })
    })

    describe('lastName', () => {
      it('debe requerir campo', () => {
        expect(validationRules.lastName.required).toBe('El apellido es obligatorio.')
      })
    })

    describe('passwordOptional', () => {
      it('debe validar contraseña opcional', () => {
        const { validate } = validationRules.passwordOptional

        expect(validate.minLength('')).toBe(true) // vacío es válido
        expect(validate.minLength('Password123')).toBe(true)
        expect(validate.minLength('Short')).toContain('al menos 8')
      })

      it('debe validar patrón en contraseña opcional', () => {
        const { validate } = validationRules.passwordOptional

        expect(validate.pattern('')).toBe(true) // vacío es válido
        expect(validate.pattern('Password123')).toBe(true)
        expect(validate.pattern('password123')).toContain('mayúscula')
      })
    })

    describe('confirmPassword', () => {
      it('debe requerir confirmación', () => {
        expect(validationRules.confirmPassword.required).toBe('Confirma la contraseña.')
      })
    })

    describe('passwordLogin', () => {
      it('debe requerir contraseña para login', () => {
        expect(validationRules.passwordLogin.required).toBe('La contraseña es obligatoria.')
      })
    })
  })

  describe('createPasswordConfirmValidation', () => {
    it('debe validar que las contraseñas coincidan', () => {
      const validation = createPasswordConfirmValidation('Password123')

      expect(validation.required).toBe('Confirma tu contraseña')
      expect(validation.validate('Password123')).toBe(true)
      expect(validation.validate('DifferentPassword')).toBe('Las contraseñas no coinciden')
    })
  })
})
