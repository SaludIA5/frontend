import type React from "react";
import type { Episode } from "../../types/episode";

interface Props {
  episode: Episode;
  setEpisode: React.Dispatch<React.SetStateAction<Episode>>;
}

export default function MedHistoryTab({ episode, setEpisode }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h2>El paciente tiene:</h2>
      <div className="flex gap-3">
        <input
            type="checkbox"
            id="cardiacHistory"
            checked={!!episode.cardiacHistory}
            onChange={(e) =>
            setEpisode({ ...episode, cardiacHistory: e.target.checked })
            }
        />
        <label htmlFor="cardiacHistory">Antecedentes Cardiacos</label>
      </div>
      <div className="flex gap-3">
      <input
        type="checkbox"
        id="diabetesHistory"
        checked={!!episode.diabetesHistory}
        onChange={(e) =>
          setEpisode({ ...episode, diabetesHistory: e.target.checked })
        }
      />
      <label htmlFor="diabetesHistory">Antecedentes Diabetes</label>
      </div>
      <div className="flex gap-3">
      <input
        type="checkbox"
        id="hypertensionHistory"
        checked={!!episode.hypertensionHistory}
        onChange={(e) =>
          setEpisode({ ...episode, hypertensionHistory: e.target.checked })
        }
        />
        <label htmlFor="hypertensionHistory">Antecedentes Hipertensión Arterial</label>
      </div>
    </div>
  );
}