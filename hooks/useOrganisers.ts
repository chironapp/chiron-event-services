import { useCallback, useEffect, useState } from "react";
import {
  fetchOrganisers,
  type FetchOrganisersParams,
  type FetchOrganisersResponse,
} from "../api/organisers";
import type { Organiser } from "../lib/supabase";

/**
 * Custom hook for managing organisers data fetching with pagination
 * Provides loading states, error handling, and data management
 */
export function useOrganisers(initialParams: FetchOrganisersParams = {}) {
  const [data, setData] = useState<Organiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [params, setParams] = useState<FetchOrganisersParams>(initialParams);

  /**
   * Fetch organisers data
   */
  const fetchData = useCallback(
    async (fetchParams?: FetchOrganisersParams) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = fetchParams || params;
        const response: FetchOrganisersResponse = await fetchOrganisers(
          queryParams
        );

        setData(response.data);
        setPagination({
          count: response.count,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch organisers";
        setError(errorMessage);
        console.error("Error fetching organisers:", err);
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  /**
   * Update search parameters and refetch
   */
  const updateParams = useCallback(
    (newParams: Partial<FetchOrganisersParams>) => {
      const updatedParams = { ...params, ...newParams };
      setParams(updatedParams);
      fetchData(updatedParams);
    },
    [params, fetchData]
  );

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      updateParams({ page: pagination.page + 1 });
    }
  }, [pagination.hasNextPage, pagination.page, updateParams]);

  /**
   * Go to previous page
   */
  const previousPage = useCallback(() => {
    if (pagination.hasPreviousPage) {
      updateParams({ page: pagination.page - 1 });
    }
  }, [pagination.hasPreviousPage, pagination.page, updateParams]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) {
        updateParams({ page });
      }
    },
    [pagination.totalPages, updateParams]
  );

  /**
   * Update search term
   */
  const setSearch = useCallback(
    (search: string) => {
      updateParams({ search, page: 1 }); // Reset to first page when searching
    },
    [updateParams]
  );

  /**
   * Update sorting
   */
  const setSorting = useCallback(
    (
      sortBy: FetchOrganisersParams["sortBy"],
      sortOrder: FetchOrganisersParams["sortOrder"]
    ) => {
      updateParams({ sortBy, sortOrder, page: 1 }); // Reset to first page when sorting
    },
    [updateParams]
  );

  /**
   * Refresh data with current parameters
   */
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []); // Only run on mount

  return {
    // Data
    data,
    loading,
    error,
    pagination,
    params,

    // Actions
    refresh,
    nextPage,
    previousPage,
    goToPage,
    setSearch,
    setSorting,
    updateParams,
  };
}
