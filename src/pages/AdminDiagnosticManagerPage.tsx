import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import type { Diagnostic } from "../types/patientInfo";
import CreateDiagnosticModal from "../components/Admin/CreateDiagnosticModal";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export default function AdminDiagnosticManagerPage(){
    const navigate = useNavigate();
    const [diagnostics, setDiagnostics] = useState<Diagnostic[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(()=> {
        const getDiagnostics = async () => {
            const res = await api.get("/diagnostics")
            const info: Diagnostic[] = res.data.items;
            setDiagnostics(info.sort((a, b) => a.id - b.id));
        }
        getDiagnostics();
    }, []);

    const deleteDiagnostic = async (id: number) => {
        try {
            await api.delete(`/diagnostics/${id}`);
        } catch (error) {
            console.error("Error deleting diagnostic:", error);
        }
    }  

    return(
    <>
    <Header />
    <div className="px-10 py-6">
        <div className="flex items-center flex-end">
            <button 
                onClick={() => navigate("/admin")}
                className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            >
                Volver a Panel de Administrador
            </button>
        </div>
        <h2 className="text-2xl font-bold w-full text-center py-4">Diagnósticos</h2>
        <div className="flex items-center justify-end">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            >
                Agregar Diagnóstico
            </button>
        </div>
        <ul>
            <div className="grid grid-cols-[1.25fr_0.75fr_5fr] gap-6 px-4 py-2">
                <p className="text-left">ID del Diagnóstico</p>
                <p className="text-left">Código CIE</p>
                <p className="text-left">Descripción</p>
            </div>
            {diagnostics && diagnostics.map((diag, i) => {
                return (
                <li 
                key={i}
                className="my-1.5 border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4 cursor-pointer"
                >
                <div className="grid grid-cols-[2fr_1fr_5fr_2fr] gap-4 items-center">
                <p>{diag.id}</p>
                <p>{diag.cie_code}</p>
                <p>{diag.description}</p>
                <button 
                    onClick={() => deleteDiagnostic(diag.id)}
                    className="rounded-xl px-4 py-2 text-white shadow bg-red-500 hover:bg-red-600 text-sm"
                    >Eliminar Diagnóstico</button>
                </div>
                </li>
            )})}
        </ul>
        {isModalOpen && <CreateDiagnosticModal handleClose={() => setIsModalOpen(false)}/>}
    </div>
    </>
    )
}