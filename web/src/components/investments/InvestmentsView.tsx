import { CSS_CLASSES } from "../../utils/constants";
import {
  InvestmentsSummary,
  InvestmentForm,
  InvestmentsList,
  InvestmentFilters,
  investmentColumns,
} from ".";
import { Loading } from "../ui";
import { type Investment, type PaginatedResponse } from "../../services/api";
import {
  type GenericFormHook,
  type GenericFilterState,
  type InvestmentFormData,
  type InvestmentFilters as IFilters,
} from "../../types/hooks";

interface InvestmentsViewProps {
  data: PaginatedResponse<Investment> | undefined;
  filteredData: Investment[];
  totals:
    | { totalInvested: number; totalMonthlyReturn: number; averageRate: number }
    | undefined;
  isLoading: boolean;
  error: Error | null;
  paginationLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  setCurrentPage: (page: number) => void;
  formHook: GenericFormHook<InvestmentFormData>;
  filterState: GenericFilterState<IFilters>;
  onClearFilters: () => void;
}

export function InvestmentsView({
  filteredData,
  totals,
  isLoading,
  error,
  paginationLoading,
  currentPage,
  itemsPerPage,
  onPageChange,
  setCurrentPage,
  formHook,
  filterState,
  onClearFilters,
}: Readonly<InvestmentsViewProps>) {
  const {
    totalInvested = 0,
    totalMonthlyReturn = 0,
    averageRate = 0,
  } = totals || {};

  const filters = (
    <InvestmentFilters
      amountRange={filterState.customFilters.amountRange}
      rateRange={filterState.customFilters.rateRange}
      dateRange={filterState.customFilters.dateRange}
      searchTerm={filterState.searchTerm}
      showFilters={filterState.showFilters}
      hasActiveFilters={filterState.hasActiveFilters}
      onAmountRangeChange={(range) => {
        filterState.setCustomFilter("amountRange", range);
        onPageChange(1);
      }}
      onRateRangeChange={(range) => {
        filterState.setCustomFilter("rateRange", range);
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
        Erro ao carregar dados dos investimentos
      </div>
    );
  }

  return (
    <div className={CSS_CLASSES.LAYOUT_MAIN}>
      <div className={CSS_CLASSES.PAGE_HEADER}>
        <h1 className={CSS_CLASSES.PAGE_TITLE}>Investimentos</h1>
        <p className={CSS_CLASSES.PAGE_SUBTITLE}>
          Acompanhe seus investimentos e rendimentos
        </p>
      </div>

      <InvestmentsSummary
        totalInvested={totalInvested}
        totalMonthlyReturn={totalMonthlyReturn}
        averageRate={averageRate}
      />

      <InvestmentForm
        name={formHook.values.name}
        amount={formHook.values.amount}
        rate={formHook.values.rate}
        isLoading={formHook.isLoading}
        errors={formHook.errors}
        onNameChange={(value) => formHook.setValue("name", value)}
        onAmountChange={(value) => formHook.setValue("amount", value)}
        onRateChange={(value) => formHook.setValue("rate", value)}
        onSubmit={formHook.handleSubmit}
      />

      <div className={CSS_CLASSES.LAYOUT_CONTENT}>
        <InvestmentsList
          data={filteredData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )}
          columns={investmentColumns}
          isLoading={isLoading}
          error={error}
          searchTerm={filterState.searchTerm}
          onSearchChange={(value) => {
            filterState.setSearchTerm(value);
            setCurrentPage(1);
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
