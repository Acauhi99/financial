import { useState, useCallback } from "react";
import {
  useInvestments,
  useCreateInvestment,
  useInvestmentTotals,
  usePaginationLoading,
} from "../../hooks";
import { useGenericForm } from "../../hooks/useGenericForm";
import { investmentSchema } from "../../schemas/validation";
import { useGenericFilterState } from "../../hooks/useGenericFilterState";
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
  const createMutation = useCreateInvestment();
  const formHook = useGenericForm(
    { name: "", amount: "", rate: "" },
    investmentSchema,
    (data) =>
      createMutation.mutateAsync({
        name: data.name,
        amount: parseFloat(data.amount),
        rate: parseFloat(data.rate),
        date: new Date().toISOString().split("T")[0],
      })
  );
  const { data: totals } = useInvestmentTotals();
  const filterState = useGenericFilterState({
    amountRange: "all" as
      | "all"
      | "0-100"
      | "100-500"
      | "500-1000"
      | "1000-5000"
      | "5000+",
    rateRange: "all" as "all" | "0-50" | "50-80" | "80-100" | "100+",
    dateRange: "all" as "all" | "today" | "week" | "month" | "3months",
  });

  const filterFn = useCallback(
    (investment: Investment) => {
      if (
        !filterByAmountRange(
          investment.amount,
          filterState.customFilters.amountRange
        )
      ) {
        return false;
      }
      if (
        !filterByRateRange(investment.rate, filterState.customFilters.rateRange)
      ) {
        return false;
      }
      if (
        !filterByDateRange(investment.date, filterState.customFilters.dateRange)
      ) {
        return false;
      }
      return true;
    },
    [
      filterState.customFilters.amountRange,
      filterState.customFilters.rateRange,
      filterState.customFilters.dateRange,
    ]
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
