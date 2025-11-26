import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../test/test-utils'
import LandingPage from '../../pages/LandingPage'

import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

axios.get = vi.fn().mockResolvedValue({
  data: { is_admin: false },
});

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
