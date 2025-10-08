import { CSS_CLASSES } from "../utils/constants";
import { OverviewSummary, OverviewCharts } from "./overview";
import { Loading } from "./ui";
import { type OverviewData } from "../services/api";

interface OverviewViewProps {
  data: OverviewData | undefined;
  isLoading: boolean;
  error: Error | null;
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

export function OverviewView({
  data,
  isLoading,
  error,
  hiddenItems,
  timePeriod,
  onTimePeriodChange,
  onToggleMonthlyItem,
  onToggleChartItem,
}: Readonly<OverviewViewProps>) {
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
        onToggleMonthlyItem={onToggleMonthlyItem}
      />

      <OverviewCharts
        monthlyData={monthlyData || []}
        balanceData={balanceData || []}
        investmentTypes={investmentTypes || []}
        expenseCategories={expenseCategories || []}
        hiddenItems={hiddenItems}
        timePeriod={timePeriod}
        onTimePeriodChange={onTimePeriodChange}
        onToggleMonthlyItem={onToggleMonthlyItem}
        onToggleChartItem={onToggleChartItem}
      />
    </div>
  );
}
