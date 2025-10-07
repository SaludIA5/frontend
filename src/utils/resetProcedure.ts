import type { Patient } from "../types/user";
import type { Procedures } from "../types/patientInfo";

export function resetProcedure(prev: Patient, code: keyof Procedures): Patient {
  return {
    ...prev,
    proceduresDone: {
      // copiamos lo que ya había
      ...prev.proceduresDone,

      // aseguramos que todos los campos existan con false por defecto
      hemoDinamia: prev.proceduresDone?.hemoDinamia ?? false,
      hemoDinamiaSameDay: prev.proceduresDone?.hemoDinamiaSameDay ?? false,
      endoscopy: prev.proceduresDone?.endoscopy ?? false,
      endoscopySameDay: prev.proceduresDone?.endoscopySameDay ?? false,
      dialysis: prev.proceduresDone?.dialysis ?? false,
      trombolysis: prev.proceduresDone?.trombolysis ?? false,
      trombolysisSameDay: prev.proceduresDone?.trombolysisSameDay ?? false,
      pcr: prev.proceduresDone?.pcr ?? false,

      // forzamos el procedimiento y su "SameDay" en false
      [code]: false,
      [`${code}SameDay`]: false,
    },
  };
}
