// Deshabilitado por mientras que sigue mockeado.
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import DoctorMetricsList from '../components/Metrics/DoctorMetricsList';
import type { DoctorValidation, BackendValidationByDoctor, BackendMetricsSummary } from '../types/metrics';
import axios from 'axios';
import GeneralMetrics from '../components/Metrics/GeneralMetrics';
import { useAuth } from '../context/AuthContextBase';
import { handleUnauthorized } from '../utils/apiInterceptor';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

export default function MetricsPage() {
    const { logout } = useAuth();
    const [doctorValidations, setDoctorValidations] = useState<DoctorValidation[]>();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isChief, setIsChief] = useState(false); //Actualizar cuando se tenga forma de acceder a datos propios
    const [generalMetrics, setGeneralMetrics] = useState<BackendMetricsSummary>();

    function normalizeValidations(data: BackendValidationByDoctor[]): DoctorValidation[] {
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

    useEffect(() => {
        const fetchValidationsByDoctor = async () => {
            if (!import.meta.env.VITE_BACKEND_URL) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const userInfo = await api.get("/auth/me");
                const userData = userInfo.data;
                if (userData.is_chief_doctor || userData.is_admin) {
                    setIsChief(true);
                }
                const res = await api.get("/metrics/validation-by-doctor");
                const validationsData = res.data?.items || res.data || [];
                const list = Array.isArray(validationsData) ? validationsData : [];
                let filteredList = [];
                if (!isChief) {
                    filteredList = list.filter((item) => item.doctor_id == userData.id); //Poner id de doctor actual
                }
                const validationsList = isChief ? normalizeValidations(list) : normalizeValidations(filteredList);
                setDoctorValidations(validationsList);
                setError(false);
            } catch (error) {
                console.error("Error fetching validations:", error);
                handleUnauthorized(error, logout);
                setError(true);
            } finally {
                setLoading(false)
            }
        }
        fetchValidationsByDoctor();
    }, [isChief, logout])

    useEffect(() => {
        const fetchGeneralMetrics = async () => {
            if (!isChief) return;
            if (!import.meta.env.VITE_BACKEND_URL) {
                setError(true);
                setLoading(false);
                return;
            }
            try {
                const res = await api.get("metrics/summary");
                const recommendationMetrics = res.data;
                setGeneralMetrics(recommendationMetrics);
            } catch (error) {
                console.log(error);
                handleUnauthorized(error, logout);
            }

        }
        fetchGeneralMetrics();
    }, [isChief, logout])

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

    return (
        <>
            <Header />
            <div className='flex justify-center my-4 text-2xl font-bold'>
                <p> Métricas de Aprobación por Doctor </p>
            </div>
            <DoctorMetricsList validations={doctorValidations ?? []} />
            {isChief && generalMetrics && (
                <GeneralMetrics metricsData={generalMetrics} />
            )}
        </>
    )
}
