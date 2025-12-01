import type React from "react";
import type { Episode } from "../../types/episode";
import type { Diagnostic } from "../../types/patientInfo";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

interface DiagnosticsTabProps {
  episode: Episode;
  setEpisode: React.Dispatch<React.SetStateAction<Episode>>;
}

export default function DiagnosticsTab({ episode, setEpisode }: DiagnosticsTabProps) {
    const [allDiagnostics, setAllDiagnostics] = useState<Diagnostic[]>([]);
    const [fetchedDiagnostics, setFetchedDiagnostics] = useState<Diagnostic[]>([]);
    const [currentDiagnostic, setCurrentDiagnostic] = useState<Diagnostic>();
    
    const episodeDiagnosticsKey = useMemo(() => {
        if (!Array.isArray(episode.diagnostics)) return '';
        return episode.diagnostics.map(d => d.cie_code).sort().join(',');
    }, [episode.diagnostics]);
    
    useEffect(() => {
        const fetchDiagnostics = async () => {
            const res = await api.get("/diagnostics");
            const data = res.data.items || res.data || [];
            const mappedDiagnostics = data.map((diagnostic: Diagnostic) => ({
                id: diagnostic.id,
                cie_code: diagnostic.cie_code,
                description: diagnostic.description,
            }));
            setFetchedDiagnostics(mappedDiagnostics);
        }
        fetchDiagnostics();
    }, []);
    
    useEffect(() => {
        if (Array.isArray(episode.diagnostics) && episode.diagnostics.length > 0) {
            const diagnosticsNotInEpisode = fetchedDiagnostics.filter(
                diagnostic => !episode.diagnostics?.some(d => d.cie_code === diagnostic.cie_code)
            );
            setAllDiagnostics(diagnosticsNotInEpisode);
        } else {
            setAllDiagnostics(fetchedDiagnostics);
        }
    }, [fetchedDiagnostics, episodeDiagnosticsKey, episode.diagnostics]);
    
    const getDiagnosticByCode = (code: string) => {
        return allDiagnostics.find(diagnostic => diagnostic.cie_code === code);
    }

    const handleDelete = (cie_code: string) => {
        if (!episode.diagnostics) return;
        const newDiagnostics = episode.diagnostics.filter((diag) => diag.cie_code != cie_code);
        setEpisode({ ...episode, diagnostics: newDiagnostics });
    }

    const handleSubmitDiagnostic = () => {
        const existingDiagnostics = Array.isArray(episode.diagnostics) ? episode.diagnostics : [];
        if (!currentDiagnostic) return;
        const newDiagnostics = [...existingDiagnostics, currentDiagnostic];
        setEpisode({ ...episode, diagnostics: newDiagnostics });
        setCurrentDiagnostic(undefined);
    };

    return (
    <div className="flex flex-col gap-2">
      <p>Diagnósticos actuales: </p>
      <ul>
        {Array.isArray(episode.diagnostics) && episode.diagnostics.length > 0 ? (episode.diagnostics.map((diagnostic, i) => 
        {
            return(
            <li key={i} className="flex flex-row gap-2">
                <div 
                onClick={() => handleDelete(diagnostic.cie_code)}
                className="text-red-500 hover:cursor-default"
                >
                    X
                </div> 
                {diagnostic.cie_code} - {diagnostic.description}
            </li>
            )

        })) : "No hay diagnósticos aún"} 
      </ul>

      <p>Agregar diagnóstico:</p>
        <select
            className="w-full mb-3 rounded border border-gray-300 p-2"
            value={currentDiagnostic?.cie_code || ""}
            onChange={(e) => setCurrentDiagnostic(getDiagnosticByCode(e.target.value))}
        >
            <option value="" disabled>Seleccione</option>
            {allDiagnostics.map(diagnostic => (
                <option key={diagnostic.id} value={diagnostic.cie_code}> {diagnostic.cie_code} - {diagnostic.description}</option>
            ))}
        </select>
        <button className="text-white" onClick={handleSubmitDiagnostic}>Agregar</button>
    </div>
  );
}