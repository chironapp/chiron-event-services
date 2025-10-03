import { RACE_STATUSES, RACE_TYPES, SPORT_TYPES } from "../constants/raceTypes";
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
  distance1000?: number | null; // Distance in meters
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
