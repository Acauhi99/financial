import { useOverview, useOverviewFilters } from "../hooks";
import { CSS_CLASSES } from "../constants";
import { OverviewSummary, OverviewCharts } from "./overview";
import { Loading } from "./ui";

export function Overview() {
  const { data, isLoading, error } = useOverview();
  const {
    hiddenItems,
    timePeriod,
    setTimePeriod,
    toggleMonthlyItem,
    toggleChartItem,
  } = useOverviewFilters();

  const {
    balanceData,
    monthlyData,
    expenseCategories,
    investmentTypes,
    summary,
  } = data || {};

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

      <OverviewSummary
        summary={summary}
        hiddenMonthlyItems={hiddenItems.monthly}
        onToggleMonthlyItem={toggleMonthlyItem}
      />

      <OverviewCharts
        monthlyData={monthlyData || []}
        balanceData={balanceData || []}
        investmentTypes={investmentTypes || []}
        expenseCategories={expenseCategories || []}
        hiddenItems={hiddenItems}
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        onToggleMonthlyItem={toggleMonthlyItem}
        onToggleChartItem={toggleChartItem}
      />
    </div>
  );
}
