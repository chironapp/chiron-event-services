/**
 * Tests for date utility functions
 */

import { formatDateTime, formatDateTimeLocal, formatTime, formatEventDate, formatShortDate } from '../dateUtils';

describe('formatDateTime', () => {
  it('should format ISO datetime string to readable time', () => {
    const result = formatDateTime('2025-12-11T10:30:45');
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}\s[AP]M/);
  });

  it('should return "-" for null input', () => {
    expect(formatDateTime(null)).toBe('-');
  });

  it('should handle invalid datetime string', () => {
    expect(formatDateTime('invalid')).toBe('-');
  });
});

describe('formatDateTimeLocal', () => {
  it('should format local datetime without timezone info', () => {
    const result = formatDateTimeLocal('2025-12-11T10:30:45');
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}\s[AP]M/);
  });

  it('should strip Z from UTC timestamp and treat as local', () => {
    const result = formatDateTimeLocal('2025-12-11T10:30:45Z');
    expect(result).toMatch(/10:30:45\s[AP]M/);
  });

  it('should strip timezone offset and treat as local', () => {
    const result = formatDateTimeLocal('2025-12-11T10:30:45+00:00');
    expect(result).toMatch(/10:30:45\s[AP]M/);
  });

  it('should return "-" for null input', () => {
    expect(formatDateTimeLocal(null)).toBe('-');
  });

  it('should handle invalid datetime string', () => {
    const result = formatDateTimeLocal('not-a-date');
    expect(result).toBe('-');
  });
});

describe('formatTime', () => {
  it('should format time from centiseconds (under 1 hour)', () => {
    expect(formatTime(6000)).toBe('1:00'); // 60 seconds
    expect(formatTime(15000)).toBe('2:30'); // 2 minutes 30 seconds
  });

  it('should format time from centiseconds (over 1 hour)', () => {
    expect(formatTime(360000)).toBe('1:00:00'); // 1 hour
    expect(formatTime(450000)).toBe('1:15:00'); // 1 hour 15 minutes
  });

  it('should return "-" for null input', () => {
    expect(formatTime(null)).toBe('-');
  });

  it('should return "-" for zero', () => {
    expect(formatTime(0)).toBe('-');
  });
});

describe('formatEventDate', () => {
  it('should format date to long format', () => {
    const result = formatEventDate('2025-12-11');
    expect(result).toContain('December');
    expect(result).toContain('11');
    expect(result).toContain('2025');
  });

  it('should return "Date TBA" for null input', () => {
    expect(formatEventDate(null)).toBe('Date TBA');
  });
});

describe('formatShortDate', () => {
  it('should format date to short format', () => {
    const result = formatShortDate('2024-04-15');
    expect(result).toBe('April 15, 2024');
  });
});
