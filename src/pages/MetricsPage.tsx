import { useState } from 'react';
import Header from '../components/Header';
import DoctorMetricsList from '../components/Metrics/DoctorMetricsList';
import { useNavigate } from 'react-router-dom';
import { mockDoctors } from '../types/doctor';
import type { Doctor } from '../types/doctor';

export default function MetricsPage() {
    const navigate = useNavigate()
    const [doctors] = useState<Doctor[]>(mockDoctors);

    return(
        <>
            <Header />
            <div className='flex justify-center my-3'>
                <button className='rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]' onClick={()=> navigate("/")}>
                    Volver a Pacientes Activos
                </button>
            </div>
            <DoctorMetricsList doctors={doctors} />
        </>
    )
}