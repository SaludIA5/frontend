import React, { useState } from 'react';
import type { PatientWithEpisodes } from "../../types/patient-episode";
import type { Episode } from '../../types/episode';
import type { Patient } from '../../types/patient';
import type { Doctor } from '../../types/doctor';
import { formatDateShort } from '../../utils/formatDate';

interface PatientListProps {
  patients: PatientWithEpisodes[];
  onProcessEpisode: (episode: Episode) => void;
  onEditPatient: (patient: Patient) => void;
  doctors: Doctor[];
  onOpenCreateEpisodeModal: (patientId: number) => void;
}

const PatientRow = ({ patient, onProcessEpisode, onEditPatient, onOpenCreateEpisodeModal }: { patient: PatientWithEpisodes, onProcessEpisode: (episode: Episode) => void, onEditPatient: (patient: Patient) => void, doctors: Doctor[], onOpenCreateEpisodeModal: (patientId: number) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatRut = (rut: string): string => {
    let formatted = rut.replace(/[^0-9kK]/g, '');
    if (formatted.length > 1) {
      let body = formatted.slice(0, -1);
      const dv = formatted.slice(-1);
      body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      formatted = body + "-" + dv;
    }
    return formatted;
  };

  return (
    <React.Fragment>
      <li
        key={`patient-${patient.id}`}
        className="grid grid-cols-[1.5fr_0.8fr_0.5fr_1fr] gap-4 items-center rounded-2xl border border-gray-200 p-4 shadow-sm bg-white transition-colors duration-150 hover:border-gray-400 hover:shadow"
      >
        <p className="text-lg text-left font-medium truncate">
          {patient.name || ""}
        </p>
        <p className="text-lg text-center font-medium">{formatRut(patient.rut)}</p>
        <p className="text-lg font-medium text-center">
          {patient.age || "-"}
        </p>
        <div className="flex space-x-2 justify-end">
          <button
            className="rounded-xl text-white p-2 text-sm select-none shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Ocultar" : "Episodios"}
          </button>
          <button
            className="rounded-xl text-white p-2 text-sm select-none shadow bg-gray-500 hover:bg-gray-600"
            onClick={() => onEditPatient(patient)}
          >
            Editar Paciente
          </button>
        </div>
      </li>
      <li className="ml-0 p-0 border-0">
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="ml-8 my-2">
            <button
              onClick={() => onOpenCreateEpisodeModal(patient.id)}
              className="w-full text-center rounded-lg border-2 border-dashed border-gray-300 p-3 bg-gray-50 text-sm font-semibold text-gray-600 transition-all duration-200 hover:border-solid hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]"
            >
              + Crear Nuevo Episodio
            </button>
          </div>
          <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.7fr] gap-4 items-center p-3 ml-8 text-xs font-semibold text-gray-500">
            <p className="text-left">ID Episodio</p>
            <p className="text-center">Fecha Ingreso</p>
            <p className="text-center">Ley Urgencia</p>
            <p></p>
          </div>
          {patient.episodes.map(episode => (
            <div
              key={`episode-${episode.id}`}
              className="grid grid-cols-[1.5fr_1fr_0.8fr_0.7fr] gap-4 items-center rounded-lg border border-gray-200 p-3 ml-8 bg-white"
            >
              <p className="text-sm text-left font-medium truncate">
                Episodio #{episode.id}
              </p>
              <p className="text-sm text-center">
                {episode.fecha_ingreso ? formatDateShort(new Date(episode.fecha_ingreso)) : "-"}
              </p>
              {(() => {
                const aiValidation = episode.aiValidation ?? ((episode as unknown as { validacion?: string }).validacion === 'PERTINENTE');
                const statusConfig = aiValidation
                  ? { text: 'Aplica', className: 'bg-green-200 text-green-700' }
                  : { text: 'No Aplica', className: 'bg-red-100 text-red-700' };

                return (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold text-center ${statusConfig.className}`}
                  >
                    {statusConfig.text}
                  </span>
                );
              })()}
              <button
                className="rounded-xl text-white p-2 text-sm select-none shadow bg-[var(--color-primary)] hover:bg-opacity-80"
                onClick={() => onProcessEpisode(episode)}
              >
                Procesar Episodio
              </button>
            </div>
          ))}
        </div>
      </li>
    </React.Fragment>
  );
};

export default function PatientList({ onProcessEpisode, onEditPatient, patients, doctors, onOpenCreateEpisodeModal }: PatientListProps) {
  return (
    <ul className="space-y-2 max-w-5xl mx-auto overflow-x-auto">
      <li className="grid grid-cols-[1.5fr_0.8fr_0.5fr_1fr] gap-4 items-center text-black text-center p-4">
        <p className="text-left">Nombre</p>
        <p className="text-center">RUT</p>
        <p>Edad</p>
        <p></p>
      </li>

      {patients.map((patient) => (
        <PatientRow key={patient.id} patient={patient} onProcessEpisode={onProcessEpisode} onEditPatient={onEditPatient} doctors={doctors} onOpenCreateEpisodeModal={onOpenCreateEpisodeModal} />
      ))}
    </ul>
  );
}