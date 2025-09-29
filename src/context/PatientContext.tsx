// borrar este archivo cuando enchufemos al backend

// context/PatientsContext.tsx
import { useState, type ReactNode } from "react";
import type { User } from "../types/user";
import { PatientsContext } from "./PatientsContext";

export const PatientsProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<User[]>([]);

  const addPatient = (patient: User) => {
    setPatients((prev) => [...prev, patient]);
  };

  return (
    <PatientsContext.Provider value={{ patients, addPatient }}>
      {children}
    </PatientsContext.Provider>
  );
}
