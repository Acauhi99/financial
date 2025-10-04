import {
  BarChart3,
  TrendingUp as TrendingUpIcon,
  CircleDollarSign,
} from "lucide-react";
import { PieChartCard } from "./PieChartCard";
import { CSS_CLASSES, UI_CONFIG } from "../../constants";

interface ChartItem {
  name: string;
  value: number;
  color: string;
}

interface ChartItemWithTotal extends ChartItem {
  total: number;
  [key: string]: unknown;
}

interface ChartsGridProps {
  balanceDataWithTotal: ChartItemWithTotal[];
  investmentTypesWithTotal: ChartItemWithTotal[];
  expenseCategoriesWithTotal: ChartItemWithTotal[];
  balanceData: ChartItem[];
  investmentTypes: ChartItem[];
  expenseCategories: ChartItem[];
  hiddenItems: {
    balance: Set<string>;
    investment: Set<string>;
    expense: Set<string>;
  };
  onToggleItem: (
    type: "balance" | "investment" | "expense",
    itemName: string
  ) => void;
}

export function ChartsGrid({
  balanceDataWithTotal,
  investmentTypesWithTotal,
  expenseCategoriesWithTotal,
  balanceData,
  investmentTypes,
  expenseCategories,
  hiddenItems,
  onToggleItem,
}: Readonly<ChartsGridProps>) {
  return (
    <div className={CSS_CLASSES.GRID_CHARTS}>
      <PieChartCard
        title="Distribuição Financeira"
        icon={
          <CircleDollarSign
            size={UI_CONFIG.SIZES.ICON_MEDIUM}
            className="text-gray-600"
          />
        }
        data={balanceDataWithTotal}
        originalItems={balanceData}
        hiddenItems={hiddenItems.balance}
        onToggleItem={(name) => onToggleItem("balance", name)}
        innerRadius={40}
      />

      <PieChartCard
        title="Distribuição de Investimentos"
        icon={
          <TrendingUpIcon
            size={UI_CONFIG.SIZES.ICON_MEDIUM}
            className="text-gray-600"
          />
        }
        data={investmentTypesWithTotal}
        originalItems={investmentTypes}
        hiddenItems={hiddenItems.investment}
        onToggleItem={(name) => onToggleItem("investment", name)}
      />

      <PieChartCard
        title="Despesas por Categoria"
        icon={
          <BarChart3
            size={UI_CONFIG.SIZES.ICON_MEDIUM}
            className="text-gray-600"
          />
        }
        data={expenseCategoriesWithTotal}
        originalItems={expenseCategories}
        hiddenItems={hiddenItems.expense}
        onToggleItem={(name) => onToggleItem("expense", name)}
      />
    </div>
  );
}
