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

export interface BackendValidationByEpisode {
    episode_id: number,
    numero_episodio: string,
    patient_id: number,
    ai_recommendation: string,
    doctor_validation: string,
    chief_validation: string,
    is_concordant: boolean,
    is_accepted: boolean,
    validation_date: Date | string,
    validated_by_doctor: string
}

export interface BackendValidationByDoctor {
    doctor_id: number
    doctor_name: string
    total_validations: number
    accepted_validations: number
    rejected_validations: number
    concordant_validations: number
    discordant_validations: number
    concordance_rate: number
    acceptance_rate: number
}