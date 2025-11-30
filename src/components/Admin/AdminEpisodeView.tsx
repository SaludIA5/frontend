import { useEffect, useState } from "react";
import axios from "axios";
import type { Episode } from "../../types/episode";

interface EpisodeData {
  id?: number;
  patient_id?: number;
  numero_episodio?: string;
  fecha_estabilizacion?: Date;
  fecha_alta?: Date;
  validacion?: string;
  tipo?: string;
  tipo_alerta_ugcc?: string;
  fecha_ingreso?: Date;
  mes_ingreso?: number;
  fecha_egreso?: Date;
  mes_egreso?: number;
  centro?: string;
  antecedentes_cardiaco?: boolean;
  antecedentes_diabetes?: boolean;
  antecedentes_hipertension?: boolean;
  triage?: string;
  presion_sistolica?: string;
  presion_diastolica?: string;
  presion_media?: string;
  temperatura_c?: string;
  saturacion_o2?: string;
  frecuencia_cardiaca?: string;
  frecuencia_respiratoria?: string;
  tipo_cama?: string;
  glasgow_score?: string;
  fio2?: string;
  fio2_ge_50?: boolean;
  ventilacion_mecanica?: boolean;
  cirugia_realizada?: boolean;
  cirugia_mismo_dia_ingreso?: boolean;
  hemodinamia?: boolean;
  hemodinamia_mismo_dia_ingreso?: boolean;
  endoscopia?: boolean;
  endoscopia_mismo_dia_ingreso?: boolean;
  dialisis?: boolean;
  trombolisis?: boolean;
  trombolisis_mismo_dia_ingreso?: boolean;
  pcr?: string;
  hemoglobina?: string;
  creatinina?: string;
  nitrogeno_ureico?: string;
  sodio?: string;
  potasio?: string;
  dreo?: boolean;
  troponinas_alteradas?: boolean;
  ecg_alterado?: boolean;
  rnm_protocolo_stroke?: boolean;
  dva?: boolean;
  transfusiones?: boolean;
  compromiso_conciencia?: boolean;
  estado_del_caso?: string;
  recomendacion_modelo?: string;
  validacion_jefe_turno?: string;
  diagnostics_ids?: number[];
}

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
  const [episodeData, setEpisodeData] = useState<EpisodeData>();
  const [showMenu, setShowMenu] = useState(false);

  const insuranceText =
    episode.insuranceValidation === true
      ? "Pertinente"
      : episode.insuranceValidation === false
        ? "No pertinente"
        : "Sin respuesta";

  useEffect(() => {
    const fetchEpisodeData = () => {
      const fetchData = async () => {
        try {
          const [episodeResponse, insuranceResponse, rutResponse] = await Promise.all([
            api.get(`episodes/${episode.id}`),
            api.get(`insurance/${episode.id}`),
            api.get(`patients/${episode.patientId}`)
          ]);

          const data = episodeResponse.data || {};
          setEpisodeData(data);

          episode.insuranceValidation = insuranceResponse.data.is_pertinent;
          episode.patientRut = rutResponse.data.rut;

          onUpdateEpisode(episode);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    };
    fetchEpisodeData();
  }, [episode, onUpdateEpisode]);

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
    } catch (e) {
      console.log("Error actualizando:", e);
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
              {insuranceText}
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

      {isOpen && episodeData && (
        <div className="mt-4 pt-3 bg-gray-200 rounded-lg text-left px-6 text-gray-700 grid grid-cols-2 gap-y-1 max-h-[400px] overflow-y-auto">
          {Object.entries(episodeData)
            .filter(([, value]) => value !== null && value !== undefined && value !== "")
            .map(([key, value]) => (
              <p key={key}>
                <b>{formatKey(key)}:</b>{" "}
                {typeof value === "boolean" ? (value ? "Sí" : "No") : String(value)}
              </p>
            ))}
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