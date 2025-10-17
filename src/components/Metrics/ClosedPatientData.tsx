import type { Patient } from "../../types/user"
import { formatDate } from "../../utils/formatDate"

interface Props {
    patient: Patient
}

export default function ClosedPatientData({ patient }: Props){
    return (
        <>
            <div>
            {patient.episodes && patient.episodes.length > 0? (
                <div className="flex flex-col gap-2"> 
                    {patient.episodes.map((episode, i) => (
                        <div key={i} className="flex flex-col bg-gray-100 p-2 gap-2">
                            <p>
                            Estadia:{" "}{episode.dateOfEntry ? formatDate(episode.dateOfEntry) : ""}
                            {" - "}
                            {episode.dateOfExit ? formatDate(episode.dateOfExit) : ""}
                            </p>
                            <p>Última recomendación IA: 
                            {(() => {
                                const statusConfig = episode.isEligible
                                ? { text: "Aplica", className: "bg-green-200 text-green-700" }
                                : { text: "No Aplica", className: "bg-red-100 text-red-700" };
                                return (
                                <span
                                    className={`rounded-full mx-1 px-2 py-1 text-sm font-semibold text-center ${statusConfig.className}`}
                                >
                                    {statusConfig.text} Ley de Urgencia
                                </span>
                                );
                            })()}
                            </p>
                            <p>Decisión final médico: 
                            {(() => {
                                const statusConfig = episode.wasLawApplied
                                ? { text: "Acepta", className: "bg-green-200 text-green-700" }
                                : { text: "No Acepta", className: "bg-red-100 text-red-700" };
                                return (
                                <span
                                    className={`rounded-full mx-1 px-2 py-1 text-sm font-semibold text-center ${statusConfig.className}`}
                                >
                                    {statusConfig.text} Ley de Urgencia
                                </span>
                                );
                            })()}
                            </p>
                        </div>
                    ))}
                </div>
            ): "No hay episodios"}
            </div>
        </>
    )
}