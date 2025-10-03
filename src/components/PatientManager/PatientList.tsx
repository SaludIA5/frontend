import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  rut: string;
  name: string;
  age: number;
  isElegible: boolean;
}

interface PatientListProps {
  onProcessPatient: (patientRut: string) => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default function PatientList({ onProcessPatient }: PatientListProps) {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/patients');
        setPatients(res.data.items);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <p>Cargando pacientes...</p>;
  }

  return (
    <ul className="space-y-2 max-w-5xl mx-auto overflow-x-auto">
      <li className='grid grid-cols-[1.5fr_0.8fr_0.5fr_0.8fr_0.7fr] gap-4 items-center text-black text-center p-4'>
        <p className='text-left'>Nombre</p> <p className='text-center'>RUT</p> <p>Edad</p> <p>Ley de Urgencia</p> <p></p>
      </li>
      {patients.map((patient, i) => (
        <li
          key={i}
          className="grid grid-cols-[1.5fr_0.8fr_0.5fr_0.8fr_0.7fr] gap-4 items-center rounded-2xl border border-gray-200 p-4 shadow-sm bg-white transition-colors duration-150 hover:border-gray-400 hover:shadow"
        >
          <p className="text-lg text-left font-medium truncate">
            { patient.name || "" }
          </p>

          <p className="text-lg text-center font-medium">{patient.rut}</p>

          <p className="text-lg font-medium text-center">
            {patient.age || "-"}
          </p>

          {(() => {
            const isEligible = patient.isElegible;
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
            className="rounded-xl bg-blue-600 px-2 py-2 text-white select-none shadow hover:bg-blue-700"
            onClick={() => onProcessPatient(patient.rut)}>
            Procesar Paciente
          </button>
        </li>
      ))}
    </ul>
  )
}