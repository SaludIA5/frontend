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
    pcr: boolean
    rnmStrokeProtocol: boolean
}

export interface HospitalizationConditions {
    mechanicalVentilation : boolean
    bedType: string
}

export interface VitalSigns {
    temperature: string | number | readonly string[] | undefined
    oxygenSaturation: string | number | readonly string[] | undefined
    heartRate: string | number | readonly string[] | undefined
}

export interface Levels {
    hemoglobin: string | number | readonly string[] | undefined
    creatinin: string | number | readonly string[] | undefined
    ureic_nitro: string | number | readonly string[] | undefined
    sodium: string | number | readonly string[] | undefined
    potassium: string | number | readonly string[] | undefined
}