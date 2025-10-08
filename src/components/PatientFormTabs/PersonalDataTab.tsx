import type { Patient } from "../../types/user";

interface Props {
  newPatient: Patient;
  setNewPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

export default function PersonalDataTab({ newPatient, setNewPatient }: Props) {
  return (
    <div className="flex-auto flex-col mb-3">
      <div className="mb-3">
        Nombre:
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
        />
      </div>
      <div className="mb-3">
        RUT:
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2"
          value={newPatient.rut}
          onChange={(e) => setNewPatient({ ...newPatient, rut: e.target.value })}
        />
      </div>
      <div className="mb-3">
        Sexo:
        <select
          value={newPatient.sex}
          onChange={(e) => setNewPatient({ ...newPatient, sex: e.target.value })}
          className="w-full rounded border border-gray-300 p-2"
        >
          <option value="" disabled>Sexo del paciente</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">No Declarado</option>
        </select>
      </div>
    </div>
  );
}
