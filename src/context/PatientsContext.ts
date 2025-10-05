import { createContext } from "react";
import type { User } from "../types/user";

type PatientsContextType = {
  patients: User[];
  addPatient: (patient: User) => void;
  updatePatient: (rut: string, updated: User) => void;
};

export const PatientsContext = createContext<PatientsContextType | undefined>(undefined);
