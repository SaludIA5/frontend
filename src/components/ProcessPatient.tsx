import { useState, useEffect } from "react";
import type { User } from "../types/user";
import { usePatients } from "../hooks/usePatients";

interface ProcessPatientProps {
  isOpen: boolean;
  onClose: () => void;
  patientRut?: string;
}

export default function ProcessPatient({ isOpen, onClose, patientRut }: ProcessPatientProps) {
  const [newPatient, setNewPatient] = useState<User>({
    firstName: "",
    lastName: "",
    isEligible: false,
    rut: "",
    sex: "",
    oxygenSaturation: "",
    heartRate: "",
    bloodPressure: "",
    examPerformed: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const { patients, updatePatient } = usePatients();

  useEffect(() => {
    if (patientRut) {
      const foundPatient = patients.find((p) => p.rut === patientRut);
      if (foundPatient) {
        setNewPatient(foundPatient);
      }
    }
  }, [patientRut, patients]);

  const handleSave = () => {
    if (newPatient && patientRut) {
      const patientToSave = {
        ...newPatient,
        oxygenSaturation: newPatient.oxygenSaturation ? Number(newPatient.oxygenSaturation) : undefined,
        heartRate: newPatient.heartRate ? Number(newPatient.heartRate) : undefined,
        bloodPressure: newPatient.bloodPressure || undefined,
        examPerformed: newPatient.examPerformed || undefined,
        secondLastname: newPatient.secondLastname || undefined,
      };
      updatePatient(patientRut, patientToSave);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };



  const handleRutChange = (value: string) => {
    let clean = value.replace(/[^0-9kK]/g, '');
    if (clean.length > 1) {
      let body = clean.slice(0, -1)
      const dv = clean.slice(-1)
      body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      clean = body + "-" + dv
    }

    setNewPatient({ ...newPatient, rut: clean });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg text-black w-96 max-h-screen flex flex-col">
        <h2 className="text-xl font-bold p-6">Datos del paciente</h2>
        <div className="flex-1 overflow-y-auto p-3">
          <fieldset disabled={!isEditing} className={!isEditing ? "text-gray-600" : ""}>
            Nombre:
            <input
              type="text"
              placeholder="Nombre"
              className="w-full mb-3 rounded border border-gray-300 p-2"
              value={newPatient.firstName}
              onChange={(e) =>
                setNewPatient({ ...newPatient, firstName: e.target.value })
              }
            />
            Primer Apellido:
            <input
              type="text"
              placeholder="Primer Apellido"
              className="w-full mb-3 rounded border border-gray-300 p-2"
              value={newPatient.lastName}
              onChange={(e) =>
                setNewPatient({ ...newPatient, lastName: e.target.value })
              }
            />
            Segundo Apellido:
            <input
              type="text"
              placeholder="Segundo Apellido"
              className="w-full mb-3 rounded border border-gray-300 p-2"
              value={newPatient.secondLastname || ""}
              onChange={(e) =>
                setNewPatient({ ...newPatient, secondLastname: e.target.value })
              }
            />
            RUT:
            <input
              type="text"
              placeholder="RUT (12.345.678-9)"
              className="w-full mb-3 rounded border border-gray-300 p-2"
              value={newPatient.rut}
              onChange={(e) => handleRutChange(e.target.value)}
              maxLength={12}
            />
            Sexo:
            <select
              value={newPatient.sex}
              onChange={(e) => setNewPatient({ ...newPatient, sex: e.target.value })}
              className="w-full mb-3 rounded border border-gray-300 p-2"
            >
              <option value="" disabled>Sexo del paciente</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">No Declarado</option>
            </select>
            Exámenes Realizados:
            <select
              value={newPatient.examPerformed || ""}
              onChange={(e) => setNewPatient({ ...newPatient, examPerformed: e.target.value })}
              className="w-full mb-3 rounded border border-gray-300 p-2"
            >
              <option value="" disabled>Exámenes Realizados</option>
              <option value="Blood Tests">Exámenes de Sangre</option>
              <option value="None">Ninguno</option>
            </select>

            <h3 className="text-lg font-semibold mb-2">Signos Vitales</h3>
            <p>Saturación de Oxígeno:</p>
            <input
              type="number"
              placeholder="Saturación de Oxígeno (%)"
              className="w-full mb-3 rounded border border-gray-300 p-2"
              value={newPatient.oxygenSaturation || ""}
              onChange={(e) =>
                setNewPatient({ ...newPatient, oxygenSaturation: e.target.value })
              }
            />

            <p>Frecuencia Cardíaca:</p>
            <input
              type="number"
              placeholder="Frecuencia Cardíaca (lpm)"
              className="w-full mb-3 rounded border border-gray-300 p-2"
              value={newPatient.heartRate || ""}
              onChange={(e) =>
                setNewPatient({ ...newPatient, heartRate: e.target.value })
              }
            />

            <p>Presión Arterial:</p>
            <input
              type="text"
              placeholder="Presión Arterial (mmHg)"
              className="w-full mb-3 rounded border border-gray-300 p-2"
              value={newPatient.bloodPressure || ""}
              onChange={(e) =>
                setNewPatient({ ...newPatient, bloodPressure: e.target.value })
              }
            />
          </fieldset>
        </div>

        <div className="flex justify-end space-x-3 p-3">
          <button
            className="rounded-xl bg-gray-300 px-4 py-2 hover:bg-gray-400"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "No Editar" : "Editar"}
          </button>
          <button
            className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}