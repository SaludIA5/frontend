import { useAuth } from '../context/AuthContextBase';

type HeaderProps = {
    onLogout?: () => void
}

export default function Header({ onLogout }: HeaderProps) {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        onLogout?.();
    };
    return (
        <header className="bg-[var(--color-primary)] text-white shadow-md mb-2">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-[1fr_3fr_1fr] items-center h-16">
                    <h1 className="col-start-2 text-xl bg-primary text-white font-bold text-center">SALUIA</h1>

                    <button
                        onClick={handleLogout}
                        className="col-start-3 h-full w-full text-center px-4 bg-primary border-none rounded-none transition text-white"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </header>
    )
}
