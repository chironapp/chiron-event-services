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

/**
 * Format a datetime string to a readable time format
 * 
 * @param dateTimeString - The ISO datetime string or null
 * @returns Formatted time string (e.g., "10:30:45 AM") or "-" if null
 * 
 * @example
 * ```typescript
 * formatDateTime("2025-12-11T10:30:45") // "10:30:45 AM"
 * formatDateTime(null) // "-"
 * ```
 */
export function formatDateTime(dateTimeString: string | null): string {
  if (!dateTimeString) return "-";
  
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return "-";
  }
}

/**
 * Format a local datetime string (without timezone info) to a readable time format
 * This function treats the input as already being in local time, avoiding UTC conversion
 * 
 * @param dateTimeString - The datetime string in local time (e.g., "2025-12-11T10:30:45") or null
 * @returns Formatted time string (e.g., "10:30:45 AM") or "-" if null
 * 
 * @example
 * ```typescript
 * formatDateTimeLocal("2025-12-11T10:30:45") // "10:30:45 AM" (in local time)
 * formatDateTimeLocal(null) // "-"
 * ```
 */
export function formatDateTimeLocal(dateTimeString: string | null): string {
  if (!dateTimeString) return "-";
  
  try {
    // Parse the datetime string as local time by removing any timezone info
    // and treating the components as local
    const cleanedString = dateTimeString.replace(/Z|[+-]\d{2}:\d{2}$/i, '');
    const date = new Date(cleanedString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "-";
    }
    
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return "-";
  }
}

/**
 * Format time from centiseconds to readable format (HH:MM:SS or MM:SS)
 * 
 * @param centiseconds - Time in centiseconds (hundredths of a second)
 * @returns Formatted time string or "-" if null
 * 
 * @example
 * ```typescript
 * formatTime(6000) // "1:00" (60 seconds)
 * formatTime(360000) // "1:00:00" (1 hour)
 * formatTime(null) // "-"
 * ```
 */
export function formatTime(centiseconds: number | null): string {
  if (!centiseconds) return "-";

  const totalSeconds = Math.floor(centiseconds / 100);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

/**
 * Format a date string to short format (e.g., "April 15, 2024")
 * 
 * @param dateString - The date string to format (ISO format)
 * @returns Formatted date string in "Month Day, Year" format
 * 
 * @example
 * ```typescript
 * formatShortDate("2024-04-15") // "April 15, 2024"
 * ```
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
