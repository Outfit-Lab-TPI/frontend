// Validaciones comunes para formularios

export const validationRules = {
  name: {
    required: 'El nombre es obligatorio.',
  },
  lastName: {
    required: 'El apellido es obligatorio.',
  },
  email: {
    required: 'El correo electrónico es obligatorio.',
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Correo electrónico inválido.'
    }
  },
  password: {
    required: 'La contraseña es obligatoria.',
    minLength: {
      value: 8,
      message: 'La contraseña debe tener al menos 8 caracteres.'
    },
    pattern: {
      value: /^(?=.*[A-Z])(?=.*\d).*$/,
      message: 'Debe contener al menos una mayúscula y un número.'
    }
  },
  passwordOptional: {
    validate: {
      minLength: (value) => {
        if (!value || value.trim() === '') return true;
        return value.length >= 8 || 'La contraseña debe tener al menos 8 caracteres.';
      },
      pattern: (value) => {
        if (!value || value.trim() === '') return true;
        return /^(?=.*[A-Z])(?=.*\d).*$/.test(value) || 'Debe contener al menos una mayúscula y un número.';
      }
    }
  },
  confirmPassword: {
    required: 'Confirma la contraseña.'
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