import { useState, useEffect } from "react";
import type { Patient } from "../../types/patient";
import { usePatients } from "../../hooks/usePatients";
import axios from 'axios';
import { emptyEpisode } from "../../utils/emptyEpisode";
import { validateRUT } from "../../utils/rutValidation";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default function NewPatientRegister({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [newPatient, setNewPatient] = useState<Patient>({
    id: -1,
    name: "",
    rut: "",
    sex: "",
    age: 0,
    openEpisode: emptyEpisode(),
  });

  const [doctorsByTurn, setDoctorsByTurn] = useState<Record<string, { id: number; name: string }[]>>({});
  const [selectedDoctors, setSelectedDoctors] = useState({
    turnoA: "",
    turnoB: "",
    turnoC: "",
  });

  const isRutValid = validateRUT(newPatient.rut) || !newPatient.rut;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/users/by-turn');
        setDoctorsByTurn(res.data);
      } catch (error) {
        console.error("Error al obtener doctores:", error);
      }
    };

    fetchDoctors();
  }, []);


  const { addPatientWithEpisodes } = usePatients();

  const resetForm = () => {
    setNewPatient({
      id: -1,
      name: "",
      rut: "",
      sex: "",
      age: 0,
      openEpisode: emptyEpisode(),
    });
    setSelectedDoctors({ turnoA: "", turnoB: "", turnoC: "" });
  };


  const handleSubmit = async () => {
    const age = Number(newPatient.age);

    if (!isRutValid){
      alert("Por favor ingresar RUT valido");
      return;
    }

    if (!newPatient.rut){
      alert("Por favor ingresar un RUT de paciente");
      return;
    }

    const doctorsPayload = Object.entries(selectedDoctors)
      .filter(([, doctorId]) => doctorId !== "")
      .reduce((acc, [turn, doctorId]) => {
        acc[turn.toLowerCase()] = Number(doctorId);
        return acc;
      }, {} as { [key: string]: number });

    try {
      const res = await api.post('/patients/with-episode', {
        name: newPatient.name,
        age: age,
        rut: newPatient.rut,
        doctors: doctorsPayload,
      });

      addPatientWithEpisodes(res.data);

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error adding patient with episode:", error);
    } finally{
      window.location.reload();
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

        <div className="flex flex-col gap-0">
          <input
            type="text"
            placeholder="RUT (12.345.678-9)"
            className={`w-full mb-3 rounded border p-2 focus:outline-none ${isRutValid ? "border-gray-300 focus:border-black" : "border-red-500 focus:border-red-500"}`}
            value={newPatient.rut}
            onChange={(e) => handleRutChange(e.target.value)}
            maxLength={12}
          />

          {!isRutValid && (<p className="text-sm text-red-500">{"El rut es inválido"}</p>)}
        </div>
        <p className="text-lg mt-2">Edad del paciente</p>
        <input
          type="text"
          placeholder="Edad del paciente"
          className="w-full mb-3 rounded border border-gray-300 p-2"
          value={newPatient.age}
          onChange={(e) => setNewPatient({ ...newPatient, age: Number(e.target.value) })}
          maxLength={3}
        />
        
        <p className="text-lg mt-2">Asignar doctores por turno</p>

        <label className="block mt-2 text-sm">Doctor turno A</label>
        <select
          className="w-full mb-3 rounded border border-gray-300 p-2"
          value={selectedDoctors.turnoA}
          onChange={(e) =>
            setSelectedDoctors({ ...selectedDoctors, turnoA: e.target.value })
          }
        >
          <option value="">Seleccionar...</option>
          {doctorsByTurn["A"] && doctorsByTurn["A"].length > 0 ? (
            doctorsByTurn["A"].map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))
          ) : (
            <option value="" disabled>No hay doctores disponibles</option>
          )}
        </select>

        <label className="block mt-2 text-sm">Doctor turno B</label>
        <select
          className="w-full mb-3 rounded border border-gray-300 p-2"
          value={selectedDoctors.turnoB}
          onChange={(e) =>
            setSelectedDoctors({ ...selectedDoctors, turnoB: e.target.value })
          }
        >
          <option value="">Seleccionar...</option>
          {doctorsByTurn["B"] && doctorsByTurn["B"].length > 0 ? (
            doctorsByTurn["B"].map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))
          ) : (
            <option value="" disabled>No hay doctores disponibles</option>
          )}
        </select>

        <label className="block mt-2 text-sm">Doctor turno C</label>
        <select
          className="w-full mb-3 rounded border border-gray-300 p-2"
          value={selectedDoctors.turnoC}
          onChange={(e) =>
            setSelectedDoctors({ ...selectedDoctors, turnoC: e.target.value })
          }
        >
          <option value="">Seleccionar...</option>
          {doctorsByTurn["C"] && doctorsByTurn["C"].length > 0 ? (
            doctorsByTurn["C"].map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))
          ) : (
            <option value="" disabled>No hay doctores disponibles</option>
          )}
        </select>

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