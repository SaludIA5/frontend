import { useState, useEffect } from "react";
import type { Patient } from "../../types/patient";
import { usePatients } from "../../hooks/usePatients";
import axios from 'axios';
import { emptyEpisode } from "../../utils/emptyEpisode";

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

  const [doctors, setDoctors] = useState<{ id: number; name: string }[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState({
    turnoA: "",
    turnoB: "",
    turnoC: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // const res = await api.get('/doctors'); FALTAAAA
        // setDoctors(res.data);
  
        setDoctors([
          { id: 1, name: "Dr. González" },
          { id: 2, name: "Dra. Pérez" },
          { id: 3, name: "Dr. Ramírez" },
        ]);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
  
    fetchDoctors();
  }, []);
  

  const { addPatient } = usePatients();

  const resetForm = () => {
    setNewPatient({
      id: -1,
      name: "",
      rut: "",
      sex: "",
      age: 0,
      openEpisode: emptyEpisode(),
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
        // doctors: { FALTAAAAA
        //   turnoA: selectedDoctors.turnoA,
        //   turnoB: selectedDoctors.turnoB,
        //   turnoC: selectedDoctors.turnoC,
        // },
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
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>{doc.name}</option>
          ))}
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
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>{doc.name}</option>
          ))}
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
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>{doc.name}</option>
          ))}
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