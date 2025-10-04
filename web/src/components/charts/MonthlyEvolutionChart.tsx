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
import { LineChart as LineChartIcon } from "lucide-react";
import { CustomTooltip } from "./CustomTooltip";

interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
  saldo: number;
  investimentos: number;
}

interface MonthlyEvolutionChartProps {
  data: MonthlyData[];
  hiddenLines: Set<string>;
  onToggleLine: (lineName: string) => void;
  timePeriod: string;
  onTimePeriodChange: (period: string) => void;
}

export function MonthlyEvolutionChart({
  data,
  hiddenLines,
  timePeriod,
  onTimePeriodChange,
}: Readonly<MonthlyEvolutionChartProps>) {
  const periodOptions = [
    { value: "3", label: "3M" },
    { value: "6", label: "6M" },
    { value: "9", label: "9M" },
    { value: "12", label: "1A" },
    { value: "60", label: "5A" },
  ];

  const filteredData = data.slice(-parseInt(timePeriod));
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-gray-200/60 transition-all duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <LineChartIcon size={20} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            Evolução Mensal
          </h3>
        </div>
        <select
          value={timePeriod}
          onChange={(e) => onTimePeriodChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent focus:outline-none text-sm cursor-pointer"
        >
          {periodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} height={25} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              width={50}
              label={{
                value: "R$ (mil)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: "11px" },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              width={50}
              label={{
                value: "R$ (centenas)",
                angle: 90,
                position: "insideRight",
                style: { fontSize: "11px" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "5px" }} />
            {!hiddenLines.has("receitas") && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="receitas"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#22c55e" }}
                name="Receitas"
              />
            )}
            {!hiddenLines.has("despesas") && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="despesas"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#ef4444" }}
                name="Despesas"
              />
            )}
            {!hiddenLines.has("saldo") && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="saldo"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#3b82f6" }}
                name="Saldo"
              />
            )}
            {!hiddenLines.has("investimentos") && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="investimentos"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#8b5cf6" }}
                name="Investimentos"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
