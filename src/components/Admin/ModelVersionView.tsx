import type { Model } from "../../types/models";

interface Props {
    model: Model;
    active: boolean;
    onToggle: () => void;
}

export default function ModelVersionView({ model, active, onToggle }: Props) {
    const inputId = `switch-${model.id}`;
    return (
    <>
        <div className="grid grid-cols-[2fr_2fr_2fr_2fr_2fr_2fr] gap-4 items-center [&>p]:text-center">
            <p>{model.version}</p>
            <p>{model.stage}</p>
            <p>{model.metric}</p>
            <p>{Math.round(Number(model.metric_value)*100)}%</p>
            <p>{typeof(model.trained_at) === "string" ? model.trained_at : model.trained_at.toLocaleDateString()}</p>
            <div className="relative inline-block ml-[45%] w-11 h-5">
            <input
                id={inputId}
                type="checkbox"
                className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-[var(--color-primary)] cursor-pointer transition-colors duration-300"
                checked={active}
                onChange={onToggle}
            />
            <label
                htmlFor={inputId}
                className="absolute top-0 left-0 w-5 h-5 z-10 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
            />
            </div>
        </div>
    </>
    )
}