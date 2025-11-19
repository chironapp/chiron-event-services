import { RACE_TYPES } from "@/constants/raceTypes";
import { PublicRaceEvent, RaceStartListResult } from "@/types/race";
import { participantHasFinished } from "./raceUtils";

/**
 * Gets the latest finished_at_local timestamp for any participant with the same team as the specified participant.
 * Used for relay races or team events where you need to know when the last team member finished.
 *
 * @param participants - Array of race participants to search through
 * @param participantId - ID of the participant whose team to check
 * @returns The latest finished_at_local timestamp for the team, or null if no team members have finished
 *
 * @throws {Error} When participant with specified ID is not found
 * @throws {Error} When specified participant has no team_id
 *
 * @example
 * ```typescript
 * // Find when the last member of participant's team finished
 * const lastFinish = getLastTeamMembersFinishedAtLocal(
 *   raceStartListResults,
 *   'participant-123'
 * );
 *
 * if (lastFinish) {
 *   console.log(`Team's last member finished at: ${lastFinish}`);
 * } else {
 *   console.log('No team members have finished yet');
 * }
 *
 * // Use for calculating team completion time
 * const teamFinishTime = getLastTeamMembersFinishedAtLocal(
 *   participants,
 *   leadRunner.id
 * );
 * if (teamFinishTime) {
 *   const teamTime = calculateTeamTime(teamStartTime, teamFinishTime);
 * }
 * ```
 */
export function getLastTeamMemberFinishedAtLocal(
  participants: RaceStartListResult[],
  participantId: string
): string | null {
  // Find the specified participant
  const participant = participants.find((p) => p.id === participantId);
  if (!participant) {
    throw new Error(`Participant with ID ${participantId} not found`);
  }

  // Check if participant has a team_id
  const teamId = (participant as any).team_id;
  if (!teamId) {
    throw new Error(`Participant ${participantId} has no team_id`);
  }

  // Find all team members who have finished (have a finished_at_local timestamp)
  const finishedTeamMembers = participants.filter((p) => {
    const pTeamId = (p as any).team_id;
    return (
      pTeamId === teamId && // Same team
      p.finished_at_local && // Has finished
      participantHasFinished(p) // Has valid finish time
    );
  });

  // If no team members have finished, return null
  if (finishedTeamMembers.length === 0) {
    return null;
  }

  // Find the latest (most recent) finished_at_local timestamp
  const latestFinishTime = finishedTeamMembers.reduce((latest, current) => {
    if (!latest) return current.finished_at_local;
    if (!current.finished_at_local) return latest;

    // Compare timestamps and return the later one
    return new Date(current.finished_at_local) > new Date(latest)
      ? current.finished_at_local
      : latest;
  }, null as string | null);

  return latestFinishTime;
}

/**
 * Determines if a race type represents a relay race.
 *
 * Relay races are team-based events where multiple participants from the same team
 * take turns completing segments of the race course. This function checks against
 * the database enum values defined in RACE_TYPES constants.
 *
 * @param raceType - The race type number to evaluate (1=individual, 2=relay)
 * @returns True if the race type is a relay, false otherwise
 *
 * @example
 * ```typescript
 * // Check if a race is a relay before calculating team times
 * if (isRelay(raceEvent.race_type)) {
 *   const teamFinishTime = getLastTeamMemberFinishedAtLocal(participants, participantId);
 *   calculateRelayTeamTime(teamFinishTime);
 * }
 *
 * // Filter relay races from a list of events
 * const relayRaces = raceEvents.filter(event => isRelay(event.race_type));
 *
 * // Conditional UI rendering for relay-specific features
 * {isRelay(race.race_type) && <RelayTeamStandings />}
 *
 * // Using with database enum values
 * const relayEvent = { race_type: RACE_TYPES.RELAY };
 * console.log(isRelay(relayEvent.race_type)); // true
 *
 * const individualEvent = { race_type: RACE_TYPES.INDIVIDUAL };
 * console.log(isRelay(individualEvent.race_type)); // false
 * ```
 *
 * @throws No exceptions thrown - handles null/undefined gracefully
 */
export function isRelay(
  publicRaceEvent: PublicRaceEvent | null | undefined
): boolean {
  return publicRaceEvent?.race_type === RACE_TYPES.RELAY;
}

/**
 * Checks if all participants in a relay team have finished the race.
 * A relay team is considered finished when all participants with the same team_id have completed their leg.
 *
 * @param participants - Array of race participants to check
 * @param teamId - The team ID to check for completion
 * @returns True if all team members have finished, false otherwise
 *
 * @throws {Error} When team_id is null or undefined
 *
 * @example
 * ```typescript
 * // Check if relay team has completed
 * const teamFinished = hasRelayTeamFinished(
 *   raceStartListResults,
 *   'team-123'
 * );
 *
 * if (teamFinished) {
 *   console.log('All team members have finished');
 *   // Calculate team time and position
 * }
 * ```
 */
export function hasRelayTeamFinished(
  participants: RaceStartListResult[],
  teamId: string
): boolean {
  if (!teamId) {
    throw new Error("teamId cannot be null or undefined");
  }

  // Find all participants with the matching team_id
  const teamMembers = participants.filter((p) => {
    const pTeamId = (p as any).team_id;
    return pTeamId === teamId;
  });

  // If no team members found, team hasn't finished
  if (teamMembers.length === 0) {
    return false;
  }

  // Check if all team members have finished
  return teamMembers.every((member) => participantHasFinished(member));
}

/**
 * Calculate team order for a participant based on finished_at_local times
 */
export const getTeamOrder = (
  participant: RaceStartListResult,
  allParticipants: RaceStartListResult[]
): number | null => {
  const teamId = (participant as any).team_id;

  // Return null if no team or hasn't finished
  if (!teamId || !participant.finished_at_local) {
    return null;
  }

  // Get all finished team members
  const teamMembers = allParticipants.filter((p) => {
    const pTeamId = (p as any).team_id;
    return pTeamId === teamId && p.finished_at_local;
  });

  // Sort by finished_at_local to determine order
  const sortedTeamMembers = teamMembers.sort((a, b) => {
    const timeA = new Date(a.finished_at_local!).getTime();
    const timeB = new Date(b.finished_at_local!).getTime();
    return timeA - timeB;
  });

  // Find the participant's position in the sorted list (1-indexed)
  const orderIndex = sortedTeamMembers.findIndex(
    (p) => p.id === participant.id
  );
  return orderIndex >= 0 ? orderIndex + 1 : null;
};
