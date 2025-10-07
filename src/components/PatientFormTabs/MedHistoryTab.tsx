import type { Patient } from "../../types/user";

interface Props {
  newPatient: Patient;
  setNewPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

export default function MedHistoryTab({ newPatient, setNewPatient }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h2>El paciente tiene:</h2>
      <div className="flex gap-3">
        <input
            type="checkbox"
            id="cardiacHistory"
            checked={!!newPatient.cardiacHistory}
            onChange={(e) =>
            setNewPatient({ ...newPatient, cardiacHistory: e.target.checked })
            }
        />
        <label htmlFor="cardiacHistory">Antecedentes Cardiacos</label>
      </div>
      <div className="flex gap-3">
      <input
        type="checkbox"
        id="diabetesHistory"
        checked={!!newPatient.diabetesHistory}
        onChange={(e) =>
          setNewPatient({ ...newPatient, diabetesHistory: e.target.checked })
        }
      />
      <label htmlFor="diabetesHistory">Antecedentes Diabetes</label>
      </div>
      <div className="flex gap-3">
      <input
        type="checkbox"
        id="hypertensionHistory"
        checked={!!newPatient.hypertensionHistory}
        onChange={(e) =>
          setNewPatient({ ...newPatient, hypertensionHistory: e.target.checked })
        }
        />
        <label htmlFor="hypertensionHistory">Antecedentes Hipertensión Arterial</label>
      </div>
    </div>
  );
}