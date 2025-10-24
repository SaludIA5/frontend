import type { Episode } from "./episode";

export interface Patient {
    id: number
    name: string
    rut: string
    sex: string
    age: number,
    openEpisode?: Episode
}

export const mockPatients: Patient[] = [
  {
    id: 1,
    name: "Andrés Arriagada",
    rut: "15.646.548-4",
    sex: "Masculino",
    age: 45,
    openEpisode: {
      episodeId: 101,
      patientId: 1,
      aiValidation: true,
      chiefValidation: true,
      isActive: true,
      dateOfEntry: new Date("2025-10-10"),
    },
  },
  {
    id: 2,
    name: "Barbara Hanna",
    rut: "18.945.673-2",
    sex: "Femenino",
    age: 52,
    openEpisode: {
      episodeId: 201,
      patientId: 2,
      aiValidation: false,
      chiefValidation: false,
      isActive: true,
      dateOfEntry: new Date("2025-09-25"),
    },
  },
  {
    id: 3,
    name: "Cristian Bale",
    rut: "9.876.543-2",
    sex: "Masculino",
    age: 60,
    openEpisode: {
      episodeId: 301,
      patientId: 3,
      aiValidation: false,
      chiefValidation: false,
      isActive: true,
      dateOfEntry: new Date("2025-10-08"),
    },
  },
  {
    id: 4,
    name: "Daniela Rojas",
    rut: "12.345.678-9",
    sex: "Femenino",
    age: 34,
    openEpisode: {
      episodeId: 401,
      patientId: 4,
      aiValidation: true,
      chiefValidation: true,
      isActive: true,
      dateOfEntry: new Date("2025-10-11"),
    },
  },
  {
    id: 5,
    name: "Felipe Navarro",
    rut: "18.765.432-1",
    sex: "Masculino",
    age: 29,
    openEpisode: {
      episodeId: 501,
      patientId: 5,
      aiValidation: false,
      chiefValidation: false,
      isActive: true,
      dateOfEntry: new Date("2025-09-29"),
    },
  },
];
