import type { User } from "../../types/user";
import { updateNestedField } from "../../utils/updateNestedField";
import { useState } from "react";

interface Props {
  newPatient: User;
  setNewPatient: React.Dispatch<React.SetStateAction<User>>;
}

export default function VitalsSignsDataTab({ newPatient, setNewPatient }: Props) {
  const [showBP, setShowBP] = useState(false)
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

     {/* Subgrupo de presión arterial */}
     <div
        role="button"
        className="w-full flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md mb-2"
        onClick={() => setShowBP(!showBP)}
      >
        <span className="font-medium">Presión Arterial</span>
        <span>{showBP ? "▲" : "▼"}</span>
      </div>

      {showBP && (
        <div className="ml-4 border-l pl-4 space-y-2">
          <div>
            <p>Media:</p>
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              value={newPatient.bloodPressure?.mediumBloodPressure || ""}
              onChange={(e) =>
                setNewPatient((prev) =>
                  updateNestedField(prev, "bloodPressure", "mediumBloodPressure", e.target.value)
                )
              }
            />
          </div>
          <div>
            <p>Sistólica:</p>
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              value={newPatient.bloodPressure?.sistolicBloodPressure || ""}
              onChange={(e) =>
                setNewPatient((prev) =>
                  updateNestedField(prev, "bloodPressure", "sistolicBloodPressure", e.target.value)
                )
              }
            />
          </div>
          <div>
            <p>Diastólica:</p>
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              value={newPatient.bloodPressure?.diastolicBloodPressure || ""}
              onChange={(e) =>
                setNewPatient((prev) =>
                  updateNestedField(prev, "bloodPressure", "diastolicBloodPressure", e.target.value)
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
