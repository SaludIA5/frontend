import type { Episode } from "../types/episode";
import { emptyEpisode } from "./emptyEpisode";

export function normalizeEpisode(apiEp: any): Episode {
    const base = emptyEpisode();
    return {
        ...base,
        id: apiEp?.id ?? base.id,
        patientId: apiEp?.patient_id ?? apiEp?.patientId ?? base.patientId,
        aiValidation: apiEp?.aiValidation ?? (typeof apiEp?.validacion === "string" ? apiEp.validacion === "PERTINENTE" : base.aiValidation),
        chiefValidation: apiEp?.chiefValidation ?? base.chiefValidation,
        doctorValidation: apiEp?.doctorValidation ?? base.doctorValidation,
        medicalCenter: apiEp?.medicalCenter,
        isActive: apiEp?.isActive,
        dateOfEntry: apiEp?.dateOfEntry ?? apiEp?.fecha_ingreso ?? base.dateOfEntry,
        dateOfStabilization: apiEp?.dateOfStabilization ?? base.dateOfStabilization,
        dateOfExit: apiEp?.dateOfExit ?? apiEp?.fecha_egreso ?? base.dateOfExit,
        patientState: {
            temperature: apiEp?.temperatura_c ?? base.patientState?.temperature,
            oxygenSaturation: apiEp?.saturacion_o2 ?? base.patientState?.oxygenSaturation,
            fio2: apiEp?.fio2 ?? base.patientState?.fio2,
            respirationRate: apiEp?.frecuencia_respiratoria ?? base.patientState?.respirationRate,
            heartRate: apiEp?.frecuencia_cardiaca ?? base.patientState?.heartRate,
            compromisedConsiousness: apiEp?.compromiso_conciencia ?? base.patientState?.compromisedConsiousness,
        },
        bloodPressure: {
            sistolicBloodPressure: apiEp?.presion_sistolica ?? base.bloodPressure?.sistolicBloodPressure,
            diastolicBloodPressure: apiEp?.presion_diastolica ?? base.bloodPressure?.diastolicBloodPressure,
            mediumBloodPressure: apiEp?.presion_media ?? base.bloodPressure?.mediumBloodPressure,
        },
        hospitalizationConditions: {
            bedType: apiEp?.tipo_cama ?? base.hospitalizationConditions?.bedType,
            mechanicalVentilation: apiEp?.ventilacion_mecanica ?? base.hospitalizationConditions?.mechanicalVentilation,
            glasgowScore: apiEp?.glasgow_score ?? base.hospitalizationConditions?.glasgowScore,
        },
        proceduresDone: {
            ecg: apiEp?.ecg ?? base.proceduresDone?.ecg,
            troponine: apiEp?.troponine ?? base.proceduresDone?.troponine,
            surgery: apiEp?.cirugia_realizada ?? base.proceduresDone?.surgery,
            surgerySameDay: apiEp?.cirugia_mismo_dia_ingreso ?? base.proceduresDone?.surgerySameDay,
            hemoDinamia: apiEp?.hemodinamia ?? base.proceduresDone?.hemoDinamia,
            hemoDinamiaSameDay: apiEp?.hemodinamia_mismo_dia_ingreso ?? base.proceduresDone?.hemoDinamiaSameDay,
            endoscopy: apiEp?.endoscopia ?? base.proceduresDone?.endoscopy,
            endoscopySameDay: apiEp?.endoscopia_mismo_dia_ingreso ?? base.proceduresDone?.endoscopySameDay,
            dialysis: apiEp?.dialisis ?? base.proceduresDone?.dialysis,
            trombolysis: apiEp?.trombolisis ?? base.proceduresDone?.trombolysis,
            trombolysisSameDay: apiEp?.trombolisis_mismo_dia_ingreso ?? base.proceduresDone?.trombolysisSameDay,
            alteredTroponine: apiEp?.troponinas_alteradas ?? base.proceduresDone?.alteredTroponine,
            alteredEcg: apiEp?.ecg_alterado ?? base.proceduresDone?.alteredEcg,
            rnmStrokeProtocol: apiEp?.rnm_protocolo_stroke ?? base.proceduresDone?.rnmStrokeProtocol,
            bloodTransfusions: apiEp?.transfusiones ?? base.proceduresDone?.bloodTransfusions,
        },
        levels: {
            creatinin: apiEp?.creatinina ?? base.levels?.creatinin,
            hemoglobin: apiEp?.hemoglobina ?? base.levels?.hemoglobin,
            ureic_nitro: apiEp?.nitrogeno_ureico ?? base.levels?.ureic_nitro,
            pcr: apiEp?.pcr ?? base.levels?.pcr,
            potassium: apiEp?.potasio ?? base.levels?.potassium,
            sodium: apiEp?.sodio ?? base.levels?.sodium,
        },
        wasLawApplied: apiEp?.wasLawApplied ?? base.wasLawApplied,
        // Medical history fields
        cardiacHistory: apiEp?.antecedentes_cardiaco ?? apiEp?.cardiacHistory ?? base.cardiacHistory,
        diabetesHistory: apiEp?.antecedentes_diabetes ?? apiEp?.diabetesHistory ?? base.diabetesHistory,
        hypertensionHistory: apiEp?.antecedentes_hipertension ?? apiEp?.hypertensionHistory ?? base.hypertensionHistory,
        // Diagnostics - preserve if present in API response
        diagnostics: apiEp?.diagnostics ?? base.diagnostics,
    };
}
