import { useContext } from "react";
import { PatientsContext } from "../context/PatientsContext";

export function usePatients() {
  const ctx = useContext(PatientsContext);
  if (!ctx) throw new Error("usePatients debe usarse dentro de PatientsProvider");
  return ctx;
}
