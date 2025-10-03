import type { Organiser } from "../lib/supabase";
import { supabase } from "../lib/supabase";

/**
 * API functions for fetching organiser data from Supabase
 * Provides paginated results and error handling
 */

export interface FetchOrganisersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
}

export interface FetchOrganisersResponse {
  data: Organiser[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Fetch organisers with pagination and optional search/sorting
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise<FetchOrganisersResponse> - Paginated organiser data
 *
 * @example
 * ```typescript
 * // Fetch first page with default settings
 * const result = await fetchOrganisers();
 *
 * // Fetch specific page with search
 * const result = await fetchOrganisers({
 *   page: 2,
 *   limit: 10,
 *   search: 'running club',
 *   sortBy: 'name',
 *   sortOrder: 'asc'
 * });
 * ```
 */
export async function fetchOrganisers(
  params: FetchOrganisersParams = {}
): Promise<FetchOrganisersResponse> {
  const {
    page = 1,
    limit = 20,
    search = "",
    sortBy = "name",
    sortOrder = "asc",
  } = params;

  try {
    // Calculate pagination offset
    const offset = (page - 1) * limit;

    // Build the base query
    let query = supabase.from("organisers").select("*", { count: "exact" });

    // Add search filter if provided
    if (search.trim()) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch organisers: ${error.message}`);
    }

    // Calculate pagination metadata
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: data || [],
      count: totalCount,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  } catch (error) {
    console.error("Error fetching organisers:", error);
    throw error;
  }
}

/**
 * Fetch a single organiser by ID
 *
 * @param id - The organiser ID
 * @returns Promise<Organiser | null> - The organiser data or null if not found
 */
export async function fetchOrganiserById(
  id: string
): Promise<Organiser | null> {
  try {
    const { data, error } = await supabase
      .from("organisers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      throw new Error(`Failed to fetch organiser: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching organiser by ID:", error);
    throw error;
  }
}

/**
 * Get the total count of organisers (useful for analytics)
 *
 * @returns Promise<number> - Total number of organisers
 */
export async function getOrganisersCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("organisers")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new Error(`Failed to get organisers count: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error("Error getting organisers count:", error);
    throw error;
  }
}
