import { RACE_STATUSES } from "@/constants/raceTypes";

/**
 * Returns true if the participant has a non-null finish_time100 (i.e., has finished).
 * @param participant - The participant object (should have finish_time100 property)
 * @returns {boolean} True if finish_time100 is not null, else false
 * @example
 * if (participantHasFinished(participant)) { ... }
 */
export function participantHasFinished(participant: {
  finish_time100?: number | null;
}): boolean {
  return participant.finish_time100 != null;
}

/**
 * Returns a formatted string with full name and race number, e.g. "Clive Gross (#4)"
 * @param firstName - First name
 * @param lastName - Last name
 * @param raceNumber - Race number
 * @returns string
 */
export function getNameWithRaceNumber(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  raceNumber: number | string | null | undefined
): string {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  if (name && raceNumber) {
    return `${name} (#${raceNumber})`;
  }
  if (name) return name;
  if (raceNumber) return `#${raceNumber}`;
  return "";
}

/**
 * Determines if a race has been finished/completed
 * @param raceStatus - The current race status
 * @returns True if the race is finished, false otherwise
 *
 * @example
 * ```typescript
 * const isFinished = isRaceFinished("completed"); // Returns true
 * const notFinished = isRaceFinished("started"); // Returns false
 * ```
 */
export function isRaceFinished(raceStatus: string | null): boolean {
  return (
    raceStatus === RACE_STATUSES.COMPLETED ||
    raceStatus === RACE_STATUSES.PRELIMINARY_RESULTS ||
    raceStatus === RACE_STATUSES.FINAL_RESULTS
  );
}

/**
 * Determines if a race has not yet started
 * @param raceStatus - The current race status
 * @returns True if the race has not started, false otherwise
 *
 * @example
 * ```typescript
 * const notStarted = isRaceNotStarted("draft"); // Returns true
 * const hasStarted = isRaceNotStarted("started"); // Returns false
 * ```
 */
export function isRaceNotStarted(raceStatus: string | null): boolean {
  return (
    raceStatus === RACE_STATUSES.PAUSED ||
    raceStatus === RACE_STATUSES.DRAFT ||
    raceStatus === RACE_STATUSES.REGISTRATION_OPEN ||
    raceStatus === RACE_STATUSES.REGISTRATION_CLOSED ||
    raceStatus === null
  );
}
