import { useEffect, useState } from "react";
import axios from "axios";
import type { Episode } from "../../types/episode";

interface Props {
  episode: Episode;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateEpisode: (updated: Episode) => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default function AdminEpisodeView({
  episode,
  isOpen,
  onToggle,
  onUpdateEpisode,
}: Props) {
  const colorDoctor = episode.doctorValidation ? "green" : "red";
  const colorChief = episode.chiefValidation ? "green" : "red";
  const colorAI = episode.aiValidation == episode.doctorValidation ? "green" : "red";
  const colorInsurance =
    episode.insuranceValidation === true ? "green" : 
      episode.insuranceValidation === false ? "red" : "gray";
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchInsuranceData = () => {
      const fetchData = async () => {
        try {
          const insuranceResponse = await api.get(`insurance/${episode.id}`);
          const insuranceData = insuranceResponse.data;
          onUpdateEpisode({
            ...episode,
            insuranceValidation: insuranceData.is_pertinent,
          });
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    };
    fetchInsuranceData();
  }, [episode.id]);

  const mapValue = (v: string): boolean | null => {
    if (v === "PERTINENTE") return true;
    if (v === "NO_PERTINENTE") return false;
    return null;
  };
  

  const handleInsuranceChange = async (newValue: string) => {
    setShowMenu(false);

    try {
        await api.post(`/insurance/review`, {
          is_pertinent: mapValue(newValue),
          episode_id: episode.id
        });
        
        onUpdateEpisode({
          ...episode,
          insuranceValidation: mapValue(newValue),
        });
    } catch(e) {
      console.log("Error actualizando:", e);
    }    
  };

  const onCloseEpisode = async () => {
    const estadoDelCaso = episode.isActive ? "Cerrado" : "Abierto";
    try {
      await api.patch(`/episodes/${episode.id}`, {
        estado_del_caso: estadoDelCaso,
      });
      onUpdateEpisode({
        ...episode,
        isActive: !episode.isActive,
      });
    } catch (error) {
      console.log("Error cerrando episodio:", error);
    }
  };

  return (
    <>
      <div
        className="grid grid-cols-[minmax(0,1fr)_repeat(6,minmax(0,10fr))] gap-4 items-center px-4"
      >
        <span onClick={onToggle}>{isOpen ? "▲" : "▼"}</span>
        <p className="font-medium" onClick={onToggle}>#{episode.id}</p>

        <p className="font-medium" onClick={onToggle}>{formatRut(episode.patientRut)}</p>

        <p>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorDoctor}-200 text-${colorDoctor}-700`}
            onClick={onToggle}
          >
            {episode.doctorValidation ? "" : "No "} Se Aplicó Ley
          </span>
        </p>

        <p>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorAI}-200 text-${colorAI}-700`}
            onClick={onToggle}
          >
            {episode.aiValidation == episode.doctorValidation ? "" : "No "} Concuerda
          </span>
        </p>

        <p>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorChief}-200 text-${colorChief}-700`}
            onClick={onToggle}
          >
            {episode.chiefValidation ? "" : "No "} Se Aplicó Ley
          </span>
        </p>
        <div>
          <div className="relative">
            <span
              onClick={() => setShowMenu((prev) => !prev)}
              className={`cursor-pointer rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorInsurance}-200 text-${colorInsurance}-700`}
            >
              {episode.insuranceValidation === true ? "Pertinente" : episode.insuranceValidation === false ? "No pertinente" : "Sin respuesta"}
            </span>

            {showMenu && (
              <div className="absolute z-20 mt-2 w-40 rounded-xl bg-white shadow-lg border border-gray-200 p-2 gap-2 grid">
                <span
                  className="w-full text-left px-2 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleInsuranceChange("PERTINENTE")}
                >
                  Pertinente
                </span>
                <span
                  className="w-full text-left px-2 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleInsuranceChange("NO_PERTINENTE")}
                >
                  No pertinente
                </span>
                <span
                  className="w-full text-left px-2 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleInsuranceChange("SIN_RESPUESTA")}
                >
                  Sin respuesta
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && episode && (
        <div>
        <div className="mt-4 pt-3 bg-gray-200 rounded-lg text-left px-6 text-gray-700 grid grid-cols-2 gap-y-1 max-h-[400px] overflow-y-auto">
          {Object.entries(episode)
            .filter(([, value]) => value !== null && value !== undefined && value !== "")
            .map(([key, value]) => (
              <p key={key}>
                <b>{formatKey(key)}:</b>{" "}
                {typeof value === "boolean" ? (value ? "Sí" : "No") : String(value)}
              </p>
            ))}
        </div>
        {episode.chiefValidation && (
          <button 
            className="rounded-xl px-6 py-2 mt-3 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            onClick={onCloseEpisode}
          >
            {episode.isActive ? "Cerrar Episodio" : "Abrir Episodio"}
          </button>
        )}
        </div>
      )}
    </>
  );
}

/**
 * Formatea el RUT a la forma XX.XXX.XXX-X o X.XXX.XXX-X
 */
function formatRut(rut: string): string {
  if (!rut) return "";
  const cleanedRut = rut.replace(/\D/g, "");
  const match = cleanedRut.match(/(\d{1,2})(\d{3})(\d{3})(\d)/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return rut;
}

/**
 * Convierte nombres_de_campos a algo más legible: 
 * ejemplo: fecha_ingreso → "Fecha de Ingreso"
 */
function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}