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

/**
 * Get participant status based on race status and participant data
 * @param participant - The participant object with finish_time100 and position
 * @param raceStatus - The race status
 * @returns Status string for display
 *
 * @example
 * ```typescript
 * getParticipantStatus({ position: 1, finish_time100: 12000 }, "completed") // Returns "Finished"
 * getParticipantStatus({ position: -1, finish_time100: null }, "completed") // Returns "Did Not Start"
 * ```
 */
export function getParticipantStatus(
  participant: {
    position?: number | null;
    finish_time100?: number | null;
  },
  raceStatus: string | null
): string {
  // Check if race hasn't started
  if (isRaceNotStarted(raceStatus)) {
    return "Not Started";
  }

  // Check for special positions (negative values)
  if (participant.position !== null && participant.position !== undefined) {
    if (participant.position === -1) return "Did Not Start";
    if (participant.position === -2) return "Did Not Finish";
    if (participant.position === -3) return "Disqualified";
    if (participant.position < 0) return "No Result";
  }

  // Check if participant has finished
  if (participantHasFinished(participant)) {
    return "Finished";
  }

  // Race has started but participant hasn't finished
  if (raceStatus === RACE_STATUSES.STARTED) {
    return "Started";
  }

  return "Not Started";
}

/**
 * Format position in relation to total (e.g., "2nd of 48")
 * @param position - The participant's position
 * @param total - Total number of participants
 * @returns Formatted position string
 *
 * @example
 * ```typescript
 * formatPositionOfTotal(2, 48) // Returns "2nd of 48"
 * formatPositionOfTotal(1, 100) // Returns "1st of 100"
 * formatPositionOfTotal(null, 100) // Returns "-"
 * ```
 */
export function formatPositionOfTotal(
  position: number | null | undefined,
  total: number | null | undefined
): string {
  if (
    position === null ||
    position === undefined ||
    position <= 0 ||
    !total
  ) {
    return "-";
  }

  const suffix = getOrdinalSuffix(position);
  return `${position}${suffix} of ${total}`;
}

/**
 * Get ordinal suffix for a number (st, nd, rd, th)
 * @param num - The number
 * @returns Ordinal suffix
 */
function getOrdinalSuffix(num: number): string {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return "th";
  }

  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
