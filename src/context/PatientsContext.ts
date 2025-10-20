import { createContext } from "react";
import type { Patient } from "../types/patient";

type PatientsContextType = {
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  setPatientList: (patients: Patient[]) => void;
  updatePatient: (rut: string, updated: Patient) => void;
};

export const PatientsContext = createContext<PatientsContextType | undefined>(undefined);
