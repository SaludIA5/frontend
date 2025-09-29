import { createContext } from "react";
import type { User } from "../types/user";

type PatientsContextType = {
  patients: User[];
  addPatient: (patient: User) => void;
};

export const PatientsContext = createContext<PatientsContextType | undefined>(undefined);
