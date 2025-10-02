import { useState } from 'react';
import PatientList from './PatientList';
import PatientControls from './PatientControls';
import { usePatients } from '../../hooks/usePatients';

interface PatientManagerProps {
  onProcessPatient: (patientRut: string) => void;
}

export default function PatientManager({ onProcessPatient }: PatientManagerProps) {
  const { patients } = usePatients();

  const [search, setSearch] = useState("");
  const [filterEligible, setFilterEligible] = useState<"all" | "yes" | "no">("all");
  const [sortBy, setSortBy] = useState<"name" | "rut">("name");
  const [filterGender, setFilterGender] = useState<"all" | "M" | "F" | "ND">("all");

  const filteredPatients = patients
    .filter((p) => {
      const fullName = `${p.firstName} ${p.lastName} ${p.secondLastname ?? ""}`;
      return fullName.toLowerCase().includes(search.toLowerCase());
    })
    .filter((p) => {
      if (filterEligible === "yes") return p.isEligible;
      if (filterEligible === "no") return !p.isEligible;
      return true;
    })
    .filter((p) => {
      return filterGender !== "all" ? p.sex === filterGender : true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.firstName.localeCompare(b.firstName);
      if (sortBy === "rut") return a.rut.localeCompare(b.rut);
      return 0;
    });

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
      <PatientList patients={filteredPatients} onProcessPatient={onProcessPatient} />
    </div>
  );
}