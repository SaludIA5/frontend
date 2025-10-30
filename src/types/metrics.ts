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

export interface BackendMetricsSummary {
    recommendation_metrics: {
      total_recommendations: number
      accepted_recommendations: number
      rejected_recommendations: number
      accepted_concordant: number
      accepted_ia_pertinent_doctor_pertinent: number
      accepted_ia_no_pertinent_doctor_no_pertinent: number
      accepted_discordant: number
      accepted_ia_pertinent_doctor_no_pertinent: number
      accepted_ia_no_pertinent_doctor_pertinent: number
      rejected_concordant: number
      rejected_ia_pertinent_doctor_pertinent: number
      rejected_ia_no_pertinent_doctor_no_pertinent: number
      rejected_discordant: number
      rejected_ia_pertinent_doctor_no_pertinent: number
      rejected_ia_no_pertinent_doctor_pertinent: number
      precision: number
      recall: number
      f1_score: number
      accuracy: number
      concordance_rate: number
      acceptance_rate: 0
    },
    validation_metrics: BackendValidationByDoctor[]
    total_episodes: number
    episodes_with_ai_recommendation: number
    episodes_with_doctor_validation: number
    episodes_with_chief_validation: number
    period_start: Date
    period_end: Date
  }