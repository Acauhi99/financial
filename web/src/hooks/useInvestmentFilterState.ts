import { useState } from "react";
import { useFilterState } from "./useFilterState";

type AmountRangeType =
  | "all"
  | "0-100"
  | "100-500"
  | "500-1000"
  | "1000-5000"
  | "5000+";
type RateRangeType = "all" | "0-50" | "50-80" | "80-100" | "100+";
type DateRangeType = "all" | "today" | "week" | "month" | "3months";

export function useInvestmentFilterState() {
  const baseFilters = useFilterState();
  const [amountRange, setAmountRange] = useState<AmountRangeType>("all");
  const [rateRange, setRateRange] = useState<RateRangeType>("all");
  const [dateRange, setDateRange] = useState<DateRangeType>("all");

  const hasActiveFilters =
    amountRange !== "all" ||
    rateRange !== "all" ||
    dateRange !== "all" ||
    baseFilters.searchTerm !== "";

  const clearFilters = () => {
    baseFilters.clearFilters();
    setAmountRange("all");
    setRateRange("all");
    setDateRange("all");
  };

  return {
    ...baseFilters,
    amountRange,
    setAmountRange,
    rateRange,
    setRateRange,
    dateRange,
    setDateRange,
    hasActiveFilters,
    clearFilters,
  };
}
