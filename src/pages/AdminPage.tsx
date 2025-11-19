import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export default function AdminPage(){
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkPermission = async () => {
            if (!import.meta.env.VITE_BACKEND_URL) {
                setError(true);
                setLoading(false);
                return;
            }
            try {
                const res = await api.get("auth/me");
                const data = res.data;
                setIsAdmin(data.is_admin);
            } catch (error) {
                console.error("Error validating administrator privileges:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        checkPermission();
    });

    if (!isAdmin) return (<><Header /> Solo el admin tiene permitido acceder a esta página</>);
    if (loading) return (<><Header /> Cargando...</>);
    if (error) return (<><Header /> Ha habido un error.</>);

    return(
    <>
    <Header />
    <div className="flex flex-col justify-center items-center">
        <p className="text-3xl mt-3 mb-5 font-bold">Panel de Administrador</p>
        <div className="grid grid-cols-2 gap-4 items-center max-w-5xl justify-center px-3">
            <button 
                onClick={() => navigate("episodes")}
                className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            >
                Administrar Episodios
            </button>
            <button 
                onClick={() => alert("No implementado aún")}
                className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            >
                Administrar Usuarios
            </button>
        </div>
    </div>
    </>
    )
}