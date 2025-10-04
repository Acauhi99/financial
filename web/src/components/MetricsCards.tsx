import { MetricCard } from "./MetricCard";
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
      key: "saldo",
      title: "Saldo Total",
      value: summary.balance,
      icon: <Wallet size={16} className="text-gray-600" />,
      iconBgColor: "bg-gray-100",
      valueColor: "text-gray-900",
      toggleColor: "bg-blue-500",
    },
    {
      key: "receitas",
      title: "Receitas",
      value: summary.totalIncome,
      icon: <DollarSign size={16} className="text-green-600" />,
      iconBgColor: "bg-green-100",
      valueColor: "text-green-600",
      toggleColor: "bg-green-500",
    },
    {
      key: "despesas",
      title: "Despesas",
      value: summary.totalExpenses,
      icon: <TrendingUp size={16} className="text-red-600" />,
      iconBgColor: "bg-red-100",
      valueColor: "text-red-600",
      toggleColor: "bg-red-500",
    },
    {
      key: "investimentos",
      title: "Investimentos",
      value: summary.totalInvestments,
      icon: <TrendingUpIcon size={16} className="text-purple-600" />,
      iconBgColor: "bg-purple-100",
      valueColor: "text-purple-600",
      toggleColor: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
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
              className={`absolute top-2 right-2 w-6 h-6 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                isHidden
                  ? "bg-gray-300 text-gray-600"
                  : `${metric.toggleColor} text-white`
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
