import { RACE_STATUSES } from "../constants/raceTypes";
import type { RaceEventWithOrganiser } from "../api/events";

/**
 * Filter events by their status classification
 * 
 * Classification rules:
 * - Upcoming: registration_open OR registration_closed
 * - Started: started
 * - Completed: completed, preliminary_results, OR final_results
 */

/**
 * Filter events that are upcoming (registration open or closed)
 * 
 * @param events - Array of race events to filter
 * @returns Array of upcoming events
 */
export function filterUpcomingEvents(
  events: RaceEventWithOrganiser[]
): RaceEventWithOrganiser[] {
  return events.filter((event) => {
    return (
      event.race_status === RACE_STATUSES.REGISTRATION_OPEN ||
      event.race_status === RACE_STATUSES.REGISTRATION_CLOSED
    );
  });
}

/**
 * Filter events that have started
 * 
 * @param events - Array of race events to filter
 * @returns Array of started events
 */
export function filterStartedEvents(
  events: RaceEventWithOrganiser[]
): RaceEventWithOrganiser[] {
  return events.filter((event) => {
    return event.race_status === RACE_STATUSES.STARTED;
  });
}

/**
 * Filter events that are completed (including preliminary and final results)
 * 
 * @param events - Array of race events to filter
 * @returns Array of completed events
 */
export function filterCompletedEvents(
  events: RaceEventWithOrganiser[]
): RaceEventWithOrganiser[] {
  return events.filter((event) => {
    return (
      event.race_status === RACE_STATUSES.COMPLETED ||
      event.race_status === RACE_STATUSES.PRELIMINARY_RESULTS ||
      event.race_status === RACE_STATUSES.FINAL_RESULTS
    );
  });
}

/**
 * Filter events for the "Results" view (started + completed)
 * 
 * @param events - Array of race events to filter
 * @returns Array of events with results (started or completed)
 */
export function filterResultsEvents(
  events: RaceEventWithOrganiser[]
): RaceEventWithOrganiser[] {
  const started = filterStartedEvents(events);
  const completed = filterCompletedEvents(events);
  return [...started, ...completed];
}
