import type { BloodPressure, Procedures, HospitalizationConditions, PatientState, Levels, Diagnostic } from "./patientInfo"

export interface Episode {
    id: number
    patientId: number
    patientRut: string
    aiValidation?: boolean
    chiefValidation?: boolean
    doctorValidation?: boolean
    insuranceValidation: boolean | null
    medicalCenter?: string
    isActive?: boolean
    // Fechas
    dateOfEntry?: Date | string
    fecha_ingreso?: Date | string
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
    diagnostics?: Diagnostic[]
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