import type { User } from "../../types/user";

interface Props {
  newPatient: User;
  setNewPatient: React.Dispatch<React.SetStateAction<User>>;
}

export default function VitalsSignsDataTab({ newPatient, setNewPatient }: Props) {
  return (
    <div>
      <p>Saturación de Oxígeno:</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={newPatient.oxygenSaturation || ""}
        onChange={(e) => setNewPatient({ ...newPatient, oxygenSaturation: e.target.value })}
      />

      <p>Frecuencia Cardíaca:</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={newPatient.heartRate || ""}
        onChange={(e) => setNewPatient({ ...newPatient, heartRate: e.target.value })}
      />

      <p>Presión Arterial:</p>
      <input
        type="text"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={newPatient.bloodPressure || ""}
        onChange={(e) => setNewPatient({ ...newPatient, bloodPressure: e.target.value })}
      />
    </div>
  );
}
