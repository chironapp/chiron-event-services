/**
 * Utility functions for name formatting and string manipulation
 */

/**
 * Combines first name and last name into full name
 * Handles null/undefined values gracefully
 * 
 * @param firstName - First name of the person
 * @param lastName - Last name of the person
 * @returns Full name with proper spacing, or empty string if both are empty
 * 
 * @example
 * getFullName("John", "Doe") // "John Doe"
 * getFullName("Jane", "") // "Jane"
 * getFullName("", "Smith") // "Smith"
 * getFullName("", "") // ""
 */
export function getFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string {
  const first = firstName?.trim() || "";
  const last = lastName?.trim() || "";
  
  if (first && last) {
    return `${first} ${last}`;
  }
  
  return first || last || "";
}

/**
 * Capitalizes the first letter of a string and lowercases the rest
 * Handles null/undefined values gracefully
 * 
 * @param str - String to capitalize
 * @returns Capitalized string, or empty string if input is null/undefined
 * 
 * @example
 * capitalizeFirst("hello") // "Hello"
 * capitalizeFirst("HELLO") // "Hello"
 * capitalizeFirst("") // ""
 * capitalizeFirst(null) // ""
 */
export function capitalizeFirst(str: string | null | undefined): string {
  if (!str) return "";
  
  const trimmed = str.trim();
  if (trimmed.length === 0) return "";
  
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}
