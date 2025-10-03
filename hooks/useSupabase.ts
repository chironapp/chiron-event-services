/**
 * Custom hook for fetching race events with proper loading and error states
 * Demonstrates proper React patterns for web applications
 */

import { useCallback, useEffect, useState } from "react";
import {
  checkDatabaseConnection,
  getDatabaseStats,
  supabase,
} from "../lib/supabase";

type RaceEvent = {
  id: string;
  title: string | null;
  description: string | null;
  race_start_date: string | null;
  race_type: number;
  sport_type: number;
  race_status: string | null;
  registration_url: string | null;
  organisers: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
};

export function useRaceEvents() {
  const [events, setEvents] = useState<RaceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
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
          organisers!inner (
            id,
            name,
            logo
          )
        `
        )
        .eq("race_status", "published")
        .gte("race_start_date", new Date().toISOString())
        .order("race_start_date", { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const refetch = () => {
    fetchEvents();
  };

  return { events, loading, error, refetch };
}

/**
 * Hook for real-time race event updates
 */
export function useRaceEventsRealtime() {
  const { events, loading, error, refetch } = useRaceEvents();

  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel("race-events-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "public_race_events",
        },
        (payload) => {
          console.log("Race event updated:", payload);
          // Refetch data when changes occur
          refetch();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  return { events, loading, error, refetch };
}

/**
 * Hook for database connection status
 * Provides basic health check and connection monitoring for anonymous access
 */
export function useDatabaseStatus() {
  const [status, setStatus] = useState({
    connected: false,
    loading: true,
    error: null as string | null,
    stats: null as any,
  });

  useEffect(() => {
    async function checkStatus() {
      try {
        setStatus((prev) => ({ ...prev, loading: true, error: null }));

        const [connectionResult, statsResult] = await Promise.all([
          checkDatabaseConnection(),
          getDatabaseStats(),
        ]);

        setStatus({
          connected: connectionResult.connected,
          loading: false,
          error: connectionResult.connected
            ? null
            : connectionResult.error || "Connection failed",
          stats: statsResult,
        });
      } catch (error) {
        setStatus({
          connected: false,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
          stats: null,
        });
      }
    }

    checkStatus();
  }, []);

  const refetch = useCallback(async () => {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const [connectionResult, statsResult] = await Promise.all([
        checkDatabaseConnection(),
        getDatabaseStats(),
      ]);

      setStatus({
        connected: connectionResult.connected,
        loading: false,
        error: connectionResult.connected
          ? null
          : connectionResult.error || "Connection failed",
        stats: statsResult,
      });
    } catch (error) {
      setStatus({
        connected: false,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stats: null,
      });
    }
  }, []);

  return { ...status, refetch };
}
