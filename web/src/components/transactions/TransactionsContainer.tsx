import { useState, useMemo } from "react";
import {
  useTransactions,
  useCreateTransaction,
  useTransactionTotals,
  usePaginationLoading,
} from "../../hooks";
import { useGenericForm } from "../../hooks/useGenericForm";
import { transactionSchema } from "../../schemas/validation";
import { useGenericFilterState } from "../../hooks/useGenericFilterState";
import { useFilterLogic } from "../../hooks/useFilterLogic";
import { filterByAmountRange, filterByDateRange } from "../../utils/filters";
import { type Transaction } from "../../services/api";
import { PAGINATION } from "../../utils/constants";
import { TransactionsView } from "./TransactionsView";

export function TransactionsContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;

  const { data, isLoading, error } = useTransactions(1, 1000, "", "all");
  const paginationLoading = usePaginationLoading(isLoading, currentPage);
  const createMutation = useCreateTransaction();
  const formHook = useGenericForm(
    { description: "", amount: "", type: "expense" as "income" | "expense" },
    transactionSchema,
    (data) =>
      createMutation.mutateAsync({
        type: data.type,
        description: data.description,
        amount: parseFloat(data.amount),
        date: new Date().toISOString().split("T")[0],
      })
  );
  const { data: totals } = useTransactionTotals();
  const filterState = useGenericFilterState({
    filterType: "all" as "all" | "income" | "expense",
    amountRange: "all" as
      | "all"
      | "0-100"
      | "100-500"
      | "500-1000"
      | "1000-5000"
      | "5000+",
    dateRange: "all" as
      | "all"
      | "today"
      | "week"
      | "month"
      | "3months"
      | "6months",
  });

  const { filterType, amountRange, dateRange } = filterState.customFilters;

  const filterFn = useMemo(
    () => (transaction: Transaction) => {
      if (filterType !== "all" && transaction.type !== filterType) {
        return false;
      }
      if (!filterByAmountRange(transaction.amount, amountRange)) {
        return false;
      }
      if (!filterByDateRange(transaction.date, dateRange)) {
        return false;
      }
      return true;
    },
    [filterType, amountRange, dateRange]
  );

  const searchFn = useMemo(
    () => (transaction: Transaction, term: string) => {
      return transaction.description.toLowerCase().includes(term.toLowerCase());
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
    <TransactionsView
      data={data}
      filteredData={filteredData}
      totals={totals}
      isLoading={isLoading}
      error={error}
      paginationLoading={paginationLoading}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      setCurrentPage={setCurrentPage}
      formHook={formHook}
      filterState={filterState}
      onClearFilters={handleClearFilters}
    />
  );
}
