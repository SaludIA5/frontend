import { useNavigate, useParams } from "react-router-dom"
import type { Doctor } from "../types/doctor"
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import ValidateAsChief from "../components/Metrics/ValidateAsChief";
import type { Patient } from "../types/patient";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
}); 

interface BackendValidations {
    episode_id: number,
    numero_episodio: string,
    patient_id: number,
    ai_recommendation: string,
    doctor_validation: string,
    chief_validation: string,
    is_concordant: boolean,
    is_accepted: boolean,
    validation_date: Date | string,
    validated_by_doctor: string
}

export default function DetailedMetricsPage(){
    const navigate = useNavigate();
    const params = useParams();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [doctor, setDoctor] = useState<Doctor>();
    const [episodes, setEpisodes] = useState<BackendValidations[]>();

    useEffect(() => {
        const getDoctor = async () => {
            if (!import.meta.env.VITE_BACKEND_URL) {
                setError(true);
                setLoading(false);
                return;
            }
        
            try {
                const user = await api.get(`/users/${params.id}`, { headers: { Authorization: axios.defaults.headers.common.Authorization }});
                const data = user.data?.items || user.data || {};
                const episodes = await api.get("/metrics/episodes");
                const episodeData = episodes.data?.items || episodes.data || [];
                const userEpisodes = episodeData.filter((episode : BackendValidations) => episode.validated_by_doctor == data.name)
                const newDoctor: Doctor = {
                    name: data.name,
                    id: data.id,
                    email: data.email,
                    isDoctor: data.is_doctor,
                    isChiefDoctor: data.is_chief_doctor,
                }
                setDoctor(newDoctor);
                setEpisodes(userEpisodes);
                setError(false);
            } catch (error) {
                console.error("Error fetching doctor:", error);
                setError(true);
              } finally {
                setLoading(false);
              }
        }
        getDoctor();
    }, [params.id])

    useEffect(() => {    
        const fetchPatient = async (patientId : number) => {
          if (!import.meta.env.VITE_BACKEND_URL) {
            setError(true);
            setLoading(false);
            return;
          }
    
          try {
            const res = await api.get(`/patients/${patientId}`, { headers: { Authorization: axios.defaults.headers.common.Authorization }});
            const patientData = res.data?.items || res.data || [];
            setPatients(p => [...p, patientData]);
            setError(false);
          } catch (error) {
            console.error("Error fetching patients:", error);
            setError(true);
          } finally {
            setLoading(false);
          }
        };
        fetchPatient(1);
      }, []);

    const findPatientFromID = (id: number) : string => {
        const patient = patients.find((patient) => patient.id === id);
        return patient?.name || "Nombre No Encontrado"
    }
    
    const handleValidation = (choice: boolean) => {
        console.log(choice) //TODO: Cambiar cuando se pasen datos de paciente 
    }
    if (error) return (<><Header /> Ha ocurrido un error.</>);
    if (loading) return (<><Header /> Cargando...</>); 
    if (!doctor) return (<>Doctor no encontrado</>);
    if (!episodes) return (<>No hay episodios para el doctor.</>);
    return(
    <>
    <Header />
    <div className="flex justify-between my-3 px-8 items-center">
        <b>Doctor(a): {doctor.name}</b>
        <button className='rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]' 
        onClick={()=> navigate("/metrics")}>
            Volver a Vista General
        </button>
    </div>
    {episodes ? 
    (<table className="w-full border-separate border-spacing-2">
        <thead className="text-center">
        <tr>
            <th>Paciente</th>
            <th>Decisión Doctor</th>
            <th>Concordancia con IA</th>
            <th>Decisión Jefe de Turno</th>
        </tr>
        </thead>
        <tbody className="text-center">
        {episodes.map((episode, i) => {
            if (!episode.doctor_validation) return;
            else return (<tr key={i}>
                    <td>{findPatientFromID(episode.patient_id)}</td>
                    <td> {(() => {
                            const color = episode.doctor_validation ? "green" : "red";
                            return (
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${color}-200 text-${color}-700`}
                            >
                                {episode.doctor_validation ? "" : "No "} Se Aplicó Ley
                            </span>
                        );})()}
                    </td>
                    <td> {(() => {
                            const color = episode.is_concordant ? "green" : "red";
                            return (
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${color}-200 text-${color}-700`}
                            >
                                {episode.is_concordant ? "" : "No "} Concuerda
                            </span>
                        );})()}
                    </td>
                    <td><button className='rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]' 
                    onClick={()=> setModalOpen(!modalOpen)}>Validar Decisión</button></td>  
            </tr>)
        })}
        </tbody>
    </table>) : (<p>No hay episodios para este médico.</p>)}
    <ValidateAsChief isOpen={modalOpen} onClose={()=>setModalOpen(!modalOpen)} onChoice={handleValidation}/>
    </>
    )
}