import type { Episode } from "../../types/episode";
import { updateNestedField } from "../../utils/updateNestedField";

interface Props {
    episode: Episode;
    setEpisode: React.Dispatch<React.SetStateAction<Episode>>;
}

export default function ConditionsTab({ episode, setEpisode }: Props){
    
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
                <input
                    type="checkbox"
                    id="ventilation"
                    checked={!!episode.hospitalizationConditions?.mechanicalVentilation}
                    onChange={(e) =>
                        setEpisode((prev) => updateNestedField(prev, "hospitalizationConditions", "mechanicalVentilation", e.target.checked)
                    )}
                    />
                <label htmlFor="ventilation">Ventilación mecánica</label>
            </div>
            <p>Tipo de Cama:</p>
            <select
                className="w-full mb-3 rounded border border-gray-300 p-2"
                value={episode.hospitalizationConditions?.bedType || ""}
                onChange={(e) =>
                    setEpisode((prev) => updateNestedField(prev, "hospitalizationConditions", "bedType", e.target.value)
                )}
            >
                <option value="" disabled>Seleccione</option>
                <option value="Básica">Básica</option>
                <option value="Urgencia">Urgencia</option>
                <option value="UCI">UCI</option>
                <option value="UTI">UTI</option>
            </select>
            <p>Puntaje Glasgow (entre 3-15):</p>
            <input
                type="number"
                min={3}
                max={15}
                className="w-full mb-3 rounded border border-gray-300 p-2"
                value={episode.hospitalizationConditions?.glasgowScore ?? ""}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    const score = inputValue === "" ? "" : Math.max(3, Math.min(Number(inputValue), 15));
                    setEpisode((prev) =>
                        updateNestedField(prev, "hospitalizationConditions", "glasgowScore", score)
                    );
                }}
            />
        </div>
    )
}