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

