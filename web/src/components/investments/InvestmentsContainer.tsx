import { useState, useCallback } from "react";
import {
  useInvestments,
  useInvestmentForm,
  useInvestmentTotals,
  usePaginationLoading,
} from "../../hooks";
import { useInvestmentFilterState } from "../../hooks/useInvestmentFilterState";
import { useFilterLogic } from "../../hooks/useFilterLogic";
import {
  filterByAmountRange,
  filterByRateRange,
  filterByDateRange,
} from "../../utils/filters";
import { type Investment } from "../../services/api";
import { PAGINATION } from "../../utils/constants";
import { InvestmentsView } from "./InvestmentsView";

export function InvestmentsContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;

  const { data, isLoading, error } = useInvestments(
    currentPage,
    itemsPerPage,
    ""
  );
  const paginationLoading = usePaginationLoading(isLoading, currentPage);
  const formHook = useInvestmentForm();
  const { data: totals } = useInvestmentTotals();
  const filterState = useInvestmentFilterState();

  const filterFn = useCallback(
    (investment: Investment) => {
      if (!filterByAmountRange(investment.amount, filterState.amountRange)) {
        return false;
      }
      if (!filterByRateRange(investment.rate, filterState.rateRange)) {
        return false;
      }
      if (!filterByDateRange(investment.date, filterState.dateRange)) {
        return false;
      }
      return true;
    },
    [filterState.amountRange, filterState.rateRange, filterState.dateRange]
  );

  const searchFn = useCallback((investment: Investment, term: string) => {
    return investment.name.toLowerCase().includes(term.toLowerCase());
  }, []);

  const filteredData = useFilterLogic({
    data: data?.data,
    searchTerm: filterState.searchTerm,
    sortBy: filterState.sortBy,
    sortOrder: filterState.sortOrder,
    filterFn,
    searchFn,
  });

  const handleClearFilters = () => {
    filterState.clearFilters();
    setCurrentPage(1);
  };

  return (
    <InvestmentsView
      data={data}
      filteredData={filteredData}
      totals={totals}
      isLoading={isLoading}
      error={error}
      paginationLoading={paginationLoading}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      formHook={formHook}
      filterState={filterState}
      onClearFilters={handleClearFilters}
    />
  );
}
