import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../test/test-utils'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />)
  })

  it('renders the landing page', () => {
    const { getByText } = renderWithProviders(<App />)
    expect(getByText('Pacientes Activos')).toBeInTheDocument()
  })
})
