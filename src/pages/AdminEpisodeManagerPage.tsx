import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import AdminEpisodeView from "../components/Admin/AdminEpisodeView";
import { useNavigate } from "react-router-dom";
import type { Episode } from "../types/episode";
import { normalizeEpisode } from "../utils/normalizeEpisode";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export default function AdminEpisodeManagerPage(){
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openEpisodes, setOpenEpisodes] = useState<Episode[]>();
    const [closedEpisodes, setClosedEpisodes] = useState<Episode[]>();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showOpenList, setShowOpenList] = useState(false);
    const [showClosedList, setShowClosedList] = useState(false);
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

    useEffect(() => {
        const getEpisodes = async () => {
            if (!import.meta.env.VITE_BACKEND_URL) {
                setError(true);
                setLoading(false);
                return;
            }
            try {   
                const validatedEpisodes = await api.get("/episodes/?page=1&page_size=100");
                const episodeData: Episode[] = validatedEpisodes.data?.items || validatedEpisodes.data || [];
                let normalizedEpisodeData = episodeData.map(episode => normalizeEpisode(episode));
                normalizedEpisodeData = normalizedEpisodeData.sort((a, b)=> {return b.id - a.id})
                setOpenEpisodes(normalizedEpisodeData.filter(episode => episode.isActive));
                setClosedEpisodes(normalizedEpisodeData.filter(episode => !episode.isActive));
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

    return(
    <>
    <Header />
    <div className="flex items-center justify-center">
        <button 
            onClick={() => navigate("/admin")}
            className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
        >
            Volver a Panel de Administrador
        </button>
    </div>
    <div className="text-center">
        <div 
            onClick={() => setShowOpenList(!showOpenList)}
            className="flex items-center justify-center gap-2 my-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
            <h2 className="text-2xl font-bold">Episodios Abiertos</h2>
            <span className={`text-xl transition-transform duration-200 ${showOpenList ? 'rotate-180' : ''}`}>
                ▼
            </span>
        </div>
        {showOpenList && (
            <ul className="mx-auto max-w-5xl space-y-3">
                <li>
                <div className="grid grid-cols-[minmax(0,1fr)_repeat(5,minmax(0,10fr))] gap-4 items-center px-4">
                    <p className="col-start-2">ID de Episodio</p>
                    <p>ID de Paciente</p>
                    <p>Decisión Doctor</p>
                    <p>Recomendacion IA</p>
                    <p>Decisión Jefe de Turno</p>
                </div>
                </li>
                {openEpisodes && openEpisodes.map((openEpisode, i) => {
                return (
                    <li
                    key={i}
                    className="my-1.5 border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4 cursor-pointer"
                    >
                    <AdminEpisodeView
                    episode={openEpisode}
                    isOpen={openIndex == i}
                    onToggle={() => setOpenIndex(openIndex == i ? null : i)}
                    />
                    </li>
                );
                })}
            </ul>
        )}
    </div>
    <div className="text-center">
        <div 
            onClick={() => setShowClosedList(!showClosedList)}
            className="flex items-center justify-center gap-2 my-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
            <h2 className="text-2xl font-bold">Episodios Cerrados</h2>
            <span className={`text-xl transition-transform duration-200 ${showClosedList ? 'rotate-180' : ''}`}>
                ▼
            </span>
        </div>
        {showClosedList && (
            <ul className="mx-auto max-w-5xl space-y-3">
                <li>
                <div className="grid grid-cols-[minmax(0,1fr)_repeat(5,minmax(0,10fr))] gap-4 items-center px-4">
                    <p className="col-start-2">ID de Episodio</p>
                    <p>ID de Paciente</p>
                    <p>Decisión Doctor</p>
                    <p>Recomendacion IA</p>
                    <p>Decisión Jefe de Turno</p>
                </div>
                </li>
                {closedEpisodes && closedEpisodes.map((closedEpisode, i) => {
                const index = openEpisodes ? i + openEpisodes.length : i;
                return (
                    <li
                    key={index}
                    className="my-1.5 border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4 cursor-pointer"
                    >
                    <AdminEpisodeView
                    episode={closedEpisode}
                    isOpen={openIndex == index}
                    onToggle={() => setOpenIndex(openIndex == index ? null : index)}
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