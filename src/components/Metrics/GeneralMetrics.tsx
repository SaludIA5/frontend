import type { BackendMetricsSummary } from "../../types/metrics";

interface Props {
  metricsData: BackendMetricsSummary;
}

export default function GeneralMetrics({ metricsData }: Props) {
  const round = (num: number, digits: number) =>
    Math.round(num * 10 ** digits) / 10 ** digits;

  const precision = round(metricsData.recommendation_metrics.precision, 2);
  const concordanceRate = round(metricsData.recommendation_metrics.concordance_rate, 2);
  const acceptanceRate = round(metricsData.recommendation_metrics.acceptance_rate, 2);

  const metricColor = (value: number) =>
    value >= 0.8 ? "text-green-600" : value >= 0.6 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="w-full max-w-5xl mx-auto my-6 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Métricas Generales
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
        <div className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow transition-all duration-150">
          <p className="text-sm text-gray-500">Episodios Totales</p>
          <p className="text-2xl font-bold text-gray-800">
            {metricsData.total_episodes}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow transition-all duration-150">
          <p className="text-sm text-gray-500">Sin Validación de Médico</p>
          <p className="text-2xl font-bold text-gray-800">
            {metricsData.total_episodes - metricsData.episodes_with_doctor_validation}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow transition-all duration-150">
          <p className="text-sm text-gray-500">Sin Validación de Jefe</p>
          <p className="text-2xl font-bold text-gray-800">
            {metricsData.total_episodes - metricsData.episodes_with_chief_validation}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow transition-all duration-150">
          <p className="text-sm text-gray-500">Precisión de IA</p>
          <p className={`text-2xl font-bold ${metricColor(precision)}`}>
            {precision}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow transition-all duration-150">
          <p className="text-sm text-gray-500">Tasa de Concordancia con IA</p>
          <p className={`text-2xl font-bold ${metricColor(concordanceRate)}`}>
            {concordanceRate}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow transition-all duration-150">
          <p className="text-sm text-gray-500">Tasa de Aceptación</p>
          <p className={`text-2xl font-bold ${metricColor(acceptanceRate)}`}>
            {acceptanceRate}
          </p>
        </div>
      </div>
    </div>
  );
}
