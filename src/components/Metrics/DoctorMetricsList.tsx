import { useNavigate } from "react-router-dom";
import type { DoctorValidation } from "../../types/metrics";

interface Props {
  validations: DoctorValidation[];
}

export default function DoctorMetricsList({ validations }: Props) {
  const navigate = useNavigate();
  return (
    <ul className="mx-auto max-w-5xl space-y-3">
      <li>
        <div className="grid grid-cols-6 gap-4 items-center text-center px-4">
          <p className="text-left">Nombre</p>
          <p>Casos Aprobados <br/> para Ley de Urgencia</p>
          <p>Casos Rechazados <br/> para Ley de Urgencia</p>
          <p>Tasa de <br/> Aprobación</p>
          <p>Tasa de concordancia con IA</p>
        </div>
      </li>
      {validations.map((validation, i) => {

        return (
          <li
            key={i}
            className="border border-gray-200 rounded-2xl shadow-sm bg-white transition-all duration-200 hover:shadow-md p-4"
          >
            <div className="grid grid-cols-6 gap-4 items-center">
              <h1 className="text-lg text-left font-medium truncate">
                {validation.doctorName}
              </h1>

              <p className="text-center text-green-600 font-semibold">
                {validation.acceptedValidations}
              </p>

              <p className="text-center text-red-600 font-semibold">
                {validation.rejectedValidations}
              </p>

              <p className="text-center font-semibold">
                {Math.round(validation.acceptanceRate * 100)}%
              </p>

              <p className="text-center font-semibold">
                {Math.round(validation.concordanceRate * 100)}%
              </p>

              <button
                className="rounded-xl px-6 py-2 text-white shadow bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)]"
                onClick={() => navigate(`./${validation.doctorId}`)}
              >
                Ver detalle
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}