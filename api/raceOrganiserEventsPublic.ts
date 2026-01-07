// Warning: This file has been synced from chironapp. Do not modify or it will be overwritten.

// api/raceOrganiserEventsPublic.ts
import { supabase } from "../lib/supabase";
import type { RaceStartListResult } from "../types/race";
import { getPagination } from "./utils";

/**
 * Extended start list result with joined category and team names
 */
export type StartListResult = RaceStartListResult & {
  age_category_name?: string | null;
  sex_category_name?: string | null;
  team_name?: string | null;
};

/**
 * Fetch public race events for a specific organiser with pagination
 * @param organiserId - The organiser ID
 * @param page - Page number (0-indexed)
 * @param pageSize - Number of items per page
 * @returns Promise with paginated race events data
 *
 * @example
 * ```typescript
 * const { data, count, hasMore } = await fetchOrganiserRaceEvents(
 *   'organiser-123',
 *   0,
 *   20
 * );
 * // Filter events by series
 * const seriesEvents = data.filter(e => e.series_id === 'series-456');
 * ```
 */
export async function fetchOrganiserRaceEvents(
  organiserId: string,
  page: number = 0,
  pageSize: number = 20
) {
  try {
    const { from, to } = getPagination(page, pageSize);

    const { data, error, count } = await supabase
      .from("public_race_events")
      .select("*", { count: "exact" })
      .eq("organiser_id", organiserId)
      .order("race_start_date", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching organiser race events:", error);
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
      hasMore: (count || 0) > to + 1,
    };
  } catch (error) {
    console.error("Unexpected error fetching organiser race events:", error);
    throw error;
  }
}

/**
 * Fetch a single public race event by ID
 * @param eventId - The ID of the race event to fetch
 * @returns Promise with race event data or null if not found. The returned event includes
 *          a `series_id` field (nullable) that links to a public_race_event_series record.
 *
 * @example
 * ```typescript
 * const event = await fetchPublicRaceEvent('event-123');
 * if (event?.series_id) {
 *   const series = await fetchPublicRaceEventSeries(event.series_id);
 * }
 * ```
 */
export async function fetchPublicRaceEvent(eventId: string) {
  try {
    const { data, error } = await supabase
      .from("public_race_events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) {
      console.error("Error fetching public race event:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching public race event:", error);
    throw error;
  }
}

/**
 * Fetch race start list items for a specific event with pagination
 * @param eventId - The race event ID
 * @param page - Page number (0-based)
 * @param pageSize - Number of items per page
 * @param searchQuery - Optional search query for name filtering
 * @param ageCategoryId - Optional age category filter
 * @param sexCategoryId - Optional sex category filter
 * @param teamId - Optional team filter
 * @param sortBy - Sort field (race_number, first_name, last_name)
 * @param sortOrder - Sort order (asc or desc)
 * @returns Promise with paginated start list data
 */
export async function fetchRaceStartList(
  eventId: string,
  page: number = 0,
  pageSize: number = 50,
  searchQuery?: string,
  ageCategoryId?: number,
  sexCategoryId?: number,
  teamId?: string,
  sortBy: string = "race_number",
  sortOrder: "asc" | "desc" = "asc"
) {
  try {
    const { from, to } = getPagination(page, pageSize);

    // Build the query with joins for category and team names
    let query = supabase
      .from("race_start_list_results")
      .select(
        `
        *,
        age_category:race_athlete_categories!race_start_list_results_age_category_id_fkey(name),
        sex_category:race_athlete_categories!race_start_list_results_sex_category_id_fkey(name),
        team:race_teams(name)
      `,
        { count: "exact" }
      )
      .eq("public_race_event_id", eventId);

    // Apply filters
    if (searchQuery && searchQuery.trim()) {
      // Search in first_name or last_name
      query = query.or(
        `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`
      );
    }

    if (ageCategoryId !== undefined && ageCategoryId !== null) {
      query = query.eq("age_category_id", ageCategoryId);
    }

    if (sexCategoryId !== undefined && sexCategoryId !== null) {
      query = query.eq("sex_category_id", sexCategoryId);
    }

    if (teamId !== undefined && teamId !== null) {
      query = query.eq("team_id", teamId);
    }

    // Apply sorting
    const ascending = sortOrder === "asc";
    query = query.order(sortBy, { ascending });

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching race start list:", error);
      throw error;
    }

    // Transform the data to flatten nested objects
    const transformedData: StartListResult[] = (data || []).map(
      (item: any) => ({
        ...item,
        age_category_name: item.age_category?.name || null,
        sex_category_name: item.sex_category?.name || null,
        team_name: item.team?.name || null,
      })
    );

    return {
      data: transformedData,
      count: count || 0,
      hasMore: (count || 0) > to + 1,
    };
  } catch (error) {
    console.error("Unexpected error fetching race start list:", error);
    throw error;
  }
}

/**
 * Fetch unique filter options for start list
 * @param eventId - The race event ID
 * @returns Promise with unique age categories, sex categories, and teams
 */
export async function fetchStartListFilterOptions(eventId: string) {
  try {
    // Fetch the start list to get category and team IDs
    const { data: startListData, error: startListError } = await supabase
      .from("race_start_list_results")
      .select("age_category_id, sex_category_id, team_id")
      .eq("public_race_event_id", eventId);

    if (startListError) {
      throw startListError;
    }

    // Extract unique IDs
    const ageCategoryIds = [
      ...new Set(
        startListData
          ?.map((item) => item.age_category_id)
          .filter((id): id is number => id !== null)
      ),
    ];
    const sexCategoryIds = [
      ...new Set(
        startListData
          ?.map((item) => item.sex_category_id)
          .filter((id): id is number => id !== null)
      ),
    ];
    const teamIds = [
      ...new Set(
        startListData
          ?.map((item) => item.team_id)
          .filter((id): id is string => id !== null)
      ),
    ];

    // Fetch category names
    let ageCategories: { id: number; name: string }[] = [];
    let sexCategories: { id: number; name: string }[] = [];
    let teams: { id: string; name: string }[] = [];

    if (ageCategoryIds.length > 0) {
      const { data: ageCatData, error: ageCatError } = await supabase
        .from("race_athlete_categories")
        .select("id, name")
        .in("id", ageCategoryIds);

      if (!ageCatError && ageCatData) {
        ageCategories = ageCatData;
      }
    }

    if (sexCategoryIds.length > 0) {
      const { data: sexCatData, error: sexCatError } = await supabase
        .from("race_athlete_categories")
        .select("id, name")
        .in("id", sexCategoryIds);

      if (!sexCatError && sexCatData) {
        sexCategories = sexCatData;
      }
    }

    if (teamIds.length > 0) {
      const { data: teamData, error: teamError } = await supabase
        .from("race_teams")
        .select("id, name")
        .in("id", teamIds);

      if (!teamError && teamData) {
        teams = teamData;
      }
    }

    return {
      ageCategories,
      sexCategories,
      teams,
    };
  } catch (error) {
    console.error("Unexpected error fetching filter options:", error);
    throw error;
  }
}

/**
 * Fetch all race teams for a specific event
 * @param eventId - The public race event ID
 * @returns Promise with race teams data
 * @throws Error if fetch fails
 *
 * @example
 * ```typescript
 * const teams = await fetchRaceTeams('race-123');
 * console.log(`Found ${teams.length} teams`);
 * ```
 */
export async function fetchRaceTeams(eventId: string) {
  try {
    const { data, error } = await supabase
      .from("race_teams")
      .select("*")
      .eq("public_race_event_id", eventId)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching race teams:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching race teams:", error);
    throw error;
  }
}

/**
 * Checks if all participants in a relay team have finished the race via API.
 * A relay team is considered finished when all participants with the same team_id have completed their leg.
 *
 * @param eventId - The public race event ID
 * @param teamId - The team ID to check for completion
 * @returns Promise<boolean> - True if all team members have finished, false otherwise
 *
 * @throws {Error} When team_id is null, undefined, or database query fails
 *
 * @example
 * ```typescript
 * // Check if relay team has completed via API
 * const teamFinished = await hasRelayTeamFinishedApi(
 *   'race-123',
 *   'team-456'
 * );
 *
 * if (teamFinished) {
 *   console.log('All team members have finished');
 *   // Update team results
 *   await updateRelayTeamResults('race-123', 'team-456');
 * }
 * ```
 */
export async function hasRelayTeamFinishedApi(
  eventId: string,
  teamId: string
): Promise<boolean> {
  if (!teamId) {
    throw new Error("teamId cannot be null or undefined");
  }

  try {
    // Fetch all participants for this team
    const { data: participants, error } = await supabase
      .from("race_start_list_results")
      .select("id, finish_time100")
      .eq("public_race_event_id", eventId)
      .eq("team_id", teamId);

    if (error) {
      console.error("Error fetching team members:", error);
      throw error;
    }

    // If no team members found, team hasn't finished
    if (!participants || participants.length === 0) {
      return false;
    }

    // Check if all team members have finished (have a finish_time100)
    return participants.every((member) => member.finish_time100 != null);
  } catch (error) {
    console.error("Unexpected error checking team finish status:", error);
    throw error;
  }
}
