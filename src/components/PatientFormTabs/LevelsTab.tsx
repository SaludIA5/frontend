import type { Patient } from "../../types/user";
import { updateNestedField } from "../../utils/updateNestedField";
interface Props {
  newPatient: Patient;
  setNewPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

export default function LevelsTab({ newPatient, setNewPatient }: Props) {
  return (
    <div>
      <p>Hemoglobina:</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={newPatient.levels?.hemoglobin || ""}
        onChange={(e) =>
          setNewPatient((prev) =>
            updateNestedField(prev, "levels", "hemoglobin", e.target.value)
          )
        }
      />

      <p>Creatinina:</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={newPatient.levels?.creatinin || ""}
        onChange={(e) =>
          setNewPatient((prev) =>
            updateNestedField(prev, "levels", "creatinin", e.target.value)
          )
        }
      />

      <p>Nitrógeno Ureico:</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={newPatient.levels?.ureic_nitro || ""}
        onChange={(e) =>
          setNewPatient((prev) =>
            updateNestedField(prev, "levels", "ureic_nitro", e.target.value)
          )
        }
      />

    <p>Sodio:</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={newPatient.levels?.sodium || ""}
        onChange={(e) =>
          setNewPatient((prev) =>
            updateNestedField(prev, "levels", "sodium", e.target.value)
          )
        }
      />
    <p>Potasio:</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={newPatient.levels?.potassium || ""}
        onChange={(e) =>
          setNewPatient((prev) =>
            updateNestedField(prev, "levels", "potassium", e.target.value)
          )
        }
      />
    </div>
  );
}
