import { useState } from "react";
import { useFilterState } from "./useFilterState";

type FilterType = "all" | "income" | "expense";
type AmountRangeType =
  | "all"
  | "0-100"
  | "100-500"
  | "500-1000"
  | "1000-5000"
  | "5000+";
type DateRangeType = "all" | "today" | "week" | "month" | "3months";

export function useTransactionFilterState() {
  const baseFilters = useFilterState();
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [amountRange, setAmountRange] = useState<AmountRangeType>("all");
  const [dateRange, setDateRange] = useState<DateRangeType>("all");

  const hasActiveFilters =
    filterType !== "all" ||
    amountRange !== "all" ||
    dateRange !== "all" ||
    baseFilters.searchTerm !== "";

  const clearFilters = () => {
    baseFilters.clearFilters();
    setFilterType("all");
    setAmountRange("all");
    setDateRange("all");
  };

  return {
    ...baseFilters,
    filterType,
    setFilterType,
    amountRange,
    setAmountRange,
    dateRange,
    setDateRange,
    hasActiveFilters,
    clearFilters,
  };
}
