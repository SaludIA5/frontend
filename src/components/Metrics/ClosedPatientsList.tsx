import { useState } from "react";
import type { Patient } from "../../types/user";
import ClosedPatientData from "./ClosedPatientData";

interface Props {
  patients: Patient[];
}

export default function ClosedPatientsList({ patients }: Props) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index) // cerrar si ya está abierto
        : [...prev, index] // abrir si estaba cerrado
    );
  };

  return (
    <ul className="mx-auto max-w-5xl space-y-3">
      {patients.map((patient, i) => {
        const isOpen = openIndexes.includes(i);
        if (!patient.episodes || patient.episodes.length == 0) return;
        return (
          <li
            key={i}
            className={`border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4`}
          >
            <div
              className="grid grid-cols-[5fr_5fr_1fr] gap-4 items-center cursor-pointer"
              onClick={() => toggleOpen(i)}
            >
              <p className="text-lg text-left font-medium truncate">{patient.name || ""}</p>
              <p className="text-lg text-center font-medium">{patient.rut}</p>
              <span
                className={`text-center ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </div>

            {/* Contenido expandido */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isOpen ? "max-h-96 opacity-100 mt-3 border-t border-gray-200 pt-3" : "max-h-0 opacity-0"
              }`}
            >
              <ClosedPatientData patient={patient} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
