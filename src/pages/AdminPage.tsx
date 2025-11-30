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

    const trainModel = async () => {
        if (!import.meta.env.VITE_BACKEND_URL) {
            setError(true);
            setLoading(false);
            return;
        }
        try {
            await api.post("/ml-model/training/prod");
        } catch (error) {
            console.error("Error validating administrator privileges:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    }
    
    if (!isAdmin) return (<><Header /> <div className="text-center py-8"><p className="text-gray-500">
        Solo el admin tiene permitido acceder a esta página </p></div></>);
    if (loading) return (<><Header /> <div className="text-center py-8"><p className="text-gray-500">
        Cargando...</p></div></>);
    if (error) return (<><Header /> <div className="text-center py-8"><p className="text-gray-500">
    Ha habido un error.</p></div></>);

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
                onClick={() => navigate("users")}
                className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            >
                Administrar Usuarios
            </button>
            <button 
                onClick={() => navigate("diagnostics")}
                className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            >
                Administrar Diagnosticos
            </button>
            <button 
                onClick={() => {
                    if (confirm("¿Estás seguro de que deseas re-entrenar el modelo? Esta acción solo debe usarse en casos concretos.")) {
                        trainModel();
                    }
                }}
                className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            >
                Entrenar Modelo
            </button>
        </div>
    </div>
    </>
    )
}