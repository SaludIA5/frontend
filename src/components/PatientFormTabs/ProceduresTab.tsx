import type { Episode } from "../../types/episode";
import type { Procedures } from "../../types/patientInfo";
import { updateNestedField } from "../../utils/updateNestedField";
import { resetProcedure } from "../../utils/resetProcedure";

interface Props {
  episode: Episode;
   setEpisode: React.Dispatch<React.SetStateAction<Episode>>;
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
  { code: "rnmStrokeProtocol", label: "Resonancia Magnética con protocolo de ACV" },
  { code: "bloodTransfusions", label: "Transfusiones de sangre" },
  { code: "ecg", label: "Electro Cardiograma", subKey: "alteredEcg", subLabel: "¿Resultados Alterados?" },
  { code: "troponine", label: "Prueba de Troponina", subKey: "alteredTroponine", subLabel: "¿Resultados Alterados?" }
];

export default function ProceduresTab({ episode, setEpisode }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h2>Se han realizado:</h2>

      {PROCEDURES.map((procedure) => {
        const isChecked = !!episode.proceduresDone?.[procedure.code];

        return (
          <div className="flex flex-col gap-1" key={procedure.code}>
            {/* Checkbox principal */}
            <div className="flex gap-3 items-center">
            <input
                type="checkbox"
                id={procedure.code}
                checked={!!episode.proceduresDone?.[procedure.code]}
                onChange={(e) =>
                    setEpisode((prev) =>
                    e.target.checked || !procedure.subKey
                        ? updateNestedField(prev, "proceduresDone", procedure.code, e.target.checked)
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
                  checked={!!episode.proceduresDone?.[procedure.subKey]}
                  onChange={(e) =>
                    setEpisode((prev) =>
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