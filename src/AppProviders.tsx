import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Routing from './common/Routing.tsx';
import { PatientsProvider } from './context/PatientContext.tsx';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

export default function AppProviders() {
    if (!domain || !clientId) {
        console.error('Auth0 configuration missing:', { domain, clientId });
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-red-600 mb-4">Configuration Error</div>
                    <div className="text-sm text-gray-600">
                        Auth0 domain and clientId must be provided in environment variables
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin
            }}
        >
            <BrowserRouter>
                <PatientsProvider>
                    <Routing />
                </PatientsProvider>
            </BrowserRouter>
        </Auth0Provider>
    );
}

