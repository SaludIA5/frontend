import type { User } from '../types/user'

export default function PatientList({ patients }: { patients: User[] }) {
  return (
    <ul className="space-y-3 max-w-full mx-auto flex flex-col items-center justify-center">
      {patients.map((patient, i) => (
        <li key={i} className="flex w-4/5 align-middle  items-center justify-around rounded-2xl border border-gray-50 my-4 p-4 shadow-sm">
          <div>
            <p className="text-lg font-medium ">
              {patient.firstName} {patient.lastName}
            </p>
          </div>

          {patient.isEligible ? (
            <span className="rounded-full px-3 py-1 text-sm font-semibold bg-green-100 text-green-700">
                Aplica Ley Urgencia
            </span>
            ) : (
            <span className="rounded-full px-3 py-1 text-sm font-semibold bg-red-100 text-red-700">
                No Aplica Ley Urgencia
            </span>
          )}
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">Procesar Paciente</button>
        </li>
      ))}
    </ul>
  )
}