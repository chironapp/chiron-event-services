/**
 * Date formatting utility functions
 */

/**
 * Format a date string to "Friday 11 December 2025" format
 * 
 * @param dateString - The date string to format (ISO format or null)
 * @returns Formatted date string or "Date TBA" if null
 * 
 * @example
 * ```typescript
 * formatEventDate("2025-12-11") // "Thursday 11 December 2025"
 * formatEventDate(null) // "Date TBA"
 * ```
 */
export function formatEventDate(dateString: string | null): string {
  if (!dateString) return "Date TBA";
  const date = new Date(dateString);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
}
