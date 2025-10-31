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
    name: "Marcela Torres",
    email: "marcela.torres@hospitaluc.cl",
    isDoctor: true,
    isChiefDoctor: false,
    episodes: [
      // Andrés Arriagada
      {
        id: 101,
        patientId: 105,
        aiValidation: true,
        chiefValidation: true,
        doctorValidation: true,
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
        id: 102,
        patientId: 105,
        aiValidation: false,
        chiefValidation: false,
        doctorValidation: false,
        medicalCenter: "Hospital del Salvador",
        isActive: false,
        dateOfEntry: new Date("2025-04-12"),
        dateOfExit: new Date("2025-04-14"),
      },
      // Bárbara Hanna
      {
        id: 201,
        patientId: 106,
        aiValidation: false,
        chiefValidation: false,
        doctorValidation: true,
        medicalCenter: "Hospital Félix Bulnes",
        isActive: true,
        dateOfEntry: new Date("2025-09-25"),
      },
    ],
  },
  {
    id: 2,
    name: "Jorge Ibáñez",
    email: "jorge.ibanez@hospitalsjd.cl",
    isDoctor: true,
    isChiefDoctor: false,
    episodes: [
      // Cristian Bale
      {
        id: 301,
        patientId: 107,
        aiValidation: false,
        chiefValidation: false,
        doctorValidation: false,
        medicalCenter: "Hospital San Juan de Dios",
        isActive: true,
        dateOfEntry: new Date("2025-10-08"),
      },
      {
        id: 302,
        patientId: 107,
        aiValidation: true,
        chiefValidation: true,
        doctorValidation: true,
        medicalCenter: "Hospital Militar",
        isActive: false,
        dateOfEntry: new Date("2024-11-05"),
        dateOfExit: new Date("2024-11-20"),
      },
      // Felipe Navarro
      {
        id: 501,
        patientId: 109,
        aiValidation: false,
        chiefValidation: false,
        doctorValidation: true,
        medicalCenter: "Hospital Luis Tisné",
        isActive: true,
        dateOfEntry: new Date("2025-09-29"),
      },
    ],
  },
  {
    id: 3,
    name: "Sebastián Paredes",
    email: "sebastian.paredes@minsal.cl",
    isDoctor: true,
    isChiefDoctor: true,
    episodes: [
      // Casos validados por jefe
      {
        id: 103,
        patientId: 105,
        aiValidation: true,
        chiefValidation: true,
        doctorValidation: true,
        medicalCenter: "Hospital Sótero del Río",
        isActive: false,
        dateOfEntry: new Date("2024-09-21"),
        dateOfExit: new Date("2024-09-24"),
      },
      {
        id: 202,
        patientId: 106,
        aiValidation: true,
        chiefValidation: true,
        doctorValidation: true,
        medicalCenter: "Clínica Alemana",
        isActive: false,
        dateOfEntry: new Date("2025-01-10"),
        dateOfExit: new Date("2025-01-15"),
      },
      {
        id: 303,
        patientId: 107,
        aiValidation: false,
        chiefValidation: false,
        doctorValidation: false,
        medicalCenter: "Hospital La Florida",
        isActive: false,
        dateOfEntry: new Date("2023-06-10"),
        dateOfExit: new Date("2023-06-14"),
      },
      {
        id: 401,
        patientId: 108,
        aiValidation: true,
        chiefValidation: true,
        doctorValidation: false,
        medicalCenter: "Clínica Santa María",
        isActive: true,
        dateOfEntry: new Date("2025-10-11"),
      },
      {
        id: 402,
        patientId: 108,
        aiValidation: false,
        chiefValidation: true,
        doctorValidation: false,
        medicalCenter: "Hospital Metropolitano",
        isActive: false,
        dateOfEntry: new Date("2024-03-20"),
        dateOfExit: new Date("2024-03-27"),
      },
      {
        id: 502,
        patientId: 109,
        aiValidation: true,
        chiefValidation: true,
        doctorValidation: false,
        medicalCenter: "Clínica Dávila",
        isActive: false,
        dateOfEntry: new Date("2023-12-02"),
        dateOfExit: new Date("2023-12-09"),
      },
    ],
  },
];