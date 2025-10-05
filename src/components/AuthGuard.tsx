import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';

type AuthGuardProps = {
    children: React.ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <LoginModal />;
    }

    return <>{children}</>;
};

export default AuthGuard;
