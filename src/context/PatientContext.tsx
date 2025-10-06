import { useCallback, useState, type ReactNode } from "react";
import type { User } from "../types/user";
import { PatientsContext } from "./PatientsContext";
import { mockPatients } from "../types/user";

export const PatientsProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<User[]>(mockPatients);

  const addPatient = (patient: User) => {
    setPatients((prev) => [...prev, patient]);
  };
  
  const setPatientList = useCallback((patients: User[]) => {
    setPatients(patients);
  }, []);


  const updatePatient = (rut: string, updated: User) => {
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
