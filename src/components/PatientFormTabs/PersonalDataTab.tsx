import type { Patient } from "../../types/patient";

// Personal Data es distinta a las otras porque cambia el paciente, no el episodio
interface Props {
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

export default function PersonalDataTab({ patient, setPatient }: Props) {
  return (
    <div className="flex-auto flex-col mb-3">
      <div className="mb-3">
        Nombre:
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2"
          value={patient.name}
          onChange={(e) => setPatient({ ...patient, name: e.target.value })}
        />
      </div>
      <div className="mb-3">
        RUT:
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2"
          value={patient.rut}
          onChange={(e) => setPatient({ ...patient, rut: e.target.value })}
        />
      </div>
    </div>
  );
}
