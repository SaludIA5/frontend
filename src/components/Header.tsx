import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
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

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
    axios.get("/auth/me").then(res => {
        setIsAdmin(res.data.is_admin);
    });
    }, []);



    return (
        <header className="bg-[var(--color-primary)] text-white shadow-md mb-2">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-[1fr_6fr_2fr_2fr_2fr_2fr] items-center min-h-16 h-auto">
                    <div
                        className="col-start-2 flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        {/* <img src="src/assets/logo.png" alt="Logo" className="h-10" /> */}
                        <h1 
                        onClick={() => navigate("/")}
                        className="col-start-2 text-xl bg-primary text-white font-bold text-center cursor-pointer"
                    >
                        SALUIA
                    </h1>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => navigate("/admin")}
                            className="h-full w-full text-center px-4 rounded-none text-white border-none"
                        >
                            Panel Admin
                        </button>
                    )}

                    <button
                        onClick={() => navigate("/")}
                        className="h-full w-full text-center px-4 rounded-none text-white border-none"
                    >
                        Pacientes
                    </button>

                    <button
                        onClick={() => navigate("/metrics")}
                        className="h-full w-full text-center px-4 rounded-none text-white border-none"
                    >
                        Métricas
                    </button>

                    <button
                        onClick={handleLogout}
                        className="h-full w-full text-center px-4 rounded-none text-white border-none"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </header>
    )
}
