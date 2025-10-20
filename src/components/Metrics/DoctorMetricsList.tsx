import type { Doctor } from "../../types/doctor";

interface Props {
  doctors: Doctor[];
}

export default function DoctorMetricsList({ doctors }: Props) {
  return (
    <ul className="mx-auto max-w-5xl space-y-3">
      {doctors.map((doctor, i) => {
        if (!doctor.episodes || doctor.episodes.length === 0) return null;

        // Filtrar episodios cerrados (no activos)
        const closedEpisodes = doctor.episodes.filter(
          (ep) => ep.isActive === false
        );

        // Contar aprobados y rechazados
        const approvedCount = closedEpisodes.filter(
          (ep) => ep.isValidatedByChief === true
        ).length;
        const rejectedCount = closedEpisodes.filter(
          (ep) => ep.isValidatedByChief === false
        ).length;

        return (
          <li
            key={i}
            className="border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4"
          >
            <div className="grid grid-cols-[3fr_3fr_3fr_2fr] gap-4 items-center">
              {/* Nombre del doctor */}
              <p className="text-lg text-left font-medium truncate">
                {doctor.name}
              </p>

              {/* Aprobados */}
              <p className="text-center text-green-600 font-semibold">
                Aprobados: {approvedCount}
              </p>

              {/* Rechazados */}
              <p className="text-center text-red-600 font-semibold">
                Rechazados: {rejectedCount}
              </p>

              {/* Botón de detalle */}
              <button
                className="rounded-lg px-4 py-2 bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                onClick={() => console.log(`Ver detalle de ${doctor.name}`)}
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