import { useMemo } from "react";

interface FilterLogicProps<T> {
  data: T[] | undefined;
  searchTerm: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  filterFn: (item: T) => boolean;
  searchFn: (item: T, term: string) => boolean;
}

export function useFilterLogic<T>({
  data,
  searchTerm,
  sortBy,
  sortOrder,
  filterFn,
  searchFn,
}: FilterLogicProps<T>) {
  return useMemo(() => {
    if (!data) {
      return [];
    }

    let filtered = data.filter(filterFn);

    if (searchTerm) {
      filtered = filtered.filter((item) => searchFn(item, searchTerm));
    }

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sortBy];
        const bValue = (b as Record<string, unknown>)[sortBy];

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
    }

    return filtered;
  }, [data, searchTerm, sortBy, sortOrder, filterFn, searchFn]);
}
