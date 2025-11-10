import { useState, useEffect, useMemo, useRef } from "react";
import type { Patient } from "../types/patient";
import type { Episode } from "../types/episode";
import axios from 'axios';
import { usePatients } from "../hooks/usePatients";
import PersonalDataTab from "./PatientFormTabs/PersonalDataTab";
import PatientStateTab from "./PatientFormTabs/PatientStateTab";
import TabButton from "./PatientFormTabs/TabButton";
import MedHistoryTab from "./PatientFormTabs/MedHistoryTab";
import ProceduresTab from "./PatientFormTabs/ProceduresTab";
import ConditionsTab from "./PatientFormTabs/ConditionsTab";
import LevelsTab from "./PatientFormTabs/LevelsTab";
import { emptyEpisode } from "../utils/emptyEpisode";
import type { EpisodeWithPatientData } from "../types/patient-episode";
import { useAuth } from "../context/AuthContextBase";
import { normalizeEpisode } from "../utils/normalizeEpisode";
import DiagnosticsTab from "./PatientFormTabs/DiagnosticsTab";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

interface ProcessEpisodeProps {
  isOpen: boolean;
  onClose: () => void;
  patientRut?: string;
  episode: Episode | null;
}

export default function ProcessEpisode({ isOpen, onClose, episode: episodeProp }: ProcessEpisodeProps) {
  const [patient, setPatient] = useState<Patient>({
    id: -1,
    name: "",
    rut: "",
    age: 0,
    sex: "",
  })
  const [episode, setEpisode] = useState<Episode>(emptyEpisode);
  const [isEligibleToGenerate, setIsEligibleToGenerate] = useState(false);

  const [activeTab, setActiveTab] = useState<"personal" | "vitals"
    | "medhistory" | "procedures" | "conditions" | "levels" | "diagnostics">("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [recommendationResult, setRecommendationResult] = useState<null | { label: string; prediction: number; probability: number }>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  const currentEpisodeIdRef = useRef<number | null>(null);
  const wasOpenRef = useRef(false);

  const { updatePatient, updateEpisode, patientsWithEpisodes } = usePatients();
  const { user } = useAuth();

  const payload = useMemo(() => ({
    id_episodio: episode.id,
    numero_episodio: "0",
    diagnostics_id: episode.diagnostics || null,
    antecedentes_cardiaco: episode.cardiacHistory || null,
    antecedentes_diabetes: episode.diabetesHistory || null,
    antecedentes_hipertension: episode.hypertensionHistory || null,
    creatinina: episode.levels?.creatinin || null,
    fio2: Number(episode.patientState?.fio2) || null,
    fio2_ge_50: Number(episode.patientState?.fio2) >= 50 || null,
    frecuencia_cardiaca: Number(episode.patientState?.heartRate) || null,
    frecuencia_respiratoria: Number(episode.patientState?.respirationRate) || null,
    glasgow_score: Number(episode.hospitalizationConditions?.glasgowScore) || null,
    hemoglobina: Number(episode.levels?.hemoglobin) || null,
    model_type: "random_forest",
    nitrogeno_ureico: Number(episode.levels?.ureic_nitro) || null,
    pcr: Number(episode.levels?.pcr) || null,
    potasio: Number(episode.levels?.potassium) || null,
    presion_diastolica: Number(episode.bloodPressure?.diastolicBloodPressure) || null,
    presion_media: Number(episode.bloodPressure?.mediumBloodPressure) || null,
    presion_sistolica: Number(episode.bloodPressure?.sistolicBloodPressure) || null,
    saturacion_o2: Number(episode.patientState?.oxygenSaturation) || null,
    sodio: Number(episode.levels?.sodium) || null,
    temperatura_c: Number(episode.patientState?.temperature) || null,
    tipo: "SIN ALERTA",
    tipo_alerta_ugcc: "SIN ALERTA",
    tipo_cama: episode.hospitalizationConditions?.bedType,
    triage: 3,
    ventilacion_mecanica: episode.hospitalizationConditions?.mechanicalVentilation || null,

    cirugia_realizada: episode.proceduresDone?.surgery || null,
    cirugia_mismo_dia_ingreso: episode.proceduresDone?.surgerySameDay || null,
    hemodinamia: episode.proceduresDone?.hemoDinamia || null,
    hemodinamia_mismo_dia_ingreso: episode.proceduresDone?.hemoDinamiaSameDay || null,
    endoscopia: episode.proceduresDone?.endoscopy || null,
    endoscopia_mismo_dia_ingreso: episode.proceduresDone?.endoscopySameDay || null,
    dialisis: episode.proceduresDone?.dialysis || null,
    trombolisis: episode.proceduresDone?.trombolysis || null,
    trombolisis_mismo_dia_ingreso: episode.proceduresDone?.trombolysisSameDay || null,
    dreo: false,
    troponinas_alteradas: episode.proceduresDone?.alteredTroponine || null,
    ecg_alterado: episode.proceduresDone?.alteredEcg || null,
    rnm_protocolo_stroke: episode.proceduresDone?.rnmStrokeProtocol || null,
    dva: false,
    transfusiones: episode.proceduresDone?.bloodTransfusions || null,
    compromiso_conciencia: episode.patientState?.compromisedConsiousness || null,
  }), [episode]);

  useEffect(() => {
    const justOpened = isOpen && !wasOpenRef.current;
    const episodeChanged = episodeProp && episodeProp.id !== currentEpisodeIdRef.current;
    
    if (isOpen) {
      if (justOpened || episodeChanged) {
        setIsLoading(true);
        if (episodeProp) {
          currentEpisodeIdRef.current = episodeProp.id;
          
          let latestEpisode: Episode | null = null;
          let patientData: { id: number; name: string; rut: string; age: number } | null = null;
          
          for (const patient of patientsWithEpisodes) {
            const foundEpisode = patient.episodes.find(ep => ep.id === episodeProp.id);
            if (foundEpisode) {
              latestEpisode = foundEpisode;
              patientData = {
                id: patient.id,
                name: patient.name,
                rut: patient.rut,
                age: patient.age,
              };
              break;
            }
          }
          
          const episodeToUse = latestEpisode || episodeProp;
          const episodeData = episodeToUse as EpisodeWithPatientData;
          
          if (patientData) {
            setPatient({
              id: patientData.id,
              name: patientData.name,
              rut: patientData.rut,
              age: patientData.age,
            });
          } else {
            setPatient({
              id: episodeData.patient_id || episodeData.patientId || episodeToUse.patientId || -1,
              name: episodeData.patient_name || "",
              rut: episodeData.patient_rut || "",
              age: episodeData.patient_age || 0,
            });
          }
          
          if (latestEpisode) {
            setEpisode(latestEpisode);
          } else {
            const normalized = normalizeEpisode(episodeProp);
            setEpisode(normalized);
          }
        }
        setIsLoading(false);
      }
      wasOpenRef.current = true;
    } else {
      setEpisode(emptyEpisode);
      setIsEditing(false);
      setPatient({ id: -1, name: "", rut: "", age: 0 });
      currentEpisodeIdRef.current = null;
      wasOpenRef.current = false;
    }
  }, [episodeProp, isOpen, patientsWithEpisodes]);

  useEffect(() => {
    const filledFields = Object.values(payload).filter(
      (v) => v !== null && v !== undefined && v !== ""
    ).length;
    setIsEligibleToGenerate(filledFields >= 14);
  }, [payload]);


  const handleSave = async () => {
    if (!patient) return;

    const diagnosticsIds = episode.diagnostics?.map((diagnostic) => diagnostic.id);
    const patchPayload = {
      diagnostics_ids: diagnosticsIds,
      antecedentes_cardiaco: episode.cardiacHistory,
      antecedentes_diabetes: episode.diabetesHistory,
      antecedentes_hipertension: episode.hypertensionHistory,
      creatinina: episode.levels?.creatinin,
      fio2: Number(episode.patientState?.fio2),
      frecuencia_cardiaca: Number(episode.patientState?.heartRate),
      frecuencia_respiratoria: Number(episode.patientState?.respirationRate),
      glasgow_score: Number(episode.hospitalizationConditions?.glasgowScore),
      hemoglobina: Number(episode.levels?.hemoglobin),
      nitrogeno_ureico: Number(episode.levels?.ureic_nitro),
      pcr: Number(episode.levels?.pcr),
      potasio: Number(episode.levels?.potassium),
      presion_diastolica: Number(episode.bloodPressure?.diastolicBloodPressure),
      presion_media: Number(episode.bloodPressure?.mediumBloodPressure),
      presion_sistolica: Number(episode.bloodPressure?.sistolicBloodPressure),
      saturacion_o2: Number(episode.patientState?.oxygenSaturation),
      sodio: Number(episode.levels?.sodium),
      temperatura_c: Number(episode.patientState?.temperature),
      tipo_cama: episode.hospitalizationConditions?.bedType,
      ventilacion_mecanica: episode.hospitalizationConditions?.mechanicalVentilation,
      cirugia_realizada: episode.proceduresDone?.surgery,
      cirugia_mismo_dia_ingreso: episode.proceduresDone?.surgerySameDay,
      hemodinamia: episode.proceduresDone?.hemoDinamia,
      hemodinamia_mismo_dia_ingreso: episode.proceduresDone?.hemoDinamiaSameDay,
      endoscopia: episode.proceduresDone?.endoscopy,
      endoscopia_mismo_dia_ingreso: episode.proceduresDone?.endoscopySameDay,
      dialisis: episode.proceduresDone?.dialysis,
      trombolisis: episode.proceduresDone?.trombolysis,
      trombolisis_mismo_dia_ingreso: episode.proceduresDone?.trombolysisSameDay,
      troponinas_alteradas: episode.proceduresDone?.alteredTroponine,
      ecg_alterado: episode.proceduresDone?.alteredEcg,
      rnm_protocolo_stroke: episode.proceduresDone?.rnmStrokeProtocol,
      transfusiones: episode.proceduresDone?.bloodTransfusions,
      compromiso_conciencia: episode.patientState?.compromisedConsiousness,
    };

    Object.keys(patchPayload).forEach(key => {
      const value = patchPayload[key as keyof typeof patchPayload];
      if (value === null || value === undefined || Number.isNaN(value)) {
        delete patchPayload[key as keyof typeof patchPayload];
      }
    });

    try {
      const res = await api.patch(`/episodes/${episode.id}`, patchPayload);
      const updatedEpisodeData = res.data;
      const normalizedUpdatedEpisode = normalizeEpisode(updatedEpisodeData);
      
      const patientIdToUse = patient.id > 0 
        ? patient.id 
        : (normalizedUpdatedEpisode.patientId || episode.patientId || (updatedEpisodeData as EpisodeWithPatientData)?.patient_id) || -1;
      
      const mergedEpisode: Episode = {
        ...normalizedUpdatedEpisode,
        id: episode.id,
        patientId: patientIdToUse,
        diagnostics: episode.diagnostics ?? normalizedUpdatedEpisode.diagnostics,
        cardiacHistory: episode.cardiacHistory ?? normalizedUpdatedEpisode.cardiacHistory,
        diabetesHistory: episode.diabetesHistory ?? normalizedUpdatedEpisode.diabetesHistory,
        hypertensionHistory: episode.hypertensionHistory ?? normalizedUpdatedEpisode.hypertensionHistory,
      };
      
      if (patientIdToUse > 0 && episode.id > 0) {
        updateEpisode(patientIdToUse, episode.id, mergedEpisode);
      }
      setEpisode(mergedEpisode);
      if (patient.id > 0) {
        updatePatient(patient.id, { ...patient, openEpisode: updatedEpisodeData });
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating episode:", error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as typeof activeTab);
  };


  const handleGenerateRecommendation = async () => {
    try {
      const res = await api.post("/predictions", payload);
      const { prediction } = res.data;

      setRecommendationResult(res.data);
      setIsPopupVisible(true);
      setEpisode({ ...episode, aiValidation: prediction === 1 });
      updatePatient(patient.id, { ...patient, openEpisode: episode });
    } catch (error) {
      console.error("Error generando la recomendación:", error);
      alert("Ocurrió un error al generar la recomendación.");
    }
  };

  const handleValidateDecision = async (decision: "PERTINENTE" | "NO PERTINENTE") => {
    if (!episode?.id) {
      alert("Episodio inválido.");
      return;
    }
    if (!user?.id) {
      alert("Usuario no autenticado.");
      return;
    }
    try {
      await api.post(`/episodes/${episode.id}/validate`, {
        user_id: user.id,
        decision,
      });
      alert(`Episodio ${decision === "PERTINENTE" ? "validado" : "descartado"}.`);
      setIsPopupVisible(false);
    } catch (error) {
      console.error("Error validando episodio:", error);
      alert("No se pudo validar el episodio.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-white rounded-2xl shadow-lg text-black max-h-screen flex flex-col w-[40rem] min-h-[32rem]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" onClick={onClose} className="hover:cursor-pointer self-end mx-3 my-2">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
        {/* Tabs */}
        <div className="flex overflow-x-auto">
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Personal" code="personal" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Estado del Paciente" code="vitals" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Antecedentes Médicos" code="medhistory" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Procedimientos" code="procedures" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Condiciones Hospitalización" code="conditions" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Niveles" code="levels" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Diagnósticos" code="diagnostics" />
        </div>

        {/* Form content */}
        <div className="flex-1 overflow-y-auto p-6">
          <fieldset disabled={!isEditing} className={!isEditing ? "text-gray-600" : ""}>
            {isLoading ? (
              <div className="text-gray-500">Cargando...</div>
            ) : activeTab === "personal" ? (
              <PersonalDataTab patient={patient} />
            ) : activeTab === "vitals" ? (
              <PatientStateTab episode={episode} setEpisode={setEpisode} />
            ) : activeTab === "medhistory" ? (
              <MedHistoryTab episode={episode} setEpisode={setEpisode} />
            ) : activeTab === "procedures" ? (
              <ProceduresTab episode={episode} setEpisode={setEpisode} />
            ) : activeTab === "conditions" ? (
              <ConditionsTab episode={episode} setEpisode={setEpisode} />
            ) : activeTab === "diagnostics" ? (
              <DiagnosticsTab episode={episode} setEpisode={setEpisode} />
            ) : activeTab === "levels" ? (
              <LevelsTab episode={episode} setEpisode={setEpisode} />
            ) : (
              <div>Error: Pestaña no encontrada</div>
            )}
          </fieldset>
        </div>

        <div className="flex justify-end space-x-3 p-3">
          <div className="relative group">
            <button
              className={`rounded-xl px-4 py-2 text-white text-sm transition ${isEligibleToGenerate
                ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={!isEligibleToGenerate}
              onClick={isEligibleToGenerate ? handleGenerateRecommendation : undefined}
            >
              Generar Recomendación
            </button>

            {!isEligibleToGenerate && (
              <div className="absolute bg-[var(--color-primary)] bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                Debes llenar al menos 10 campos para generar una recomendación
              </div>
            )}
          </div>
          <button
            className={`rounded-xl px-4 py-2 text-white transition-colors duration-200 text-sm ${isEditing ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Desactivar Edición" : "Editar"}
          </button>
          <button
            className="rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] px-4 py-2 text-sm text-white"
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Popup Result */}
      {isPopupVisible && recommendationResult && (
        <div className="absolute bg-white rounded-xl border border-gray-300 shadow-2xl drop-shadow-2xl shadow-[0_20px_45px_rgba(0,0,0,0.25)] p-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" onClick={() => setIsPopupVisible(false)} className="hover:cursor-pointer justify-self-end">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
          <p className="pb-5 text-left">Resultado Recomendación:</p>
          <span className={`px-4 py-2 m-2 rounded-full font-semibold ${recommendationResult.prediction === 1 ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
            {recommendationResult.prediction === 1 ? "Aplica Ley de Urgencia" : "No aplica Ley de Urgencia"}
          </span>
          <div className="flex justify-center gap-3 mt-4">
            <button
              className="rounded-xl bg-green-600 hover:bg-green-700 px-4 py-2 text-sm text-white"
              onClick={() => handleValidateDecision("PERTINENTE")}
            >
              Validar
            </button>
            <button
              className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-sm text-white"
              onClick={() => handleValidateDecision("NO PERTINENTE")}
            >
              Descartar
            </button>
          </div>
          <p className="pt-5 italic text-xs">Esta recomendación es generada con IA, por lo que se recomienda su revisión.</p>
        </div>
      )}
    </div>
  );
}