import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { renderWithProviders } from '../../test/test-utils'
import Header from '../../components/Header'

vi.mock('axios')

describe('Header', () => {
  it('renders the SALUIA title', async () => {

    axios.get = vi.fn().mockResolvedValue({
      data: { is_admin: false }
    })

    const { getByText } = renderWithProviders(<Header />)
    expect(getByText('SALUIA')).toBeInTheDocument()
  })

  it('renders navigation buttons', async () => {

    axios.get = vi.fn().mockResolvedValue({
      data: { is_admin: false }
    })

    const { getByText } = renderWithProviders(<Header />)
    expect(getByText('Pacientes')).toBeInTheDocument()
    expect(getByText('Métricas')).toBeInTheDocument()
    expect(getByText('Cerrar sesión')).toBeInTheDocument()
  })
})
