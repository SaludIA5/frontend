import { useMemo, useState } from 'react';
import type { Doctor } from '../../types/doctor';
import axios from 'axios';
import { usePatients } from '../../hooks/usePatients';

interface CreateEpisodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: number | null;
    doctors: Doctor[];
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export default function CreateEpisodeModal({ isOpen, onClose, patientId, doctors }: CreateEpisodeModalProps) {
    const [selectedDoctors, setSelectedDoctors] = useState({
        turnoA: '',
        turnoB: '',
        turnoC: '',
    });
    const doctorsByTurn = useMemo(() => {
        return doctors.reduce((acc, doctor) => {
            acc[doctor.turn || ''] = [...(acc[doctor.turn || ''] || []), doctor];
            return acc;
        }, {} as { [key: string]: Doctor[] });
    }, [doctors]);

    const { patientsWithEpisodes, setPatientsWithEpisodes } = usePatients();

    const handleCreateEpisode = async () => {
        if (!patientId) return;

        const doctorsPayload = Object.entries(selectedDoctors)
            .filter(([, doctorId]) => doctorId !== "")
            .reduce((acc, [turn, doctorId]) => {
                acc[turn.toLowerCase()] = Number(doctorId);
                return acc;
            }, {} as { [key: string]: number });

        try {
            const res = await api.post('/episodes/', {
                patient_id: patientId,
                doctors: doctorsPayload,
            });
            const newEpisode = res.data;

            const patient = patientsWithEpisodes.find(p => p.id === patientId);
            if (patient) {
                newEpisode.patient_id = patient.id;
                newEpisode.patient_name = patient.name;
                newEpisode.patient_rut = patient.rut;
                newEpisode.patient_age = patient.age;
            }

            const updatedPatients = patientsWithEpisodes.map(p =>
                p.id === patientId
                    ? { ...p, episodes: [newEpisode, ...p.episodes] }
                    : p
            );
            setPatientsWithEpisodes(updatedPatients);

            setSelectedDoctors({ turnoA: '', turnoB: '', turnoC: '' });
            onClose();
        } catch (error) {
            console.error("Error creating episode:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-lg text-black">
                <h2 className="text-xl font-bold mb-4">Crear Nuevo Episodio</h2>

                <label className="block mt-2 text-sm">Doctor turno A</label>
                <select
                    className="w-full mb-3 rounded border border-gray-300 p-2"
                    value={selectedDoctors.turnoA}
                    onChange={(e) => setSelectedDoctors({ ...selectedDoctors, turnoA: e.target.value })}
                >
                    <option value="">Seleccionar...</option>
                    {doctorsByTurn["A"] && doctorsByTurn["A"].map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                </select>

                <label className="block mt-2 text-sm">Doctor turno B</label>
                <select
                    className="w-full mb-3 rounded border border-gray-300 p-2"
                    value={selectedDoctors.turnoB}
                    onChange={(e) => setSelectedDoctors({ ...selectedDoctors, turnoB: e.target.value })}
                >
                    <option value="">Seleccionar...</option>
                    {doctorsByTurn["B"] && doctorsByTurn["B"].map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                </select>

                <label className="block mt-2 text-sm">Doctor turno C</label>
                <select
                    className="w-full mb-3 rounded border border-gray-300 p-2"
                    value={selectedDoctors.turnoC}
                    onChange={(e) => setSelectedDoctors({ ...selectedDoctors, turnoC: e.target.value })}
                >
                    <option value="">Seleccionar...</option>
                    {doctorsByTurn["C"] && doctorsByTurn["C"].map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                </select>

                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        className="rounded-xl bg-gray-300 px-4 py-2 hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        onClick={handleCreateEpisode}
                    >
                        Crear Episodio
                    </button>
                </div>
            </div>
        </div>
    );
}
