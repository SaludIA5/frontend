export interface DoctorValidation {
    doctorId: number
    doctorName: string
    totalValidations: number
    acceptedValidations: number
    rejectedValidations: number
    concordantValidations: number
    discordantValidations: number
    concordanceRate: number
    acceptanceRate: number
}