import type { BloodPressure, Procedures, HospitalizationConditions, PatientState, Levels } from "./patientInfo"

export interface Episode {
    isEligible: boolean
    examPerformed?: string | number | readonly string[] | undefined
    patientState?: PatientState 
    bloodPressure?: BloodPressure
    cardiacHistory?: boolean
    diabetesHistory?: boolean
    hypertensionHistory?: boolean
    proceduresDone?: Procedures
    hospitalizationConditions?: HospitalizationConditions
    levels?: Levels
}