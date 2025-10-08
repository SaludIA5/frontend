import type { Patient } from "../../types/user";
import type { Procedures } from "../../types/patientInfo";
import { updateNestedField } from "../../utils/updateNestedField";
import { resetProcedure } from "../../utils/resetProcedure";

interface Props {
  newPatient: Patient;
  setNewPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

interface Procedure {
  code: keyof Procedures;
  label: string;
  subKey?: keyof Procedures;
  subLabel?: string;
}

const PROCEDURES: Procedure[] = [
  { code: "surgery", label: "Cirugía", subKey: "surgerySameDay", subLabel: "¿Mismo día?" },
  { code: "hemoDinamia", label: "Hemo Dinamia", subKey: "hemoDinamiaSameDay", subLabel: "¿Mismo día?" },
  { code: "endoscopy", label: "Endoscopía", subKey: "endoscopySameDay", subLabel: "¿Mismo día?" },
  { code: "dialysis", label: "Diálisis" },
  { code: "trombolysis", label: "Trombolisis", subKey: "trombolysisSameDay", subLabel: "¿Mismo día?" },
  { code: "pcr", label: "PCR" },
  { code: "rnmStrokeProtocol", label: "Resonancia Magnética con protocolo de ACV" },
  { code: "bloodTransfusions", label: "Transfusiones de sangre" },
  { code: "ecg", label: "Electro Cardiograma", subKey: "alteredEcg", subLabel: "¿Resultados Alterados?" },
  { code: "troponine", label: "Prueba de Troponina", subKey: "alteredTroponine", subLabel: "¿Resultados Alterados?" }
];

export default function ProceduresTab({ newPatient, setNewPatient }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h2>Se han realizado:</h2>

      {PROCEDURES.map((procedure) => {
        const isChecked = !!newPatient.proceduresDone?.[procedure.code];

        return (
          <div className="flex flex-col gap-1" key={procedure.code}>
            {/* Checkbox principal */}
            <div className="flex gap-3 items-center">
            <input
                type="checkbox"
                id={procedure.code}
                checked={!!newPatient.proceduresDone?.[procedure.code]}
                onChange={(e) =>
                    setNewPatient((prev) =>
                    e.target.checked || !procedure.subKey
                        ? updateNestedField(prev, "proceduresDone", procedure.code, true)
                        : resetProcedure(prev, procedure.code, procedure.subKey)
                    )
                }
            />
              <label htmlFor={procedure.code}>{procedure.label}</label>
            </div>

            {/* Sub-checkbox "Same Day" */}
            {procedure.subKey && isChecked && (
              <div className="ml-6 flex gap-2 items-center">
                <input
                  type="checkbox"
                  id={`${procedure.code}-subComponent`}
                  checked={!!newPatient.proceduresDone?.[procedure.subKey]}
                  onChange={(e) =>
                    setNewPatient((prev) =>
                      updateNestedField(prev, "proceduresDone", procedure.subKey!, e.target.checked)
                    )
                  }
                />
                <label htmlFor={`${procedure.code}-subComponent`}>{procedure.subLabel}</label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}