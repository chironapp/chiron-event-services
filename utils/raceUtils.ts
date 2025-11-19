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
