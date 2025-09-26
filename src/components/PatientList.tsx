import type { User } from '../types/user'

export default function PatientList({ patients }: { patients: User[] }){
    return(
        <ul className="space-y-2 max-w-5xl mx-auto overflow-scroll">
        {patients.map((patient, i) => (
          <li
            key={i}
            className="grid grid-cols-[2fr_1.5fr_1fr_2fr_auto] gap-4 items-center rounded-2xl border border-gray-200 p-4 shadow-sm"
          >
            <p className="text-lg font-medium truncate">
              {patient.firstName} {patient.lastName} {patient.secondLastname || ""}
            </p>
  
            <p className="text-lg font-medium">{patient.rut}</p>
  
            <p className="text-lg font-medium">
              {patient.sex !== "O" ? patient.sex : ""}
            </p>
  
            {patient.isEligible ? (
              <span className="rounded-full px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 text-center">
                Aplica Ley Urgencia
              </span>
            ) : (
              <span className="rounded-full px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 text-center">
                No Aplica Ley Urgencia
              </span>
            )}
  
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">
              Procesar
            </button>
          </li>
        ))}
      </ul>
    )
}