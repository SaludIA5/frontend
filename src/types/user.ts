import type { ClosedEpisode, Episode } from "./episode";

export interface Patient {
    name: string
    rut: string
    sex: string
    age: string
    episodes?: ClosedEpisode[]
    currentEpisode: Episode
}

export const mockPatients: Patient[] = [
  {
    name: "Andrés Arriagada",
    rut: "15.646.548-4",
    sex: "Masculino",
    age: "45",
    currentEpisode: {
      isEligible: true,
      isActive: true,
      dateOfEntry: new Date("2025-10-10"),
      patientState: {
        temperature: 37.8,
        oxygenSaturation: 95,
        fio2: 21,
        respirationRate: 18,
        heartRate: 85,
        compromisedConsiousness: false,
      },
      bloodPressure: {
        sistolicBloodPressure: 125,
        diastolicBloodPressure: 80,
        mediumBloodPressure: 95,
      },
      cardiacHistory: true,
      diabetesHistory: false,
      hypertensionHistory: true,
      proceduresDone: {
        surgery: false,
        surgerySameDay: false,
        hemoDinamia: false,
        hemoDinamiaSameDay: false,
        endoscopy: false,
        endoscopySameDay: false,
        dialysis: false,
        trombolysis: false,
        trombolysisSameDay: false,
        rnmStrokeProtocol: false,
        bloodTransfusions: false,
        ecg: true,
        alteredEcg: false,
        troponine: true,
        alteredTroponine: false,
      },
      hospitalizationConditions: {
        mechanicalVentilation: false,
        bedType: "Básica",
        glasgowScore: 15,
      },
      levels: {
        hemoglobin: 13.4,
        creatinin: 0.9,
        ureic_nitro: 28,
        sodium: 140,
        potassium: 4.3,
        pcr: 5.1,
      },
    },
    episodes: [
      {
        isEligible: false,
        wasLawApplied: false,
        isActive: false,
        dateOfEntry: new Date("2025-04-12"),
        dateOfExit: new Date("2025-04-14"),
        patientState: {
          temperature: 38.5,
          oxygenSaturation: 90,
          fio2: 30,
          respirationRate: 22,
          heartRate: 110,
          compromisedConsiousness: false,
        },
        hospitalizationConditions: {
          mechanicalVentilation: false,
          bedType: "UCI",
          glasgowScore: 15,
        },
      },
      {
        isEligible: true,
        wasLawApplied: true,
        isActive: false,
        dateOfEntry: new Date("2024-09-21"),
        dateOfExit: new Date("2024-09-24"),
        patientState: {
          temperature: 39.2,
          oxygenSaturation: 88,
          fio2: 40,
          respirationRate: 25,
          heartRate: 120,
          compromisedConsiousness: true,
        },
        hospitalizationConditions: {
          mechanicalVentilation: true,
          bedType: "UTI",
          glasgowScore: 11,
        },
      },
    ],
  },
  {
    name: "Barbara Hanna",
    rut: "18.945.673-2",
    sex: "Femenino",
    age: "52",
    currentEpisode: {
      isEligible: false,
      isActive: true,
      dateOfEntry: new Date("2025-09-25"),
      patientState: {
        temperature: 36.7,
        oxygenSaturation: 97,
        fio2: 21,
        respirationRate: 16,
        heartRate: 78,
        compromisedConsiousness: false,
      },
      bloodPressure: {
        sistolicBloodPressure: 120,
        diastolicBloodPressure: 75,
        mediumBloodPressure: 90,
      },
      hypertensionHistory: true,
      cardiacHistory: false,
      diabetesHistory: false,
      proceduresDone: {
        surgery: true,
        surgerySameDay: true,
        hemoDinamia: false,
        hemoDinamiaSameDay: false,
        endoscopy: false,
        endoscopySameDay: false,
        dialysis: false,
        trombolysis: false,
        trombolysisSameDay: false,
        rnmStrokeProtocol: false,
        bloodTransfusions: false,
        ecg: true,
        alteredEcg: false,
        troponine: false,
        alteredTroponine: false,
      },
      hospitalizationConditions: {
        mechanicalVentilation: false,
        bedType: "Básica",
        glasgowScore: 15,
      },
      levels: {
        hemoglobin: 12.8,
        creatinin: 1.0,
        ureic_nitro: 20,
        sodium: 139,
        potassium: 4.0,
        pcr: 3.2,
      },
    },
    episodes: [
      {
        isEligible: false,
        wasLawApplied: true,
        isActive: false,
        dateOfEntry: new Date("2025-01-10"),
        dateOfExit: new Date("2025-01-15"),
        hospitalizationConditions: {
          mechanicalVentilation: false,
          bedType: "Básica",
          glasgowScore: 15,
        },
      },
    ],
  },
  {
    name: "Cristian Bale",
    rut: "9.876.543-2",
    sex: "Masculino",
    age: "60",
    currentEpisode: {
      isEligible: false,
      isActive: true,
      dateOfEntry: new Date("2025-10-08"),
      hospitalizationConditions: {
        mechanicalVentilation: true,
        bedType: "UCI",
        glasgowScore: 13,
      },
      patientState: {
        temperature: 38.0,
        oxygenSaturation: 91,
        fio2: 50,
        respirationRate: 24,
        heartRate: 105,
        compromisedConsiousness: true,
      },
    },
    episodes: [
      {
        isEligible: true,
        wasLawApplied: false,
        isActive: false,
        dateOfEntry: new Date("2024-11-05"),
        dateOfExit: new Date("2024-11-20"),
        hospitalizationConditions: {
          mechanicalVentilation: true,
          bedType: "UTI",
          glasgowScore: 9,
        },
      },
      {
        isEligible: false,
        wasLawApplied: false,
        isActive: false,
        dateOfEntry: new Date("2023-06-10"),
        dateOfExit: new Date("2023-06-14"),
        hospitalizationConditions: {
          mechanicalVentilation: false,
          bedType: "Urgencia",
          glasgowScore: 15,
        },
      },
    ],
  },
];
