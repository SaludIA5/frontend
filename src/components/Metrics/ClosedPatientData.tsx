import type { Patient } from "../../types/user"

interface Props {
    patient: Patient
}

export default function ClosedPatientData({ patient }: Props){
    return (
        <>
            <div>
                {
                    patient.episodes && patient.episodes.length > 0
                        ? (
                            <ul>
                                {patient.episodes.map((episode, idx) => (
                                    <li key={idx}>{JSON.stringify(episode)}</li>
                                ))}
                            </ul>
                        )
                        : "No hay episodios"
                }
            </div>
        </>
    )
}