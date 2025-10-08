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
  onPageChange: (page: number) => void;
  formHook: {
    name: string;
    amount: string;
    rate: string;
    isLoading: boolean;
    errors: Record<string, string>;
    setName: (value: string) => void;
    setAmount: (value: string) => void;
    setRate: (value: string) => void;
    addInvestment: () => void;
  };
  filterState: {
    amountRange:
      | "all"
      | "0-100"
      | "100-500"
      | "500-1000"
      | "1000-5000"
      | "5000+";
    rateRange: "all" | "0-50" | "50-80" | "80-100" | "100+";
    dateRange: "all" | "today" | "week" | "month" | "3months";
    searchTerm: string;
    showFilters: boolean;
    hasActiveFilters: boolean;
    setAmountRange: (
      range: "all" | "0-100" | "100-500" | "500-1000" | "1000-5000" | "5000+"
    ) => void;
    setRateRange: (range: "all" | "0-50" | "50-80" | "80-100" | "100+") => void;
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

export function InvestmentsView({
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
}: Readonly<InvestmentsViewProps>) {
  const {
    totalInvested = 0,
    totalMonthlyReturn = 0,
    averageRate = 0,
  } = totals || {};

  const filters = (
    <InvestmentFilters
      amountRange={filterState.amountRange}
      rateRange={filterState.rateRange}
      dateRange={filterState.dateRange}
      searchTerm={filterState.searchTerm}
      showFilters={filterState.showFilters}
      hasActiveFilters={filterState.hasActiveFilters}
      onAmountRangeChange={(range) => {
        filterState.setAmountRange(range);
        onPageChange(1);
      }}
      onRateRangeChange={(range) => {
        filterState.setRateRange(range);
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
        name={formHook.name}
        amount={formHook.amount}
        rate={formHook.rate}
        isLoading={formHook.isLoading}
        errors={formHook.errors}
        onNameChange={formHook.setName}
        onAmountChange={formHook.setAmount}
        onRateChange={formHook.setRate}
        onSubmit={formHook.addInvestment}
      />

      <div className={CSS_CLASSES.LAYOUT_CONTENT}>
        <InvestmentsList
          data={filteredData}
          columns={investmentColumns}
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
