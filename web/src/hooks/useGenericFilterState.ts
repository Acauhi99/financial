import { useState } from "react";

export function useGenericFilterState<T extends Record<string, unknown>>(
  initialCustomFilters: T
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [customFilters, setCustomFilters] = useState<T>(initialCustomFilters);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const setCustomFilter = <K extends keyof T>(key: K, value: T[K]) => {
    setCustomFilters((prev) => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    Object.values(customFilters as Record<string, unknown>).some((value) =>
      Array.isArray(value) ? value.length > 0 : value !== "all"
    );

  const clearFilters = () => {
    setSearchTerm("");
    setShowFilters(false);
    setCustomFilters(initialCustomFilters);
  };

  return {
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    sortBy,
    sortOrder,
    handleSort,
    customFilters,
    setCustomFilter,
    hasActiveFilters,
    clearFilters,
  };
}
