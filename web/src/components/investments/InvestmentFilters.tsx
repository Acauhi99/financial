import { FILTER_OPTIONS } from "../../utils/constants";
import { GenericFilters } from "../ui/GenericFilters";

type AmountRangeType =
  | "all"
  | "0-100"
  | "100-500"
  | "500-1000"
  | "1000-5000"
  | "5000+";
type RateRangeType = "all" | "0-50" | "50-80" | "80-100" | "100+";
type DateRangeType = "all" | "today" | "week" | "month" | "3months";

interface InvestmentFiltersProps {
  amountRange: AmountRangeType;
  rateRange: RateRangeType;
  dateRange: DateRangeType;
  searchTerm: string;
  showFilters: boolean;
  hasActiveFilters: boolean | string;
  onAmountRangeChange: (range: AmountRangeType) => void;
  onRateRangeChange: (range: RateRangeType) => void;
  onDateRangeChange: (range: DateRangeType) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

export function InvestmentFilters({
  amountRange,
  rateRange,
  dateRange,
  searchTerm,
  showFilters,
  hasActiveFilters,
  onAmountRangeChange,
  onRateRangeChange,
  onDateRangeChange,
  onToggleFilters,
  onClearFilters,
}: Readonly<InvestmentFiltersProps>) {
  const filterConfigs = [
    {
      id: "amount",
      value: amountRange,
      onChange: (value: string) =>
        onAmountRangeChange(value as AmountRangeType),
      options: [...FILTER_OPTIONS.AMOUNT_RANGES],
    },
    {
      id: "rate",
      value: rateRange,
      onChange: (value: string) => onRateRangeChange(value as RateRangeType),
      options: [...FILTER_OPTIONS.INVESTMENT_RATES],
    },
    {
      id: "date",
      value: dateRange,
      onChange: (value: string) => onDateRangeChange(value as DateRangeType),
      options: [...FILTER_OPTIONS.DATE_RANGES],
    },
  ];

  const activeFiltersCount = [
    amountRange !== "all",
    rateRange !== "all",
    dateRange !== "all",
    searchTerm,
  ].filter(Boolean).length;

  return (
    <GenericFilters
      showFilters={showFilters}
      hasActiveFilters={hasActiveFilters}
      onToggleFilters={onToggleFilters}
      onClearFilters={onClearFilters}
      filterConfigs={filterConfigs}
      activeFiltersCount={activeFiltersCount}
    />
  );
}
