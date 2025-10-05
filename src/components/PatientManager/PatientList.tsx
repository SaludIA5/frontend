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
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!import.meta.env.VITE_BACKEND_URL) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/patients');
        const patientsData = res.data?.items || res.data || [];
        setPatients(Array.isArray(patientsData) ? patientsData : []);
        setError(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <p>Cargando pacientes...</p>;
  }

  const patientsList = patients || [];

  if (patientsList.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {error ? "No se pudo cargar la lista de pacientes." : "No hay pacientes disponibles."}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2 max-w-5xl mx-auto overflow-x-auto">
      <li className='grid grid-cols-[1.5fr_0.8fr_0.5fr_0.8fr_0.7fr] gap-4 items-center text-black text-center p-4'>
        <p className='text-left'>Nombre</p> <p className='text-center'>RUT</p> <p>Edad</p> <p>Ley de Urgencia</p> <p></p>
      </li>
      {patientsList.map((patient, i) => (
        <li
          key={i}
          className="grid grid-cols-[1.5fr_0.8fr_0.5fr_0.8fr_0.7fr] gap-4 items-center rounded-2xl border border-gray-200 p-4 shadow-sm bg-white transition-colors duration-150 hover:border-gray-400 hover:shadow"
        >
          <p className="text-lg text-left font-medium truncate">
            {patient.name || ""}
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