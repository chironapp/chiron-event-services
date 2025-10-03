/**
 * Example component showing how to use the Supabase client
 * in chiron-event-services web application
 */

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

// Type for the query result
type RaceEventWithOrganiser = {
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
  };
};

export function RaceEventsList() {
  const [events, setEvents] = useState<RaceEventWithOrganiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
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
            organisers (
              id,
              name,
              logo
            )
          `
          )
          .eq("race_status", "published") // Published events only
          .gte("race_start_date", new Date().toISOString())
          .order("race_start_date", { ascending: true })
          .limit(20);

        if (supabaseError) {
          throw supabaseError;
        }

        setEvents(data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading upcoming races...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (events.length === 0) {
    return <div>No upcoming races found.</div>;
  }

  return (
    <div>
      <h2>Upcoming Races</h2>
      {events.map((event) => (
        <div
          key={event.id}
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <h3>{event.title}</h3>
          {event.description && <p>{event.description}</p>}
          {event.race_start_date && (
            <p>
              <strong>Date:</strong>{" "}
              {new Date(event.race_start_date).toLocaleDateString()}
            </p>
          )}
          <p>
            <strong>Organiser:</strong> {event.organisers.name}
          </p>
          {event.registration_url && (
            <p>
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Register
              </a>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default RaceEventsList;
