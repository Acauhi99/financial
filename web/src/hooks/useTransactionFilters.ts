import { useState, useMemo } from "react";
import { type Transaction } from "../services/api";
import { filterByAmountRange } from "../constants";

type FilterType = "all" | "income" | "expense";
type AmountRangeType =
  | "all"
  | "0-100"
  | "100-500"
  | "500-1000"
  | "1000-5000"
  | "5000+";
type SortableValue = string | number | Date;

export function useTransactionFilters(data: Transaction[] = []) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [amountRange, setAmountRange] = useState<AmountRangeType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"description" | "amount" | "type">(
    "description"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...data];

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (amountRange !== "all") {
      filtered = filtered.filter((t) =>
        filterByAmountRange(t.amount, amountRange)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      const aValue: SortableValue = a[sortBy as keyof Transaction];
      const bValue: SortableValue = b[sortBy as keyof Transaction];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
    return sorted;
  }, [data, sortBy, sortOrder, filterType, amountRange, searchTerm]);

  const clearFilters = () => {
    setFilterType("all");
    setAmountRange("all");
    setSearchTerm("");
  };

  const hasActiveFilters =
    filterType !== "all" || amountRange !== "all" || searchTerm;

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key as typeof sortBy);
      setSortOrder("asc");
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    amountRange,
    setAmountRange,
    showFilters,
    setShowFilters,
    sortBy,
    sortOrder,
    filteredAndSortedTransactions,
    clearFilters,
    hasActiveFilters,
    handleSort,
  };
}
