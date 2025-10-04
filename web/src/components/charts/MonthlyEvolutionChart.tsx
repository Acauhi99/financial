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
import {
  CSS_CLASSES,
  UI_CONFIG,
  COLORS,
  METRICS_CONFIG,
} from "../../constants";

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
  const periodOptions = UI_CONFIG.TIME_PERIODS;

  const filteredData = data.slice(-parseInt(timePeriod));
  return (
    <div className={`${CSS_CLASSES.CHART_CONTAINER} h-full`}>
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className={CSS_CLASSES.CHART_HEADER}>
          <LineChartIcon
            size={UI_CONFIG.SIZES.ICON_MEDIUM}
            className="text-gray-600"
          />
          <h3 className={CSS_CLASSES.CHART_TITLE}>Evolução Mensal</h3>
        </div>
        <div className="flex items-center space-x-1">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTimePeriodChange(option.value)}
              className={`${CSS_CLASSES.BUTTON_SMALL} ${
                timePeriod === option.value
                  ? CSS_CLASSES.BUTTON_SMALL_ACTIVE
                  : CSS_CLASSES.BUTTON_SMALL_INACTIVE
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.GRID} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: UI_CONFIG.SIZES.FONT_TICK }}
              height={25}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: UI_CONFIG.SIZES.FONT_TICK }}
              width={50}
              label={{
                value: "R$ (mil)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: `${UI_CONFIG.SIZES.FONT_LABEL}px` },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: UI_CONFIG.SIZES.FONT_TICK }}
              width={50}
              label={{
                value: "R$ (centenas)",
                angle: 90,
                position: "insideRight",
                style: { fontSize: `${UI_CONFIG.SIZES.FONT_LABEL}px` },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: `${UI_CONFIG.SIZES.FONT_LEGEND}px`,
                paddingTop: "5px",
              }}
            />
            {!hiddenLines.has("receitas") && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="receitas"
                stroke={METRICS_CONFIG.INCOME.chartColor}
                strokeWidth={UI_CONFIG.CHART.LINE_STROKE_WIDTH}
                dot={{
                  fill: METRICS_CONFIG.INCOME.chartColor,
                  strokeWidth: 2,
                  r: UI_CONFIG.CHART.LINE_DOT_RADIUS,
                }}
                activeDot={{
                  r: UI_CONFIG.CHART.LINE_ACTIVE_DOT_RADIUS,
                  fill: METRICS_CONFIG.INCOME.chartColor,
                }}
                name="Receitas"
              />
            )}
            {!hiddenLines.has("despesas") && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="despesas"
                stroke={METRICS_CONFIG.EXPENSES.chartColor}
                strokeWidth={UI_CONFIG.CHART.LINE_STROKE_WIDTH}
                dot={{
                  fill: METRICS_CONFIG.EXPENSES.chartColor,
                  strokeWidth: 2,
                  r: UI_CONFIG.CHART.LINE_DOT_RADIUS,
                }}
                activeDot={{
                  r: UI_CONFIG.CHART.LINE_ACTIVE_DOT_RADIUS,
                  fill: METRICS_CONFIG.EXPENSES.chartColor,
                }}
                name="Despesas"
              />
            )}
            {!hiddenLines.has("saldo") && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="saldo"
                stroke={METRICS_CONFIG.BALANCE.chartColor}
                strokeWidth={UI_CONFIG.CHART.LINE_STROKE_WIDTH}
                dot={{
                  fill: METRICS_CONFIG.BALANCE.chartColor,
                  strokeWidth: 2,
                  r: UI_CONFIG.CHART.LINE_DOT_RADIUS,
                }}
                activeDot={{
                  r: UI_CONFIG.CHART.LINE_ACTIVE_DOT_RADIUS,
                  fill: METRICS_CONFIG.BALANCE.chartColor,
                }}
                name="Saldo"
              />
            )}
            {!hiddenLines.has("investimentos") && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="investimentos"
                stroke={METRICS_CONFIG.INVESTMENTS.chartColor}
                strokeWidth={UI_CONFIG.CHART.LINE_STROKE_WIDTH}
                dot={{
                  fill: METRICS_CONFIG.INVESTMENTS.chartColor,
                  strokeWidth: 2,
                  r: UI_CONFIG.CHART.LINE_DOT_RADIUS,
                }}
                activeDot={{
                  r: UI_CONFIG.CHART.LINE_ACTIVE_DOT_RADIUS,
                  fill: METRICS_CONFIG.INVESTMENTS.chartColor,
                }}
                name="Investimentos"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
