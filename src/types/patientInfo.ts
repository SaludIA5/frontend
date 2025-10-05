export interface BloodPressure {
    mediumBloodPressure?: string | number | readonly string[] | undefined
    sistolicBloodPressure?: string | number | readonly string[] | undefined
    diastolicBloodPressure?: string | number | readonly string[] | undefined
}

export interface Procedures {
    hemoDinamia: boolean
    hemoDinamiaSameDay: boolean
    endoscopy: boolean
    endoscopySameDay: boolean
    dialysis: boolean
    trombolysis: boolean
    trombolysisSameDay: boolean
    pcr: boolean
}