import { BrowserRouter } from 'react-router-dom';
import Routing from './common/Routing.tsx';
import { PatientsProvider } from './context/PatientContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

export default function AppProviders() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <PatientsProvider>
                    <Routing />
                </PatientsProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

