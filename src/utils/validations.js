// Validaciones comunes para formularios

export const validationRules = {
  name: {
    required: 'El nombre es requerido',
    minLength: {
      value: 2,
      message: 'El nombre debe tener al menos 2 caracteres'
    }
  },
  email: {
    required: 'El email es requerido',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email inválido'
    }
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres'
    }
  },
  passwordOptional: {
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres'
    }
  }
}

// Función para validar confirmación de contraseña
export const createPasswordConfirmValidation = (passwordValue) => ({
  required: 'Confirma tu contraseña',
  validate: (value) =>
    value === passwordValue || 'Las contraseñas no coinciden'
})

// Función para validar confirmación de contraseña opcional (para perfil)
export const createOptionalPasswordConfirmValidation = (passwordValue) => ({
  validate: (value) => {
    const pwd = passwordValue?.trim()
    if (pwd && pwd !== '') {
      return value === pwd || 'Las contraseñas no coinciden'
    }
    return true
  }
})

// Patrones de validación comunes
export const patterns = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/
}

// Mensajes de error comunes
export const errorMessages = {
  required: (field) => `${field} es requerido`,
  minLength: (field, min) => `${field} debe tener al menos ${min} caracteres`,
  maxLength: (field, max) => `${field} no puede tener más de ${max} caracteres`,
  pattern: (field) => `${field} tiene un formato inválido`,
  email: 'Email inválido',
  passwordMismatch: 'Las contraseñas no coinciden',
  passwordWeak: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
}