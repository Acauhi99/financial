import {
  Wallet,
  DollarSign,
  TrendingUp,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { CSS_CLASSES, METRICS_CONFIG, UI_CONFIG } from "../../constants";
import { MetricCard } from "../ui";

interface MetricsCardsProps {
  summary: {
    balance: number;
    totalIncome: number;
    totalExpenses: number;
    totalInvestments: number;
  };
  hiddenMonthlyItems: Set<string>;
  onToggleMonthlyItem: (itemName: string) => void;
}

export function MetricsCards({
  summary,
  hiddenMonthlyItems,
  onToggleMonthlyItem,
}: Readonly<MetricsCardsProps>) {
  const metricsConfig = [
    {
      ...METRICS_CONFIG.BALANCE,
      value: summary.balance,
      icon: (
        <Wallet size={UI_CONFIG.SIZES.ICON_SMALL} className="text-gray-600" />
      ),
      iconBgColor: "bg-gray-100",
      valueColor: "text-gray-900",
      toggleColor: "bg-blue-500",
    },
    {
      ...METRICS_CONFIG.INCOME,
      value: summary.totalIncome,
      icon: (
        <DollarSign
          size={UI_CONFIG.SIZES.ICON_SMALL}
          className="text-green-600"
        />
      ),
      iconBgColor: "bg-green-100",
      valueColor: "text-green-600",
      toggleColor: "bg-green-500",
    },
    {
      ...METRICS_CONFIG.EXPENSES,
      value: summary.totalExpenses,
      icon: (
        <TrendingUp
          size={UI_CONFIG.SIZES.ICON_SMALL}
          className="text-red-600"
        />
      ),
      iconBgColor: "bg-red-100",
      valueColor: "text-red-600",
      toggleColor: "bg-red-500",
    },
    {
      ...METRICS_CONFIG.INVESTMENTS,
      value: summary.totalInvestments,
      icon: (
        <TrendingUpIcon
          size={UI_CONFIG.SIZES.ICON_SMALL}
          className="text-purple-600"
        />
      ),
      iconBgColor: "bg-purple-100",
      valueColor: "text-purple-600",
      toggleColor: "bg-purple-500",
    },
  ];

  return (
    <div className={CSS_CLASSES.GRID_METRICS}>
      {metricsConfig.map((metric) => {
        const isHidden = hiddenMonthlyItems.has(metric.key);

        return (
          <div key={metric.key} className="relative">
            <MetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              iconBgColor={metric.iconBgColor}
              valueColor={metric.valueColor}
              isActive={!isHidden}
            />
            <button
              onClick={() => onToggleMonthlyItem(metric.key)}
              className={`${CSS_CLASSES.TOGGLE_BUTTON} ${
                isHidden
                  ? CSS_CLASSES.TOGGLE_INACTIVE
                  : `${metric.toggleColor} ${CSS_CLASSES.TOGGLE_ACTIVE}`
              }`}
            >
              {isHidden ? "✕" : "✓"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
