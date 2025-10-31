import { useCallback, useState, type ReactNode } from "react";
import type { Patient } from "../types/patient";
import { PatientsContext } from "./PatientsContext";
import type { PatientWithEpisodes } from "../types/patient-episode";

export const PatientsProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsWithEpisodes, setPatientsWithEpisodes] = useState<PatientWithEpisodes[]>([]);

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient]);
  };

  const addPatientWithEpisodes = (patient: PatientWithEpisodes) => {
    setPatientsWithEpisodes((prev) => [...prev, patient]);
  }

  const setPatientList = useCallback((patients: Patient[]) => {
    setPatients(patients);
  }, []);


  const updatePatient = (id: number, updated: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    setPatientsWithEpisodes((prev) =>
      prev.map((pwe) => (pwe.id === id ? { ...pwe, ...updated } : pwe))
    );
  };


  return (
    <PatientsContext.Provider value={{ patients, addPatient, setPatientList, updatePatient, patientsWithEpisodes, setPatientsWithEpisodes, addPatientWithEpisodes }}>
      {children}
    </PatientsContext.Provider>
  );
}
