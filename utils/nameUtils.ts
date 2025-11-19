/**
 * Utility functions for working with user names and profiles
 */

/**
 * Generates a full name from first and last name components
 *
 * @param firstName - The person's first name
 * @param lastName - The person's last name
 * @returns The full name as "firstName lastName", or empty string if both are empty
 *
 * @example
 * ```typescript
 * getFullName("John", "Doe") // returns "John Doe"
 * getFullName("John", "") // returns "John"
 * getFullName("", "Doe") // returns "Doe"
 * getFullName("", "") // returns ""
 * ```
 */
export const getFullName = (firstName?: string, lastName?: string): string => {
  const first = firstName?.trim() || "";
  const last = lastName?.trim() || "";

  if (!first && !last) {
    return "";
  }

  if (!first) {
    return last;
  }

  if (!last) {
    return first;
  }

  return `${first} ${last}`;
};

/**
 * Gets the initials from a full name or first/last name components
 *
 * @param firstName - The person's first name
 * @param lastName - The person's last name
 * @returns The initials as uppercase letters
 *
 * @example
 * ```typescript
 * getInitials("John", "Doe") // returns "JD"
 * getInitials("John", "") // returns "J"
 * getInitials("", "") // returns ""
 * ```
 */
export const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.trim() || "";
  const last = lastName?.trim() || "";

  const firstInitial = first.charAt(0).toUpperCase();
  const lastInitial = last.charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`.trim();
};

/**
 * Capitalizes the first letter of a string
 *
 * @param text - The text to capitalize
 * @returns The text with the first letter capitalized
 *
 * @example
 * ```typescript
 * capitalizeFirst("male") // returns "Male"
 * capitalizeFirst("FEMALE") // returns "Female"
 * capitalizeFirst("") // returns ""
 * ```
 */
export const capitalizeFirst = (text?: string): string => {
  if (!text) return "";

  const trimmed = text.trim();
  if (!trimmed) return "";

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

/**
 * Generates a full name with race number from first name, last name, and race number
 *
 * @param firstName - The person's first name
 * @param lastName - The person's last name
 * @param raceNumber - The person's race number
 * @returns The full name with race number as "firstName lastName (#raceNumber)", or just the name if no race number
 *
 * @example
 * ```typescript
 * getNameWithRaceNumber("John", "Doe", "123") // returns "John Doe (#123)"
 * getNameWithRaceNumber("John", "Doe", 123) // returns "John Doe (#123)"
 * getNameWithRaceNumber("John", "Doe", null) // returns "John Doe"
 * getNameWithRaceNumber("John", "", "123") // returns "John (#123)"
 * ```
 */
export const getNameWithRaceNumber = (
  firstName?: string,
  lastName?: string,
  raceNumber?: string | number | null
): string => {
  const fullName = getFullName(firstName, lastName);

  if (!raceNumber) {
    return fullName;
  }

  const raceNumberStr = String(raceNumber).trim();
  if (!raceNumberStr) {
    return fullName;
  }

  return fullName ? `${fullName} (#${raceNumberStr})` : `(#${raceNumberStr})`;
};
