import { useState, useEffect } from 'react';
import PatientList from './PatientList';
import PatientControls from './PatientControls';
import { usePatients } from '../../hooks/usePatients';
import axios from 'axios';
import type { Patient } from '../../types/patient';

interface PatientManagerProps {
  onProcessPatient: (patientRut: string) => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default function PatientManager({ onProcessPatient }: PatientManagerProps) {
  const { patients, setPatientList } = usePatients();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [filterEligible, setFilterEligible] = useState<"all" | "yes" | "no">("all");
  const [sortBy, setSortBy] = useState<"name" | "rut">("name");
  const [filterGender, setFilterGender] = useState<"all" | "M" | "F" | "ND">("all");

  useEffect(() => {
    //Parche para poder recibir pacientes en formato antiguo
    const normalizePatient = (patient: Patient): Patient => {
      const newPatient: Patient = {
        name: patient.name,
        rut: patient.rut,
        age: patient.age,
        sex: patient.sex,
        openEpisode: {
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

  const filteredPatients = patients
    .filter((p) => {
      return p.name.toLowerCase().includes(search.toLowerCase());
    })
    .filter((p) => {
      if (filterEligible === "yes") return p.openEpisode.isEligible;
      if (filterEligible === "no") return !p.openEpisode.isEligible;
      return true;
    })
    .filter((p) => {
      return filterGender !== "all" ? p.sex === filterGender : true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rut") return a.rut.localeCompare(b.rut);
      return 0;
    });

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

  return (
    <div className='m-4'>
      <PatientControls
        search={search}
        setSearch={setSearch}
        filterEligible={filterEligible}
        setFilterEligible={setFilterEligible}
        filterGender={filterGender}
        setFilterGender={setFilterGender}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      {!loading?
      <PatientList onProcessPatient={onProcessPatient} patients={filteredPatients}/>:
      "Cargando..."}
    </div>
  );
}