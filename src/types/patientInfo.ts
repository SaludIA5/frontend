export interface BloodPressure {
    mediumBloodPressure?: string | number | readonly string[] | undefined
    sistolicBloodPressure?: string | number | readonly string[] | undefined
    diastolicBloodPressure?: string | number | readonly string[] | undefined
}

export interface Procedures {
    surgery: boolean
    surgerySameDay: boolean
    hemoDinamia: boolean
    hemoDinamiaSameDay: boolean
    endoscopy: boolean
    endoscopySameDay: boolean
    dialysis: boolean
    trombolysis: boolean
    trombolysisSameDay: boolean
    rnmStrokeProtocol: boolean
    bloodTransfusions: boolean
    ecg: boolean
    alteredEcg: boolean
    troponine: boolean
    alteredTroponine: boolean
}

export interface HospitalizationConditions {
    mechanicalVentilation : boolean
    bedType: "Básica" | "UCI" | "UTI" | "Urgencia"
    glasgowScore: number
}

export interface PatientState {
    temperature: string | number | readonly string[] | undefined
    oxygenSaturation: string | number | readonly string[] | undefined
    fio2: string | number | readonly string[] | undefined
    respirationRate: string | number | readonly string[] | undefined
    heartRate: string | number | readonly string[] | undefined
    compromisedConsiousness: boolean
}

export interface Levels {
    hemoglobin: string | number | readonly string[] | undefined
    creatinin: string | number | readonly string[] | undefined
    ureic_nitro: string | number | readonly string[] | undefined
    sodium: string | number | readonly string[] | undefined
    potassium: string | number | readonly string[] | undefined
    pcr: string | number | readonly string[] | undefined
}

export interface Diagnostic {
    id: number
    cie_code: string
    description: string
}