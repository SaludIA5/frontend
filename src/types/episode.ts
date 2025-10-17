import type { BloodPressure, Procedures, HospitalizationConditions, PatientState, Levels } from "./patientInfo"

export interface Episode {
    isEligible: boolean
    dateOfEntry?: Date,
    dateOfExit?: Date, 
    isActive?: boolean,
    patientState?: PatientState 
    bloodPressure?: BloodPressure
    cardiacHistory?: boolean
    diabetesHistory?: boolean
    hypertensionHistory?: boolean
    proceduresDone?: Procedures
    hospitalizationConditions?: HospitalizationConditions
    levels?: Levels
}