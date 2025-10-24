import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../test/test-utils'
import Header from '../../components/Header'

describe('Header', () => {
  it('renders the SALUIA title', () => {
    const { getByText } = renderWithProviders(<Header />)
    expect(getByText('SALUIA')).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    const { getByText } = renderWithProviders(<Header />)
    expect(getByText('Ver Pacientes')).toBeInTheDocument()
    expect(getByText('Ver Métricas')).toBeInTheDocument()
    expect(getByText('Cerrar sesión')).toBeInTheDocument()
  })
})
