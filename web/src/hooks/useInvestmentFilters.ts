import { useState, useMemo } from "react";
import { type Investment } from "../services/api";
import { filterByAmountRange, filterByRateRange } from "../utils/filters";

type AmountRangeType =
  | "all"
  | "0-100"
  | "100-500"
  | "500-1000"
  | "1000-5000"
  | "5000+";
type RateRangeType = "all" | "0-50" | "50-80" | "80-100" | "100+";

export function useInvestmentFilters(data: Investment[] = []) {
  const [searchTerm, setSearchTerm] = useState("");
  const [amountRange, setAmountRange] = useState<AmountRangeType>("all");
  const [rateRange, setRateRange] = useState<RateRangeType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "amount" | "rate" | "monthlyReturn"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredAndSortedInvestments = useMemo(() => {
    let filtered = [...data];

    if (amountRange !== "all") {
      filtered = filtered.filter((inv) =>
        filterByAmountRange(inv.amount, amountRange)
      );
    }

    if (rateRange !== "all") {
      filtered = filtered.filter((inv) =>
        filterByRateRange(inv.rate, rateRange)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((inv) =>
        inv.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      const aValue = a[sortBy as keyof Investment];
      const bValue = b[sortBy as keyof Investment];

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
  }, [data, sortBy, sortOrder, amountRange, rateRange, searchTerm]);

  const clearFilters = () => {
    setAmountRange("all");
    setRateRange("all");
    setSearchTerm("");
  };

  const hasActiveFilters =
    amountRange !== "all" || rateRange !== "all" || searchTerm;

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
    amountRange,
    setAmountRange,
    rateRange,
    setRateRange,
    showFilters,
    setShowFilters,
    sortBy,
    sortOrder,
    filteredAndSortedInvestments,
    clearFilters,
    hasActiveFilters,
    handleSort,
  };
}
