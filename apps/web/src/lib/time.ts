import { startOfDay, addMinutes, setHours, setMinutes } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime, format as tzFormat } from "date-fns-tz";

export const DEFAULT_DAY_START_HOUR = 7;
export const DEFAULT_DAY_END_HOUR = 19;
export const DEFAULT_PX_PER_MINUTE = 10 / 5; // 10px per 5 minutes = 2px per minute

/**
 * Round a date to the nearest unit_length_minutes
 */
export function roundToUnit(
  date: Date,
  unitLengthMinutes: number,
  timezone: string
): Date {
  const zonedDate = utcToZonedTime(date, timezone);
  const minutes = zonedDate.getMinutes();
  const roundedMinutes = Math.round(minutes / unitLengthMinutes) * unitLengthMinutes;
  const rounded = setMinutes(setHours(zonedDate, zonedDate.getHours()), roundedMinutes);
  return zonedTimeToUtc(rounded, timezone);
}

/**
 * Get the start of day in a timezone
 */
export function getDayStart(date: Date, timezone: string): Date {
  const zonedDate = utcToZonedTime(date, timezone);
  const start = startOfDay(zonedDate);
  return zonedTimeToUtc(start, timezone);
}

/**
 * Get the window start time (default 7am) in a timezone
 */
export function getWindowStart(date: Date, timezone: string, startHour = DEFAULT_DAY_START_HOUR): Date {
  const zonedDate = utcToZonedTime(date, timezone);
  const windowStart = setHours(startOfDay(zonedDate), startHour);
  return zonedTimeToUtc(windowStart, timezone);
}

/**
 * Get the window end time (default 7pm) in a timezone
 */
export function getWindowEnd(date: Date, timezone: string, endHour = DEFAULT_DAY_END_HOUR): Date {
  const zonedDate = utcToZonedTime(date, timezone);
  const windowEnd = setHours(startOfDay(zonedDate), endHour);
  return zonedTimeToUtc(windowEnd, timezone);
}

/**
 * Format time in timezone
 */
export function formatTime(date: Date | string, timezone: string, formatStr = "h:mm a"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return tzFormat(d, formatStr, { timeZone: timezone });
}

/**
 * Format date in timezone
 */
export function formatDate(date: Date | string, timezone: string, formatStr = "MMM d, yyyy"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return tzFormat(d, formatStr, { timeZone: timezone });
}

/**
 * Get time slots for a day
 */
export function getTimeSlots(
  date: Date,
  timezone: string,
  startHour = DEFAULT_DAY_START_HOUR,
  endHour = DEFAULT_DAY_END_HOUR,
  intervalMinutes = 30
): Date[] {
  const slots: Date[] = [];
  const windowStart = getWindowStart(date, timezone, startHour);
  const windowEnd = getWindowEnd(date, timezone, endHour);
  
  let current = windowStart;
  while (current < windowEnd) {
    slots.push(new Date(current));
    current = addMinutes(current, intervalMinutes);
  }
  
  return slots;
}

/**
 * Calculate pixel position for a time
 */
export function timeToPixels(
  time: Date,
  windowStart: Date,
  pxPerMinute: number
): number {
  const diffMs = time.getTime() - windowStart.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  return diffMinutes * pxPerMinute;
}

/**
 * Calculate time from pixel position
 */
export function pixelsToTime(
  pixels: number,
  windowStart: Date,
  pxPerMinute: number,
  unitLengthMinutes: number
): Date {
  const minutes = pixels / pxPerMinute;
  const roundedMinutes = Math.round(minutes / unitLengthMinutes) * unitLengthMinutes;
  return addMinutes(windowStart, roundedMinutes);
}

/**
 * Get current time in timezone
 */
export function getCurrentTime(timezone: string): Date {
  return utcToZonedTime(new Date(), timezone);
}
