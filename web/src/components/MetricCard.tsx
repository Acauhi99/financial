import type { ReactNode } from "react";
import { CSS_CLASSES, formatCurrency } from "../constants";

interface MetricCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconBgColor: string;
  valueColor: string;
  formatter?: (value: number) => string;
}

export function MetricCard({
  title,
  value,
  icon,
  iconBgColor,
  valueColor,
  formatter = formatCurrency,
}: Readonly<MetricCardProps>) {
  return (
    <div className={CSS_CLASSES.CARD}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>
            {formatter(value)}
          </p>
        </div>
        <div className={`${CSS_CLASSES.ICON_CONTAINER} ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
