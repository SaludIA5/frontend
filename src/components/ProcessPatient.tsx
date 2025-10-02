import { useState, useEffect, useRef } from "react";
import type { User } from "../types/user";
import { usePatients } from "../hooks/usePatients";

interface ProcessPatientProps {
  isOpen: boolean;
  onClose: () => void;
  patientRut?: string;
}

export default function ProcessPatient({ isOpen, onClose, patientRut }: ProcessPatientProps) {
  const [newPatient, setNewPatient] = useState<User>({
    firstName: "",
    lastName: "",
    isEligible: false,
    rut: "",
    sex: "",
    oxygenSaturation: "",
    heartRate: "",
    bloodPressure: "",
    examPerformed: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [isAiObservationLoading, setIsAiObservationLoading] = useState(false);
  const [aiObservation, setAiObservation] = useState<string>(
    "El sistemallllllllllllllllllllllllllllllllllllllllllllllll detectó parámetros clínicos dentro delllllllllllllllllllllllllllllllllllllllll detectó parámetros clínicos dentro delllllllllllllllllllllllllllllllllllllllll detectó parámetros clínicos dentro delllllllllllllllllllllllllllllllllllllllll detectó parámetros clínicos dentro delllllllllllllllllllllllllllllllllllllllll detectó parámetros clínicos dentro delllllllllllllllllllllllllllllllllllllllll detectó parámetros clínicos dentro de rangos moderados. Se sugiere evaluar criterios de Ley de Urgencia en base a signos vitales y antecedentes."
  );
  const [aiSuggestion, setAiSuggestion] = useState<"Aplica" | "No Aplica">("No Aplica");

  const { patients, updatePatient } = usePatients();
  const aiTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (patientRut && isOpen) {
      setIsLoading(true);
      const foundPatient = patients.find((p) => p.rut === patientRut);
      if (foundPatient) {
        setNewPatient(foundPatient);
      }
      setIsLoading(false);
    } else if (!isOpen) {
      setNewPatient({
        firstName: "",
        lastName: "",
        isEligible: false,
        rut: "",
        sex: "",
        oxygenSaturation: "",
        heartRate: "",
        bloodPressure: "",
        examPerformed: "",
      });
      setIsEditing(false);
      setShowReview(false);
      setIsAiObservationLoading(false);
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
        aiTimerRef.current = null;
      }
    }
  }, [patientRut, patients, isOpen]);

  const handleSave = () => {
    if (newPatient && patientRut) {
      const patientToSave = {
        ...newPatient,
        oxygenSaturation: newPatient.oxygenSaturation ? Number(newPatient.oxygenSaturation) : undefined,
        heartRate: newPatient.heartRate ? Number(newPatient.heartRate) : undefined,
        bloodPressure: newPatient.bloodPressure || undefined,
        examPerformed: newPatient.examPerformed || undefined,
        secondLastname: newPatient.secondLastname || undefined,
      };
      updatePatient(patientRut, patientToSave);
    }
    setIsEditing(false);
    setShowReview(true);
    setIsAiObservationLoading(true);
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
    }
    aiTimerRef.current = window.setTimeout(() => {
      setIsAiObservationLoading(false);
      aiTimerRef.current = null;
    }, 400);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleApprove = () => {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    onClose();
  };

  const handleReject = () => {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    onClose();
  };

  const handleBackToForm = () => {
    setShowReview(false);
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    setIsAiObservationLoading(false);
  };



  const handleRutChange = (value: string) => {
    let clean = value.replace(/[^0-9kK]/g, '');
    if (clean.length > 1) {
      let body = clean.slice(0, -1)
      const dv = clean.slice(-1)
      body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      clean = body + "-" + dv
    }

    setNewPatient({ ...newPatient, rut: clean });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className={`bg-white rounded-2xl shadow-lg text-black max-h-screen flex flex-col transition-all duration-300 ease-in-out ${showReview ? 'w-[38rem] min-h-[26rem]' : 'w-[40rem] min-h-[32rem]'}`}>
        <h2 className="text-xl font-bold p-6">{showReview ? "Observaciones IA" : "Datos del paciente"}</h2>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-gray-500">Cargando...</div>
          </div>
        ) : showReview ? (
          <div className="flex-1 p-6">
            <div className="relative min-h-[20rem]">
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isAiObservationLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="text-gray-500">Cargando...</div>
              </div>
              <div className={`absolute inset-0 transition-opacity duration-300 ${isAiObservationLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Sugerencia:</p>
                  {(() => {
                    const cfg = aiSuggestion === "Aplica"
                      ? { className: "bg-green-200 text-green-700", text: "Aplica" }
                      : { className: "bg-red-100 text-red-700", text: "No Aplica" };
                    return (
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${cfg.className}`}>
                        {cfg.text}
                      </span>
                    );
                  })()}
                </div>
                <div className="mb-2 text-sm text-gray-600">Detalle:</div>
                <div className="border border-gray-200 rounded-lg p-3 min-h-[15rem] text-sm leading-relaxed">
                  {aiObservation}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 transition-opacity duration-300 ease-in-out">
            <fieldset disabled={!isEditing} className={!isEditing ? "text-gray-600" : ""}>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  Nombre:
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full rounded border border-gray-300 p-2"
                    value={newPatient.firstName}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  Primer Apellido:
                  <input
                    type="text"
                    placeholder="Primer Apellido"
                    className="w-full rounded border border-gray-300 p-2"
                    value={newPatient.lastName}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, lastName: e.target.value })
                    }
                  />
                </div>
                <div>
                  Segundo Apellido:
                  <input
                    type="text"
                    placeholder="Segundo Apellido"
                    className="w-full rounded border border-gray-300 p-2"
                    value={newPatient.secondLastname || ""}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, secondLastname: e.target.value })
                    }
                  />
                </div>
                <div>
                  RUT:
                  <input
                    type="text"
                    placeholder="RUT (12.345.678-9)"
                    className="w-full rounded border border-gray-300 p-2"
                    value={newPatient.rut}
                    onChange={(e) => handleRutChange(e.target.value)}
                    maxLength={12}
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
              Exámenes Realizados:
              <select
                value={newPatient.examPerformed || ""}
                onChange={(e) => setNewPatient({ ...newPatient, examPerformed: e.target.value })}
                className="w-full mb-3 rounded border border-gray-300 p-2"
              >
                <option value="" disabled>Exámenes Realizados</option>
                <option value="Blood Tests">Exámenes de Sangre</option>
                <option value="None">Ninguno</option>
              </select>

              <h3 className="text-lg font-semibold mb-2">Signos Vitales</h3>
              <p>Saturación de Oxígeno:</p>
              <input
                type="number"
                placeholder="Saturación de Oxígeno (%)"
                className="w-full mb-3 rounded border border-gray-300 p-2"
                value={newPatient.oxygenSaturation || ""}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, oxygenSaturation: e.target.value })
                }
              />

              <p>Frecuencia Cardíaca:</p>
              <input
                type="number"
                placeholder="Frecuencia Cardíaca (lpm)"
                className="w-full mb-3 rounded border border-gray-300 p-2"
                value={newPatient.heartRate || ""}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, heartRate: e.target.value })
                }
              />

              <p>Presión Arterial:</p>
              <input
                type="text"
                placeholder="Presión Arterial (mmHg)"
                className="w-full mb-3 rounded border border-gray-300 p-2"
                value={newPatient.bloodPressure || ""}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, bloodPressure: e.target.value })
                }
              />
            </fieldset>
          </div>
        )}

        <div className="flex justify-end space-x-3 p-3">
          {showReview ? (
            <>
              <button
                className="rounded-xl bg-gray-300 px-4 py-2 hover:bg-gray-400"
                onClick={handleBackToForm}
              >
                Volver
              </button>
              <button
                className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                onClick={handleReject}
              >
                Rechazar
              </button>
              <button
                className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={handleApprove}
              >
                Aprobar
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-xl bg-gray-300 px-4 py-2 hover:bg-gray-400"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                className={`rounded-xl px-4 py-2 text-white transition-colors duration-200 w-32 text-sm whitespace-nowrap flex items-center justify-center ${isEditing
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
                  }`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancelar Edición" : "Editar"}
              </button>
              <button
                className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={handleSave}
              >
                Guardar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}