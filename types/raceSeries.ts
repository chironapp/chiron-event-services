import type { Database } from "./supabase";

/**
 * Scoring method enum for series standings
 * - "time": Scoring based on finish times
 * - "points": Scoring based on points assigned per position
 */
export type ScoringMethod = "time" | "points";

/**
 * Aggregation method enum for series standings
 * - "total": Sum all results
 * - "average": Average all results
 */
export type AggregationMethod = "total" | "average";

/**
 * Series participant row from database with enhanced typing
 * Maps to series_participant database table
 */
type DatabaseSeriesParticipantRow =
  Database["public"]["Tables"]["series_participant"]["Row"];
export interface SeriesParticipant extends DatabaseSeriesParticipantRow {
  // No additional fields needed for now, but interface allows for future enhancements
}

/**
 * Series participant insert type with enhanced typing
 * Used for creating new series participants
 */
type DatabaseSeriesParticipantInsert =
  Database["public"]["Tables"]["series_participant"]["Insert"];
export interface SeriesParticipantInsert
  extends DatabaseSeriesParticipantInsert {
  // No additional fields needed for now, but interface allows for future enhancements
}

/**
 * Series participant update type with enhanced typing
 * Used for updating existing series participants
 */
type DatabaseSeriesParticipantUpdate =
  Database["public"]["Tables"]["series_participant"]["Update"];
export interface SeriesParticipantUpdate
  extends DatabaseSeriesParticipantUpdate {
  // No additional fields needed for now, but interface allows for future enhancements
}

/**
 * Series participant personal insert type with enhanced typing
 * Used for creating new series participant personal records
 */
type DatabaseSeriesParticipantPersonalInsert =
  Database["public"]["Tables"]["series_participant_personal"]["Insert"];
export interface SeriesParticipantPersonalInsert
  extends DatabaseSeriesParticipantPersonalInsert {
  // No additional fields needed for now, but interface allows for future enhancements
}

/**
 * Combined series participant data for reading operations
 * Combines data for both series_participant and series_participant_personal tables
 * Personal data is nested to clearly distinguish table ownership and match Supabase join structure
 */
export interface SeriesParticipantData {
  // From series_participant
  id: string;
  series_id: string;
  first_name: string;
  last_name: string;
  sex_category_id: number | null;
  age_category_id: number | null;
  created_at: string;
  updated_at: string;
  // From series_participant_personal (nested to match join structure)
  personal?: {
    user_id: string | null;
    year_of_birth: number | null;
    email: string | null;
  } | null;
}

/**
 * Series participant insert type for API operations
 * Combines data for creating both series_participant and series_participant_personal records
 * Personal data is nested to clearly distinguish which table to insert into
 */
export interface SeriesParticipantEntryInsert {
  // From series_participant
  series_id: string;
  first_name: string;
  last_name: string;
  sex_category_id?: number | null;
  age_category_id?: number | null;
  // From series_participant_personal (optional nested object)
  personal?: {
    user_id?: string | null;
    year_of_birth?: number | null;
    email?: string | null;
  };
}

/**
 * Series participant update type for API operations
 * Combines data for updating both series_participant and series_participant_personal records
 * Personal data is nested to clearly distinguish which table to update
 */
export interface SeriesParticipantEntryUpdate {
  // From series_participant (id is used for identification, not updating)
  first_name?: string;
  last_name?: string;
  sex_category_id?: number | null;
  age_category_id?: number | null;
  // From series_participant_personal (optional nested object)
  personal?: {
    user_id?: string | null;
    year_of_birth?: number | null;
    email?: string | null;
  };
}

/**
 * Series standings scoring configuration row from database
 * Defines how a series is scored - configurable scoring definitions per series
 * Maps to series_standings_scoring_config database table
 */
type DatabaseSeriesStandingsScoringConfigRow =
  Database["public"]["Tables"]["series_standings_scoring_config"]["Row"];

/**
 * Series standings scoring configuration with enhanced typing
 * Used for reading scoring configuration from database
 */
export interface SeriesStandingsScoringConfig
  extends DatabaseSeriesStandingsScoringConfigRow {
  // No additional fields needed for now, but interface allows for future enhancements
}

/**
 * Series standings scoring configuration insert type
 * Used for creating new scoring configurations
 */
type DatabaseSeriesStandingsScoringConfigInsert =
  Database["public"]["Tables"]["series_standings_scoring_config"]["Insert"];

export interface SeriesStandingsScoringConfigInsert
  extends DatabaseSeriesStandingsScoringConfigInsert {
  // No additional fields needed for now, but interface allows for future enhancements
}

/**
 * Series standings scoring configuration update type
 * Used for updating existing scoring configurations
 */
type DatabaseSeriesStandingsScoringConfigUpdate =
  Database["public"]["Tables"]["series_standings_scoring_config"]["Update"];

export interface SeriesStandingsScoringConfigUpdate
  extends DatabaseSeriesStandingsScoringConfigUpdate {
  // No additional fields needed for now, but interface allows for future enhancements
}

/**
 * Series standings row from database
 * Stores derived standings per participant per series
 * Maps to series_standings database table
 */
type DatabaseSeriesStandingsRow =
  Database["public"]["Tables"]["series_standings"]["Row"];

/**
 * Series standings with enhanced typing
 * Used for reading standings data from database
 */
export interface SeriesStandings extends DatabaseSeriesStandingsRow {
  // No additional fields needed for now, but interface allows for future enhancements
}

/**
 * Series standings insert type
 * Used for creating new standings records
 */
type DatabaseSeriesStandingsInsert =
  Database["public"]["Tables"]["series_standings"]["Insert"];

export interface SeriesStandingsInsert extends DatabaseSeriesStandingsInsert {
  // No additional fields needed for now, but interface allows for future enhancements
}

/**
 * Series standings update type
 * Used for updating existing standings records
 */
type DatabaseSeriesStandingsUpdate =
  Database["public"]["Tables"]["series_standings"]["Update"];

export interface SeriesStandingsUpdate extends DatabaseSeriesStandingsUpdate {
  // No additional fields needed for now, but interface allows for future enhancements
}

/**
 * Type guard to check if a value is a valid scoring method
 *
 * @param value - Value to check
 * @returns True if value is a valid ScoringMethod
 *
 * @example
 * ```typescript
 * const userInput = "time";
 * if (isValidScoringMethod(userInput)) {
 *   // TypeScript now knows userInput is ScoringMethod
 *   console.log(userInput);
 * }
 * ```
 */
export const isValidScoringMethod = (value: any): value is ScoringMethod => {
  return value === "time" || value === "points";
};

/**
 * Type guard to check if a value is a valid aggregation method
 *
 * @param value - Value to check
 * @returns True if value is a valid AggregationMethod
 *
 * @example
 * ```typescript
 * const userInput = "total";
 * if (isValidAggregationMethod(userInput)) {
 *   // TypeScript now knows userInput is AggregationMethod
 *   console.log(userInput);
 * }
 * ```
 */
export const isValidAggregationMethod = (
  value: any
): value is AggregationMethod => {
  return value === "total" || value === "average";
};
