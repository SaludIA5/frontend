import type { User } from '../../types/user';

interface PatientListProps {
  patients: User[];
  onProcessPatient: (patientRut: string) => void;
}

export default function PatientList({ patients, onProcessPatient }: PatientListProps) {

  return (
    <ul className="space-y-2 max-w-5xl mx-auto overflow-x-auto">
      <li className='grid grid-cols-[1.5fr_0.8fr_0.5fr_0.8fr_0.7fr] gap-4 items-center text-black text-center p-4'>
        <p className='text-left'>Nombre</p> <p className='text-center'>RUT</p> <p>Sexo</p> <p>Aplica Ley</p> <p>Procesar</p>
      </li>
      {patients.map((patient, i) => (
        <li
          key={i}
          className="grid grid-cols-[1.5fr_0.8fr_0.5fr_0.8fr_0.7fr] gap-4 items-center rounded-2xl border border-gray-200 p-4 shadow-sm"
        >
          <p className="text-lg text-left font-medium truncate">
            {patient.firstName} {patient.lastName} {patient.secondLastname || ""}
          </p>

          <p className="text-lg text-center font-medium">{patient.rut}</p>

          <p className="text-lg font-medium text-center">
            {patient.sex}
          </p>

          {(() => {
            const isEligible = patient.isEligible;
            const statusConfig = isEligible
              ? {
                text: "Aplica",
                className: "bg-green-200 text-green-700"
              }
              : {
                text: "No Aplica",
                className: "bg-red-100 text-red-700"
              };

            return (
              <span className={`rounded-full px-3 py-1 text-sm font-semibold text-center ${statusConfig.className}`}>
                {statusConfig.text}
              </span>
            );
          })()}
          <button
            className="rounded-xl bg-blue-600 px-2 py-2 text-white shadow hover:bg-blue-700"
            onClick={() => onProcessPatient(patient.rut)}>
            Procesar Paciente
          </button>
        </li>
      ))}
    </ul>
  )
}