// Warning: This file has been synced from chironapp. Do not modify or it will be overwritten.

import {
  RACE_STATUSES,
  RACE_TYPES,
  SPORT_TYPES,
  type RacePosition,
} from "@/constants/raceTypes";
import { SEX_CATEGORY_IDS, type SexCategoryId } from "../constants/sex";
import type { Database } from "./supabase";

/**
 * Race type enum values - matches database smallint enum
 */
export type RaceType = (typeof RACE_TYPES)[keyof typeof RACE_TYPES];

/**
 * Sport type enum values - matches database smallint enum
 */
export type SportType = (typeof SPORT_TYPES)[keyof typeof SPORT_TYPES];

/**
 * Race status enum values - matches database text enum
 */
export type RaceStatus = (typeof RACE_STATUSES)[keyof typeof RACE_STATUSES];

/**
 * Sex type for athlete categorization
 */
export type Sex = "female" | "male" | "other";

/**
 * Sex category ID constants - re-exported from centralized location
 * @see {@link @/constants/sex}
 */
export { SEX_CATEGORY_IDS, type SexCategoryId };

/**
 * Age category interface for race athlete categorization
 * Maps to race_athlete_categories database table
 */
export interface AgeCategory {
  id: number;
  name: string;
  description: string;
  sex: Sex;
  minAge: number;
  maxAge: number | null; // null means no upper limit (e.g., 70+)
}

/**
 * Race team row from database with enhanced typing
 * Maps to race_teams database table
 */
type DatabaseRaceTeamRow = Database["public"]["Tables"]["race_teams"]["Row"];
export interface RaceTeam extends DatabaseRaceTeamRow {
  position: RacePosition | null; // Enhanced position type supporting special statuses
}

/**
 * Base public race event row from database with enhanced typing
 * Extends the auto-generated Supabase type with our custom enum types
 */
type DatabasePublicRaceEventRow =
  Database["public"]["Tables"]["public_race_events"]["Row"];
export interface PublicRaceEvent
  extends Omit<
    DatabasePublicRaceEventRow,
    "race_type" | "sport_type" | "race_status"
  > {
  race_type: RaceType;
  sport_type: SportType;
  race_status: RaceStatus | null;
  race_start_date: string | null; // ISO timestamp
  race_started_at_local: string | null; // ISO timestamp
}

/**
 * Public race event insert type with enhanced typing
 * Used for creating new race events with type-safe enum values
 */
type DatabasePublicRaceEventInsert =
  Database["public"]["Tables"]["public_race_events"]["Insert"];
export interface PublicRaceEventInsert
  extends Omit<
    DatabasePublicRaceEventInsert,
    "race_type" | "sport_type" | "race_status"
  > {
  race_type?: RaceType;
  sport_type?: SportType;
  race_status?: RaceStatus | null;
  race_start_date?: string | null;
  race_started_at_local?: string | null;
}

/**
 * Public race event update type with enhanced typing
 * Used for updating existing race events with type-safe enum values
 */
type DatabasePublicRaceEventUpdate =
  Database["public"]["Tables"]["public_race_events"]["Update"];
export interface PublicRaceEventUpdate
  extends Omit<
    DatabasePublicRaceEventUpdate,
    "race_type" | "sport_type" | "race_status"
  > {
  race_type?: RaceType;
  sport_type?: SportType;
  race_status?: RaceStatus | null;
  race_start_date?: string | null;
  race_started_at_local?: string | null;
}

/**
 * Base public race event series row from database with enhanced typing
 * Extends the auto-generated Supabase type with our custom enum types
 */
type DatabasePublicRaceEventSeriesRow =
  Database["public"]["Tables"]["public_race_event_series"]["Row"];
export interface PublicRaceEventSeries
  extends Omit<
    DatabasePublicRaceEventSeriesRow,
    "race_type" | "sport_type" | "series_status"
  > {
  race_type: RaceType;
  sport_type: SportType;
  series_status: RaceStatus | null;
}

/**
 * Public race event series insert type with enhanced typing
 * Used for creating new race event series with type-safe enum values
 */
type DatabasePublicRaceEventSeriesInsert =
  Database["public"]["Tables"]["public_race_event_series"]["Insert"];
export interface PublicRaceEventSeriesInsert
  extends Omit<
    DatabasePublicRaceEventSeriesInsert,
    "race_type" | "sport_type" | "series_status"
  > {
  race_type?: RaceType;
  sport_type?: SportType;
  series_status?: RaceStatus | null;
}

/**
 * Public race event series update type with enhanced typing
 * Used for updating existing race event series with type-safe enum values
 */
type DatabasePublicRaceEventSeriesUpdate =
  Database["public"]["Tables"]["public_race_event_series"]["Update"];
export interface PublicRaceEventSeriesUpdate
  extends Omit<
    DatabasePublicRaceEventSeriesUpdate,
    "race_type" | "sport_type" | "series_status"
  > {
  race_type?: RaceType;
  sport_type?: SportType;
  series_status?: RaceStatus | null;
}

/**
 * Type guard to check if a value is a valid race type
 * @param value - Value to check
 * @returns True if value is a valid race type
 * @example
 * ```typescript
 * if (isValidRaceType(userInput)) {
 *   // userInput is now typed as RaceType
 *   console.log(RACE_TYPE_LABELS[userInput]);
 * }
 * ```
 */
export const isValidRaceType = (value: any): value is RaceType => {
  return Object.values(RACE_TYPES).includes(value);
};

/**
 * Type guard to check if a value is a valid sport type
 * @param value - Value to check
 * @returns True if value is a valid sport type
 * @example
 * ```typescript
 * if (isValidSportType(userInput)) {
 *   // userInput is now typed as SportType
 *   console.log(SPORT_TYPE_LABELS[userInput]);
 * }
 * ```
 */
export const isValidSportType = (value: any): value is SportType => {
  return Object.values(SPORT_TYPES).includes(value);
};

/**
 * Type guard to check if a value is a valid race status
 * @param value - Value to check
 * @returns True if value is a valid race status
 * @example
 * ```typescript
 * if (isValidRaceStatus(userInput)) {
 *   // userInput is now typed as RaceStatus
 *   console.log(RACE_STATUS_LABELS[userInput]);
 * }
 * ```
 */
export const isValidRaceStatus = (value: any): value is RaceStatus => {
  return Object.values(RACE_STATUSES).includes(value);
};

/**
 * Enhanced public race event database operations types
 * Overrides the auto-generated types with our custom enum types
 */
export interface PublicRaceEventDatabase {
  public: {
    Tables: {
      public_race_events: {
        Row: PublicRaceEvent;
        Insert: PublicRaceEventInsert;
        Update: PublicRaceEventUpdate;
      };
      public_race_event_series: {
        Row: PublicRaceEventSeries;
        Insert: PublicRaceEventSeriesInsert;
        Update: PublicRaceEventSeriesUpdate;
      };
      race_start_list_results: {
        Row: RaceStartListResult;
        Insert: RaceStartListResultInsert;
        Update: RaceStartListResultUpdate;
      };
    };
  };
}

/**
 * Helper type for race event with populated organiser information
 * Used when joining with organisers table
 */
export interface PublicRaceEventWithOrganiser extends PublicRaceEvent {
  organiser: {
    id: string;
    name: string;
    description: string | null;
    website: string | null;
    logo: string | null;
  };
}

/**
 * Helper type for race event creation payload
 * Includes all required fields for creating a new race event
 */
export interface CreateRaceEventPayload {
  title: string;
  description?: string | null;
  organiser_id: string;
  race_type: RaceType;
  sport_type: SportType;
  race_status?: RaceStatus;
  race_start_date?: string | null;
  race_started_at_local?: string | null;
  distance?: number | null; // Distance in meters
  registration_url?: string | null;
  image?: string | null;
}

/**
 * Helper type for race event filters
 * Used for searching and filtering race events
 */
export interface RaceEventFilters {
  race_type?: RaceType;
  sport_type?: SportType;
  race_status?: RaceStatus;
  organiser_id?: string;
  distance_min?: number; // Minimum distance in meters
  distance_max?: number; // Maximum distance in meters
  start_date_from?: string; // ISO date string
  start_date_to?: string; // ISO date string
  search_text?: string; // Search in title and description
}

/**
 * Start list entry data for creating a race participant
 * Combines data for both race_start_list_results and race_start_list_athlete_personal tables
 */
export interface StartListEntryData {
  // From race_start_list_results
  first_name: string;
  last_name: string;
  race_number: number;
  public_race_event_id: string;
  sex_category_id?: number | null; // Reference to race_athlete_categories for sex category
  age_category_id?: number | null; // Reference to race_athlete_categories for age category
  // From race_start_list_athlete_personal
  month_of_birth?: number | null;
  year_of_birth?: number | null;
  email?: string | null;
}

/**
 * Start list entry insert type for API operations
 */
export interface StartListEntryInsert {
  first_name: string;
  last_name: string;
  race_number: number;
  public_race_event_id: string;
  sex_category_id?: number | null;
  age_category_id?: number | null;
  month_of_birth?: number | null;
  year_of_birth?: number | null;
  email?: string | null;
}

/**
 * Race start list result row from database with enhanced typing
 * Extends the auto-generated Supabase type with our custom position type
 */
type DatabaseRaceStartListResultRow =
  Database["public"]["Tables"]["race_start_list_results"]["Row"];
export interface RaceStartListResult
  extends Omit<
    DatabaseRaceStartListResultRow,
    "position" | "age_category_position" | "sex_category_position"
  > {
  position: RacePosition | null; // Enhanced position type supporting special statuses
  age_category_position: RacePosition | null; // Position within age category
  sex_category_position: RacePosition | null; // Position within sex category
  finished_at_local: string | null; // ISO timestamp when participant finished
}

/**
 * Race start list result insert type with enhanced typing
 * Used for creating new race start list entries with type-safe position values
 */
type DatabaseRaceStartListResultInsert =
  Database["public"]["Tables"]["race_start_list_results"]["Insert"];
export interface RaceStartListResultInsert
  extends Omit<
    DatabaseRaceStartListResultInsert,
    "position" | "age_category_position" | "sex_category_position"
  > {
  position?: RacePosition | null;
  age_category_position?: RacePosition | null;
  sex_category_position?: RacePosition | null;
  finished_at_local?: string | null;
}

/**
 * Race start list result update type with enhanced typing
 * Used for updating existing race start list entries with type-safe position values
 */
type DatabaseRaceStartListResultUpdate =
  Database["public"]["Tables"]["race_start_list_results"]["Update"];
export interface RaceStartListResultUpdate
  extends Omit<
    DatabaseRaceStartListResultUpdate,
    "position" | "age_category_position" | "sex_category_position"
  > {
  position?: RacePosition | null;
  age_category_position?: RacePosition | null;
  sex_category_position?: RacePosition | null;
  finished_at_local?: string | null;
}

/**
 * Enhanced race start list result with populated category information
 * Used when joining with race_athlete_categories table
 */
export interface RaceStartListResultWithCategories extends RaceStartListResult {
  sex_category: {
    id: number;
    name: string;
    description: string;
  } | null;
  age_category: {
    id: number;
    name: string;
    description: string;
    sex: Sex;
    minAge: number;
    maxAge: number | null;
  } | null;
  team: {
    id: string;
    name: string;
  } | null;
}

/**
 * Race participant with timing data
 * Combines start list result with calculated timing information
 */
export interface RaceParticipantWithTiming extends RaceStartListResult {
  // Calculated fields
  finish_time_formatted?: string; // "1:23:45" format
  net_finish_time_formatted?: string; // "1:23:45" format
  pace_per_km?: string; // "5:30" format for pace per kilometer
  pace_per_mile?: string; // "8:52" format for pace per mile
  has_finished: boolean; // True if participant has a finish time
  is_special_status: boolean; // True if position is DNS, DNF, DQ, etc.
}
