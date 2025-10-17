import { useState } from "react";
import type { Patient } from "../../types/user";
import { usePatients } from "../../hooks/usePatients";
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default function NewPatientRegister({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [newPatient, setNewPatient] = useState<Patient>({
    name: "",
    rut: "",
    sex: "",
    age: "",
    currentEpisode: {isEligible: false},
  });

  const { addPatient } = usePatients();

  const resetForm = () => {
    setNewPatient({
      name: "",
      currentEpisode: {isEligible: false},
      rut: "",
      sex: "",
      age: "",
    });
  };

  const handleSave = () => {
    addPatient({
      ...newPatient
    });
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    const age = Number(newPatient.age);

    try {
      await api.post('/patients/', {
        name: newPatient.name,
        age: age,
        rut: newPatient.rut,
      });
      handleSave();
    } catch (error) {
      console.error("Error adding patient:", error);
    } 
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg text-black">
        <h2 className="text-xl font-bold mb-4">Agregar paciente</h2>

        <input
          type="text"
          placeholder="Nombre"
          className="w-full mb-3 rounded border border-gray-300 p-2"
          value={newPatient.name}
          onChange={(e) =>
            setNewPatient({ ...newPatient, name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="RUT (12.345.678-9)"
          className="w-full mb-3 rounded border border-gray-300 p-2"
          value={newPatient.rut}
          onChange={(e) => handleRutChange(e.target.value)}
          maxLength={12}
        />

        <input
          type="text"
          placeholder="Edad del paciente"
          className="w-full mb-3 rounded border border-gray-300 p-2"
          value={newPatient.age}
          onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
          maxLength={3}
        />

        <div className="flex justify-center space-x-3">
          <button
            className="rounded-xl bg-gray-300 px-4 py-2 hover:bg-gray-400"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            className="rounded-xl px-4 py-2 text-white"
            onClick={handleSubmit}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}