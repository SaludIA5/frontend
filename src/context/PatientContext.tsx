// borrar este archivo cuando enchufemos al backend

// context/PatientsContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

export type User = {
  firstName: string;
  lastName: string;
  secondLastname?: string;
  rut: string;
  sex: string;
  isEligible: boolean;
  oxygenSaturation?: BigInteger;
  
};

type PatientsContextType = {
  patients: User[];
  addPatient: (patient: User) => void;
};

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export function PatientsProvider({ children }: { children: ReactNode }) {
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

export function usePatients() {
  const ctx = useContext(PatientsContext);
  if (!ctx) throw new Error("usePatients debe usarse dentro de PatientsProvider");
  return ctx;
}
