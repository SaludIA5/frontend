import type { Patient } from "../../types/patient";

interface PatientListProps {
  patients: Patient[];
  onProcessPatient: (patientRut: string) => void;
}

export default function PatientList({ onProcessPatient, patients }: PatientListProps) {
  const formatRut = (rut: string) : string => {
    let formatted = rut.replace(/[^0-9kK]/g, '');
    if (formatted.length > 1) {
      let body = formatted.slice(0, -1)
      const dv = formatted.slice(-1)
      body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      formatted = body + "-" + dv
    }
    return formatted;
  }
  return (
    <ul className="space-y-2 max-w-5xl mx-auto overflow-x-auto">
      <li className="grid grid-cols-[1.5fr_0.8fr_0.5fr_0.8fr_0.7fr] gap-4 items-center text-black text-center p-4">
        <p className="text-left">Nombre</p>
        <p className="text-center">RUT</p>
        <p>Edad</p>
        <p>Ley de Urgencia</p>
        <p></p>
      </li>

      {patients.map((patient, i) => (
        <li
          key={i}
          className="grid grid-cols-[1.5fr_0.8fr_0.5fr_0.8fr_0.7fr] gap-4 items-center rounded-2xl border border-gray-200 p-4 shadow-sm bg-white transition-colors duration-150 hover:border-gray-400 hover:shadow"
        >
          <p className="text-lg text-left font-medium truncate">
            {patient.name|| ""}
          </p>

          <p className="text-lg text-center font-medium">{formatRut(patient.rut)}</p>

          <p className="text-lg font-medium text-center">
            {patient.age || "-"}
          </p>

          {(() => {
            const aiValidation = patient.openEpisode?.aiValidation;
            const statusConfig = aiValidation
              ? { text: "Aplica", className: "bg-green-200 text-green-700" }
              : { text: "No Aplica", className: "bg-red-100 text-red-700" };

            return (
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold text-center ${statusConfig.className}`}
              >
                {statusConfig.text}
              </span>
            );
          })()}

          <button
            className="rounded-xl text-white p-2 text-sm select-none shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            onClick={() => onProcessPatient(patient.rut)}
          >
            Procesar Paciente
          </button>
        </li>
      ))}
    </ul>
  );
}