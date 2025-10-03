import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL environment variable");
}

if (!SUPABASE_ANON_KEY) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

/**
 * Supabase client configured for anonymous-only web access
 *
 * This application is designed for public data access only and does not
 * require user authentication. All data access is through Row Level Security
 * policies that allow anonymous access to public data.
 *
 * Features:
 * - Anonymous-only access using anon key
 * - No authentication or session management
 * - Optimized for static web deployment
 * - Real-time subscriptions available for public data
 */
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      // Disable all authentication features for anonymous-only access
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    realtime: {
      // Enable real-time for public data updates
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        "X-Client-Info": "chiron-event-services@1.0.0",
        "X-Access-Type": "anonymous-public",
      },
    },
  }
);

/**
 * Database health check function
 * Verifies that the Supabase connection is working and returns basic stats
 */
export const checkDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("organisers")
      .select("id", { count: "exact", head: true });

    if (error) {
      throw error;
    }

    return {
      connected: true,
      organisersCount: data?.length || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Database connection check failed:", error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get database statistics for public data
 * Returns counts of publicly available records
 */
export const getDatabaseStats = async () => {
  try {
    const [organisersResult, eventsResult] = await Promise.all([
      supabase.from("organisers").select("*", { count: "exact", head: true }),
      supabase
        .from("public_race_events")
        .select("*", { count: "exact", head: true }),
    ]);

    return {
      organisers: organisersResult.count || 0,
      events: eventsResult.count || 0,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching database stats:", error);
    return {
      organisers: 0,
      events: 0,
      error: error instanceof Error ? error.message : "Unknown error",
      lastUpdated: new Date().toISOString(),
    };
  }
};

/**
 * Type-safe database access
 */
export type Tables = Database["public"]["Tables"];
export type PublicRaceEvent = Tables["public_race_events"]["Row"];
export type Organiser = Tables["organisers"]["Row"];
export type RaceAthleteCategory = Tables["race_athlete_categories"]["Row"];
export type RaceAthleteCategoryCollection =
  Tables["race_athlete_category_collections"]["Row"];
