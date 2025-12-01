import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Model } from "../types/models";
import ModelVersionView from "../components/Admin/ModelVersionView";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export default function AdminModelManagerPage() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [models, setModels] = useState<Model[]>([]);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [activeModel, setActiveModel] = useState<Model | null>(null);
    
    useEffect(() => {
        const getModels = async () => {
            const res = await api.get("/ml-model/versions");
            const data: Model[] = res.data;
            setModels(data);
            const activeVersion = data.find((model) => model.active);
            if (activeVersion){
                setActiveModel(activeVersion);
                setSelectedModel(activeVersion);
            }
        }
        getModels();
    }, []);

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
    }, []);

    if (!isAdmin) return (<><Header /> <div className="text-center py-8"><p className="text-gray-500">
        Solo el admin tiene permitido acceder a esta página </p></div></>);
    if (loading) return (<><Header /> <div className="text-center py-8"><p className="text-gray-500">
        Cargando...</p></div></>);
    if (error) return (<><Header /> <div className="text-center py-8"><p className="text-gray-500">
        Ha habido un error.</p></div></>);

    const trainModel = async () => {
        if (!import.meta.env.VITE_BACKEND_URL) {
            setError(true);
            setLoading(false);
            return;
        }
        try {
            await api.post("/ml-model/training/prod");
        } catch (error) {
            console.error("Error re-training model", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    const handleModelChange = async () => {
        if (!import.meta.env.VITE_BACKEND_URL) {
            setError(true);
            setLoading(false);
            return;
        }
        if (!selectedModel){
            alert("No hay un modelo seleccionado")
            return;
        }
        try {
            await api.post(`/ml-model/versions/${selectedModel.version}/activate`);
        } catch (error) {
            console.error("Error changing models:", error);
            setError(true);
        } finally {
            setLoading(false);
            window.location.reload();
        }
    }

    return (
        <>
        <Header />
        <div className="flex items-center flex-end gap-4 py-3 px-8">
            <button 
                onClick={() => navigate("/admin")}
                className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            >
                Volver a Panel de Administrador
            </button>
        </div>
        <h2 className="w-full text-center text-3xl font-bold ">Lista de Modelos </h2>
        <ul className="mx-auto max-w-5xl space-y-3 py-3">
        <div
        className="grid grid-cols-[2fr_2fr_2fr_2fr_2fr_2fr] gap-4 items-center px-4 [&>p]:text-center"
        >
            <p>Versión</p>
            <p>Etapa</p>
            <p>Métrica</p>
            <p>Valor de la métrica</p>
            <p>Fecha de entrenamiento</p>
            <p>Activo</p>
        </div>
            {models.map((model) => (
                <li 
                key={model.id}
                className="my-1.5 border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4 cursor-pointer"
                >
                    <ModelVersionView
                        model={model}
                        active={model.id === selectedModel?.id}
                        onToggle={() => setSelectedModel(model)}
                    />
                </li>
            ))}
        </ul>
        <div className="w-full flex items-center justify-center">
            <button 
                onClick={handleModelChange}
                className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] disabled:bg-gray-400 hover:bg-[var(--color-secondary-hover)]"
                disabled={!activeModel || !selectedModel || activeModel.id == selectedModel.id}
            >
                Actualizar Modelo Activo
            </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 mt-5">
            <br />
            <br />
            <button 
            onClick={() => {
                if (confirm("¿Estás seguro de que deseas re-entrenar el modelo? Esta acción solo debe usarse en casos concretos.")) {
                    trainModel();
                }
            }}
            className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            >
                Re-entrenar Modelo Activo
            </button>
            <p>¡Sólo presionar este botón en caso de emergencia!</p>
        </div>
        </>
    )
}