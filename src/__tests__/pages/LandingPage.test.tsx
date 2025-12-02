import { describe, it, expect } from 'vitest'
import { vi } from "vitest";

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

import { renderWithProviders } from '../../test/test-utils'
import LandingPage from '../../pages/LandingPage'

describe('LandingPage', () => {
    it('renders the main heading', () => {
        const { getByText } = renderWithProviders(<LandingPage />)
        expect(getByText('Pacientes Activos')).toBeInTheDocument()
    })

    it('renders the add patient button', () => {
        const { getByText } = renderWithProviders(<LandingPage />)
        expect(getByText('Agregar Paciente')).toBeInTheDocument()
    })
})
