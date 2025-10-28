// Deshabilitado por mientras que sigue mockeado.
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import DoctorMetricsList from '../components/Metrics/DoctorMetricsList';
import type { DoctorValidation } from '../types/metrics';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

interface BackendValidations {
    doctor_id: number
    doctor_name: string
    total_validations: number
    accepted_validations: number
    rejected_validations: number
    concordant_validations: number
    discordant_validations: number
    concordance_rate: number
    acceptance_rate: number
}

export default function MetricsPage() {
    const [doctorValidations, setDoctorValidations] = useState<DoctorValidation[]>();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false)

    function normalizeValidations(data: BackendValidations[]): DoctorValidation[] {
        return data.map(doctor => ({
            doctorId: doctor.doctor_id,
            doctorName: doctor.doctor_name,
            totalValidations: doctor.total_validations,
            acceptedValidations: doctor.accepted_validations,
            rejectedValidations: doctor.rejected_validations,
            concordantValidations: doctor.concordant_validations,
            discordantValidations: doctor.discordant_validations,
            concordanceRate: doctor.concordance_rate,
            acceptanceRate: doctor.acceptance_rate
        }));
      }

    useEffect(()=>{
        const fetchValidationsByDoctor = async () => {
            if (!import.meta.env.VITE_BACKEND_URL) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const res = await api.get("/metrics/validation-by-doctor");
                console.log(res);
                const validationsData = res.data?.items || res.data || [];
                const list = Array.isArray(validationsData) ? validationsData : [];
                const validationsList = normalizeValidations(list);
                setDoctorValidations(validationsList);
                setError(false);
            } catch (error) {
                console.error("Error fetching validations:", error);
                setError(true);
            } finally {
                setLoading(false)
            }
        }
        fetchValidationsByDoctor();
    }, [])

    if (loading) return (
    <>
        <Header />
        Cargando...
    </>)
    if (error) return (
    <>
        <Header />
        Ha habido un error...
    </>)

    return(
        <>
            <Header />
            <div className='flex justify-center my-4 text-2xl font-bold'>
                <p> Metricas de Aprobación por Doctor </p>
            </div>
            <DoctorMetricsList validations={doctorValidations ?? []} />
        </>
    )
}
