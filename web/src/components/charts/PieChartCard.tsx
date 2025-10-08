import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieTooltip } from "./PieTooltip";
import { InteractiveChartLegend } from "./InteractiveChartLegend";
import {
  formatCurrency,
  CSS_CLASSES,
  UI_CONFIG,
  COLORS,
} from "../../utils/constants";
import type { ReactNode } from "react";

interface ChartData {
  name: string;
  value: number;
  color: string;
  total: number;
  [key: string]: unknown;
}

interface ChartItem {
  name: string;
  value: number;
  color: string;
}

interface PieChartCardProps {
  title: string;
  icon: ReactNode;
  data: ChartData[];
  originalItems: ChartItem[];
  hiddenItems: Set<string>;
  onToggleItem: (itemName: string) => void;
  innerRadius?: number;
}

export function PieChartCard({
  title,
  icon,
  data,
  originalItems,
  hiddenItems,
  onToggleItem,
  innerRadius = 0,
}: Readonly<PieChartCardProps>) {
  return (
    <div className={CSS_CLASSES.CHART_CONTAINER}>
      <div className={CSS_CLASSES.CHART_HEADER}>
        {icon}
        <h3 className={CSS_CLASSES.CHART_TITLE}>{title}</h3>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={UI_CONFIG.CHART.PIE_OUTER_RADIUS}
              paddingAngle={UI_CONFIG.CHART.PIE_PADDING_ANGLE}
              dataKey="value"
              stroke={COLORS.WHITE}
              strokeWidth={UI_CONFIG.CHART.PIE_STROKE_WIDTH}
            >
              {data?.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-shrink-0">
        <InteractiveChartLegend
          items={originalItems}
          hiddenItems={hiddenItems}
          onToggleItem={onToggleItem}
          showValues
          formatter={formatCurrency}
        />
      </div>
    </div>
  );
}
