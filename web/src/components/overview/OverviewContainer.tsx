import { useOverview, useOverviewFilters } from "../../hooks";
import { OverviewView } from "./OverviewView";

export function OverviewContainer() {
  const { data, isLoading, error } = useOverview();
  const {
    hiddenItems,
    timePeriod,
    setTimePeriod,
    toggleMonthlyItem,
    toggleChartItem,
  } = useOverviewFilters();

  return (
    <OverviewView
      data={data}
      isLoading={isLoading}
      error={error}
      hiddenItems={hiddenItems}
      timePeriod={timePeriod}
      onTimePeriodChange={setTimePeriod}
      onToggleMonthlyItem={toggleMonthlyItem}
      onToggleChartItem={toggleChartItem}
    />
  );
}
