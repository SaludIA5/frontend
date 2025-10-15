import type { Episode } from "../../types/episode";
import { updateNestedField } from "../../utils/updateNestedField";
import { useState } from "react";

interface Props {
  episode: Episode;
   setEpisode: React.Dispatch<React.SetStateAction<Episode>>;
}

export default function PatientStateTab({ episode, setEpisode }: Props) {
  const [showBP, setShowBP] = useState(false)
  const [showCardioResp, setShowCardioResp] = useState(false)
  return (
    <div>
      <div className="flex gap-3 items-center">
        <input
          type="checkbox"
          id="conciousness"
          checked={!!episode.patientState?.compromisedConsiousness}
          onChange={(e) =>
            setEpisode((prev) => updateNestedField(prev, "patientState", "compromisedConsiousness", e.target.checked)
          )}
        />
        <label htmlFor="conciousness">Compromiso de Conciencia</label>
      </div>
      <p>Temperatura (°C):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={episode.patientState?.temperature || ""}
        onChange={(e) =>
          setEpisode((prev) =>
            updateNestedField(prev, "patientState", "temperature", e.target.value)
          )
        }
      />
     {/* Subgrupo cardio respiratorio */}
     <div
        role="button"
        className="w-full flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md mb-2"
        onClick={() => setShowCardioResp(!showCardioResp)}
      >
        <span className="font-medium">Cardio Respiratorio</span>
        <span>{showCardioResp ? "▲" : "▼"}</span>
      </div>
      {showCardioResp && (
      <div className="ml-4 border-l pl-4 space-y-2">
      <p>Saturación de Oxígeno (%):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={episode.patientState?.oxygenSaturation || ""}
        onChange={(e) =>
          setEpisode((prev) =>
            updateNestedField(prev, "patientState", "oxygenSaturation", e.target.value)
          )
        }
      />

      <p>FiO2 (Fracción Inspirada de Oxigeno) (%):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={episode.patientState?.fio2 || ""}
        onChange={(e) =>
          setEpisode((prev) =>
            updateNestedField(prev, "patientState", "fio2", e.target.value)
          )
        }
      />

      <p>Frecuencia Respiratoria (rpm):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={episode.patientState?.respirationRate || ""}
        onChange={(e) =>
          setEpisode((prev) =>
            updateNestedField(prev, "patientState", "respirationRate", e.target.value)
          )
        }
      />

      <p>Frecuencia Cardíaca (lpm):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={episode.patientState?.heartRate || ""}
        onChange={(e) =>
          setEpisode((prev) =>
            updateNestedField(prev, "patientState", "heartRate", e.target.value)
          )
        }
      />
      </div>)}

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
            <p>Media (mmHg):</p>
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              value={episode.bloodPressure?.mediumBloodPressure || ""}
              onChange={(e) =>
                setEpisode((prev) =>
                  updateNestedField(prev, "bloodPressure", "mediumBloodPressure", e.target.value)
                )
              }
            />
          </div>
          <div>
            <p>Sistólica (mmHg):</p>
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              value={episode.bloodPressure?.sistolicBloodPressure || ""}
              onChange={(e) =>
                setEpisode((prev) =>
                  updateNestedField(prev, "bloodPressure", "sistolicBloodPressure", e.target.value)
                )
              }
            />
          </div>
          <div>
            <p>Diastólica (mmHg):</p>
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              value={episode.bloodPressure?.diastolicBloodPressure || ""}
              onChange={(e) =>
                setEpisode((prev) =>
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
