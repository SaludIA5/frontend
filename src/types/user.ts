export interface User {
    examPerformed: string | number | readonly string[] | undefined
    oxygenSaturation: string | number | readonly string[] | undefined
    heartRate: string | number | readonly string[] | undefined
    bloodPressure: string | number | readonly string[] | undefined
    firstName: string
    lastName: string
    secondLastname?: string
    isEligible: boolean
    rut: string
    sex: string
}