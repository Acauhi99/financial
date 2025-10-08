import { FILTER_OPTIONS } from "../../utils/constants";
import { GenericFilters } from "../ui/GenericFilters";

type FilterType = "all" | "income" | "expense";
type AmountRangeType =
  | "all"
  | "0-100"
  | "100-500"
  | "500-1000"
  | "1000-5000"
  | "5000+";
type DateRangeType = "all" | "today" | "week" | "month" | "3months";

interface TransactionFiltersProps {
  filterType: FilterType;
  amountRange: AmountRangeType;
  dateRange: DateRangeType;
  searchTerm: string;
  showFilters: boolean;
  hasActiveFilters: boolean | string;
  onFilterTypeChange: (type: FilterType) => void;
  onAmountRangeChange: (range: AmountRangeType) => void;
  onDateRangeChange: (range: DateRangeType) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

export function TransactionFilters({
  filterType,
  amountRange,
  dateRange,
  searchTerm,
  showFilters,
  hasActiveFilters,
  onFilterTypeChange,
  onAmountRangeChange,
  onDateRangeChange,
  onToggleFilters,
  onClearFilters,
}: Readonly<TransactionFiltersProps>) {
  const filterConfigs = [
    {
      id: "type",
      value: filterType,
      onChange: (value: string) => onFilterTypeChange(value as FilterType),
      options: [...FILTER_OPTIONS.TRANSACTION_TYPES],
    },
    {
      id: "amount",
      value: amountRange,
      onChange: (value: string) =>
        onAmountRangeChange(value as AmountRangeType),
      options: [...FILTER_OPTIONS.AMOUNT_RANGES],
    },
    {
      id: "date",
      value: dateRange,
      onChange: (value: string) => onDateRangeChange(value as DateRangeType),
      options: [...FILTER_OPTIONS.DATE_RANGES],
    },
  ];

  const activeFiltersCount = [
    filterType !== "all",
    amountRange !== "all",
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
