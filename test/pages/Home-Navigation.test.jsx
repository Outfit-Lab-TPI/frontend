import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../../src/pages/Home'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock ProbadorVirtual to avoid 3D rendering issues in tests
vi.mock('../../src/components/Probador', () => ({
  default: () => <div data-testid="probador-virtual">Probador Virtual Mock</div>
}))

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

const MockedRouter = ({ children, initialEntries = ['/'] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
)

describe('Home - Navigation to Nueva Prenda', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe mostrar el boton Nueva prenda en el Home', () => {
    render(
      <MockedRouter>
        <Home />
      </MockedRouter>
    )

    const nuevaPrendaButton = screen.getByText('Nueva prenda')
    expect(nuevaPrendaButton).toBeInTheDocument()
    expect(nuevaPrendaButton.tagName).toBe('BUTTON')
  })

  it('debe navegar a /nueva-prenda al clickear el boton Nueva prenda', () => {
    render(
      <MockedRouter>
        <Home />
      </MockedRouter>
    )

    const nuevaPrendaButton = screen.getByText('Nueva prenda')
    fireEvent.click(nuevaPrendaButton)

    expect(mockNavigate).toHaveBeenCalledWith('/nueva-prenda')
  })
})