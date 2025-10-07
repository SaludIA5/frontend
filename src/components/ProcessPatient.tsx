import { useState, useEffect } from "react";
import type { Patient } from "../types/user";
import axios from 'axios';
import { usePatients } from "../hooks/usePatients";
import PersonalDataTab from "./PatientFormTabs/PersonalDataTab";
import ExamDataTab from "./PatientFormTabs/ExamDataTab";
import VitalSignsDataTab from "./PatientFormTabs/VitalSignsDataTab";
import TabButton from "./PatientFormTabs/TabButton";
import MedHistoryTab from "./PatientFormTabs/MedHistoryTab";
import ProceduresTab from "./PatientFormTabs/ProceduresTab";
interface ProcessPatientProps {
  isOpen: boolean;
  onClose: () => void;
  patientRut?: string;
}

export default function ProcessPatient({ isOpen, onClose, patientRut }: ProcessPatientProps) {
  const [newPatient, setNewPatient] = useState<Patient>({
    name: "",
    isEligible: false,
    rut: "",
    sex: "",
    oxygenSaturation: "",
    heartRate: "",
    bloodPressure: {
      mediumBloodPressure: "",
      sistolicBloodPressure: "",
      diastolicBloodPressure: ""
    },
    examPerformed: "",
    age: "",
  });

  const [activeTab, setActiveTab] = useState<"personal" | "exams" | "vitals" | "medhistory" | "procedures">("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [recommendationResult, setRecommendationResult] = useState<null | { label: string; prediction: number; probability: number }>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { patients, updatePatient } = usePatients();

  useEffect(() => {
    if (patientRut && isOpen) {
      setIsLoading(true);
      const foundPatient = patients.find((p) => p.rut === patientRut);
      // console.log(foundPatient)
      if (foundPatient) setNewPatient(foundPatient);
      setIsLoading(false);
    } else if (!isOpen) {
      setNewPatient({
        name: "",
        isEligible: false,
        rut: "",
        sex: "",
        oxygenSaturation: "",
        heartRate: "",
        bloodPressure: {
          mediumBloodPressure: "",
          sistolicBloodPressure: "",
          diastolicBloodPressure: ""
        },
        examPerformed: "",
        age: ""
      });
      setIsEditing(false);
    }
  }, [patientRut, patients, isOpen]);

  const handleSave = () => {
    if (patientRut) updatePatient(patientRut, newPatient);
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
        antecedentes_cardiaco: true,
        antecedentes_diabetes: false,
        antecedentes_hipertension: true,
        creatinina: 0.92,
        fio2: 0.21,
        fio2_ge_50: false,
        frecuencia_cardiaca: Number(newPatient.heartRate) || 0,
        frecuencia_respiratoria: 27,
        glasgow_score: 14,
        hemoglobina: 13.1,
        model_type: "xgboost",
        nitrogeno_ureico: 31,
        pcr: 17.51,
        potasio: 4.5,
        presion_diastolica: Number(newPatient.bloodPressure?.diastolicBloodPressure) || 0,
        presion_media: Number(newPatient.bloodPressure?.mediumBloodPressure) || 0,
        presion_sistolica: Number(newPatient.bloodPressure?.sistolicBloodPressure) || 0,
        saturacion_o2: Number(newPatient.oxygenSaturation) || 0,
        sodio: 139,
        temperatura_c: 36.5,
        tipo: "SIN ALERTA",
        tipo_alerta_ugcc: "SIN ALERTA",
        tipo_cama: "UCI",
        triage: 3,
        ventilacion_mecanica: false,

        cirugia_realizada: false,
        cirugia_mismo_dia_ingreso: false,
        hemodinamia: false,
        hemodinamia_mismo_dia_ingreso: false,
        endoscopia: false,
        endoscopia_mismo_dia_ingreso: false,
        dialisis: false,
        trombolisis: false,
        trombolisis_mismo_dia_ingreso: false,
        dreo: false,
        troponinas_alteradas: false,
        ecg_alterado: false,
        rnm_protocolo_stroke: false,
        dva: false,
        transfusiones: false,
        compromiso_conciencia: false
      };

      const res = await api.post("predictions", payload);
      const { prediction } = res.data;
      setRecommendationResult(res.data);
      setIsPopupVisible(true);
      updatePatient(patientRut!, { ...newPatient, isEligible: prediction === 1 });
    } catch (error) {
      console.error("Error generando la recomendación:", error);
      alert("Ocurrió un error al generar la recomendación.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-white rounded-2xl shadow-lg text-black max-h-screen flex flex-col w-[40rem] min-h-[32rem]">
        {/* Tabs */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" onClick={onClose} className="hover:cursor-pointer self-end m-4">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
          <div className="flex rounded-t-2xl">
            <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Personal" code="personal"/>
            <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Exámenes" code="exams" />
            <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Signos Vitales" code="vitals" />
            <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Antecedentes Médicos" code="medhistory" />
            <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Procedimientos" code="procedures" />
          </div>

          {/* Form content */}
        <div className="flex-1 overflow-y-auto p-6">
          <fieldset disabled={!isEditing} className={!isEditing ? "text-gray-600" : ""}>
            {isLoading ? (
              <div className="text-gray-500">Cargando...</div>
            ) : activeTab === "personal" ? (
              <PersonalDataTab newPatient={newPatient} setNewPatient={setNewPatient} />
            ) : activeTab === "exams" ? (
              <ExamDataTab newPatient={newPatient} setNewPatient={setNewPatient} />
            ) : activeTab === "vitals" ? (
              <VitalSignsDataTab newPatient={newPatient} setNewPatient={setNewPatient} />
            ) : activeTab === "medhistory"? (
              <MedHistoryTab newPatient={newPatient} setNewPatient={setNewPatient} />
            ) : (
              <ProceduresTab newPatient={newPatient} setNewPatient={setNewPatient} />
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