import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieTooltip } from "./PieTooltip";
import { InteractiveChartLegend } from "./InteractiveChartLegend";
import { formatCurrency } from "../../constants";
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
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-gray-200/60 transition-all duration-300 flex flex-col">
      <div className="flex items-center space-x-2 mb-3 flex-shrink-0">
        {icon}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
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
