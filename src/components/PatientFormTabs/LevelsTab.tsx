import type { Episode } from "../../types/episode";
import { updateNestedField } from "../../utils/updateNestedField";
interface Props {
  episode: Episode;
   setEpisode: React.Dispatch<React.SetStateAction<Episode>>;
}

export default function LevelsTab({ episode, setEpisode }: Props) {
  return (
    <div>
      <p>Hemoglobina (g/dL):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={episode.levels?.hemoglobin || ""}
        onChange={(e) =>
          setEpisode((prev) =>
            updateNestedField(prev, "levels", "hemoglobin", e.target.value)
          )
        }
      />

      <p>Creatinina (mg/dL):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={episode.levels?.creatinin || ""}
        onChange={(e) =>
          setEpisode((prev) =>
            updateNestedField(prev, "levels", "creatinin", e.target.value)
          )
        }
      />

      <p>Nitrógeno Ureico (mg/dL):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={episode.levels?.ureic_nitro || ""}
        onChange={(e) =>
          setEpisode((prev) =>
            updateNestedField(prev, "levels", "ureic_nitro", e.target.value)
          )
        }
      />

      <p>Sodio (mEq/L):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={episode.levels?.sodium || ""}
        onChange={(e) =>
          setEpisode((prev) =>
            updateNestedField(prev, "levels", "sodium", e.target.value)
          )
        }
      />
      <p>Proteína C Reactiva (mg/L):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={episode.levels?.pcr || ""}
        onChange={(e) =>
          setEpisode((prev) =>
            updateNestedField(prev, "levels", "pcr", e.target.value)
          )
        }
      />
      <p>Potasio (mEq/L):</p>
      <input
        type="number"
        className="w-full mb-3 rounded border border-gray-300 p-2"
        value={episode.levels?.potassium || ""}
        onChange={(e) =>
          setEpisode((prev) =>
            updateNestedField(prev, "levels", "potassium", e.target.value)
          )
        }
      />
    </div>
  );
}
