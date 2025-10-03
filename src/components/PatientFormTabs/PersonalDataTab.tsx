import type { User } from "../../types/user";

interface Props {
  newPatient: User;
  setNewPatient: React.Dispatch<React.SetStateAction<User>>;
}

export default function PersonalDataTab({ newPatient, setNewPatient }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-3">
      <div>
        Nombre:
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2"
          value={newPatient.firstName}
          onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
        />
      </div>
      <div>
        Primer Apellido:
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2"
          value={newPatient.lastName}
          onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
        />
      </div>
      <div>
        Segundo Apellido:
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2"
          value={newPatient.secondLastname || ""}
          onChange={(e) => setNewPatient({ ...newPatient, secondLastname: e.target.value })}
        />
      </div>
      <div>
        RUT:
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2"
          value={newPatient.rut}
          onChange={(e) => setNewPatient({ ...newPatient, rut: e.target.value })}
        />
      </div>
      <div>
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
