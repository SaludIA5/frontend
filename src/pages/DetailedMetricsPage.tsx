import { useNavigate, useParams } from "react-router-dom"
import type { Doctor } from "../types/doctor"
import Header from "../components/Header";
import DetailedMetricEntry from "../components/Metrics/DetailedMetricEntry";
import { useEffect, useState } from "react";
import axios from "axios";
import ValidateAsChief from "../components/Metrics/ValidateAsChief";
import type { Patient } from "../types/patient";
import type { BackendValidationByEpisode } from "../types/metrics";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default function DetailedMetricsPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [episodeToValidate, setEpisodeToValidate] = useState<BackendValidationByEpisode>();
  const [doctor, setDoctor] = useState<Doctor>();
  const [validatedEpisodes, setValidatedEpisodes] = useState<BackendValidationByEpisode[]>();
  const [isChief, setIsChief] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);
  const [openEpisodeIndex, setOpenEpisodeIndex] = useState<number | null>(null);


  useEffect(() => {
    const getDoctor = async () => {
      if (!import.meta.env.VITE_BACKEND_URL) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const user = await api.get(`/users/${params.id}`, { headers: { Authorization: axios.defaults.headers.common.Authorization } });
        const userData = user.data?.items || user.data || {};
        const newDoctor: Doctor = {
          name: userData.name,
          id: userData.id,
          email: userData.email,
          isDoctor: userData.is_doctor,
          isChiefDoctor: userData.is_chief_doctor,
        }
        setDoctor(newDoctor);

        const validatedEpisodes = await api.get("/metrics/episodes");
        const episodeData = validatedEpisodes.data?.items || validatedEpisodes.data || [];
        const userEpisodes = episodeData.filter((episode: BackendValidationByEpisode) => episode.validated_by_doctor == userData.name)
        setValidatedEpisodes(userEpisodes);
        setError(false);

        const currentUser = await api.get("/auth/me");
        if (currentUser.data.is_admin || currentUser.data.is_chief_doctor) {
          setIsChief(true);
        } else if (currentUser.data.id != params.id) {
          setIsAllowed(false);
        }
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
    const fetchPatient = async (patientId: number) => {
      if (!import.meta.env.VITE_BACKEND_URL) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/patients/${patientId}`, { headers: { Authorization: axios.defaults.headers.common.Authorization } });
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
    if (!doctor || !validatedEpisodes) return;
    for (let i = 0; i < validatedEpisodes.length; i++) {
      if (validatedEpisodes) {
        const patientId = validatedEpisodes[i].patient_id;
        fetchPatient(patientId);
      }
    }
  }, [doctor, validatedEpisodes]);

  const findPatientFromID = (id: number): string => {
    const patient = patients.find((patient) => patient.id === id);
    return patient?.name || "Nombre No Encontrado"
  }

  const handleValidation = async (decision: "PERTINENTE" | "NO PERTINENTE", comment: string) => {
    if (!episodeToValidate || !doctor) return;
    const currentUser = await api.get("auth/me");
    const userId = currentUser.data.id;
    const validationBody = {
      "user_id": userId,
      "decision": decision
    }
    const summaryBody = {
      "episode_id": episodeToValidate.episode_id,
      "user_id": userId,
      "comment": comment
    }
    try {
      await api.post(`episodes/${episodeToValidate.episode_id}/chief-validate`, validationBody);
      await api.post(`doctor-summaries`, summaryBody);
      await api.patch(`episodes/${episodeToValidate.episode_id}`, { estado_del_caso: "Cerrado" });
      window.location.reload();
    } catch (error) {
      console.log(error)
    }
  }

  const openValidationModal = (episode: BackendValidationByEpisode) => {
    setEpisodeToValidate(episode);
    setModalOpen(!modalOpen);
  }

  const closeEpisode = async (episodeId: number) => {
    try {
      await api.patch(`episodes/${episodeId}`, { estado_del_caso: "Cerrado" })
      window.location.reload();
    } catch (error) {
      console.log(error)
    }
  }

  if (error) return (<><Header /> Ha ocurrido un error.</>);
  if (loading) return (<><Header /> Cargando...</>);
  if (!doctor) return (<><Header /> Doctor no encontrado</>);
  if (!validatedEpisodes) return (<><Header /> No hay episodios para el doctor.</>);
  if (!isAllowed) return (<><Header /> No está permitido ver los datos de este doctor.</>);
  return (
    <>
      <Header />
      <div className="flex justify-between my-3 px-8 items-center">
        <b>Doctor(a): {doctor.name}</b>
        <button
          className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
          onClick={() => navigate("/metrics")}
        >
          Volver a Vista General
        </button>
      </div>

      <ul className="mx-auto max-w-5xl space-y-3">
        {validatedEpisodes && validatedEpisodes.length > 0 ? (
          <div className="w-full">
            <li>
              <div className="grid grid-cols-[minmax(0,1fr)_repeat(5,minmax(0,10fr))] text-center my-2 px-4 font-semibold">
                <p className="col-start-2">Paciente</p>
                <p>Estado del Caso</p>
                <p>Decisión Doctor</p>
                <p>Concordancia con IA</p>
                <p>Decisión Jefe de Turno</p>
              </div>
            </li>

            <div className="text-center">
              {validatedEpisodes.map((validatedEpisode, i) => {
                if (!validatedEpisode.doctor_validation) return null;

                return (
                  <li
                    key={i}
                    className="my-1.5 border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4 cursor-pointer"
                  >
                    <DetailedMetricEntry
                      episodeValidation={validatedEpisode}
                      patientName={findPatientFromID(validatedEpisode.patient_id)}
                      isOpen={openEpisodeIndex === i}
                      isChief={isChief}
                      onToggle={() => setOpenEpisodeIndex(openEpisodeIndex === i ? null : i)}
                      onValidate={openValidationModal}
                      handleClose={() => closeEpisode(validatedEpisode.episode_id)}
                    />
                  </li>
                );
              })}
            </div>
          </div>
        ) : (
          <p>No hay episodios para este médico.</p>
        )}
      </ul>

      <ValidateAsChief
        isOpen={modalOpen}
        onClose={() => setModalOpen(!modalOpen)}
        onChoice={handleValidation}
      />
    </>
  );

}