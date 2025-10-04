import { MetricCard } from "./MetricCard";
import { CSS_CLASSES, METRICS_CONFIG, UI_CONFIG } from "../constants";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";

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
        <Wallet
          size={UI_CONFIG.SIZES.ICON_SMALL}
          className={`text-${METRICS_CONFIG.BALANCE.color}-600`}
        />
      ),
      iconBgColor: `bg-${METRICS_CONFIG.BALANCE.color}-100`,
      valueColor: `text-${METRICS_CONFIG.BALANCE.color}-900`,
      toggleColor: "bg-blue-500",
    },
    {
      ...METRICS_CONFIG.INCOME,
      value: summary.totalIncome,
      icon: (
        <DollarSign
          size={UI_CONFIG.SIZES.ICON_SMALL}
          className={`text-${METRICS_CONFIG.INCOME.color}-600`}
        />
      ),
      iconBgColor: `bg-${METRICS_CONFIG.INCOME.color}-100`,
      valueColor: `text-${METRICS_CONFIG.INCOME.color}-600`,
      toggleColor: `bg-${METRICS_CONFIG.INCOME.color}-500`,
    },
    {
      ...METRICS_CONFIG.EXPENSES,
      value: summary.totalExpenses,
      icon: (
        <TrendingUp
          size={UI_CONFIG.SIZES.ICON_SMALL}
          className={`text-${METRICS_CONFIG.EXPENSES.color}-600`}
        />
      ),
      iconBgColor: `bg-${METRICS_CONFIG.EXPENSES.color}-100`,
      valueColor: `text-${METRICS_CONFIG.EXPENSES.color}-600`,
      toggleColor: `bg-${METRICS_CONFIG.EXPENSES.color}-500`,
    },
    {
      ...METRICS_CONFIG.INVESTMENTS,
      value: summary.totalInvestments,
      icon: (
        <TrendingUpIcon
          size={UI_CONFIG.SIZES.ICON_SMALL}
          className={`text-${METRICS_CONFIG.INVESTMENTS.color}-600`}
        />
      ),
      iconBgColor: `bg-${METRICS_CONFIG.INVESTMENTS.color}-100`,
      valueColor: `text-${METRICS_CONFIG.INVESTMENTS.color}-600`,
      toggleColor: `bg-${METRICS_CONFIG.INVESTMENTS.color}-500`,
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
