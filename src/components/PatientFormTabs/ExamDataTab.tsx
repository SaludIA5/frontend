import type { User } from "../../types/user";

interface Props {
  newPatient: User;
  setNewPatient: React.Dispatch<React.SetStateAction<User>>;
}

export default function ExamsForm({ newPatient, setNewPatient }: Props) {
  return (
    <div>
      Exámenes Realizados:
      <select
        value={newPatient.examPerformed || ""}
        onChange={(e) => setNewPatient({ ...newPatient, examPerformed: e.target.value })}
        className="w-full mb-3 rounded border border-gray-300 p-2"
      >
        <option value="" disabled>Seleccione</option>
        <option value="Blood Tests">Exámenes de Sangre</option>
        <option value="None">Ninguno</option>
      </select>
    </div>
  );
}
