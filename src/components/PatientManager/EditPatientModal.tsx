import { useState, useEffect } from 'react';
import type { Patient } from '../../types/patient';
import axios from 'axios';
import { usePatients } from '../../hooks/usePatients';
import { validateRUT } from '../../utils/rutValidation';

interface EditPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient | null;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export default function EditPatientModal({ isOpen, onClose, patient: patientProp }: EditPatientModalProps) {
    const [name, setName] = useState('');
    const [rut, setRut] = useState('');

    const isRutValid = validateRUT(rut) || rut.length == 0;
    
    const { updatePatient } = usePatients();

    useEffect(() => {
        if (patientProp) {
            setName(patientProp.name);
            setRut((patientProp.rut));
        }
    }, [patientProp]);

    const handleRutChange = (value: string) => {
        let clean = value.replace(/[^0-9kK]/g, '');
        if (clean.length > 1) {
            let body = clean.slice(0, -1);
            const dv = clean.slice(-1);
            body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            clean = body + "-" + dv;
        }
        setRut(clean);
    };

    const handleSave = async () => {
        if (!patientProp) return;
        
        if (!isRutValid){
            alert("Por favor ingresar RUT valido");
            return;
        }
      
        if (!rut){
            alert("Por favor ingresar un RUT de paciente");
            return;
        }
        try {
            const res = await api.patch(`/patients/${patientProp.id}`, {
                name: name,
                rut: rut,
            });
            updatePatient(patientProp.id, res.data);
            onClose();
        } catch (error) {
            console.error("Error updating patient:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-lg text-black">
                <h2 className="text-xl font-bold mb-4">Editar Paciente</h2>
                <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full mb-3 rounded border border-gray-300 p-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="RUT"
                    className={`w-full mb-3 rounded border focus:outline-none p-2 ${isRutValid ? "border-gray-300 focus:border-black" : "border-red-500 focus:border-red-500"}`}
                    value={rut}
                    onChange={(e) => handleRutChange(e.target.value)}
                    maxLength={12}
                />
                {!isRutValid && (<p className="text-sm text-red-500">{"El rut es inválido"}</p>)}
                <div className="flex justify-end space-x-3">
                    <button
                        className="rounded-xl bg-gray-300 px-4 py-2 hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="rounded-xl bg-[var(--color-secondary)] px-4 py-2 text-white hover:bg-[var(--color-secondary-hover)]"
                        onClick={handleSave}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
