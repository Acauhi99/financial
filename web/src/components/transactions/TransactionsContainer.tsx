import { useState, useCallback } from "react";
import {
  useTransactions,
  useTransactionForm,
  useTransactionTotals,
  usePaginationLoading,
} from "../../hooks";
import { useTransactionFilterState } from "../../hooks/useTransactionFilterState";
import { useFilterLogic } from "../../hooks/useFilterLogic";
import { filterByAmountRange, filterByDateRange } from "../../utils/filters";
import { type Transaction } from "../../services/api";
import { PAGINATION } from "../../utils/constants";
import { TransactionsView } from "./TransactionsView";

export function TransactionsContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;

  const { data, isLoading, error } = useTransactions(
    currentPage,
    itemsPerPage,
    "",
    "all"
  );
  const paginationLoading = usePaginationLoading(isLoading, currentPage);
  const formHook = useTransactionForm();
  const { data: totals } = useTransactionTotals();
  const filterState = useTransactionFilterState();

  const filterFn = useCallback(
    (transaction: Transaction) => {
      if (
        filterState.filterType !== "all" &&
        transaction.type !== filterState.filterType
      ) {
        return false;
      }
      if (!filterByAmountRange(transaction.amount, filterState.amountRange)) {
        return false;
      }
      if (!filterByDateRange(transaction.date, filterState.dateRange)) {
        return false;
      }
      return true;
    },
    [filterState.filterType, filterState.amountRange, filterState.dateRange]
  );

  const searchFn = useCallback((transaction: Transaction, term: string) => {
    return transaction.description.toLowerCase().includes(term.toLowerCase());
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
    <TransactionsView
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
