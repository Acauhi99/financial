import type { ReactNode } from "react";
import { CSS_CLASSES, formatCurrency } from "../../constants";

interface MetricCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconBgColor: string;
  valueColor: string;
  formatter?: (value: number) => string;
  isActive?: boolean;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  icon,
  iconBgColor,
  valueColor,
  formatter = formatCurrency,
  isActive = true,
  onClick,
}: Readonly<MetricCardProps>) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-gray-200/60 transition-all duration-300 text-left ${
        !isActive ? "opacity-50" : ""
      } ${onClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-xl font-bold ${valueColor}`}>
            {formatter(value)}
          </p>
        </div>
        <div className={`${CSS_CLASSES.ICON_CONTAINER} ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </Component>
  );
}
