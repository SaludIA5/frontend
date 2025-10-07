import { useCallback, useState, type ReactNode } from "react";
import type { Patient } from "../types/user";
import { PatientsContext } from "./PatientsContext";

export const PatientsProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient]);
  };
  
  const setPatientList = useCallback((patients: Patient[]) => {
    setPatients(patients);
  }, []);


  const updatePatient = (rut: string, updated: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.rut === rut ? { ...p, ...updated } : p))
    );
  };


  return (
    <PatientsContext.Provider value={{ patients, addPatient, setPatientList, updatePatient }}>
      {children}
    </PatientsContext.Provider>
  );
}
