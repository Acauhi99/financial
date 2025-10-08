import { MonthlyEvolutionChart } from "../charts/MonthlyEvolutionChart";
import { ChartsGrid } from "../charts/ChartsGrid";
import { CSS_CLASSES } from "../../utils/constants";

interface OverviewChartsProps {
  monthlyData: Array<{
    month: string;
    receitas: number;
    despesas: number;
    saldo: number;
    investimentos: number;
  }>;
  balanceData: Array<{ name: string; value: number; color: string }>;
  investmentTypes: Array<{ name: string; value: number; color: string }>;
  expenseCategories: Array<{ name: string; value: number; color: string }>;
  hiddenItems: {
    balance: Set<string>;
    expense: Set<string>;
    investment: Set<string>;
    monthly: Set<string>;
  };
  timePeriod: string;
  onTimePeriodChange: (period: string) => void;
  onToggleMonthlyItem: (itemName: string) => void;
  onToggleChartItem: (
    type: "balance" | "expense" | "investment",
    itemName: string
  ) => void;
}

export function OverviewCharts({
  monthlyData,
  balanceData,
  investmentTypes,
  expenseCategories,
  hiddenItems,
  timePeriod,
  onTimePeriodChange,
  onToggleMonthlyItem,
  onToggleChartItem,
}: Readonly<OverviewChartsProps>) {
  const filteredBalanceData = balanceData.filter(
    (item) => !hiddenItems.balance.has(item.name)
  );
  const filteredExpenseData = expenseCategories.filter(
    (item) => !hiddenItems.expense.has(item.name)
  );
  const filteredInvestmentData = investmentTypes.filter(
    (item) => !hiddenItems.investment.has(item.name)
  );

  const balanceTotal = filteredBalanceData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const expenseTotal = filteredExpenseData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const investmentTotal = filteredInvestmentData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const balanceDataWithTotal = filteredBalanceData.map((item) => ({
    ...item,
    total: balanceTotal,
  }));
  const expenseCategoriesWithTotal = filteredExpenseData.map((item) => ({
    ...item,
    total: expenseTotal,
  }));
  const investmentTypesWithTotal = filteredInvestmentData.map((item) => ({
    ...item,
    total: investmentTotal,
  }));

  return (
    <div className={CSS_CLASSES.LAYOUT_CONTENT}>
      <div className="flex-1 min-h-0">
        <MonthlyEvolutionChart
          data={monthlyData}
          hiddenLines={hiddenItems.monthly}
          onToggleLine={onToggleMonthlyItem}
          timePeriod={timePeriod}
          onTimePeriodChange={onTimePeriodChange}
        />
      </div>

      <ChartsGrid
        balanceDataWithTotal={balanceDataWithTotal}
        investmentTypesWithTotal={investmentTypesWithTotal}
        expenseCategoriesWithTotal={expenseCategoriesWithTotal}
        balanceData={balanceData}
        investmentTypes={investmentTypes}
        expenseCategories={expenseCategories}
        hiddenItems={hiddenItems}
        onToggleItem={onToggleChartItem}
      />
    </div>
  );
}
