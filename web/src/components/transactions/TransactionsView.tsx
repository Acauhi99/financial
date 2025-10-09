import { CSS_CLASSES } from "../../utils/constants";
import {
  TransactionsSummary,
  TransactionForm,
  TransactionsList,
  TransactionFilters,
  transactionColumns,
} from ".";
import { Loading } from "../ui";
import { type Transaction, type PaginatedResponse } from "../../services/api";
import {
  type GenericFormHook,
  type GenericFilterState,
  type TransactionFormData,
  type TransactionFilters as TFilters,
} from "../../types/hooks";

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
  itemsPerPage: number;
  onPageChange: (page: number) => void;

  formHook: GenericFormHook<TransactionFormData>;
  filterState: GenericFilterState<TFilters>;
  onClearFilters: () => void;
}

export function TransactionsView({
  filteredData,
  totals,
  isLoading,
  error,
  paginationLoading,
  currentPage,
  itemsPerPage,
  onPageChange,

  formHook,
  filterState,
  onClearFilters,
}: Readonly<TransactionsViewProps>) {
  const { totalIncome = 0, totalExpenses = 0, balance = 0 } = totals || {};

  const filters = (
    <TransactionFilters
      filterType={filterState.customFilters.filterType}
      amountRange={filterState.customFilters.amountRange}
      dateRange={filterState.customFilters.dateRange}
      searchTerm={filterState.searchTerm}
      showFilters={filterState.showFilters}
      hasActiveFilters={filterState.hasActiveFilters}
      onFilterTypeChange={(type) => {
        filterState.setCustomFilter("filterType", type);
        onPageChange(1);
      }}
      onAmountRangeChange={(range) => {
        filterState.setCustomFilter("amountRange", range);
        onPageChange(1);
      }}
      onDateRangeChange={(range) => {
        filterState.setCustomFilter("dateRange", range);
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
        description={formHook.values.description}
        amount={formHook.values.amount}
        type={formHook.values.type}
        isLoading={formHook.isLoading}
        errors={formHook.errors}
        onDescriptionChange={(value) => formHook.setValue("description", value)}
        onAmountChange={(value) => formHook.setValue("amount", value)}
        onTypeChange={(value) => formHook.setValue("type", value)}
        onSubmit={formHook.handleSubmit}
      />

      <div className={CSS_CLASSES.LAYOUT_CONTENT}>
        <TransactionsList
          data={filteredData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )}
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
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          onPageChange={onPageChange}
          filters={filters}
          hasActiveFilters={filterState.hasActiveFilters}
          onClearFilters={onClearFilters}
          totalItems={filteredData.length}
          paginationLoading={paginationLoading}
        />
      </div>
    </div>
  );
}
