// Warning: This file has been synced from chironapp. Do not modify or it will be overwritten.

// api/raceSeriesPublic.ts
import { supabase } from "../lib/supabase";
import type { PublicRaceEventSeries } from "../types/race";
import type { SeriesParticipantData } from "../types/raceSeries";
import { getPagination } from "./utils";

/**
 * Fetch a single public race event series by ID
 * @param seriesId - The series ID to fetch
 * @returns The public race event series with enhanced typing
 *
 * @example
 * ```typescript
 * const series = await fetchPublicRaceEventSeries('series-123');
 * console.log(series?.title);
 * ```
 */
export async function fetchPublicRaceEventSeries(
  seriesId: string
): Promise<PublicRaceEventSeries> {
  try {
    const { data, error } = await supabase
      .from("public_race_event_series")
      .select("*")
      .eq("id", seriesId)
      .single();

    if (error) {
      console.error("Error fetching public race event series:", error);
      throw error;
    }

    return data as PublicRaceEventSeries;
  } catch (error) {
    console.error("Unexpected error fetching public race event series:", error);
    throw error;
  }
}

/**
 * Fetch public race event series for a specific organiser with pagination
 * @param organiserId - The organiser ID
 * @param page - Page number (0-based)
 * @param pageSize - Number of items per page
 * @returns Promise with paginated series data
 * @throws Error if fetch fails
 *
 * @example
 * ```typescript
 * const { data, count, hasMore } = await fetchOrganiserRaceEventSeries(
 *   'organiser-123',
 *   0,
 *   20
 * );
 * console.log(`Found ${count} series`);
 * ```
 */
export async function fetchOrganiserRaceEventSeries(
  organiserId: string,
  page: number = 0,
  pageSize: number = 20
) {
  try {
    const { from, to } = getPagination(page, pageSize);

    const { data, error, count } = await supabase
      .from("public_race_event_series")
      .select("*", { count: "exact" })
      .eq("organiser_id", organiserId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching organiser race event series:", error);
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
      hasMore: (count || 0) > to + 1,
    };
  } catch (error) {
    console.error(
      "Unexpected error fetching organiser race event series:",
      error
    );
    throw error;
  }
}

/**
 * Series participant result with category names for display
 */
export interface SeriesParticipantResult extends SeriesParticipantData {
  age_category_name: string | null;
  sex_category_name: string | null;
}

/**
 * Raw series participant data from Supabase with joined category data
 */
interface SeriesParticipantRaw extends SeriesParticipantData {
  age_category?: { name: string } | null;
  sex_category?: { name: string } | null;
}

/**
 * Fetches series participants with pagination, search, and filtering
 * Similar to fetchRaceStartList but for series_participant table
 *
 * This is a public function that queries the series_participant table
 * which has public read RLS policies.
 *
 * @param seriesId - The ID of the race series
 * @param page - Page number (0-indexed)
 * @param pageSize - Number of items per page
 * @param searchQuery - Search query for first_name or last_name
 * @param sortBy - Field to sort by (default: "last_name")
 * @param sortOrder - Sort order: "asc" or "desc" (default: "asc")
 * @returns Promise with paginated series participants data
 *
 * @throws {Error} When database query fails
 *
 * @example
 * ```typescript
 * const result = await fetchSeriesParticipants(
 *   "series-123",
 *   0,
 *   50,
 *   "john"
 * );
 * console.log(`Found ${result.count} participants`);
 * ```
 */
export async function fetchSeriesParticipants(
  seriesId: string,
  page: number = 0,
  pageSize: number = 50,
  searchQuery?: string,
  sortBy: string = "last_name",
  sortOrder: "asc" | "desc" = "asc"
) {
  try {
    const { from, to } = getPagination(page, pageSize);

    // Build the query with joins for category names
    let query = supabase
      .from("series_participant")
      .select(
        `
        *,
        age_category:race_athlete_categories!series_participant_age_category_id_fkey(name),
        sex_category:race_athlete_categories!series_participant_sex_category_id_fkey(name)
      `,
        { count: "exact" }
      )
      .eq("series_id", seriesId);

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      // Search in first_name or last_name
      query = query.or(
        `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`
      );
    }

    // Apply sorting
    const ascending = sortOrder === "asc";
    query = query.order(sortBy, { ascending });

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching series participants:", error);
      throw error;
    }

    // Transform the data to flatten nested objects
    const transformedData: SeriesParticipantResult[] = (data || []).map(
      (item: SeriesParticipantRaw) => ({
        ...item,
        age_category_name: item.age_category?.name || null,
        sex_category_name: item.sex_category?.name || null,
      })
    );

    return {
      data: transformedData,
      count: count || 0,
      hasMore: (count || 0) > to + 1,
    };
  } catch (error) {
    console.error("Unexpected error fetching series participants:", error);
    throw error;
  }
}

/**
 * Series standings result with flattened category names
 */
export interface SeriesStandingsResult {
  id: string;
  series_id: string;
  series_participant_id: string;
  rank: number | null;
  total_points: number | null;
  average_points: number | null;
  total_time_ms: number | null;
  average_time_ms: number | null;
  races_counted: number;
  created_at: string;
  updated_at: string;
  // Joined participant data
  first_name: string;
  last_name: string;
  sex_category_id: number | null;
  age_category_id: number | null;
  // Flattened category names
  age_category_name: string | null;
  sex_category_name: string | null;
}

/**
 * Raw series standings data from Supabase with joined data
 */
interface SeriesStandingsRaw {
  id: string;
  series_id: string;
  series_participant_id: string;
  rank: number | null;
  total_points: number | null;
  average_points: number | null;
  total_time_ms: number | null;
  average_time_ms: number | null;
  races_counted: number;
  created_at: string;
  updated_at: string;
  series_participant?: {
    first_name: string;
    last_name: string;
    sex_category_id: number | null;
    age_category_id: number | null;
    age_category?: { name: string } | null;
    sex_category?: { name: string } | null;
  } | null;
}

/**
 * Fetches series standings with pagination, filtering, and sorting
 *
 * @param seriesId - The ID of the race series
 * @param page - Page number (0-indexed)
 * @param pageSize - Number of items per page
 * @param searchQuery - Search query for first_name or last_name
 * @param sexCategoryId - Filter by sex category ID (1 = male, 2 = female)
 * @param sortBy - Field to sort by (default: "rank")
 * @param sortOrder - Sort order: "asc" or "desc" (default: "asc")
 * @returns Promise with paginated series standings data
 *
 * @throws {Error} When database query fails
 *
 * @example
 * ```typescript
 * const result = await fetchSeriesStandings(
 *   "series-123",
 *   0,
 *   50,
 *   undefined,
 *   1 // Male only
 * );
 * console.log(`Found ${result.count} standings`);
 * ```
 */
export async function fetchSeriesStandings(
  seriesId: string,
  page: number = 0,
  pageSize: number = 50,
  searchQuery?: string,
  sexCategoryId?: number,
  sortBy: string = "rank",
  sortOrder: "asc" | "desc" = "asc"
) {
  try {
    const { from, to } = getPagination(page, pageSize);

    // Build the query with joins for participant and category data
    let query = supabase
      .from("series_standings")
      .select(
        `
        *,
        series_participant!inner(
          first_name,
          last_name,
          sex_category_id,
          age_category_id,
          age_category:race_athlete_categories!series_participant_age_category_id_fkey(name),
          sex_category:race_athlete_categories!series_participant_sex_category_id_fkey(name)
        )
      `,
        { count: "exact" }
      )
      .eq("series_id", seriesId);

    // Apply sex category filter
    if (sexCategoryId !== undefined && sexCategoryId !== null) {
      query = query.eq("series_participant.sex_category_id", sexCategoryId);
    }

    // Apply search filter on participant name
    if (searchQuery && searchQuery.trim()) {
      query = query.or(
        `series_participant.first_name.ilike.%${searchQuery}%,series_participant.last_name.ilike.%${searchQuery}%`
      );
    }

    // Apply sorting
    const ascending = sortOrder === "asc";
    query = query.order(sortBy, { ascending });

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching series standings:", error);
      throw error;
    }

    // Transform the data to flatten nested objects
    const transformedData: SeriesStandingsResult[] = (data || []).map(
      (item: SeriesStandingsRaw) => {
        const participant = item.series_participant;
        return {
          id: item.id,
          series_id: item.series_id,
          series_participant_id: item.series_participant_id,
          rank: item.rank,
          total_points: item.total_points,
          average_points: item.average_points,
          total_time_ms: item.total_time_ms,
          average_time_ms: item.average_time_ms,
          races_counted: item.races_counted,
          created_at: item.created_at,
          updated_at: item.updated_at,
          first_name: participant?.first_name || "",
          last_name: participant?.last_name || "",
          sex_category_id: participant?.sex_category_id || null,
          age_category_id: participant?.age_category_id || null,
          age_category_name: participant?.age_category?.name || null,
          sex_category_name: participant?.sex_category?.name || null,
        };
      }
    );

    return {
      data: transformedData,
      count: count || 0,
      hasMore: (count || 0) > to + 1,
    };
  } catch (error) {
    console.error("Unexpected error fetching series standings:", error);
    throw error;
  }
}

/**
 * Fetch all public race events belonging to a specific series with pagination
 * @param seriesId - The series ID
 * @param page - Page number (0-based)
 * @param pageSize - Number of items per page
 * @returns Promise with paginated race events data
 * @throws Error if fetch fails
 *
 * @example
 * ```typescript
 * const { data, count, hasMore } = await fetchPublicRaceEventsBySeries(
 *   'series-123',
 *   0,
 *   20
 * );
 * console.log(`Found ${count} events in series`);
 * ```
 */
export async function fetchPublicRaceEventsBySeries(
  seriesId: string,
  page: number = 0,
  pageSize: number = 20
) {
  try {
    const { from, to } = getPagination(page, pageSize);

    const { data, error, count } = await supabase
      .from("public_race_events")
      .select("*", { count: "exact" })
      .eq("series_id", seriesId)
      .order("race_start_date", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching race events by series:", error);
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
      hasMore: (count || 0) > to + 1,
    };
  } catch (error) {
    console.error("Unexpected error fetching race events by series:", error);
    throw error;
  }
}
