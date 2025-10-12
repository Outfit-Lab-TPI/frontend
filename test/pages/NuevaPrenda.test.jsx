import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NuevaPrenda from '../../src/pages/NuevaPrenda'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const MockedRouter = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
)

describe('NuevaPrenda - Formulario Básico', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar el formulario', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    // Verificar que el formulario existe
    const form = screen.getByRole('form', { name: /nueva prenda/i })
    expect(form).toBeInTheDocument()
  })

  it('debe tener campo de nombre (input text)', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const nombreInput = screen.getByLabelText(/nombre de la prenda/i)
    expect(nombreInput).toBeInTheDocument()
    expect(nombreInput.type).toBe('text')
  })

  it('debe tener selector de tipo de prenda (select)', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const tipoSelect = screen.getByLabelText(/tipo de prenda/i)
    expect(tipoSelect).toBeInTheDocument()
    expect(tipoSelect.tagName).toBe('SELECT')
  })

  it('debe tener área para cargar imágenes', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    // Buscar por texto que indique upload de imágenes
    const imagenesSection = screen.getByText(/imágenes de la prenda/i)
    expect(imagenesSection).toBeInTheDocument()

    // Verificar que hay inputs para archivos
    const imageInputs = screen.getAllByRole('button', { name: /cargar imagen/i })
    expect(imageInputs).toHaveLength(2) // Frente y atrás
  })

  it('debe tener botón Guardar Prenda', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const guardarButton = screen.getByRole('button', { name: /guardar prenda/i })
    expect(guardarButton).toBeInTheDocument()
    expect(guardarButton.type).toBe('submit')
  })

  it('debe tener botón Cancelar', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const cancelarButton = screen.getByRole('button', { name: /cancelar/i })
    expect(cancelarButton).toBeInTheDocument()
  })

  it('el botón Cancelar debe navegar de vuelta al Home', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const cancelarButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelarButton)

    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })
})

describe('NuevaPrenda - Validaciones de Campos Requeridos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('el botón debe estar deshabilitado si el nombre está vacío', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const guardarButton = screen.getByRole('button', { name: /guardar prenda/i })
    expect(guardarButton).toBeDisabled()
  })

  it('el botón debe estar deshabilitado si no se selecciona tipo de prenda', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const nombreInput = screen.getByLabelText(/nombre de la prenda/i)
    fireEvent.change(nombreInput, { target: { value: 'Test' } })

    const guardarButton = screen.getByRole('button', { name: /guardar prenda/i })
    expect(guardarButton).toBeDisabled()
  })

  it('el botón debe estar deshabilitado si no se cargan imágenes', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const nombreInput = screen.getByLabelText(/nombre de la prenda/i)
    const tipoSelect = screen.getByLabelText(/tipo de prenda/i)

    fireEvent.change(nombreInput, { target: { value: 'Test' } })
    fireEvent.change(tipoSelect, { target: { value: 'remera' } })

    const guardarButton = screen.getByRole('button', { name: /guardar prenda/i })
    expect(guardarButton).toBeDisabled()
  })

  it('el botón debe estar habilitado solo cuando todos los campos están completos', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const nombreInput = screen.getByLabelText(/nombre de la prenda/i)
    const tipoSelect = screen.getByLabelText(/tipo de prenda/i)
    const guardarButton = screen.getByRole('button', { name: /guardar prenda/i })

    // Inicialmente debe estar deshabilitado
    expect(guardarButton).toBeDisabled()

    // Llenar nombre y tipo
    fireEvent.change(nombreInput, { target: { value: 'Test' } })
    fireEvent.change(tipoSelect, { target: { value: 'remera' } })

    // Aún debe estar deshabilitado (faltan imágenes)
    expect(guardarButton).toBeDisabled()
  })
})

describe('NuevaPrenda - Validación de Tipo de Prenda', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('el selector debe mostrar solo remera y pantalón como opciones', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const tipoSelect = screen.getByLabelText(/tipo de prenda/i)

    // Verificar que tiene las opciones correctas
    const remeraOption = screen.getByRole('option', { name: /remera/i })
    const pantalonOption = screen.getByRole('option', { name: /pantalón/i })

    expect(remeraOption).toBeInTheDocument()
    expect(pantalonOption).toBeInTheDocument()

    // Verificar que no hay más opciones además del placeholder
    const allOptions = screen.getAllByRole('option')
    expect(allOptions).toHaveLength(3) // placeholder + remera + pantalón
  })

  it('no debe permitir valores diferentes a remera o pantalón', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const tipoSelect = screen.getByLabelText(/tipo de prenda/i)

    // Intentar seleccionar un valor inválido (esto debería ser imposible en un select normal)
    // Pero podemos verificar que las únicas opciones disponibles sean las correctas
    expect(tipoSelect.innerHTML).not.toMatch(/camisa|zapatos|sombrero/i)
  })

  it('debe permitir seleccionar remera como tipo válido', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const tipoSelect = screen.getByLabelText(/tipo de prenda/i)

    fireEvent.change(tipoSelect, { target: { value: 'remera' } })

    expect(tipoSelect.value).toBe('remera')
  })

  it('debe permitir seleccionar pantalón como tipo válido', () => {
    render(
      <MockedRouter>
        <NuevaPrenda />
      </MockedRouter>
    )

    const tipoSelect = screen.getByLabelText(/tipo de prenda/i)

    fireEvent.change(tipoSelect, { target: { value: 'pantalon' } })

    expect(tipoSelect.value).toBe('pantalon')
  })
})