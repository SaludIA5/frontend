import { useState, useEffect } from 'react';
import PatientList from './PatientList';
import PatientControls from './PatientControls';
import { usePatients } from '../../hooks/usePatients';
import axios from 'axios';
import type { EpisodeWithPatientData, PatientWithEpisodes } from '../../types/patient-episode';
import type { Patient } from '../../types/patient';
import type { Episode } from '../../types/episode';
import type { Doctor } from '../../types/doctor';
import { normalizeEpisode } from '../../utils/normalizeEpisode';
import { useAuth } from '../../context/AuthContextBase';
import { handleUnauthorized } from '../../utils/apiInterceptor';

interface PatientManagerProps {
  onProcessEpisode: (episode: Episode) => void;
  onEditPatient: (patient: Patient) => void;
  onOpenCreateEpisodeModal: (patientId: number) => void;
  setDoctors: (doctors: Doctor[]) => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default function PatientManager({ onProcessEpisode, onEditPatient, onOpenCreateEpisodeModal, setDoctors: setDoctorsProp }: PatientManagerProps) {
  const { logout } = useAuth();
  const { setPatientList, setPatientsWithEpisodes, patientsWithEpisodes } = usePatients();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [search, setSearch] = useState("");
  const [filterEligible, setFilterEligible] = useState<"all" | "PERTINENTE" | "NO PERTINENTE">("all");
  const [sortBy, setSortBy] = useState<"name" | "rut">("name");

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!import.meta.env.VITE_BACKEND_URL) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const [episodesRes, doctorsRes] = await Promise.all([
          api.get("/episodes/assigned"),
          api.get("/users/by-turn")
        ]);
        const episodes: EpisodeWithPatientData[] = episodesRes.data || [];
        const doctorsByTurn = doctorsRes.data;
        const allDoctors = Object.values(doctorsByTurn).flat() as Doctor[];
        setDoctors(allDoctors);
        setDoctorsProp(allDoctors);

        const patientsMap = new Map<number, PatientWithEpisodes>();

        episodes.forEach(episode => {
          if (episode.patient_id) {
            if (!patientsMap.has(episode.patient_id)) {
              patientsMap.set(episode.patient_id, {
                id: episode.patient_id,
                name: episode.patient_name,
                rut: episode.patient_rut,
                age: episode.patient_age,
                episodes: [],
              });
            }
            // Normalize the episode to ensure consistent format (same as when saving)
            const normalizedEpisode = normalizeEpisode(episode);
            // Preserve fields that might not be in normalizeEpisode but are in the API response
            const rawEpisode = episode as EpisodeWithPatientData & { antecedentes_cardiaco?: boolean; antecedentes_diabetes?: boolean; antecedentes_hipertension?: boolean };
            const episodeWithPatientData: EpisodeWithPatientData = {
              ...normalizedEpisode,
              patient_id: episode.patient_id,
              patient_name: episode.patient_name,
              patient_rut: episode.patient_rut,
              patient_age: episode.patient_age,
              // Preserve diagnostics if present in API response
              diagnostics: rawEpisode.diagnostics || normalizedEpisode.diagnostics,
              // Preserve medical history if present in API response
              cardiacHistory: rawEpisode.antecedentes_cardiaco ?? normalizedEpisode.cardiacHistory,
              diabetesHistory: rawEpisode.antecedentes_diabetes ?? normalizedEpisode.diabetesHistory,
              hypertensionHistory: rawEpisode.antecedentes_hipertension ?? normalizedEpisode.hypertensionHistory,
            };
            patientsMap.get(episode.patient_id)?.episodes.push(episodeWithPatientData);
          }
        });

        const patientsWithEpisodes = Array.from(patientsMap.values());
        setPatientsWithEpisodes(patientsWithEpisodes);

        const regularPatients: Patient[] = patientsWithEpisodes.map(p => ({
          id: p.id,
          name: p.name,
          rut: p.rut,
          age: p.age,
          openEpisode: p.openEpisode,
        }));
        setPatientList(regularPatients);

        setError(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        handleUnauthorized(error, logout);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [setPatientList, setPatientsWithEpisodes, logout]);

  const filteredPatients = patientsWithEpisodes
    .filter((p) => {
      const searchTerm = search.toLowerCase();
      return (
        p?.name?.toLowerCase().includes(searchTerm) ||
        p?.rut?.toLowerCase().includes(searchTerm)
      );
    })
    .filter((p) => {
      return p.episodes.some(e => (e as unknown as { validacion?: string }).validacion === filterEligible
        || filterEligible === "all"
        || (e as unknown as { validacion?: string }).validacion === null && filterEligible === "NO PERTINENTE");
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rut") return a.rut.localeCompare(b.rut);
      return 0;
    });

  if (!patientsWithEpisodes || patientsWithEpisodes.length === 0) {
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

  return (
    <div className='m-4'>
      <PatientControls
        search={search}
        setSearch={setSearch}
        filterEligible={filterEligible}
        setFilterEligible={setFilterEligible}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      {!loading ?
        <PatientList onProcessEpisode={onProcessEpisode} onEditPatient={onEditPatient} patients={filteredPatients} doctors={doctors} onOpenCreateEpisodeModal={onOpenCreateEpisodeModal} filterEligible={filterEligible} /> :
        "Cargando..."}
    </div>
  );
}