import { Filter, X } from "lucide-react";
import { FILTER_OPTIONS, CSS_CLASSES } from "../../constants";

type AmountRangeType =
  | "all"
  | "0-100"
  | "100-500"
  | "500-1000"
  | "1000-5000"
  | "5000+";
type RateRangeType = "all" | "0-50" | "50-80" | "80-100" | "100+";

interface InvestmentFiltersProps {
  amountRange: AmountRangeType;
  rateRange: RateRangeType;
  searchTerm: string;
  showFilters: boolean;
  hasActiveFilters: boolean | string;
  onAmountRangeChange: (range: AmountRangeType) => void;
  onRateRangeChange: (range: RateRangeType) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

export function InvestmentFilters({
  amountRange,
  rateRange,
  searchTerm,
  showFilters,
  hasActiveFilters,
  onAmountRangeChange,
  onRateRangeChange,
  onToggleFilters,
  onClearFilters,
}: Readonly<InvestmentFiltersProps>) {
  return (
    <>
      <button
        onClick={onToggleFilters}
        className={`flex items-center space-x-2 px-3 py-2 border rounded-md text-sm font-medium transition-colors cursor-pointer ${
          hasActiveFilters
            ? "border-gray-500 bg-gray-100 text-gray-700"
            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filtros</span>
        {hasActiveFilters && (
          <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {
              [amountRange !== "all", rateRange !== "all", searchTerm].filter(
                Boolean
              ).length
            }
          </span>
        )}
      </button>

      {showFilters && (
        <div className="flex flex-wrap gap-2">
          <select
            value={amountRange}
            onChange={(e) =>
              onAmountRangeChange(e.target.value as AmountRangeType)
            }
            className={CSS_CLASSES.SELECT}
          >
            {FILTER_OPTIONS.AMOUNT_RANGES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={rateRange}
            onChange={(e) => onRateRangeChange(e.target.value as RateRangeType)}
            className={CSS_CLASSES.SELECT}
          >
            {FILTER_OPTIONS.INVESTMENT_RATES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 bg-white cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
