import type { Episode } from "../../types/episode";

interface Props {
  episode: Episode;
   setEpisode: React.Dispatch<React.SetStateAction<Episode>>;
}

export default function ExamsForm({ episode, setEpisode }: Props) {
  return (
    <div>
      Exámenes Realizados:
      <select
        value={episode.examPerformed || ""}
        onChange={(e) => setEpisode({ ...episode, examPerformed: e.target.value })}
        className="w-full mb-3 rounded border border-gray-300 p-2"
      >
        <option value="" disabled>Seleccione</option>
        <option value="Blood Tests">Exámenes de Sangre</option>
        <option value="None">Ninguno</option>
      </select>
    </div>
  );
}
