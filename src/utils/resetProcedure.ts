import type { Patient } from "../types/user";
import type { Procedures } from "../types/patientInfo";

export function resetProcedure(prev: Patient, code: keyof Procedures, subKey: keyof Procedures): Patient {
  return {
    ...prev,
    proceduresDone: {
      ...prev.proceduresDone,
      surgery: prev.proceduresDone?.surgery ?? false,
      surgerySameDay: prev.proceduresDone?.surgerySameDay ?? false,
      hemoDinamia: prev.proceduresDone?.hemoDinamia ?? false,
      hemoDinamiaSameDay: prev.proceduresDone?.hemoDinamiaSameDay ?? false,
      endoscopy: prev.proceduresDone?.endoscopy ?? false,
      endoscopySameDay: prev.proceduresDone?.endoscopySameDay ?? false,
      dialysis: prev.proceduresDone?.dialysis ?? false,
      trombolysis: prev.proceduresDone?.trombolysis ?? false,
      trombolysisSameDay: prev.proceduresDone?.trombolysisSameDay ?? false,
      pcr: prev.proceduresDone?.pcr ?? false,
      bloodTransfusions: prev.proceduresDone?.bloodTransfusions ?? false,
      rnmStrokeProtocol: prev.proceduresDone?.rnmStrokeProtocol ?? false,
      ecg: prev.proceduresDone?.ecg ?? false,
      alteredEcg: prev.proceduresDone?.alteredEcg ?? false,
      troponine: prev.proceduresDone?.troponine ?? false,
      alteredTroponine: prev.proceduresDone?.alteredTroponine ?? false,

      [code]: false,
      [subKey]: false,
    },
  };
}
