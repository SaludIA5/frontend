// Deshabilitado por mientras que sigue mockeado.
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import DoctorMetricsList from '../components/Metrics/DoctorMetricsList';
import { mockDoctors } from '../types/doctor';
import type { Doctor } from '../types/doctor';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

interface BackendUser {
    id: number;
    name: string;
    email: string;
    rut: string;
    is_chief_doctor: boolean;
    is_doctor: boolean;
    is_admin: boolean;
    turn: string | null;
}

export default function MetricsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false)

    function normalizeUsersToDoctors(users: BackendUser[]): Doctor[] {
        return users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          isDoctor: user.is_doctor,
          isChiefDoctor: user.is_chief_doctor,
        }));
      }

    useEffect(()=>{
        const fetchAllDoctors = async () => {
            if (!import.meta.env.VITE_BACKEND_URL) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const res = await api.get("/users");
                const doctorsData = res.data?.items || res.data || [];
                const list = Array.isArray(doctorsData) ? doctorsData : [];
                const doctorList = normalizeUsersToDoctors(list).filter((doctor) => doctor.isDoctor || doctor.isChiefDoctor)
                setDoctors(doctorList);
                setError(false);
            } catch (error) {
                console.error("Error fetching patients:", error);
                setError(true);
            } finally {
                setLoading(false)
            }
        }
        // eslint-disable-next-line no-constant-condition
        if (false) fetchAllDoctors();
    }, [])

    if (loading) return (<>Cargando...</>)
    if (error) return (<>Ha habido un error...</>)

    return(
        <>
            <Header />
            <div className='flex justify-center my-3 text-3xl font-bold'>
                <p> Metricas de Aprobación por Doctor </p>
            </div>
            <DoctorMetricsList doctors={doctors} />
        </>
    )
}