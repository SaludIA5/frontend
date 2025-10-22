import { useNavigate, useParams } from "react-router-dom"
import { mockDoctors } from "../types/doctor"
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { usePatients } from "../hooks/usePatients";
import axios from "axios";
import ValidateAsChief from "../components/Metrics/ValidateAsChief";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
}); 

export default function DetailedMetricsPage(){
    const navigate = useNavigate();
    const params = useParams();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { patients, setPatientList } = usePatients();
    const [modalOpen, setModalOpen] = useState(false);
    const doctor = mockDoctors.find((doctor) => doctor.id == Number(params.id)); //Reemplazar por doctores reales

    useEffect(() => {    
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
            setPatientList(list);
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

    const findPatientFromID = (id: number) : string => {
        const patient = patients.find((patient) => patient.id === id);
        return patient?.name || "Nombre No Encontrado"
    }
    
    const handleValidation = (choice: boolean) => {
        console.log(choice)
    }
    
    if (!doctor) return (<>No hay un doctor con esa id.</>)
    if (error) return (<>Ha ocurrido un error.</>)
    if (loading) return (<>Cargando...</>)
    return(
    <>
    <Header />
    <div className="flex justify-center my-3">
        <button className='rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]' 
        onClick={()=> navigate("/metrics")}>
            Volver a Vista General
        </button>
    </div>
    <div>
        <b>Doctor(a): {doctor.name}</b>
    </div>
    {doctor.episodes ? 
    (<table className="w-full border-separate border-spacing-2">
        <thead className="text-center">
        <tr>
            <th>Paciente</th>
            <th>Recomendación IA</th>
            <th>Decisión Doctor</th>
        </tr>
        </thead>
        <tbody className="text-center">
        {doctor.episodes.map((episode, i) => {
            if (!episode.doctorValidation) return;
            else return (<tr key={i}>
                    <td>{findPatientFromID(episode.patientId)}</td>
                    <td> {(() => {
                            const color = episode.aiValidation ? "green" : "red";
                            return (
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${color}-200 text-${color}-700`}
                            >
                                {episode.aiValidation ? "" : "No "} Aplica Ley
                            </span>
                        );})()}
                    </td>
                    <td> {(() => {
                            const color = episode.doctorValidation ? "green" : "red";
                            return (
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold text-center bg-${color}-200 text-${color}-700`}
                            >
                                {episode.doctorValidation ? "" : "No "} Se Aplicó Ley
                            </span>
                        );})()}
                    </td>
                    <td><button className='rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]' 
                    onClick={()=> setModalOpen(!modalOpen)}>Validar como Jefe</button></td>  
            </tr>)
        })}
        </tbody>
    </table>) : (<p>No hay episodios para este médico.</p>)}
    <ValidateAsChief isOpen={modalOpen} onClose={()=>setModalOpen(!modalOpen)} onChoice={handleValidation}/>
    </>
    )
}