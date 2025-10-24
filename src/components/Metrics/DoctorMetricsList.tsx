import { useNavigate } from "react-router-dom";
import type { Doctor } from "../../types/doctor";

interface Props {
  doctors: Doctor[];
}

export default function DoctorMetricsList({ doctors }: Props) {
  const navigate = useNavigate();
  return (
    <ul className="mx-auto max-w-5xl space-y-3">
      <li>
        <div className="grid grid-cols-[3fr_3fr_3fr_2fr] gap-4 items-center text-center px-4">
          <p className="text-left">Nombre</p>
          <p>Casos Aprobados <br /> para Ley de Urgencia</p>
          <p>Casos Rechazados <br /> para Ley de Urgencia</p>
        </div>
      </li>
      {doctors.map((doctor, i) => {
        if (!doctor.episodes || doctor.episodes.length === 0) return null;

        // Filtrar episodios cerrados (no activos)
        const closedEpisodes = doctor.episodes.filter(
          (ep) => "doctorValidation" in ep
        );

        // Contar aprobados y rechazados
        const approvedCount = closedEpisodes.filter(
          (ep) => ep.doctorValidation === true
        ).length;
        const rejectedCount = closedEpisodes.filter(
          (ep) => ep.doctorValidation === false
        ).length;

        return (
          <li
            key={i}
            className="border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4"
          >
            <div className="grid grid-cols-[3fr_3fr_3fr_2fr] gap-4 items-center">
              <h1 className="text-lg text-left font-medium truncate">
                {doctor.name}
              </h1>

              <p className="text-center text-green-600 font-semibold">
                {approvedCount}
              </p>

              <p className="text-center text-red-600 font-semibold">
                {rejectedCount}
              </p>

              <button
                className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
                onClick={() => navigate(`./${doctor.id}`)}
              >
                Ver detalle
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}