import { Loading } from "./Loading";
import { MetricsCards } from "./MetricsCards";
import { MonthlyEvolutionChart } from "./charts/MonthlyEvolutionChart";
import { ChartsGrid } from "./charts/ChartsGrid";
import { useOverview } from "../hooks";
import { CSS_CLASSES } from "../constants";
import { useState } from "react";

export function Overview() {
  const { data, isLoading, error } = useOverview();

  const [hiddenItems, setHiddenItems] = useState({
    balance: new Set<string>(),
    expense: new Set<string>(),
    investment: new Set<string>(),
    monthly: new Set<string>(),
  });

  const [timePeriod, setTimePeriod] = useState("12");

  const {
    balanceData,
    monthlyData,
    expenseCategories,
    investmentTypes,
    summary,
  } = data || {};

  const filteredBalanceData = (balanceData || []).filter(
    (item) => !hiddenItems.balance.has(item.name)
  );
  const filteredExpenseData = (expenseCategories || []).filter(
    (item) => !hiddenItems.expense.has(item.name)
  );
  const filteredInvestmentData = (investmentTypes || []).filter(
    (item) => !hiddenItems.investment.has(item.name)
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className={CSS_CLASSES.ERROR_MESSAGE}>
        Erro ao carregar dados do overview
      </div>
    );
  }

  const toggleMonthlyItem = (itemName: string) => {
    setHiddenItems((prev) => {
      const newSet = new Set(prev.monthly);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return { ...prev, monthly: newSet };
    });
  };

  const toggleChartItem = (
    type: "balance" | "expense" | "investment",
    itemName: string
  ) => {
    setHiddenItems((prev) => {
      const newSet = new Set(prev[type]);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return { ...prev, [type]: newSet };
    });
  };

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

  if (!data || !summary) {
    return null;
  }

  return (
    <div className={CSS_CLASSES.LAYOUT_MAIN}>
      <div className={CSS_CLASSES.PAGE_HEADER}>
        <h1 className={CSS_CLASSES.PAGE_TITLE}>Overview</h1>
        <p className={CSS_CLASSES.PAGE_SUBTITLE}>
          Visão geral do estado da sua conta
        </p>
      </div>

      <MetricsCards
        summary={summary}
        hiddenMonthlyItems={hiddenItems.monthly}
        onToggleMonthlyItem={toggleMonthlyItem}
      />

      <div className={CSS_CLASSES.LAYOUT_CONTENT}>
        <div className="h-1/2">
          <MonthlyEvolutionChart
            data={monthlyData || []}
            hiddenLines={hiddenItems.monthly}
            onToggleLine={toggleMonthlyItem}
            timePeriod={timePeriod}
            onTimePeriodChange={setTimePeriod}
          />
        </div>

        <ChartsGrid
          balanceDataWithTotal={balanceDataWithTotal}
          investmentTypesWithTotal={investmentTypesWithTotal}
          expenseCategoriesWithTotal={expenseCategoriesWithTotal}
          balanceData={balanceData || []}
          investmentTypes={investmentTypes || []}
          expenseCategories={expenseCategories || []}
          hiddenItems={hiddenItems}
          onToggleItem={toggleChartItem}
        />
      </div>
    </div>
  );
}
