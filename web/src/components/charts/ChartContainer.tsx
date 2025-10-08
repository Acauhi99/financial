import type { ReactNode } from "react";
import { CSS_CLASSES } from "../../utils/constants";

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  children,
  className = "",
}: Readonly<ChartContainerProps>) {
  return (
    <div className={`${CSS_CLASSES.CARD} ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}
