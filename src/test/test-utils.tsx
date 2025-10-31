import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PatientsProvider } from '../context/PatientContext'
import { AuthProvider } from '../context/AuthContext'

export function renderWithProviders(ui: React.ReactElement) {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <PatientsProvider>
                    {ui}
                </PatientsProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}
