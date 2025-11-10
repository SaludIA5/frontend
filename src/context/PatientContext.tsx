import { useCallback, useState, type ReactNode } from "react";
import type { Patient } from "../types/patient";
import { PatientsContext } from "./PatientsContext";
import type { PatientWithEpisodes } from "../types/patient-episode";
import type { Episode } from "../types/episode";

export const PatientsProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsWithEpisodes, setPatientsWithEpisodes] = useState<PatientWithEpisodes[]>([]);

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient]);
  };

  const addPatientWithEpisodes = (patient: PatientWithEpisodes) => {
    setPatientsWithEpisodes((prev) => [...prev, patient]);
  }

  const setPatientList = useCallback((patients: Patient[]) => {
    setPatients(patients);
  }, []);


  const updatePatient = (id: number, updated: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    setPatientsWithEpisodes((prev) =>
      prev.map((pwe) => (pwe.id === id ? { ...pwe, ...updated } : pwe))
    );
  };

  const updateEpisode = (patientId: number, episodeId: number, updated: Partial<Episode>) => {
    setPatientsWithEpisodes((prev) =>
      prev.map((pwe) => {
        if (pwe.id === patientId) {
          return {
            ...pwe,
            episodes: pwe.episodes.map((ep) => {
              if (ep.id === episodeId) {
                // Check if this looks like a complete episode update (has id and patientId)
                // When saving, we pass a complete merged episode, so replace it entirely
                const isCompleteUpdate = updated.id !== undefined && updated.patientId !== undefined;
                
                if (isCompleteUpdate) {
                  // Complete episode - replace entirely, ensuring we preserve the episode ID
                  return {
                    ...updated,
                    id: episodeId, // Always preserve the episode ID
                    patientId: patientId, // Always preserve the patient ID
                  } as Episode;
                } else {
                  // Partial update - merge nested objects
                  return {
                    ...ep,
                    ...updated,
                    // Merge nested objects if they exist
                    patientState: updated.patientState 
                      ? { ...ep.patientState, ...updated.patientState }
                      : ep.patientState ?? updated.patientState,
                    bloodPressure: updated.bloodPressure
                      ? { ...ep.bloodPressure, ...updated.bloodPressure }
                      : ep.bloodPressure ?? updated.bloodPressure,
                    hospitalizationConditions: updated.hospitalizationConditions
                      ? { ...ep.hospitalizationConditions, ...updated.hospitalizationConditions }
                      : ep.hospitalizationConditions ?? updated.hospitalizationConditions,
                    proceduresDone: updated.proceduresDone
                      ? { ...ep.proceduresDone, ...updated.proceduresDone }
                      : ep.proceduresDone ?? updated.proceduresDone,
                    levels: updated.levels
                      ? { ...ep.levels, ...updated.levels }
                      : ep.levels ?? updated.levels,
                    // Preserve diagnostics array if not being updated
                    diagnostics: updated.diagnostics !== undefined 
                      ? updated.diagnostics 
                      : ep.diagnostics,
                  };
                }
              }
              return ep;
            }),
          };
        }
        return pwe;
      })
    );
  };

  return (
    <PatientsContext.Provider value={{ patients, addPatient, setPatientList, updatePatient, patientsWithEpisodes, setPatientsWithEpisodes, addPatientWithEpisodes, updateEpisode }}>
      {children}
    </PatientsContext.Provider>
  );
}
