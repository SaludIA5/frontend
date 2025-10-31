import type { Episode } from "./episode";
import type { Patient } from "./patient";

export interface EpisodeWithPatientData extends Episode {
    patient_id: number;
    patient_name: string;
    patient_rut: string;
    patient_age: number;
}

export interface PatientWithEpisodes extends Patient {
    episodes: Episode[];
}
