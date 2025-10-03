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
}

export function MonthlyEvolutionChart({
  data,
}: Readonly<MonthlyEvolutionChartProps>) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-200 h-full flex flex-col focus:outline-none">
      <div className="flex items-center space-x-2 mb-3 flex-shrink-0">
        <LineChartIcon size={20} className="text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-900">Evolução Mensal</h3>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 9 }} height={20} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 9 }}
              width={40}
              label={{
                value: "R$ (mil)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: "8px" },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 9 }}
              width={40}
              label={{
                value: "R$ (centenas)",
                angle: 90,
                position: "insideRight",
                style: { fontSize: "8px" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }} />
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
