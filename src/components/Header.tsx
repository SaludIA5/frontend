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
        <header className="bg-blue-600 text-white shadow-md mb-2">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-[1fr_3fr_1fr] items-center h-16">
                    <h1 className="col-start-2 text-xl text-white font-bold text-center">SaludIA</h1>

                    <button
                        onClick={handleLogout}
                        className="col-start-3 h-full w-full text-center px-4 bg-blue-600
            border-none rounded-none hover:bg-blue-700 transition text-white"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </header>
    )
}
