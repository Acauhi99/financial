export interface GenericFormHook<T> {
  values: T;
  errors: Record<string, string>;
  isLoading: boolean;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  handleSubmit: () => Promise<void>;
}

export interface GenericFilterState<T> {
  searchTerm: string;
  showFilters: boolean;
  hasActiveFilters: boolean;
  customFilters: T;
  setCustomFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  setSearchTerm: (term: string) => void;
  setShowFilters: (show: boolean) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  handleSort: (key: string) => void;
  clearFilters: () => void;
}

export interface TransactionFormData {
  description: string;
  amount: string;
  type: "income" | "expense";
}

export interface InvestmentFormData {
  name: string;
  amount: string;
  rate: string;
}

export interface TransactionFilters {
  filterType: "all" | "income" | "expense";
  amountRange: "all" | "0-100" | "100-500" | "500-1000" | "1000-5000" | "5000+";
  dateRange: "all" | "today" | "week" | "month" | "3months";
}

export interface InvestmentFilters {
  amountRange: "all" | "0-100" | "100-500" | "500-1000" | "1000-5000" | "5000+";
  rateRange: "all" | "0-50" | "50-80" | "80-100" | "100+";
  dateRange: "all" | "today" | "week" | "month" | "3months";
}
