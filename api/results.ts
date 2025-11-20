import type { RaceStartListResult } from "../lib/supabase";
import { supabase } from "../lib/supabase";

// Extended type to include joined category and team data
export type RaceStartListResultWithCategories = RaceStartListResult & {
  age_category: { name: string } | null;
  sex_category: { name: string } | null;
  team: { name: string } | null;
};

// Extended type to include event data for individual participant view
export type RaceStartListResultWithEvent = RaceStartListResultWithCategories & {
  public_race_event: {
    title: string | null;
    race_start_date: string | null;
    race_started_at_local: string | null;
    race_status: string | null;
  } | null;
};

// Extended type for team data with event information
export type RaceTeamWithEvent = {
  id: string;
  name: string;
  position: number | null;
  finish_time100: number | null;
  created_at: string;
  updated_at: string;
  public_race_event_id: string;
  public_race_event: {
    title: string | null;
    race_start_date: string | null;
    race_started_at_local: string | null;
    race_status: string | null;
  } | null;
};

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
  data: RaceStartListResultWithCategories[];
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

    // Build the base query with category and team joins
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

    // Add search filter if provided
    if (search.trim()) {
      const searchTerm = search.trim();
      const isNumeric = /^\d+$/.test(searchTerm);

      if (isNumeric) {
        // If search is numeric, search race_number and names
        query = query.or(
          `race_number.eq.${searchTerm},first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`
        );
      } else {
        // If search is not numeric, only search names
        query = query.or(
          `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`
        );
      }
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
      data: (data || []) as RaceStartListResultWithCategories[],
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

/**
 * Get the count of participants in a specific category for an event
 *
 * @param eventId - The event ID
 * @param categoryId - The category ID (sex_category_id or age_category_id)
 * @param categoryType - The type of category ('sex' or 'age')
 * @returns Promise<number> - Total number of participants in that category
 *
 * @example
 * ```typescript
 * // Get count of participants in sex category 5
 * const count = await getCategoryParticipantsCount('event-123', 5, 'sex');
 * // Get count of participants in age category 3
 * const count = await getCategoryParticipantsCount('event-123', 3, 'age');
 * ```
 */
export async function getCategoryParticipantsCount(
  eventId: string,
  categoryId: number | null,
  categoryType: "sex" | "age"
): Promise<number> {
  if (!categoryId) {
    return 0;
  }

  try {
    const columnName =
      categoryType === "sex" ? "sex_category_id" : "age_category_id";

    const { count, error } = await supabase
      .from("race_start_list_results")
      .select("*", { count: "exact", head: true })
      .eq("public_race_event_id", eventId)
      .eq(columnName, categoryId);

    if (error) {
      throw new Error(
        `Failed to get category participants count: ${error.message}`
      );
    }

    return count || 0;
  } catch (error) {
    console.error("Error getting category participants count:", error);
    throw error;
  }
}

/**
 * Fetch a single participant result by participant ID
 * Includes joined data for categories, team, and event information
 *
 * @param participantId - The participant ID (race_start_list_results.id)
 * @returns Promise<RaceStartListResultWithEvent | null> - Participant result with event data
 *
 * @example
 * ```typescript
 * const participant = await fetchParticipantById('participant-123');
 * if (participant) {
 *   console.log(participant.first_name, participant.last_name);
 *   console.log(participant.public_race_event?.title);
 * }
 * ```
 */
export async function fetchParticipantById(
  participantId: string
): Promise<RaceStartListResultWithEvent | null> {
  try {
    const { data, error } = await supabase
      .from("race_start_list_results")
      .select(
        `
        *,
        age_category:race_athlete_categories!race_start_list_results_age_category_id_fkey(name),
        sex_category:race_athlete_categories!race_start_list_results_sex_category_id_fkey(name),
        team:race_teams(name),
        public_race_event:public_race_events(title, race_start_date, race_started_at_local, race_status)
      `
      )
      .eq("id", participantId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      throw new Error(`Failed to fetch participant: ${error.message}`);
    }

    return data as RaceStartListResultWithEvent;
  } catch (error) {
    console.error("Error fetching participant:", error);
    throw error;
  }
}

/**
 * Fetch a single team by team ID
 * Includes joined data for event information
 *
 * @param teamId - The team ID (race_teams.id)
 * @returns Promise<RaceTeamWithEvent | null> - Team with event data
 *
 * @example
 * ```typescript
 * const team = await fetchTeamById('team-123');
 * if (team) {
 *   console.log(team.name);
 *   console.log(team.public_race_event?.title);
 * }
 * ```
 */
export async function fetchTeamById(
  teamId: string
): Promise<RaceTeamWithEvent | null> {
  try {
    const { data, error } = await supabase
      .from("race_teams")
      .select(
        `
        *,
        public_race_event:public_race_events(title, race_start_date, race_started_at_local, race_status)
      `
      )
      .eq("id", teamId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      throw new Error(`Failed to fetch team: ${error.message}`);
    }

    return data as RaceTeamWithEvent;
  } catch (error) {
    console.error("Error fetching team:", error);
    throw error;
  }
}

/**
 * Fetch team members for a specific team
 * Returns all participants with the matching team_id, sorted by team order
 *
 * @param teamId - The team ID (race_teams.id)
 * @returns Promise<RaceStartListResultWithCategories[]> - Array of team members
 *
 * @example
 * ```typescript
 * const members = await fetchTeamMembers('team-123');
 * console.log(`Team has ${members.length} members`);
 * ```
 */
export async function fetchTeamMembers(
  teamId: string
): Promise<RaceStartListResultWithCategories[]> {
  try {
    const { data, error } = await supabase
      .from("race_start_list_results")
      .select(
        `
        *,
        age_category:race_athlete_categories!race_start_list_results_age_category_id_fkey(name),
        sex_category:race_athlete_categories!race_start_list_results_sex_category_id_fkey(name),
        team:race_teams(name)
      `
      )
      .eq("team_id", teamId)
      .order("finished_at_local", { ascending: true, nullsFirst: false });

    if (error) {
      throw new Error(`Failed to fetch team members: ${error.message}`);
    }

    return (data || []) as RaceStartListResultWithCategories[];
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw error;
  }
}

/**
 * Get the total count of teams for a specific event
 *
 * @param eventId - The event ID
 * @returns Promise<number> - Total number of teams
 */
export async function getTeamsCount(eventId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("race_teams")
      .select("*", { count: "exact", head: true })
      .eq("public_race_event_id", eventId);

    if (error) {
      throw new Error(`Failed to get teams count: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error("Error getting teams count:", error);
    throw error;
  }
}

// Extended type for race teams with member count
export type RaceTeamWithMemberCount = {
  id: string;
  name: string;
  position: number | null;
  finish_time100: number | null;
  created_at: string;
  updated_at: string;
  public_race_event_id: string;
  member_count: number;
};

/**
 * Fetch race teams for a specific event with member count
 * Returns all teams sorted by position
 *
 * @param eventId - The event ID
 * @returns Promise<RaceTeamWithMemberCount[]> - Array of teams with member count
 *
 * @example
 * ```typescript
 * const teams = await fetchRaceTeams('event-123');
 * console.log(`Event has ${teams.length} teams`);
 * ```
 */
export async function fetchRaceTeams(
  eventId: string
): Promise<RaceTeamWithMemberCount[]> {
  try {
    // First, fetch all teams for the event
    const { data: teams, error: teamsError } = await supabase
      .from("race_teams")
      .select("*")
      .eq("public_race_event_id", eventId)
      .order("position", { ascending: true, nullsFirst: false });

    if (teamsError) {
      throw new Error(`Failed to fetch teams: ${teamsError.message}`);
    }

    if (!teams || teams.length === 0) {
      return [];
    }

    // Fetch member counts for all teams in a single query
    const teamIds = teams.map((team) => team.id);
    const { data: memberCounts, error: countsError } = await supabase
      .from("race_start_list_results")
      .select("team_id")
      .in("team_id", teamIds);

    if (countsError) {
      throw new Error(`Failed to fetch member counts: ${countsError.message}`);
    }

    // Count members per team
    const memberCountMap = new Map<string, number>();
    (memberCounts || []).forEach((result) => {
      if (result.team_id) {
        memberCountMap.set(
          result.team_id,
          (memberCountMap.get(result.team_id) || 0) + 1
        );
      }
    });

    // Combine teams with member counts
    const teamsWithMemberCount: RaceTeamWithMemberCount[] = teams.map(
      (team) => ({
        ...team,
        member_count: memberCountMap.get(team.id) || 0,
      })
    );

    return teamsWithMemberCount;
  } catch (error) {
    console.error("Error fetching race teams:", error);
    throw error;
  }
}
