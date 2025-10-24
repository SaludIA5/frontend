import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContextBase';

type HeaderProps = {
    onLogout?: () => void
}

export default function Header({ onLogout }: HeaderProps) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        onLogout?.();
    };
    return (
        <header className="bg-[var(--color-primary)] text-white shadow-md mb-2">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-[3fr_9fr_1fr_1fr_1fr] items-center min-h-16 h-auto">
                    <h1 className="col-start-2 text-xl bg-primary text-white font-bold text-center">SALUIA</h1>
                    <button
                        onClick={() => navigate("/")}
                        className="h-full w-full text-center px-4 bg-primary border-none rounded-none transition text-white"
                    >
                        Ver Pacientes
                    </button>
                    <button
                        onClick={() => navigate("/metrics")}
                        className="h-full w-full text-center px-4 bg-primary border-none rounded-none transition text-white"
                    >
                        Ver Métricas
                    </button>
                    <button
                        onClick={handleLogout}
                        className="h-full w-full text-center px-4 bg-primary border-none rounded-none transition text-white"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </header>
    )
}
