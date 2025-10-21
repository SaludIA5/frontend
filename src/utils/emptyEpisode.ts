import type { Episode} from "../types/episode"
export const emptyEpisode = (): Episode => {
    return {
      episodeId: -1,
      patientId: -1, // -1 es patientId vacio (por ahora)
      chiefValidation: false,
      aiValidation: false,
    }
}