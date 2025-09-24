import { useState } from "react";
import type { User } from "../types/user";

type NewPatientRegisterProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPatient: User) => void;
};

export default function NewPatientRegister({ isOpen, onClose, onSave }: NewPatientRegisterProps) {
  const [newPatient, setNewPatient] = useState<User>({
    firstName: "",
    lastName: "",
    isEligible: false,
    rut: "",
    sex: ""
  });

  const handleSave = () => {
    onSave(newPatient);
    setNewPatient({ firstName: "", lastName: "", isEligible: false, rut: "", sex:"" });
  };

  if (!isOpen) return null;

  const handleRutChange = (value: string) => {
    // Eliminar cualquier caracter que no sea número o K/k
    let clean = value.replace(/[^0-9kK]/g, '');
    // Agregar guion antes del último caracter
    if (clean.length > 1) {
      let body = clean.slice(0,-1)
      let dv = clean.slice(-1)
      body = body.replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
      clean = body + "-" + dv
    }
    
    setNewPatient({ ...newPatient, rut: clean });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg text-black">
        <h2 className="text-xl font-bold mb-4">Agregar paciente</h2>

        <input
          type="text"
          placeholder="Nombre"
          className="w-full mb-3 rounded border border-gray-300 p-2"
          value={newPatient.firstName}
          onChange={(e) =>
            setNewPatient({ ...newPatient, firstName: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Primer Apellido"
          className="w-full mb-3 rounded border border-gray-300 p-2"
          value={newPatient.lastName}
          onChange={(e) =>
            setNewPatient({ ...newPatient, lastName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Segundo Apellido"
          className="w-full mb-3 rounded border border-gray-300 p-2"
          value={newPatient.secondLastname}
          onChange={(e) =>
            setNewPatient({ ...newPatient, secondLastname: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="RUT (12.345.678-9)"
          className="w-full mb-3 rounded border border-gray-300 p-2"
          value={newPatient.rut}
          onChange={(e) => handleRutChange(e.target.value)}
          maxLength={12} // Máximo 9 dígitos + guion
        />

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

        <div className="flex justify-end space-x-3">
          <button
            className="rounded-xl bg-gray-300 px-4 py-2 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
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