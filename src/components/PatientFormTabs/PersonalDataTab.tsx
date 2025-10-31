import type { Patient } from "../../types/patient";

interface Props {
    patient: Patient;
}

export default function PersonalDataTab({ patient }: Props) {
    return (
        <div className="flex-auto flex-col mb-3">
            <div className="mb-3">
                <p className="font-semibold">Nombre:</p>
                <p className="w-full rounded border border-gray-200 p-2 bg-gray-50">
                    {patient.name}
                </p>
            </div>
            <div className="mb-3">
                <p className="font-semibold">RUT:</p>
                <p className="w-full rounded border border-gray-200 p-2 bg-gray-50">
                    {patient.rut}
                </p>
            </div>
        </div>
    );
}
