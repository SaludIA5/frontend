import type { Patient } from "../../types/user";
import type { Procedures } from "../../types/patientInfo";
import { updateNestedField } from "../../utils/updateNestedField";
import { resetProcedure } from "../../utils/resetProcedure";

interface Props {
  newPatient: Patient;
  setNewPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

interface Procedure {
  code: keyof Procedures;            // Clave principal
  label: string;
  sameDayKey?: keyof Procedures;     // Clave para el checkbox "Same Day"
  sameDayLabel?: string;
}

const PROCEDURES: Procedure[] = [
  { code: "surgery", label: "Cirugía", sameDayKey: "surgerySameDay", sameDayLabel: "¿Mismo día?" },
  { code: "hemoDinamia", label: "Hemo Dinamia", sameDayKey: "hemoDinamiaSameDay", sameDayLabel: "¿Mismo día?" },
  { code: "endoscopy", label: "Endoscopía", sameDayKey: "endoscopySameDay", sameDayLabel: "¿Mismo día?" },
  { code: "dialysis", label: "Diálisis" },
  { code: "trombolysis", label: "Trombolisis", sameDayKey: "trombolysisSameDay", sameDayLabel: "¿Mismo día?" },
  { code: "pcr", label: "PCR" },
  { code: "rnmStrokeProtocol", label: "Resonancia Magnética con protocolo de ACV" }
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
                    e.target.checked
                        ? updateNestedField(prev, "proceduresDone", procedure.code, true)
                        : resetProcedure(prev, procedure.code)
                    )
                }
            />
              <label htmlFor={procedure.code}>{procedure.label}</label>
            </div>

            {/* Sub-checkbox "Same Day" */}
            {procedure.sameDayKey && isChecked && (
              <div className="ml-6 flex gap-2 items-center">
                <input
                  type="checkbox"
                  id={`${procedure.code}-sameDay`}
                  checked={!!newPatient.proceduresDone?.[procedure.sameDayKey]}
                  onChange={(e) =>
                    setNewPatient((prev) =>
                      updateNestedField(prev, "proceduresDone", procedure.sameDayKey!, e.target.checked)
                    )
                  }
                />
                <label htmlFor={`${procedure.code}-sameDay`}>{procedure.sameDayLabel}</label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}