import { Filter, X } from "lucide-react";
import { CSS_CLASSES } from "../../utils/constants";

interface FilterOption {
  value: string;
  label: string;
}

interface GenericFiltersProps {
  showFilters: boolean;
  hasActiveFilters: boolean | string;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  filterConfigs: Array<{
    id: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
  }>;
  activeFiltersCount: number;
}

export function GenericFilters({
  showFilters,
  hasActiveFilters,
  onToggleFilters,
  onClearFilters,
  filterConfigs,
  activeFiltersCount,
}: Readonly<GenericFiltersProps>) {
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
            {activeFiltersCount}
          </span>
        )}
      </button>

      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {filterConfigs.map((config) => (
            <select
              key={config.id}
              value={config.value}
              onChange={(e) => config.onChange(e.target.value)}
              className={`${CSS_CLASSES.SELECT} cursor-pointer`}
            >
              {config.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}

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
