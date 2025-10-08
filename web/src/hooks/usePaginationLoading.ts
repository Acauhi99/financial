import { useState, useEffect } from "react";

export function usePaginationLoading(isLoading: boolean, currentPage: number) {
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [previousPage, setPreviousPage] = useState(currentPage);

  useEffect(() => {
    if (currentPage !== previousPage) {
      setPaginationLoading(true);
      setPreviousPage(currentPage);
    }
  }, [currentPage, previousPage]);

  useEffect(() => {
    if (!isLoading && paginationLoading) {
      setPaginationLoading(false);
    }
  }, [isLoading, paginationLoading]);

  return paginationLoading;
}
