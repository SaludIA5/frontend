import { useState, useEffect } from "react";
import type { User } from "../types/user";
import { usePatients } from "../hooks/usePatients";
import PersonalDataTab from "./PatientFormTabs/PersonalDataTab";
import ExamDataTab from "./PatientFormTabs/ExamDataTab";
import VitalSignsDataTab from "./PatientFormTabs/VitalSignsDataTab";
import TabButton from "./PatientFormTabs/TabButton";
import MedHistoryTab from "./PatientFormTabs/MedHistoryTab";
interface ProcessPatientProps {
  isOpen: boolean;
  onClose: () => void;
  patientRut?: string;
}

export default function ProcessPatient({ isOpen, onClose, patientRut }: ProcessPatientProps) {
  const [newPatient, setNewPatient] = useState<User>({
    firstName: "",
    lastName: "",
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
  });

  const [activeTab, setActiveTab] = useState<"personal" | "exams" | "vitals" | "medhistory">("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { patients, updatePatient } = usePatients();

  useEffect(() => {
    if (patientRut && isOpen) {
      setIsLoading(true);
      const foundPatient = patients.find((p) => p.rut === patientRut);
      if (foundPatient) setNewPatient(foundPatient);
      setIsLoading(false);
    } else if (!isOpen) {
      setNewPatient({
        firstName: "",
        lastName: "",
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
      });
      setIsEditing(false);
    }
  }, [patientRut, patients, isOpen]);

  const handleSave = () => {
    if (patientRut) updatePatient(patientRut, newPatient);
    setIsEditing(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "personal" | "exams" | "vitals" | "medhistory");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-white rounded-2xl shadow-lg text-black max-h-screen flex flex-col w-[40rem] min-h-[32rem]">
        {/* Tabs */}
        <div className="flex rounded-t-2xl">
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Personal" code="personal" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Exámenes" code="exams" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Signos Vitales" code="vitals" />
          <TabButton activeTab={activeTab} setActiveTab={handleTabChange} label="Antecedentes Médicos" code="medhistory" />
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
            ) : (
              <MedHistoryTab newPatient={newPatient} setNewPatient={setNewPatient} />
            )}
          </fieldset>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 p-3">
          <button
            className="rounded-xl bg-gray-300 px-4 py-2 hover:bg-gray-400"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            className={`rounded-xl px-4 py-2 text-white transition-colors duration-200 w-32 text-sm ${isEditing ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Desactivar Edición" : "Editar"}
          </button>
          <button
            className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}