interface Props {
    isOpen: boolean
    onClose: () => void
    onChoice: (choice: boolean) => void
}

export default function ValidateAsChief({ isOpen, onClose, onChoice }: Props){
    if (!isOpen) return null;
    return (
        <>
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="bg-white rounded-2xl shadow-lg text-black max-h-screen flex flex-col w-[32rem] pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" onClick={onClose} className="hover:cursor-pointer self-end mx-3 my-2">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
                <div className="flex flex-col items-center justify-center gap-2">
                    <h2>¿Acepta como Jefe de Turno la activación de Ley de Urgencia?</h2>
                    <div className="flex items-center justify-center gap-5">
                        <button className="bg-green-500 text-white hover:bg-green-700" onClick={() => onChoice(true)}>
                            Aceptar
                        </button>
                        <button className="bg-red-500 text-white hover:bg-red-700" onClick={() => onChoice(false)}>
                            Rechazar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}