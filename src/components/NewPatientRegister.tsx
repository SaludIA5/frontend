import { useState } from "react";
import type { User } from "../types/user";

type NewPatientRegisterProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newPatient : User) => void;
};

export default function NewPatientRegister({ isOpen, onClose, onSave }: NewPatientRegisterProps) {
    const [newPatient, setNewPatient] = useState<User>({
      firstName: "",
      lastName: "",
      isEligible: false
    })
  
    const handleSave = () => {
      onSave(newPatient)
      setNewPatient({ firstName: "", lastName: "", isEligible: false })
    }
  
    if (!isOpen) return null
  
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
            placeholder="Apellido"
            className="w-full mb-3 rounded border border-gray-300 p-2"
            value={newPatient.lastName}
            onChange={(e) =>
              setNewPatient({ ...newPatient, lastName: e.target.value })
            }
          />
  
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