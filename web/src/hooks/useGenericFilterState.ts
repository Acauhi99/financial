import { useState, useMemo, useCallback } from "react";

export function useGenericFilterState<T extends Record<string, unknown>>(
  initialCustomFilters: T
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [customFilters, setCustomFilters] = useState<T>(initialCustomFilters);

  const handleSort = useCallback(
    (key: string) => {
      if (sortBy === key) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(key);
        setSortOrder("asc");
      }
    },
    [sortBy, sortOrder]
  );

  const setCustomFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setCustomFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const hasActiveFilters = useMemo(
    () =>
      searchTerm !== "" ||
      Object.values(customFilters as Record<string, unknown>).some((value) =>
        Array.isArray(value) ? value.length > 0 : value !== "all"
      ),
    [searchTerm, customFilters]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setShowFilters(false);
    setCustomFilters(initialCustomFilters);
  }, [initialCustomFilters]);

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
