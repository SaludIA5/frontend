import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import type { BackendValidationByEpisode } from "../types/metrics";
import AdminEpisodeView from "../components/Admin/AdminEpisodeView";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export default function AdminPage(){
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openEpisodes, setOpenEpisodes] = useState<BackendValidationByEpisode[]>();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showList, setShowList] = useState(true);

    useEffect(() => {
        const checkPermission = async () => {
            const res = await api.get("auth/me");
            const data = res.data;
            setIsAdmin(data.is_admin);
        }
        checkPermission();
    });

    useEffect(() => {
        const getEpisodes = async () => {
            if (!import.meta.env.VITE_BACKEND_URL) {
                setError(true);
                setLoading(false);
                return;
            }
            try {   
                const validatedEpisodes = await api.get("/metrics/episodes");
                const episodeData = validatedEpisodes.data?.items || validatedEpisodes.data || [];
                setOpenEpisodes(episodeData);
                setError(false);
            } catch (error) {
                console.error("Error fetching episodes:", error);
                setError(true);
              } finally {
                setLoading(false);
              }
        }
        getEpisodes();
    }, [])

    if (!isAdmin) return (<><Header /> Solo el admin tiene permitido acceder a esta página</>);
    if (loading) return (<><Header /> Cargando...</>);
    if (error) return (<><Header /> Ha habido un error.</>);
    if (!openEpisodes) return (<><Header /> No hay episodios abiertos.</>);

    return(
    <>
    <Header />
    <div className="text-center">
        <div 
            onClick={() => setShowList(!showList)}
            className="flex items-center justify-center gap-2 my-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
            <h2 className="text-2xl font-bold">Episodios Abiertos</h2>
            <span className={`text-xl transition-transform duration-200 ${showList ? 'rotate-180' : ''}`}>
                ▼
            </span>
        </div>
        {showList && (
            <ul className="mx-auto max-w-5xl space-y-3">
                {openEpisodes.map((openEpisode, i) => {
                return (
                    <li
                    key={i}
                    className="my-1.5 border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4 cursor-pointer"
                    >
                    <AdminEpisodeView
                    episode={openEpisode} 
                    patientName={"John Doe"}
                    isOpen={openIndex == i}
                    onToggle={() => setOpenIndex(openIndex == i ? null : i)}
                    />
                    </li>
                );
                })}
            </ul>
        )}
    </div>
    </>
    )
}