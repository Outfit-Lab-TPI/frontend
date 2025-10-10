import { render, screen } from '@testing-library/react'
import App from '../src/App'

// Mock the pages since they might have complex dependencies
vi.mock('../src/pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}))

vi.mock('../src/pages/Profile', () => ({
  default: () => <div data-testid="profile-page">Profile Page</div>
}))

vi.mock('../src/pages/TestConnection', () => ({
  default: () => <div data-testid="test-connection-page">Test Connection Page</div>
}))

// Mock Header and Footer components
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="header">Header</header>
}))

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>
}))

// Mock react-router-dom to avoid nested router issues
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
    Routes: ({ children }) => <div data-testid="routes">{children}</div>,
    Route: ({ element }) => element,
  }
})

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />)
  })

  test('renders Header component', () => {
    render(<App />)
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  test('renders routing structure', () => {
    render(<App />)
    expect(screen.getByTestId('browser-router')).toBeInTheDocument()
    expect(screen.getByTestId('routes')).toBeInTheDocument()
  })

  test('has proper main content structure', () => {
    render(<App />)
    const mainContent = screen.getByRole('main')
    expect(mainContent).toHaveClass('main-content')
  })
})