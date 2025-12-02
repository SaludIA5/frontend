import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { renderWithProviders } from '../../test/test-utils'
import Header from '../../components/Header'

vi.mock("axios", () => {
  const mockGet = vi.fn().mockResolvedValue({
    data: { is_admin: false },
  });

  const mockApiInstance = {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
  };

  return {
    default: {
      get: mockGet,
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(() => mockApiInstance),
      defaults: {
        headers: {
          common: {}
        }
      }
    }
  };
});

describe('Header', () => {
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
