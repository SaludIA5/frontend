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
