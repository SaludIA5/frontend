import type { BloodPressure, Procedures, HospitalizationConditions, PatientState, Levels } from "./patientInfo"

export interface Episode {
    episodeId: number
    patientId: number
    aiValidation?: boolean
    chiefValidation?: boolean
    doctorValidation?: boolean
    medicalCenter?: string
    isActive?: boolean
    // Fechas
    dateOfEntry?: Date | string
    dateOfStabilization?: Date | string
    dateOfExit?: Date | string
    // Datos medicos
    patientState?: PatientState 
    bloodPressure?: BloodPressure
    cardiacHistory?: boolean
    diabetesHistory?: boolean
    hypertensionHistory?: boolean
    proceduresDone?: Procedures
    hospitalizationConditions?: HospitalizationConditions
    levels?: Levels
    wasLawApplied?: boolean
}

/*
patient_id: int
    validacion: Optional[str] = None
    tipo: Optional[str] = None
    tipo_alerta_ugcc: Optional[str] = None
    triage: Optional[PydanticDecimal] = None
    dva: Optional[bool] = None

    # IDs de diagnósticos para asociar (muchos-a-muchos)
    diagnostics_ids: Optional[List[int]] = None
*/