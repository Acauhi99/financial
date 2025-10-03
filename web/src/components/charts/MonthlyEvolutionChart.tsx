import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { COLORS } from "../../constants";

interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
  saldo: number;
  investimentos: number;
}

interface MonthlyEvolutionChartProps {
  data: MonthlyData[];
}

export function MonthlyEvolutionChart({
  data,
}: Readonly<MonthlyEvolutionChartProps>) {
  return (
    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-lg ring-2 ring-blue-100 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex-shrink-0">
        Evolução Mensal
      </h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 9 }} height={20} />
            <YAxis tick={{ fontSize: 9 }} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }} />
            <Line
              type="monotone"
              dataKey="receitas"
              stroke={COLORS.CHART.GREEN}
              strokeWidth={2}
              dot={{ fill: COLORS.CHART.GREEN, strokeWidth: 1, r: 2 }}
              name="Receitas"
            />
            <Line
              type="monotone"
              dataKey="despesas"
              stroke={COLORS.CHART.RED}
              strokeWidth={2}
              dot={{ fill: COLORS.CHART.RED, strokeWidth: 1, r: 2 }}
              name="Despesas"
            />
            <Line
              type="monotone"
              dataKey="saldo"
              stroke={COLORS.CHART.INDIGO}
              strokeWidth={2}
              dot={{ fill: COLORS.CHART.INDIGO, strokeWidth: 1, r: 2 }}
              name="Saldo"
            />
            <Line
              type="monotone"
              dataKey="investimentos"
              stroke={COLORS.CHART.TEAL}
              strokeWidth={2}
              dot={{ fill: COLORS.CHART.TEAL, strokeWidth: 1, r: 2 }}
              name="Investimentos"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
