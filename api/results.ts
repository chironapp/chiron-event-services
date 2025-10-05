import type { RaceStartListResult } from "../lib/supabase";
import { supabase } from "../lib/supabase";

/**
 * API functions for fetching race start list and results data from Supabase
 * Provides paginated results and error handling
 */

export interface FetchResultsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "position" | "race_number" | "first_name" | "finish_time100";
  sortOrder?: "asc" | "desc";
  eventId: string;
}

export interface FetchResultsResponse {
  data: RaceStartListResult[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Fetch race start list or results with pagination and optional search/sorting
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise<FetchResultsResponse> - Paginated results data
 *
 * @example
 * ```typescript
 * // Fetch first page with default settings
 * const result = await fetchRaceResults({ eventId: 'event-123' });
 *
 * // Fetch specific page with search
 * const result = await fetchRaceResults({
 *   eventId: 'event-123',
 *   page: 2,
 *   limit: 20,
 *   search: 'John',
 *   sortBy: 'position',
 *   sortOrder: 'asc'
 * });
 * ```
 */
export async function fetchRaceResults(
  params: FetchResultsParams
): Promise<FetchResultsResponse> {
  const {
    page = 1,
    limit = 20,
    search = "",
    sortBy = "position",
    sortOrder = "asc",
    eventId,
  } = params;

  try {
    // Calculate pagination offset
    const offset = (page - 1) * limit;

    // Build the base query
    let query = supabase
      .from("race_start_list_results")
      .select("*", { count: "exact" })
      .eq("public_race_event_id", eventId);

    // Add search filter if provided
    if (search.trim()) {
      query = query.or(
        `race_number.eq.${search},first_name.ilike.%${search}%,last_name.ilike.%${search}%`
      );
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch results: ${error.message}`);
    }

    // Calculate pagination metadata
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: (data || []) as RaceStartListResult[],
      count: totalCount,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  } catch (error) {
    console.error("Error fetching race results:", error);
    throw error;
  }
}

/**
 * Get the total count of results for a specific event
 *
 * @param eventId - The event ID
 * @returns Promise<number> - Total number of results
 */
export async function getResultsCount(eventId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("race_start_list_results")
      .select("*", { count: "exact", head: true })
      .eq("public_race_event_id", eventId);

    if (error) {
      throw new Error(`Failed to get results count: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error("Error getting results count:", error);
    throw error;
  }
}
