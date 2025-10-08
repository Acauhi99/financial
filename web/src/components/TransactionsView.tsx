import { CSS_CLASSES } from "../utils/constants";
import {
  TransactionsSummary,
  TransactionForm,
  TransactionsList,
  TransactionFilters,
  transactionColumns,
} from "./transactions";
import { Loading } from "./ui";
import { type Transaction, type PaginatedResponse } from "../services/api";

interface TransactionsViewProps {
  data: PaginatedResponse<Transaction> | undefined;
  filteredData: Transaction[];
  totals:
    | { totalIncome: number; totalExpenses: number; balance: number }
    | undefined;
  isLoading: boolean;
  error: Error | null;
  paginationLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  formHook: {
    description: string;
    amount: string;
    type: "income" | "expense";
    isLoading: boolean;
    errors: Record<string, string>;
    setDescription: (value: string) => void;
    setAmount: (value: string) => void;
    setType: (type: "income" | "expense") => void;
    addTransaction: () => void;
  };
  filterState: {
    filterType: "all" | "income" | "expense";
    amountRange:
      | "all"
      | "0-100"
      | "100-500"
      | "500-1000"
      | "1000-5000"
      | "5000+";
    dateRange: "all" | "today" | "week" | "month" | "3months";
    searchTerm: string;
    showFilters: boolean;
    hasActiveFilters: boolean;
    setFilterType: (type: "all" | "income" | "expense") => void;
    setAmountRange: (
      range: "all" | "0-100" | "100-500" | "500-1000" | "1000-5000" | "5000+"
    ) => void;
    setDateRange: (
      range: "all" | "today" | "week" | "month" | "3months"
    ) => void;
    setSearchTerm: (term: string) => void;
    setShowFilters: (show: boolean) => void;
    sortBy: string;
    sortOrder: "asc" | "desc";
    handleSort: (key: string) => void;
  };
  onClearFilters: () => void;
}

export function TransactionsView({
  data,
  filteredData,
  totals,
  isLoading,
  error,
  paginationLoading,
  currentPage,
  onPageChange,
  formHook,
  filterState,
  onClearFilters,
}: Readonly<TransactionsViewProps>) {
  const { totalIncome = 0, totalExpenses = 0, balance = 0 } = totals || {};

  const filters = (
    <TransactionFilters
      filterType={filterState.filterType}
      amountRange={filterState.amountRange}
      dateRange={filterState.dateRange}
      searchTerm={filterState.searchTerm}
      showFilters={filterState.showFilters}
      hasActiveFilters={filterState.hasActiveFilters}
      onFilterTypeChange={(type) => {
        filterState.setFilterType(type);
        onPageChange(1);
      }}
      onAmountRangeChange={(range) => {
        filterState.setAmountRange(range);
        onPageChange(1);
      }}
      onDateRangeChange={(range) => {
        filterState.setDateRange(range);
        onPageChange(1);
      }}
      onToggleFilters={() =>
        filterState.setShowFilters(!filterState.showFilters)
      }
      onClearFilters={onClearFilters}
    />
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className={CSS_CLASSES.ERROR_MESSAGE}>
        Erro ao carregar dados das transações
      </div>
    );
  }

  return (
    <div className={CSS_CLASSES.LAYOUT_MAIN}>
      <div className={CSS_CLASSES.PAGE_HEADER}>
        <h1 className={CSS_CLASSES.PAGE_TITLE}>Transações</h1>
        <p className={CSS_CLASSES.PAGE_SUBTITLE}>
          Gerencie suas receitas e despesas
        </p>
      </div>

      <TransactionsSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />

      <TransactionForm
        description={formHook.description}
        amount={formHook.amount}
        type={formHook.type}
        isLoading={formHook.isLoading}
        errors={formHook.errors}
        onDescriptionChange={formHook.setDescription}
        onAmountChange={formHook.setAmount}
        onTypeChange={formHook.setType}
        onSubmit={formHook.addTransaction}
      />

      <div className={CSS_CLASSES.LAYOUT_CONTENT}>
        <TransactionsList
          data={filteredData}
          columns={transactionColumns}
          isLoading={isLoading}
          error={error}
          searchTerm={filterState.searchTerm}
          onSearchChange={(value) => {
            filterState.setSearchTerm(value);
            onPageChange(1);
          }}
          sortBy={filterState.sortBy}
          sortOrder={filterState.sortOrder}
          onSort={filterState.handleSort}
          currentPage={currentPage}
          totalPages={data?.pagination.totalPages || 1}
          onPageChange={onPageChange}
          filters={filters}
          hasActiveFilters={filterState.hasActiveFilters}
          onClearFilters={onClearFilters}
          totalItems={data?.pagination.total || 0}
          paginationLoading={paginationLoading}
        />
      </div>
    </div>
  );
}
