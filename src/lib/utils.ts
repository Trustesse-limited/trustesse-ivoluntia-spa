import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumberWithCommas(value: number): string {
  return value.toLocaleString("en-US");
}

/**
 * Normalize a program status from the Programs API to a lowercase string.
 *
 * The API returns `status` as a numeric enum on reads (observed: 0 = draft /
 * not yet active, 1 = active) while the UI filters/badges and the
 * update-program-status endpoint use string statuses ('pending', 'active',
 * 'completed', 'forfeited', 'cancelled'). Normalizing once at the mapping
 * boundary keeps every filter and badge working with strings — previously the
 * raw number reached `status.toLowerCase()` and crashed the programs tables.
 *
 * Numeric values follow the statuses offered by the admin Update-Status modal
 * (Pending, Active, Completed, Forfeited, Cancelled); unobserved values are
 * stringified rather than guessed into a wrong bucket.
 */
export function normalizeProgramStatus(status: unknown): string {
  if (typeof status === "string") {
    return status.toLowerCase();
  }
  if (typeof status === "number") {
    switch (status) {
      case 0:
        return "pending";
      case 1:
        return "active";
      case 2:
        return "completed";
      case 3:
        return "forfeited";
      case 4:
        return "cancelled";
      default:
        return String(status);
    }
  }
  // Missing/unknown shape: fall back to active (matches the old `|| 'Active'`)
  return "active";
}

/**
 * Format a program location from the API into a display string.
 *
 * The Programs API returns `location` as a Location object on program
 * payloads (e.g. { address, city, state, country, zipcode }) even though the
 * UI renders it directly as a React child — rendering the raw object crashes
 * React ("Objects are not valid as a React child"). Strings pass through
 * unchanged.
 */
export function formatProgramLocation(location: unknown): string {
  if (typeof location === "string") {
    return location;
  }
  if (location && typeof location === "object") {
    const loc = location as Record<string, unknown>;
    const parts = [
      loc.address,
      loc.city,
      loc.state ?? loc.stateName,
      loc.country ?? loc.countryName,
      loc.zipcode ?? loc.zipCode,
    ].filter((part): part is string => typeof part === "string" && part.trim() !== "");
    if (parts.length > 0) {
      return parts.join(", ");
    }
  }
  return "";
}

/**
 * Format a program start/end date range for display.
 *
 * Produces strings like "July 30 - Aug 20, 2026".
 *
 * The Programs API sometimes returns timestamps with more than 3 fractional
 * seconds (e.g. `2026-07-30T13:46:05.9193372`). ECMAScript's ISO date parser
 * only accepts exactly 3 digits (milliseconds), so `new Date()` on those
 * strings yields an Invalid Date. We normalize the fractional seconds to 3
 * digits before parsing, and return an empty string when the dates are
 * missing or unparseable so callers never render "Invalid Date".
 */
export function formatProgramDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string {
  if (!startDate || !endDate) return "";

  // Normalize fractional seconds to exactly 3 digits (milliseconds).
  // Handles 1-7+ digit fractions safely: ".5" -> ".500", ".9193372" -> ".919"
  const normalizeMs = (iso: string) =>
    iso.replace(/\.\d+/, (match) => {
      const digits = match.slice(1);
      const padded = (digits + "000").slice(0, 3);
      return "." + padded;
    });

  const start = new Date(normalizeMs(startDate));
  const end = new Date(normalizeMs(endDate));

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "";
  }

  const startMonth = start.toLocaleDateString("en-US", { month: "long" });
  const startDay = start.getDate();
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const endDay = end.getDate();
  const endYear = end.getFullYear();

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
}

