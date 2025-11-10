import { createContext } from "react";
import type { Patient } from "../types/patient";
import type { PatientWithEpisodes } from "../types/patient-episode";
import type { Episode } from "../types/episode";

type PatientsContextType = {
  patients: Patient[];
  patientsWithEpisodes: PatientWithEpisodes[];
  addPatient: (patient: Patient) => void;
  addPatientWithEpisodes: (patient: PatientWithEpisodes) => void;
  setPatientList: (patients: Patient[]) => void;
  setPatientsWithEpisodes: (patients: PatientWithEpisodes[]) => void;
  updatePatient: (id: number, updated: Partial<Patient>) => void;
  updateEpisode: (patientId: number, episodeId: number, updated: Partial<Episode>) => void;
};

export const PatientsContext = createContext<PatientsContextType | undefined>(undefined);
