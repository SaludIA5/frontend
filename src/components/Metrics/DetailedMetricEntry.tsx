import { useEffect, useState } from "react";
import type { BackendValidationByEpisode, DoctorSummary } from "../../types/metrics";
import axios from "axios";
import type { Diagnostic } from "../../types/patientInfo";

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
  episodeValidation: BackendValidationByEpisode;
  patientName: string;
  isOpen: boolean;
  isChief: boolean;
  onToggle: () => void;
  onValidate: (episodeValidation: BackendValidationByEpisode) => void;
  handleClose: () => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

const summariesCache = new Map<number, DoctorSummary[]>();

export default function DetailedMetricEntry({
  episodeValidation,
  patientName,
  isOpen,
  isChief,
  onToggle,
  onValidate,
  handleClose,
}: Props) {
  const [episodeData, setEpisodeData] = useState<EpisodeData>();
  const colorDoctor = episodeValidation.doctor_validation === "PERTINENTE" ? "green" : "red";
  const colorChief = episodeValidation.chief_validation === "PERTINENTE" ? "green" : "red";
  const colorAI = episodeValidation.is_concordant ? "green" : "red";
  const colorState = episodeData?.estado_del_caso === "Abierto" ? "green" : "red";
  const [doctorSummaries, setDoctorSummaries] = useState<DoctorSummary[]>([]);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        const res = await api.get(`episodes/${episodeValidation.episode_id}`);
        const data = res.data || {};
        setEpisodeData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEpisodeData();
  }, [episodeValidation]);

  const displayDiagnostics = (diagnostics: Diagnostic[]) => {
    const displayForm = diagnostics.map((diagnostic) => `${diagnostic.cie_code} - ${diagnostic.description}`);
    return displayForm.toString();
  }

  useEffect(() => {
    const fetchDoctorSummaries = async () => {
      if (!isOpen) return;

      const episodeId = episodeValidation.episode_id;

      if (summariesCache.has(episodeId)) {
        setDoctorSummaries(summariesCache.get(episodeId)!);
        return;
      }

      try {
        const res = await api.get(`doctor-summaries/by-episode/${episodeId}`);
        const summaries = res.data || [];
        const summariesArray = Array.isArray(summaries) ? summaries : [];
        summariesCache.set(episodeId, summariesArray);
        setDoctorSummaries(summariesArray);
      } catch (error) {
        console.log(error);
        setDoctorSummaries([]);
      }
    };
    fetchDoctorSummaries();
  }, [isOpen, episodeValidation.episode_id]);

  return (
    <>
      <div
        className="grid grid-cols-[minmax(0,1fr)_repeat(5,minmax(0,10fr))] gap-4 items-center px-4 py-4 -mx-4 -my-4 cursor-pointer min-h-full"
        onClick={onToggle}
      >
        <span onClick={(e) => { e.stopPropagation(); onToggle(); }}>{isOpen ? "▲" : "▼"}</span>
        <p className="font-medium">{patientName}</p>

        <p>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorState}-200 text-${colorState}-700`}
          >
            {episodeData?.estado_del_caso ? episodeData.estado_del_caso : "Sin respuesta"} 
          </span>
        </p>

        <p>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorDoctor}-200 text-${colorDoctor}-700`}
          >
            {episodeValidation.doctor_validation == "PERTINENTE" ? "" : "No "} Se Aplicó Ley
          </span>
        </p>

        <p>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorAI}-200 text-${colorAI}-700`}
          >
            {episodeValidation.is_concordant ? "" : "No "} Concuerda
          </span>
        </p>

        <p className="flex items-center h-8">
          {!episodeValidation.chief_validation ? (isChief ? (
            <button
              className="rounded-xl px-6 py-2 text-sm text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
              onClick={(e) => {
                e.stopPropagation();
                onValidate(episodeValidation);
              }}
            >
              Validar Decisión
            </button>
          ) : <span className="text-sm">Solo un jefe de turno puede validar</span>) : (
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorChief}-200 text-${colorChief}-700`}
            >
              {episodeValidation.chief_validation === "PERTINENTE" ? "" : "No "} Aplica Ley
            </span>
          )}
        </p>
      </div>

      <div
        className={`overflow-hidden transition-all duration-150 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        {episodeData && (
          <>
            <div className="mt-4 pt-3 bg-gray-200 rounded-lg text-left px-6 text-gray-700 grid grid-cols-2 gap-y-1 max-h-[400px] overflow-y-auto">
              {Object.entries(episodeData)
                .filter(([, value]) => value !== null && value !== undefined && value !== "")
                .map(([key, value]) => (
                  <p key={key}>
                    <b>{formatKey(key)}:</b>{" "}
                    {typeof value === "boolean" ? 
                    (value ? "Sí" : "No") : 
                    key == "diagnostics" ? displayDiagnostics(value) : String(value)}
                  </p>
                ))}
            </div>
            {doctorSummaries.length > 0 && (
              <div className="mt-4 pt-3 bg-gray-200 rounded-lg text-left px-6 text-gray-700 pb-2">
                <h3 className="font-bold mb-3">Justificación de decisión</h3>
                <div className="space-y-3">
                  {doctorSummaries.map((summary) => (
                    <div key={summary.id} className="pb-3 border-b border-gray-300 last:border-b-0 last:pb-0">
                      <p className="whitespace-pre-wrap">{summary.comment}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(summary.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {episodeData?.estado_del_caso === "Abierto" && episodeData?.estado_del_caso !== null && episodeValidation.chief_validation &&
            (<button
              className="rounded-xl px-6 py-2 mt-3 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
              onClick={handleClose}
            >
              Cerrar Episodio
            </button>)}
          </>
        )}
      </div>
    </>
  );
}


function formatKey(key: string): string {
  if (key == "diagnostics") return "Diagnósticos";
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}