import { useState, useEffect } from "react";
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
interface ProcessPatientProps {
  isOpen: boolean;
  onClose: () => void;
  patientRut?: string;
}

export default function ProcessPatient({ isOpen, onClose, patientRut }: ProcessPatientProps) {
  const [patient, setPatient] = useState<Patient>({
    id: -1,
    name: "",
    rut: "",
    age: 0,
    sex: "",
  })
  const [episode, setEpisode] = useState<Episode>(emptyEpisode);

  const [activeTab, setActiveTab] = useState<"personal" | "vitals" 
  | "medhistory" | "procedures" | "conditions" | "levels">("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [recommendationResult, setRecommendationResult] = useState<null | { label: string; prediction: number; probability: number }>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { patients, updatePatient } = usePatients();

  useEffect(() => {
    if (patientRut && isOpen) {
      setIsLoading(true);
      const foundPatient = patients.find((p) => p.rut === patientRut);
      if (foundPatient){ 
        setPatient(foundPatient)
        if (foundPatient.openEpisode) setEpisode(foundPatient.openEpisode);
      }
      setIsLoading(false);
    } else if (!isOpen) {
      setEpisode(emptyEpisode);
      setIsEditing(false);
    }
  }, [patientRut, patients, isOpen]);


  const handleSave = () => {
    if (patientRut) updatePatient(patientRut, {...patient, openEpisode: episode});
    setIsEditing(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as typeof activeTab);
  };

  // Generación de recomendación
  const handleGenerateRecommendation = async () => {
    try {
      const api = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        withCredentials: true
      });

      const payload = {
        numero_episodio: "0",
        diagnostics: null,
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
        tipo_cama: episode.hospitalizationConditions?.bedType || "Básica",
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
      };
      const res = await api.post("/predictions", payload);
      const { prediction } = res.data;
      setRecommendationResult(res.data);
      setIsPopupVisible(true);
      setEpisode({...episode, aiValidation: prediction === 1})
      updatePatient(patientRut!, { ...patient, openEpisode: episode });
    } catch (error) {
      console.error("Error generando la recomendación:", error);
      alert("Ocurrió un error al generar la recomendación.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-white rounded-2xl shadow-lg text-black max-h-screen flex flex-col w-[40rem] min-h-[32rem]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" onClick={onClose} className="hover:cursor-pointer self-end mx-3 my-2">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
          {/* Tabs */}
          <div className="flex overflow-x-auto">
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Personal" code="personal" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Estado del Paciente" code="vitals" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Antecedentes Médicos" code="medhistory" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Procedimientos" code="procedures" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Condiciones Hospitalización" code="conditions" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Niveles" code="levels" />
          </div>

          {/* Form content */}
        <div className="flex-1 overflow-y-auto p-6">
          <fieldset disabled={!isEditing} className={!isEditing ? "text-gray-600" : ""}>
            {isLoading ? (
              <div className="text-gray-500">Cargando...</div>
            ) : activeTab === "personal" ? (
              // Personal Data es distinta a las otras porque cambia el paciente, no el episodio
              <PersonalDataTab patient={patient} setPatient={setPatient} />
            ) : activeTab === "vitals" ? (
              <PatientStateTab episode={episode} setEpisode={setEpisode} />
            ) : activeTab === "medhistory"? (
              <MedHistoryTab episode={episode} setEpisode={setEpisode} />
            ) : activeTab === "procedures"? (
              <ProceduresTab episode={episode} setEpisode={setEpisode} />
            ) : activeTab === "conditions"? (
              <ConditionsTab episode={episode} setEpisode={setEpisode} />
            ) : (
              <LevelsTab episode={episode} setEpisode={setEpisode} />
            )}
          </fieldset>
        </div>

        <div className="flex justify-end space-x-3 p-3">
          <button
            className="rounded-xl px-4 py-2 text-white text-sm"
            onClick={handleGenerateRecommendation}
          >
            Generar Recomendación
          </button>
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
        <div className="absolute bg-white rounded-xl shadow-lg drop-shadow-lg shadow-inner p-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" onClick={() => setIsPopupVisible(false)} className="hover:cursor-pointer justify-self-end">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
          <p className="pb-5 text-left">Resultado Recomendación:</p>
          <span className={`px-4 py-2 m-2 rounded-full font-semibold ${recommendationResult.prediction === 1 ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
            {recommendationResult.prediction === 1 ? "Aplica Ley de Urgencia" : "No aplica Ley de Urgencia"}
          </span>
          <p className="pt-5 italic text-xs">Esta recomendación es generada con IA, por lo que se recomienda su revisión.</p>
        </div>
      )}
    </div>
  );
}