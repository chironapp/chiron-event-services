import type { PublicRaceEvent } from "../types/race";
import { supabase } from "../lib/supabase";

/**
 * API functions for fetching race event data from Supabase
 * Provides paginated results and error handling
 */

export interface FetchEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "race_start_date" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
}

export interface FetchEventsResponse {
  data: RaceEventWithOrganiser[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Type for race event with populated organiser information
 */
export type RaceEventWithOrganiser = PublicRaceEvent & {
  organisers: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
};

/**
 * Fetch race events with pagination and optional search/sorting
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise<FetchEventsResponse> - Paginated event data
 *
 * @example
 * ```typescript
 * // Fetch first page with default settings
 * const result = await fetchEvents();
 *
 * // Fetch specific page with search
 * const result = await fetchEvents({
 *   page: 2,
 *   limit: 10,
 *   search: 'marathon',
 *   sortBy: 'race_start_date',
 *   sortOrder: 'asc'
 * });
 * ```
 */
export async function fetchEvents(
  params: FetchEventsParams = {}
): Promise<FetchEventsResponse> {
  const {
    page = 1,
    limit = 20,
    search = "",
    sortBy = "race_start_date",
    sortOrder = "asc",
  } = params;

  try {
    // Calculate pagination offset
    const offset = (page - 1) * limit;

    // Build the base query
    let query = supabase
      .from("public_race_events")
      .select(
        `
        id,
        title,
        description,
        race_start_date,
        race_type,
        sport_type,
        race_status,
        registration_url,
        image,
        distance1000,
        created_at,
        updated_at,
        organisers (
          id,
          name,
          logo
        )
      `,
        { count: "exact" }
      );

    // Add search filter if provided
    if (search.trim()) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    // Calculate pagination metadata
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: (data || []) as RaceEventWithOrganiser[],
      count: totalCount,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

/**
 * Fetch a single event by ID
 *
 * @param id - The event ID
 * @returns Promise<RaceEventWithOrganiser | null> - The event data or null if not found
 */
export async function fetchEventById(
  id: string
): Promise<RaceEventWithOrganiser | null> {
  try {
    const { data, error } = await supabase
      .from("public_race_events")
      .select(
        `
        id,
        title,
        description,
        race_start_date,
        race_type,
        sport_type,
        race_status,
        registration_url,
        image,
        distance1000,
        created_at,
        updated_at,
        organisers (
          id,
          name,
          logo
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      throw new Error(`Failed to fetch event: ${error.message}`);
    }

    return data as RaceEventWithOrganiser;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
}

/**
 * Get the total count of events (useful for analytics)
 *
 * @returns Promise<number> - Total number of events
 */
export async function getEventsCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("public_race_events")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new Error(`Failed to get events count: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error("Error getting events count:", error);
    throw error;
  }
}
