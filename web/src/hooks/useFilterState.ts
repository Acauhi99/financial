import { useState } from "react";

export function useFilterState() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setShowFilters(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    sortBy,
    sortOrder,
    handleSort,
    clearFilters,
  };
}
