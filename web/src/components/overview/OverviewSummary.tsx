import { MetricsCards } from "../layout";

interface OverviewSummaryProps {
  summary: {
    balance: number;
    totalIncome: number;
    totalExpenses: number;
    totalInvestments: number;
  };
  hiddenMonthlyItems: Set<string>;
  onToggleMonthlyItem: (itemName: string) => void;
}

export function OverviewSummary({
  summary,
  hiddenMonthlyItems,
  onToggleMonthlyItem,
}: Readonly<OverviewSummaryProps>) {
  return (
    <MetricsCards
      summary={summary}
      hiddenMonthlyItems={hiddenMonthlyItems}
      onToggleMonthlyItem={onToggleMonthlyItem}
    />
  );
}
