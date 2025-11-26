import { useState, useEffect } from "react";

interface Props {
    isOpen: boolean
    onClose: () => void
    onChoice: (decision: "PERTINENTE" | "NO PERTINENTE", comment: string) => void
    episode_id: number
}

export default function ValidateAsChief({ isOpen, onClose, onChoice, episode_id: _episode_id }: Props) {
    const [selectedDecision, setSelectedDecision] = useState<"PERTINENTE" | "NO PERTINENTE" | null>(null);
    const [comment, setComment] = useState<string>("");

    useEffect(() => {
        if (!isOpen) {
            setSelectedDecision(null);
            setComment("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (selectedDecision && comment.trim()) {
            onChoice(selectedDecision, comment.trim());
            setSelectedDecision(null);
            setComment("");
        }
    };

    const isSubmitDisabled = !selectedDecision || !comment.trim();

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
                <div className="bg-white rounded-2xl shadow-lg text-black max-h-screen flex flex-col w-[32rem] pb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" onClick={onClose} className="hover:cursor-pointer self-end mx-3 my-2">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                    </svg>
                    <div className="flex flex-col items-center justify-center gap-4 px-6 pb-6">
                        <h2 className="text-center">¿Acepta como Jefe de Turno la activación de Ley de Urgencia?</h2>
                        <div className="flex items-center justify-center gap-5 w-full">
                            <div className="flex items-center justify-center h-16 min-w-[120px]">
                                <button
                                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${selectedDecision === "PERTINENTE"
                                        ? "bg-green-700 text-white border-4 border-green-800 shadow-xl ring-4 ring-green-300 ring-offset-2 scale-105"
                                        : "bg-green-500 text-white hover:bg-green-600 border-2 border-transparent"
                                        }`}
                                    onClick={() => setSelectedDecision("PERTINENTE")}
                                >
                                    Aceptar
                                </button>
                            </div>
                            <div className="flex items-center justify-center h-16 min-w-[120px]">
                                <button
                                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${selectedDecision === "NO PERTINENTE"
                                        ? "bg-red-700 text-white border-4 border-red-800 shadow-xl ring-4 ring-red-300 ring-offset-2 scale-105"
                                        : "bg-red-500 text-white hover:bg-red-600 border-2 border-transparent"
                                        }`}
                                    onClick={() => setSelectedDecision("NO PERTINENTE")}
                                >
                                    Rechazar
                                </button>
                            </div>
                        </div>
                        <div className="w-full">
                            <label htmlFor="comment" className="block text-sm font-medium mb-2">
                                Justificación  <text className="text-red-500">*</text>(requerido)
                            </label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={4}
                                placeholder="Ingrese su comentario sobre la decisión..."
                                required
                            />
                        </div>
                        <button
                            className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all ${isSubmitDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 shadow-md"
                                }`}
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled}
                        >
                            Enviar decisión
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}