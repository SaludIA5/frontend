import { useAuth0 } from '@auth0/auth0-react';
import LoginModal from './LoginModal';

type AuthGuardProps = {
    children: React.ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Cargando...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginModal />;
    }

    return <>{children}</>;
};

export default AuthGuard;
