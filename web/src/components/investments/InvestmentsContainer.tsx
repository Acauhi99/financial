import { useState, useMemo } from "react";
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

  const { data, isLoading, error } = useInvestments(1, 100, "");
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
    dateRange: "all" as
      | "all"
      | "today"
      | "week"
      | "month"
      | "3months"
      | "6months",
  });

  const { amountRange, rateRange, dateRange } = filterState.customFilters;

  const filterFn = useMemo(
    () => (investment: Investment) => {
      if (!filterByAmountRange(investment.amount, amountRange)) {
        return false;
      }
      if (!filterByRateRange(investment.rate, rateRange)) {
        return false;
      }
      if (!filterByDateRange(investment.date, dateRange)) {
        return false;
      }
      return true;
    },
    [amountRange, rateRange, dateRange]
  );

  const searchFn = useMemo(
    () => (investment: Investment, term: string) => {
      return investment.name.toLowerCase().includes(term.toLowerCase());
    },
    []
  );

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
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      formHook={formHook}
      filterState={filterState}
      onClearFilters={handleClearFilters}
    />
  );
}
