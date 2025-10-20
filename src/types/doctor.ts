import type { Episode } from "./episode"

export interface Doctor {
    name: string
    id: number;
    email: string;
    isDoctor: boolean;
    isChiefDoctor: boolean;
    episodes?: Episode[] //Una llamada a back entrega episodios
}

export const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dra. Marcela Torres",
    email: "marcela.torres@hospitaluc.cl",
    isDoctor: true,
    isChiefDoctor: false,
    episodes: [
      // Andrés Arriagada
      {
        episodeId: 101,
        patientId: 1,
        isEligible: true,
        isValidatedByChief: true,
        medicalCenter: "Hospital Clínico UC",
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
        hypertensionHistory: true,
        diabetesHistory: false,
      },
      {
        episodeId: 102,
        patientId: 1,
        isEligible: false,
        isValidatedByChief: false,
        medicalCenter: "Hospital del Salvador",
        isActive: false,
        dateOfEntry: new Date("2025-04-12"),
        dateOfExit: new Date("2025-04-14"),
      },
      // Bárbara Hanna
      {
        episodeId: 201,
        patientId: 2,
        isEligible: false,
        isValidatedByChief: false,
        medicalCenter: "Hospital Félix Bulnes",
        isActive: true,
        dateOfEntry: new Date("2025-09-25"),
      },
    ],
  },
  {
    id: 2,
    name: "Dr. Jorge Ibáñez",
    email: "jorge.ibanez@hospitalsjd.cl",
    isDoctor: true,
    isChiefDoctor: false,
    episodes: [
      // Cristian Bale
      {
        episodeId: 301,
        patientId: 3,
        isEligible: false,
        isValidatedByChief: false,
        medicalCenter: "Hospital San Juan de Dios",
        isActive: true,
        dateOfEntry: new Date("2025-10-08"),
      },
      {
        episodeId: 302,
        patientId: 3,
        isEligible: true,
        isValidatedByChief: true,
        medicalCenter: "Hospital Militar",
        isActive: false,
        dateOfEntry: new Date("2024-11-05"),
        dateOfExit: new Date("2024-11-20"),
      },
      // Felipe Navarro
      {
        episodeId: 501,
        patientId: 5,
        isEligible: false,
        isValidatedByChief: false,
        medicalCenter: "Hospital Luis Tisné",
        isActive: true,
        dateOfEntry: new Date("2025-09-29"),
      },
    ],
  },
  {
    id: 3,
    name: "Dr. Sebastián Paredes",
    email: "sebastian.paredes@minsal.cl",
    isDoctor: true,
    isChiefDoctor: true,
    episodes: [
      // Casos validados por jefe
      {
        episodeId: 103,
        patientId: 1,
        isEligible: true,
        isValidatedByChief: true,
        medicalCenter: "Hospital Sótero del Río",
        isActive: false,
        dateOfEntry: new Date("2024-09-21"),
        dateOfExit: new Date("2024-09-24"),
      },
      {
        episodeId: 202,
        patientId: 2,
        isEligible: true,
        isValidatedByChief: true,
        medicalCenter: "Clínica Alemana",
        isActive: false,
        dateOfEntry: new Date("2025-01-10"),
        dateOfExit: new Date("2025-01-15"),
      },
      {
        episodeId: 303,
        patientId: 3,
        isEligible: false,
        isValidatedByChief: false,
        medicalCenter: "Hospital La Florida",
        isActive: false,
        dateOfEntry: new Date("2023-06-10"),
        dateOfExit: new Date("2023-06-14"),
      },
      {
        episodeId: 401,
        patientId: 4,
        isEligible: true,
        isValidatedByChief: true,
        medicalCenter: "Clínica Santa María",
        isActive: true,
        dateOfEntry: new Date("2025-10-11"),
      },
      {
        episodeId: 402,
        patientId: 4,
        isEligible: false,
        isValidatedByChief: true,
        medicalCenter: "Hospital Metropolitano",
        isActive: false,
        dateOfEntry: new Date("2024-03-20"),
        dateOfExit: new Date("2024-03-27"),
      },
      {
        episodeId: 502,
        patientId: 5,
        isEligible: true,
        isValidatedByChief: true,
        medicalCenter: "Clínica Dávila",
        isActive: false,
        dateOfEntry: new Date("2023-12-02"),
        dateOfExit: new Date("2023-12-09"),
      },
    ],
  },
];