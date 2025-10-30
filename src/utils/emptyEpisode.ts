import type { Episode } from "../types/episode";

export const emptyEpisode = (): Episode => {
  return {
    id: -1,
    patientId: -1, // -1 es patientId vacio (por ahora)
    aiValidation: false,
  }
}