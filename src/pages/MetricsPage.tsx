import { useState, useEffect } from 'react';
import type { Patient } from "../types/user"
import Header from '../components/Header';
import { usePatients } from '../hooks/usePatients';
import axios from 'axios';
import ClosedPatientsList from '../components/Metrics/ClosedPatientsList';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});  

export default function MetricsPage() {
    const navigate = useNavigate()
    const { patients, setPatientList } = usePatients();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        //Parche para poder recibir pacientes en formato antiguo
        const normalizePatient = (patient: Patient): Patient => {
          const newPatient: Patient = {
            name: patient.name,
            rut: patient.rut,
            age: patient.age,
            sex: patient.sex,
            currentEpisode: {
              isEligible: false 
            }
          } 
          // Migrar estructura antigua a la nueva
          return newPatient;
        }
        
        const fetchPatients = async () => {
          if (!import.meta.env.VITE_BACKEND_URL) {
            setError(true);
            setLoading(false);
            return;
          }
    
          try {
            const res = await api.get("/patients");
            const patientsData = res.data?.items || res.data || [];
            const list = Array.isArray(patientsData) ? patientsData : [];
            const normalizedList: Patient[] = list.map((patient) => normalizePatient(patient));
            setPatientList(normalizedList);
            setError(false);
          } catch (error) {
            console.error("Error fetching patients:", error);
            setError(true);
          } finally {
            setLoading(false);
          }
        };
    
        fetchPatients();
    }, [setPatientList]);

    if (!patients || patients.length === 0) {
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {error
                ? "No se pudo cargar la lista de pacientes."
                : "No hay pacientes disponibles."}
            </p>
          </div>
        );
    }

    if (loading) return <>Cargando...</>
    return(
        <>
            <Header />
            <div className='flex justify-center my-3'>
                <button className='rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]' onClick={()=> navigate("/")}>
                    Volver a Pacientes Activos
                </button>
            </div>
            <ClosedPatientsList patients={patients} />
        </>
    )
}