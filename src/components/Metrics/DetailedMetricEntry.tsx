import { useEffect, useState } from "react";
import type { BackendValidationByEpisode } from "../../types/metrics";
import axios from "axios";

interface EpisodeData {
    id?: number
    patient_id?: number
    numero_episodio?: string
    fecha_estabilizacion?: Date
    fecha_alta?: Date
    validacion?: string
    tipo?: string
    tipo_alerta_ugcc?: string
    fecha_ingreso?: Date
    mes_ingreso?: number
    fecha_egreso?: Date
    mes_egreso?: number
    centro?: string
    antecedentes_cardiaco?: boolean
    antecedentes_diabetes?: boolean
    antecedentes_hipertension?: boolean
    triage?: string
    presion_sistolica?: string
    presion_diastolica?: string
    presion_media?: string
    temperatura_c?: string
    saturacion_o2?: string
    frecuencia_cardiaca?: string
    frecuencia_respiratoria?: string
    tipo_cama?: string
    glasgow_score?: string
    fio2?: string
    fio2_ge_50?: boolean
    ventilacion_mecanica?: boolean
    cirugia_realizada?: boolean
    cirugia_mismo_dia_ingreso?: boolean
    hemodinamia?: boolean
    hemodinamia_mismo_dia_ingreso?: boolean
    endoscopia?: boolean
    endoscopia_mismo_dia_ingreso?: boolean
    dialisis?: boolean
    trombolisis?: boolean
    trombolisis_mismo_dia_ingreso?: boolean
    pcr?: string
    hemoglobina?: string
    creatinina?: string
    nitrogeno_ureico?: string
    sodio?: string
    potasio?: string
    dreo?: boolean
    troponinas_alteradas?: boolean
    ecg_alterado?: boolean
    rnm_protocolo_stroke?: boolean
    dva?: boolean
    transfusiones?: boolean
    compromiso_conciencia?: boolean
    estado_del_caso?: string
    recomendacion_modelo?: string
    validacion_jefe_turno?: string
    diagnostics_ids?: [
      0
    ]
}


interface Props {
    episodeValidation: BackendValidationByEpisode
    patientName: string
    isOpen: boolean
    isChief: boolean
    onToggle: () => void
    onValidate: (episodeValidation: BackendValidationByEpisode) => void
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
}); 

export default function DetailedMetricEntry({ episodeValidation, patientName, isOpen, isChief, onToggle, onValidate } : Props){
    const colorDoctor = episodeValidation.doctor_validation ? "green" : "red";
    const colorAI = episodeValidation.is_concordant ? "green" : "red";
    const [episodeData, setEpisodeData] = useState<EpisodeData>();

    useEffect(() => {
        const fetchEpisodeData = async () => {
            try {
                const res = await api.get(`episodes/${episodeValidation.episode_id}`);
                const data = res.data || {};
                setEpisodeData(data);
            } catch (error){
                console.log(error);
            }
        }
        fetchEpisodeData();
    }, [episodeValidation])
    
    return (
        <>
          <div
            className="grid grid-cols-4 gap-4 items-center px-4"
            onClick={onToggle}
          >
            <p className="font-medium">{patientName}</p>

            <p>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorDoctor}-200 text-${colorDoctor}-700`}
              >
                {episodeValidation.doctor_validation ? "" : "No "} Se Aplicó Ley
              </span>
            </p>

            <p>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${colorAI}-200 text-${colorAI}-700`}
              >
                {episodeValidation.is_concordant ? "" : "No "} Concuerda
              </span>
            </p>

            <p>
              {isChief ? (
                <button
                  className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
                  onClick={(e) => {
                    e.stopPropagation(); // evita abrir/cerrar el acordeón
                    onValidate(episodeValidation);
                  }}
                >
                  Validar Decisión
                </button>
              ) : (
                "Solo un jefe de turno puede validar"
              )}
            </p>
          </div>

          {/* Panel desplegable */}
          {isOpen && episodeData && (
            <div className="mt-4 border-t pt-3 text-left px-6 text-gray-700">
              <p><b>ID Episodio:</b> {episodeValidation.episode_id}</p>
              <p><b>Frecuencia Cardiaca:</b> {episodeData.frecuencia_cardiaca || "No registrada"}</p>
            </div>
          )}
        </>
    )
}