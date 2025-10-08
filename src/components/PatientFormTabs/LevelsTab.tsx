import type { Patient } from "../../types/user";
import { updateNestedField } from "../../utils/updateNestedField";
interface Props {
  newPatient: Patient;
  setNewPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

export default function LevelsTab({ newPatient, setNewPatient }: Props) {
  return (
    <div>
      <p>Hemoglobina (g/dL):</p>
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

      <p>Creatinina (mg/dL):</p>
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

      <p>Nitrógeno Ureico (mg/dL):</p>
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

      <p>Sodio (mEq/L):</p>
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
      <p>Proteína C Reactiva (mg/L):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={newPatient.levels?.pcr || ""}
        onChange={(e) =>
          setNewPatient((prev) =>
            updateNestedField(prev, "levels", "potassium", e.target.value)
          )
        }
      />
      <p>Potasio (mEq/L):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={newPatient.levels?.potassium || ""}
        onChange={(e) =>
          setNewPatient((prev) =>
            updateNestedField(prev, "levels", "pcr", e.target.value)
          )
        }
      />
    </div>
  );
}
