import { useState, useEffect, useMemo } from 'react';

interface UsePaginationOptions {
  defaultPerPage?: number;
}

export function usePagination<T>(
  items: T[],
  options: UsePaginationOptions = {}
) {
  const { defaultPerPage = 6 } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / perPage)),
    [items.length, perPage]
  );

  // Reset to page 1 whenever the filtered list length changes (e.g. after search/filter)
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Clamp current page when totalPages shrinks
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, currentPage, perPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    // smooth scroll to top of the list on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    perPage,
    paginatedItems,
    totalItems: items.length,
    onPageChange: handlePageChange,
    onPerPageChange: handlePerPageChange,
  };
}
