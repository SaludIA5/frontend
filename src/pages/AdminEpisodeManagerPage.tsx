import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import AdminEpisodeView from "../components/Admin/AdminEpisodeView";
import { useNavigate } from "react-router-dom";
import type { Episode } from "../types/episode";
import { normalizeEpisode } from "../utils/normalizeEpisode";
import type { Patient } from "../types/patient";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export default function AdminEpisodeManagerPage(){
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openEpisodes, setOpenEpisodes] = useState<Episode[]>([]);
    const [closedEpisodes, setClosedEpisodes] = useState<Episode[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showOpenList, setShowOpenList] = useState(false);
    const [showClosedList, setShowClosedList] = useState(false);
    const [rutSearch, setRutSearch] = useState("");
    const navigate = useNavigate();

    const normalizeRut = (rut: string) => rut.replace(/\./g, "").replace(/-/g, "").toLowerCase();

    const filterByRut = (episodes: Episode[]) =>
        episodes.filter(ep => {
            if (!ep.patientRut) return false;
            return normalizeRut(ep.patientRut).includes(normalizeRut(rutSearch));
        });
    
    const handleUpdateEpisode = (updated: Episode) => {
        setOpenEpisodes((prev) =>
            prev.map((ep) => (ep.id === updated.id ? updated : ep))
        );
        
        setClosedEpisodes((prev) =>
            prev.map((ep) => (ep.id === updated.id ? updated : ep))
        );
    };
          
    const filteredOpenEpisodes = filterByRut(openEpisodes);
    const filteredClosedEpisodes = filterByRut(closedEpisodes);

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

    useEffect(() => {
        const getEpisodes = async () => {
            try {
                const validatedEpisodes = await api.get("/episodes/?page=1&page_size=20");
                const episodeData: Episode[] = validatedEpisodes.data.items;
        
                const normalized = episodeData.map(e => normalizeEpisode(e));
        
               const patientRuts = await api.get("/patients/");
               const patientRutsData = patientRuts.data.items;
               const patientRutsMap = new Map(patientRutsData.map((p: Patient) => [p.id, p.rut]));
        
                setOpenEpisodes(normalized.filter(ep => ep.isActive).map(ep => ({ ...ep, patientRut: patientRutsMap.get(ep.patientId) as string })));
                setClosedEpisodes(normalized.filter(ep => !ep.isActive).map(ep => ({ ...ep, patientRut: patientRutsMap.get(ep.patientId) as string })));
            } catch (error) {
                console.error("Error fetching episodes:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        getEpisodes();
    }, [])

    if (!isAdmin) return (<><Header /> <div className="text-center py-8"><p className="text-gray-500">
        Solo el admin tiene permitido acceder a esta página </p></div></>);
    if (loading) return (<><Header /> <div className="text-center py-8"><p className="text-gray-500">
        Cargando...</p></div></>);
    if (error) return (<><Header /> <div className="text-center py-8"><p className="text-gray-500">
    Ha habido un error.</p></div></>);

    return(
    <>
    <Header />
    <div className="flex justify-between items-center my-4 mr-15 px-6">

        <button 
            onClick={() => navigate("/admin")}
            className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
        >
            Volver a Panel de Administrador
        </button>

        <input
            type="text"
            value={rutSearch}
            onChange={(e) => setRutSearch(e.target.value)}
            placeholder="Buscar por rut..."
            className="
                w-64 px-4 py-2 rounded-xl
                shadow
                outline-none
                bg-white
                placeholder-gray-400
                text-gray-700
            "
        />
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
        {showOpenList && (filteredOpenEpisodes.length > 0 ? (
            <ul className="mx-auto max-w-5xl space-y-3">
                <li>
                <div className="grid grid-cols-[minmax(0,1fr)_repeat(6,minmax(0,10fr))] gap-4 items-center px-4">
                    <p className="col-start-2">ID de Episodio</p>
                    <p>RUT del Paciente</p>
                    <p>Decisión Doctor</p>
                    <p>Recomendacion IA</p>
                    <p>Decisión Jefe de Turno</p>
                    <p>Decisión Aseguradora</p>
                </div>
                </li>
                {filteredOpenEpisodes?.map((openEpisode, i) => {
                return (
                    <li
                    key={i}
                    className="my-1.5 border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4 cursor-pointer"
                    >
                    <AdminEpisodeView
                    episode={openEpisode}
                    isOpen={openIndex == i}
                    onToggle={() => setOpenIndex(openIndex == i ? null : i)}
                    onUpdateEpisode={(updated) => handleUpdateEpisode(updated)}
                    />
                    </li>
                );
                })}
            </ul>
        ) : (
            <p className="text-gray-500">No hay episodios abiertos.</p>
        ))}
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
        {showClosedList && (filteredClosedEpisodes.length > 0 ? (
            <ul className="mx-auto max-w-5xl space-y-3">
                <li>
                <div className="grid grid-cols-[minmax(0,1fr)_repeat(6,minmax(0,10fr))] gap-4 items-center px-4">
                    <p className="col-start-2">ID de Episodio</p>
                    <p>RUT del Paciente</p>
                    <p>Decisión Doctor</p>
                    <p>Recomendacion IA</p>
                    <p>Decisión Jefe de Turno</p>
                    <p>Decisión Aseguradora</p>
                </div>
                </li>
                {filteredClosedEpisodes?.map((closedEpisode, i) => {
                const index = filteredOpenEpisodes ? i + filteredOpenEpisodes.length : i;
                return (
                    <li
                    key={index}
                    className="my-1.5 border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4 cursor-pointer"
                    >
                    <AdminEpisodeView
                    episode={closedEpisode}
                    isOpen={openIndex == index}
                    onToggle={() => setOpenIndex(openIndex == index ? null : index)}
                    onUpdateEpisode={(updated) => handleUpdateEpisode(updated)}
                    />
                    </li>
                );
                })}
            </ul>
        ) : (
            <p className="text-gray-500">No hay episodios cerrados.</p>
        ))}
    </div>
    </>
    )
}