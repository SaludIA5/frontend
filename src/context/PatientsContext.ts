import { createContext } from "react";
import type { Patient } from "../types/patient";
import type { PatientWithEpisodes } from "../types/patient-episode";

type PatientsContextType = {
  patients: Patient[];
  patientsWithEpisodes: PatientWithEpisodes[];
  addPatient: (patient: Patient) => void;
  addPatientWithEpisodes: (patient: PatientWithEpisodes) => void;
  setPatientList: (patients: Patient[]) => void;
  setPatientsWithEpisodes: (patients: PatientWithEpisodes[]) => void;
  updatePatient: (id: number, updated: Partial<Patient>) => void;
};

export const PatientsContext = createContext<PatientsContextType | undefined>(undefined);
