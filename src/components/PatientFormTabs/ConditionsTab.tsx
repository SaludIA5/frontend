import type { Patient } from "../../types/user";
import { updateNestedField } from "../../utils/updateNestedField";

interface Props {
    newPatient: Patient;
    setNewPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

export default function ConditionsTab({ newPatient, setNewPatient }: Props){
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
                <input
                    type="checkbox"
                    id="ventilation"
                    checked={!!newPatient.hospitalizationConditions?.mechanicalVentilation}
                    onChange={(e) =>
                        setNewPatient((prev) => updateNestedField(prev, "hospitalizationConditions", "mechanicalVentilation", e.target.checked)
                    )}
                    />
                <label htmlFor="ventilation">Ventilación mecánica</label>
            </div>
            <p>Tipo de Cama:</p>
            <input
                className="w-full mb-3 rounded border border-gray-300 p-2"
                value={newPatient.hospitalizationConditions?.bedType || ""}
                onChange={(e) =>
                    setNewPatient((prev) => updateNestedField(prev, "hospitalizationConditions", "bedType", e.target.value)
                )}
            />
            <p>Puntaje Glasgow (entre 3-15):</p>
            <input
                type="number"
                min={3}
                max={15}
                className="w-full mb-3 rounded border border-gray-300 p-2"
                value={newPatient.hospitalizationConditions?.glasgowScore ?? ""}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    const score = inputValue === "" ? "" : Math.max(3, Math.min(Number(inputValue), 15));
                    setNewPatient((prev) =>
                        updateNestedField(prev, "hospitalizationConditions", "glasgowScore", score)
                    );
                }}
            />
        </div>
    )
}