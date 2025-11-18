import { useEffect, useState } from "react";
import type { BackendValidationByEpisode } from "../../types/metrics";
import axios from "axios";

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
  episode: BackendValidationByEpisode;
  patientName: string;
  isOpen: boolean;
  onToggle: () => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default function AdminEpisodeView({
  episode,
  patientName,
  isOpen,
  onToggle,
}: Props) {
  const colorDoctor = episode.doctor_validation ? "green" : "red";
  const colorAI = episode.is_concordant ? "green" : "red";
  const [episodeData, setEpisodeData] = useState<EpisodeData>();

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        const res = await api.get(`episodes/${episode.episode_id}`);
        const data = res.data || {};
        setEpisodeData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEpisodeData();
  }, [episode]);

  return (
    <>
      <div
        className="grid grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,10fr))] gap-4 items-center px-4"
      >
        <span onClick={onToggle}>{isOpen ? "▲" : "▼"}</span>
        <p className="font-medium">{patientName}</p>

        <p>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorDoctor}-200 text-${colorDoctor}-700`}
          >
            {episode.doctor_validation ? "" : "No "} Se Aplicó Ley
          </span>
        </p>

        <p>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorAI}-200 text-${colorAI}-700`}
          >
            {episode.is_concordant ? "" : "No "} Concuerda
          </span>
        </p>
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
 * Convierte nombres_de_campos a algo más legible: 
 * ejemplo: fecha_ingreso → "Fecha de Ingreso"
 */
function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}