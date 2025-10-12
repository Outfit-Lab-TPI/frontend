import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../../src/components/Header'

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Componente Header', () => {
  test('renderiza exitosamente', () => {
    renderWithRouter(<Header />)
  })

  test('muestra la imagen del logo', () => {
    renderWithRouter(<Header />)

    const logo = screen.getByAltText('Outfit-Lab-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/isologo.svg')
  })

  test('tiene enlaces de navegación', () => {
    renderWithRouter(<Header />)

    const homeLink = screen.getByRole('link', { name: /outfit-lab-logo/i })
    expect(homeLink).toHaveAttribute('href', '/home')

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2) // home, profile
  })

  test('muestra el icono de perfil', () => {
    renderWithRouter(<Header />)

    const iconContainers = screen.getAllByRole('link')
    expect(iconContainers[1]).toHaveAttribute('href', '/profile')
  })
})