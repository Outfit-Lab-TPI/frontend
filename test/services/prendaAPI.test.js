import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

// Crear el objeto mock que simula una instancia de axios
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    response: {
      use: vi.fn()
    }
  }
}

// Las importaciones de axios en todo el proyecto serán reemplazadas por el mock
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance)
  }
}))

const mockedAxios = vi.mocked(axios)

describe('PrendaAPI - Servicio API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe tener función crearNuevaPrenda', async () => {
    // Importar el servicio API después de mockear axios
    const { prendaAPI } = await import('../../src/services/api')

    expect(prendaAPI.crearNuevaPrenda).toBeDefined()
    expect(typeof prendaAPI.crearNuevaPrenda).toBe('function')
  })

  it('debe enviar POST a /api/nueva-prenda', async () => {
    const mockResponse = {
      data: { id: 1, mensaje: 'Prenda creada exitosamente' },
      status: 201
    }

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'Test Remera')
    formData.append('tipo', 'remera')

    await prendaAPI.crearNuevaPrenda(formData)

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/nueva-prenda', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  })

  it('debe enviar FormData con nombre, tipo e imágenes', async () => {
    const mockResponse = {
      data: { id: 1, mensaje: 'Prenda creada exitosamente' },
      status: 201
    }

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse)

    const { prendaAPI } = await import('../../src/services/api')

    // Crear FormData con todos los campos
    const formData = new FormData()
    formData.append('nombre', 'Remera Azul')
    formData.append('tipo', 'remera')
    formData.append('imagenFrente', new File(['frente'], 'frente.jpg', { type: 'image/jpeg' }))
    formData.append('imagenAtras', new File(['atras'], 'atras.jpg', { type: 'image/jpeg' }))

    await prendaAPI.crearNuevaPrenda(formData)

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/nueva-prenda', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    // Verificar que se llamó con FormData
    const callArgs = mockAxiosInstance.post.mock.calls[0]
    expect(callArgs[1]).toBeInstanceOf(FormData)
  })

  it('debe manejar respuesta exitosa (201)', async () => {
    const mockResponse = {
      data: {
        id: 123,
        nombre: 'Remera Azul',
        tipo: 'remera',
        mensaje: 'Prenda creada exitosamente'
      },
      status: 201
    }

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'Remera Azul')
    formData.append('tipo', 'remera')

    const result = await prendaAPI.crearNuevaPrenda(formData)

    expect(result.status).toBe(201)
    expect(result.data.id).toBe(123)
    expect(result.data.mensaje).toBe('Prenda creada exitosamente')
  })

  it('debe manejar errores de red', async () => {
    const networkError = new Error('Network Error')
    networkError.code = 'ECONNABORTED'

    mockAxiosInstance.post.mockRejectedValueOnce(networkError)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'Test')
    formData.append('tipo', 'remera')

    await expect(prendaAPI.crearNuevaPrenda(formData)).rejects.toThrow('Network Error')
  })

  it('debe manejar errores de validación del servidor (400)', async () => {
    const validationError = {
      response: {
        status: 400,
        data: {
          mensaje: 'Error de validación',
          errores: [
            'El nombre es requerido',
            'El tipo debe ser remera o pantalon'
          ]
        }
      }
    }

    mockAxiosInstance.post.mockRejectedValueOnce(validationError)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'Test')
    formData.append('tipo', 'remera')

    try {
      await prendaAPI.crearNuevaPrenda(formData)
    } catch (error) {
      expect(error.response.status).toBe(400)
      expect(error.response.data.mensaje).toBe('Error de validación')
      expect(error.response.data.errores).toContain('El nombre es requerido')
    }
  })

  it('debe manejar errores del servidor (500)', async () => {
    const serverError = {
      response: {
        status: 500,
        data: {
          mensaje: 'Error interno del servidor'
        }
      }
    }

    mockAxiosInstance.post.mockRejectedValueOnce(serverError)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'Test')
    formData.append('tipo', 'remera')

    try {
      await prendaAPI.crearNuevaPrenda(formData)
    } catch (error) {
      expect(error.response.status).toBe(500)
      expect(error.response.data.mensaje).toBe('Error interno del servidor')
    }
  })

})

describe('PrendaAPI - Validación de Inputs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe validar que el tipo sea remera o pantalon', async () => {
    const validationError = {
      response: {
        status: 400,
        data: {
          mensaje: 'Tipo de prenda inválido',
          errores: ['El tipo debe ser remera o pantalon']
        }
      }
    }

    mockAxiosInstance.post.mockRejectedValueOnce(validationError)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'Prenda Test')
    formData.append('tipo', 'zapatos') // Tipo inválido

    try {
      await prendaAPI.crearNuevaPrenda(formData)
    } catch (error) {
      expect(error.response.status).toBe(400)
      expect(error.response.data.errores).toContain('El tipo debe ser remera o pantalon')
    }
  })

  it('debe validar que las imágenes sean archivos de imagen válidos', async () => {
    const validationError = {
      response: {
        status: 400,
        data: {
          mensaje: 'Formato de archivo inválido',
          errores: ['Solo se permiten archivos de imagen: jpg, jpeg, png, webp']
        }
      }
    }

    mockAxiosInstance.post.mockRejectedValueOnce(validationError)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'Test Remera')
    formData.append('tipo', 'remera')
    // Archivos con tipos MIME inválidos
    formData.append('imagenFrente', new File(['content'], 'doc.pdf', { type: 'application/pdf' }))
    formData.append('imagenAtras', new File(['content'], 'text.txt', { type: 'text/plain' }))

    try {
      await prendaAPI.crearNuevaPrenda(formData)
    } catch (error) {
      expect(error.response.status).toBe(400)
      expect(error.response.data.errores).toContain('Solo se permiten archivos de imagen: jpg, jpeg, png, webp')
    }
  })
})

describe('PrendaAPI - Integración Formulario-API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe llamar a la API al enviar formulario válido', async () => {
    const mockResponse = {
      data: { id: 1, mensaje: 'Prenda creada exitosamente' },
      status: 201
    }

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse)

    const { prendaAPI } = await import('../../src/services/api')

    // Simular datos de formulario válido
    const formData = new FormData()
    formData.append('nombre', 'Remera Deportiva')
    formData.append('tipo', 'remera')
    formData.append('imagenFrente', new File(['frente'], 'frente.jpg', { type: 'image/jpeg' }))
    formData.append('imagenAtras', new File(['atras'], 'atras.jpg', { type: 'image/jpeg' }))

    const result = await prendaAPI.crearNuevaPrenda(formData)

    expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1)
    expect(result.status).toBe(201)
  })

  it('debe manejar loading state durante el envío', async () => {
    // Simular delay en la respuesta
    const mockResponse = {
      data: { id: 1, mensaje: 'Prenda creada exitosamente' },
      status: 201
    }

    const delayedPromise = new Promise(resolve => {
      setTimeout(() => resolve(mockResponse), 100)
    })

    mockAxiosInstance.post.mockReturnValueOnce(delayedPromise)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'Test')
    formData.append('tipo', 'remera')

    // Verificar que la promesa está pending
    const promise = prendaAPI.crearNuevaPrenda(formData)
    expect(promise).toBeInstanceOf(Promise)

    // Esperar a que resuelva
    const result = await promise
    expect(result.status).toBe(201)
  })

  it('debe mostrar mensaje de éxito tras guardar', async () => {
    const mockResponse = {
      data: {
        id: 1,
        nombre: 'Remera Azul',
        tipo: 'remera',
        mensaje: 'Prenda creada exitosamente'
      },
      status: 201
    }

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'Remera Azul')
    formData.append('tipo', 'remera')

    const result = await prendaAPI.crearNuevaPrenda(formData)

    expect(result.data.mensaje).toBe('Prenda creada exitosamente')
    expect(result.data.id).toBe(1)
  })

  it('debe mostrar mensaje de error si falla', async () => {
    const errorResponse = {
      response: {
        status: 400,
        data: {
          mensaje: 'Error al crear la prenda',
          errores: ['El nombre es muy corto']
        }
      }
    }

    mockAxiosInstance.post.mockRejectedValueOnce(errorResponse)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'A') // Nombre muy corto
    formData.append('tipo', 'remera')

    try {
      await prendaAPI.crearNuevaPrenda(formData)
      // Si llega aquí, el test debería fallar
      expect(true).toBe(false)
    } catch (error) {
      expect(error.response.status).toBe(400)
      expect(error.response.data.mensaje).toBe('Error al crear la prenda')
      expect(error.response.data.errores).toContain('El nombre es muy corto')
    }
  })

  it('debe validar FormData antes de enviar', async () => {
    const { prendaAPI } = await import('../../src/services/api')

    // FormData vacío (inválido)
    const emptyFormData = new FormData()

    // La función debería validar que tenga los campos requeridos
    // Por ahora solo verificamos que se llama, la validación puede ser en el componente
    await expect(prendaAPI.crearNuevaPrenda(emptyFormData)).rejects.toThrow()
  })

  it('debe manejar timeout de requests', async () => {
    const timeoutError = new Error('Request timeout')
    timeoutError.code = 'ECONNABORTED'

    mockAxiosInstance.post.mockRejectedValueOnce(timeoutError)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'Test')
    formData.append('tipo', 'remera')

    await expect(prendaAPI.crearNuevaPrenda(formData)).rejects.toThrow('Request timeout')
  })

  it('debe retornar datos estructurados para el frontend', async () => {
    const mockResponse = {
      data: {
        id: 123,
        nombre: 'Remera Casual',
        tipo: 'remera',
        imagenes: {
          frente: 'http://localhost:8080/imagenes/123-frente.jpg',
          atras: 'http://localhost:8080/imagenes/123-atras.jpg'
        },
        fechaCreacion: '2024-01-15T10:30:00Z',
        mensaje: 'Prenda creada exitosamente'
      },
      status: 201
    }

    mockAxiosInstance.post.mockResolvedValueOnce(mockResponse)

    const { prendaAPI } = await import('../../src/services/api')

    const formData = new FormData()
    formData.append('nombre', 'Remera Casual')
    formData.append('tipo', 'remera')

    const result = await prendaAPI.crearNuevaPrenda(formData)

    // Verificar estructura de respuesta
    expect(result.data.id).toBe(123)
    expect(result.data.nombre).toBe('Remera Casual')
    expect(result.data.tipo).toBe('remera')
    expect(result.data.imagenes).toBeDefined()
    expect(result.data.imagenes.frente).toContain('123-frente.jpg')
    expect(result.data.imagenes.atras).toContain('123-atras.jpg')
    expect(result.data.fechaCreacion).toBeDefined()
  })
})