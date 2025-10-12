import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ImageUpload from '../../src/components/ImageUpload'

describe('ImageUpload - Upload Básico', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe permitir seleccionar archivos de imagen', () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    // Buscar los inputs de archivo para frente y atrás
    const frenteInput = screen.getByLabelText(/imagen frente/i)
    const atrasInput = screen.getByLabelText(/imagen atrás/i)

    expect(frenteInput).toBeInTheDocument()
    expect(atrasInput).toBeInTheDocument()
    expect(frenteInput.type).toBe('file')
    expect(atrasInput.type).toBe('file')
  })

  it('debe mostrar preview de las imágenes cargadas', async () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    const frenteInput = screen.getByLabelText(/imagen frente/i)

    // Crear un archivo mock
    const file = new File(['dummy content'], 'test-image.jpg', { type: 'image/jpeg' })

    // Simular la selección de archivo
    fireEvent.change(frenteInput, { target: { files: [file] } })

    await waitFor(() => {
      // Buscar el preview de la imagen
      const preview = screen.getByAltText(/preview.*frente/i)
      expect(preview).toBeInTheDocument()
      expect(preview.tagName).toBe('IMG')
    })
  })

  it('debe mostrar Frente y Atrás como labels', () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    const frenteLabel = screen.getByText('Frente')
    const atrasLabel = screen.getByText('Atrás')

    expect(frenteLabel).toBeInTheDocument()
    expect(atrasLabel).toBeInTheDocument()
  })

  it('debe requerir exactamente 2 imágenes (frente y atrás)', () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    // Verificar que hay exactamente 2 inputs de archivo
    const fileInputs = screen.getAllByDisplayValue('')
    const imageInputs = fileInputs.filter(input => input.type === 'file')

    expect(imageInputs).toHaveLength(2)

    // Verificar que están etiquetados como frente y atrás
    expect(screen.getByLabelText(/imagen frente/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/imagen atrás/i)).toBeInTheDocument()
  })

  it('debe llamar onImagesChange cuando se cargan imágenes', async () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    const frenteInput = screen.getByLabelText(/imagen frente/i)
    const file = new File(['dummy content'], 'test-image.jpg', { type: 'image/jpeg' })

    fireEvent.change(frenteInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(mockOnImagesChange).toHaveBeenCalled()
    })
  })

  it('debe indicar cuando faltan imágenes por cargar', () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    // O verificar que los botones de carga están visibles
    const uploadButtons = screen.getAllByRole('button', { name: /cargar imagen/i })
    expect(uploadButtons).toHaveLength(2) // Uno para frente, uno para atrás
  })
})

describe('ImageUpload - Validación de Imágenes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('solo debe aceptar formatos de imagen (jpg, jpeg, png, webp)', () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    const frenteInput = screen.getByLabelText(/imagen frente/i)

    // Verificar que el input tiene el atributo accept correcto
    expect(frenteInput.accept).toMatch(/image\/(jpeg|jpg|png|webp)/i)
  })

  it('debe rechazar archivos que no sean imágenes', async () => {
    const mockOnImagesChange = vi.fn()
    const mockOnError = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} onError={mockOnError} />)

    const frenteInput = screen.getByLabelText(/imagen frente/i)

    // Crear un archivo que no es imagen
    const textFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' })

    fireEvent.change(frenteInput, { target: { files: [textFile] } })

    await waitFor(() => {
      // Verificar que se muestra un error
      expect(screen.getByText(/formato de archivo no válido/i)).toBeInTheDocument()
    })
  })

  it('debe validar tamaño máximo de imagen (5MB)', async () => {
    const mockOnImagesChange = vi.fn()
    const mockOnError = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} onError={mockOnError} />)

    const frenteInput = screen.getByLabelText(/imagen frente/i)

    // Crear un archivo muy grande (más de 5MB)
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large-image.jpg', {
      type: 'image/jpeg'
    })

    // Mock del tamaño del archivo
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 })

    fireEvent.change(frenteInput, { target: { files: [largeFile] } })

    await waitFor(() => {
      expect(screen.getByText(/archivo muy grande.*5MB/i)).toBeInTheDocument()
    })
  })

  it('debe mostrar error si el archivo es muy grande', async () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    const frenteInput = screen.getByLabelText(/imagen frente/i)

    // Archivo de 6MB (más del límite de 5MB)
    const largeFile = new File(['content'], 'large.jpg', { type: 'image/jpeg' })
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 })

    fireEvent.change(frenteInput, { target: { files: [largeFile] } })

    await waitFor(() => {
      const errorMessage = screen.getByText(/archivo muy grande/i)
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('debe mostrar error si el formato no es válido', async () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    const frenteInput = screen.getByLabelText(/imagen frente/i)

    // Archivo con formato inválido
    const invalidFile = new File(['content'], 'document.pdf', { type: 'application/pdf' })

    fireEvent.change(frenteInput, { target: { files: [invalidFile] } })

    await waitFor(() => {
      const errorMessage = screen.getByText(/formato.*no válido/i)
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('debe aceptar archivos de imagen válidos', async () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    const frenteInput = screen.getByLabelText(/imagen frente/i)

    // Archivo válido
    const validFile = new File(['image content'], 'valid-image.jpg', {
      type: 'image/jpeg'
    })
    Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }) // 1MB

    fireEvent.change(frenteInput, { target: { files: [validFile] } })

    await waitFor(() => {
      expect(mockOnImagesChange).toHaveBeenCalled()
      // No debe mostrar errores
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })
  })
})

describe('ImageUpload - Gestión de Imágenes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe permitir eliminar una imagen ya cargada', async () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    const frenteInput = screen.getByLabelText(/imagen frente/i)
    const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

    // Cargar una imagen
    fireEvent.change(frenteInput, { target: { files: [validFile] } })

    await waitFor(() => {
      // Buscar el botón de eliminar
      const deleteButton = screen.getByRole('button', { name: /eliminar.*frente/i })
      expect(deleteButton).toBeInTheDocument()
    })

    // Hacer click en eliminar
    const deleteButton = screen.getByRole('button', { name: /eliminar.*frente/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      // Verificar que la imagen se eliminó
      expect(screen.queryByAltText(/preview.*frente/i)).not.toBeInTheDocument()
    })
  })

  it('debe permitir reemplazar una imagen', async () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    const frenteInput = screen.getByLabelText(/imagen frente/i)

    // Cargar primera imagen
    const firstFile = new File(['content1'], 'first.jpg', { type: 'image/jpeg' })
    fireEvent.change(frenteInput, { target: { files: [firstFile] } })

    await waitFor(() => {
      expect(screen.getByAltText(/preview.*frente/i)).toBeInTheDocument()
    })

    // Cargar segunda imagen (reemplazar)
    const secondFile = new File(['content2'], 'second.jpg', { type: 'image/jpeg' })
    fireEvent.change(frenteInput, { target: { files: [secondFile] } })

    await waitFor(() => {
      // Verificar que sigue habiendo solo una imagen preview
      const previews = screen.getAllByAltText(/preview.*frente/i)
      expect(previews).toHaveLength(1)
    })
  })

  it('debe notificar cambios cuando se elimina una imagen', async () => {
    const mockOnImagesChange = vi.fn()

    render(<ImageUpload onImagesChange={mockOnImagesChange} />)

    const frenteInput = screen.getByLabelText(/imagen frente/i)
    const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

    // Cargar imagen
    fireEvent.change(frenteInput, { target: { files: [validFile] } })

    await waitFor(() => {
      expect(mockOnImagesChange).toHaveBeenCalled()
    })

    // Reset mock
    mockOnImagesChange.mockClear()

    // Eliminar imagen
    const deleteButton = screen.getByRole('button', { name: /eliminar.*frente/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      // Verificar que se notificó el cambio al eliminar
      expect(mockOnImagesChange).toHaveBeenCalled()
    })
  })
})