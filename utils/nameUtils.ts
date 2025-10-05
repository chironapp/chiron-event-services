/**
 * Utility functions for formatting names
 */

/**
 * Get full name from first and last name
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Full name with proper spacing
 */
export function getFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string {
  const first = firstName?.trim() || "";
  const last = lastName?.trim() || "";
  
  if (!first && !last) {
    return "";
  }
  
  return `${first} ${last}`.trim();
}

/**
 * Capitalize the first letter of a string
 * @param str - String to capitalize
 * @returns String with first letter capitalized
 */
export function capitalizeFirst(str: string | null | undefined): string {
  if (!str) return "";
  const trimmed = str.trim();
  if (trimmed.length === 0) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}
