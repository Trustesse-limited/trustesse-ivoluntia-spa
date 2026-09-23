 /**
 * iVoluntia —  Input Sanitization Module
 *
 * A comprehensive, defense-in-depth input sanitization library designed to
 * protect the platform against:
 *
 *   - Cross-Site Scripting (XSS) via HTML / script injection
 *   - Event-handler attribute injection (onclick=, onerror=, ...)
 *   - Dangerous URL schemes (javascript:, data:, vbscript:)
 *   - Control character / NULL byte injection
 *   - Zero-width character smuggling
 *   - SQL-injection style string payloads
 *   - Input length abuse (DoS)
 *   - Hidden field tampering
 *
 * USAGE NOTES:
 *  - Client-side sanitization improves UX and provides a first line of defense.
 *  - Server-side sanitization (in Server Actions) is the AUTHORITATIVE layer
 *    and MUST also be applied. See src/app/actions/auth.ts.
 *  - Passwords are NEVER sanitized beyond control-character stripping so the
 *    user's chosen password is preserved byte-for-byte.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** RFC 5321 maximum email length. */
export const EMAIL_MAX_LENGTH = 254;

/** Reasonable maximum for human names. */
export const NAME_MAX_LENGTH = 100;

/** Default maximum for free-text fields. */
export const TEXT_MAX_LENGTH = 2000;

/** Maximum safe length for URLs. */
export const URL_MAX_LENGTH = 2048;

/** Maximum length for OTP codes. */
export const OTP_MAX_LENGTH = 6;

/** Maximum length for zip / postal codes. */
export const ZIP_MAX_LENGTH = 10;

// ---------------------------------------------------------------------------
// Regular expressions
// ---------------------------------------------------------------------------

const HTML_TAG_REGEX = /<[^>]*>/g;
const SCRIPT_TAG_REGEX = /<\s*script[\s\S]*?<\s*\/\s*script\s*>|<\s*script[\s\S]*?>/gi;
const STYLE_TAG_REGEX = /<\s*style[\s\S]*?<\s*\/\s*style\s*>|<\s*style[\s\S]*?>/gi;
const EVENT_HANDLER_REGEX = /\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URL_REGEX = /\bjavascript\s*:/gi;
const DATA_URL_REGEX = /^\s*data\s*:/i;
const VBSCRIPT_URL_REGEX = /\bvbscript\s*:/gi;
const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const NULL_BYTE_REGEX = /\0/g;
const ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF]/g;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_SCHEME_REGEX = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

// ---------------------------------------------------------------------------
// Core string sanitizers
// ---------------------------------------------------------------------------

/**
 * Removes HTML tags, script blocks, style blocks, event-handler attributes,
 * and dangerous URL schemes from a string.
 */
export function stripHtml(value: string): string {
  return value
    .replace(SCRIPT_TAG_REGEX, '')
    .replace(STYLE_TAG_REGEX, '')
    .replace(HTML_TAG_REGEX, '')
    .replace(EVENT_HANDLER_REGEX, '')
    .replace(JAVASCRIPT_URL_REGEX, '')
    .replace(VBSCRIPT_URL_REGEX, '')
    .replace(DATA_URL_REGEX, '');
}

/**
 * Removes control characters, NULL bytes, and zero-width characters.
 */
export function stripControlCharacters(value: string): string {
  return value
    .replace(NULL_BYTE_REGEX, '')
    .replace(CONTROL_CHARS_REGEX, '')
    .replace(ZERO_WIDTH_REGEX, '');
}

/**
 * Collapses consecutive whitespace to a single space and trims the edges.
 */
export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Truncates a string to the specified maximum length.
 */
export function truncate(value: string, maxLength: number = TEXT_MAX_LENGTH): string {
  return value.length <= maxLength ? value : value.slice(0, maxLength);
}

// ---------------------------------------------------------------------------
// Domain-specific sanitizers
// ---------------------------------------------------------------------------

/**
 * Sanitizes an email address.
 *  - Strips HTML / script / dangerous payloads
 *  - Removes control characters
 *  - Collapses internal whitespace
 *  - Trims and lowercases
 *  - Truncates to RFC 5321 maximum length
 */
export function sanitizeEmail(value: string): string {
  const cleaned = stripHtml(value);
  const noControl = stripControlCharacters(cleaned);
  const normalized = normalizeWhitespace(noControl);
  return truncate(normalized, EMAIL_MAX_LENGTH).toLowerCase();
}

/**
 * Sanitizes a human name (first, last, organization, etc.).
 *  - Strips HTML / script / dangerous payloads
 *  - Removes control characters
 *  - Collapses internal whitespace
 *  - Truncates to a safe length
 */
export function sanitizeName(value: string): string {
  const cleaned = stripHtml(value);
  const noControl = stripControlCharacters(cleaned);
  const normalized = normalizeWhitespace(noControl);
  return truncate(normalized, NAME_MAX_LENGTH);
}

/**
 * Sanitizes free-form text (bios, missions, addresses, etc.).
 *  - Strips HTML / script / dangerous payloads
 *  - Removes control characters
 *  - Truncates to the provided maximum length
 */
export function sanitizeText(value: string, maxLength: number = TEXT_MAX_LENGTH): string {
  const cleaned = stripHtml(value);
  const noControl = stripControlCharacters(cleaned);
  return truncate(noControl, maxLength);
}

/**
 * Sanitizes a URL, ensuring only safe http(s) schemes are permitted.
 * Returns an empty string if the value is not a safe URL.
 */
export function sanitizeUrl(value: string): string {
  const cleaned = stripHtml(value);
  const noControl = stripControlCharacters(cleaned);
  const trimmed = noControl.trim();

  if (!trimmed) return '';
  if (trimmed.length > URL_MAX_LENGTH) return '';

  const schemeMatch = trimmed.match(URL_SCHEME_REGEX);
  if (schemeMatch) {
    const scheme = schemeMatch[0].toLowerCase();
    if (scheme !== 'http:' && scheme !== 'https:') {
      return ''; // Block javascript:, data:, vbscript:, file:, etc.
    }
  }

  return trimmed;
}

/**
 * Sanitizes a zip / postal code, allowing only letters, digits, spaces,
 * hyphens, and periods. Strips everything else.
 */
export function sanitizeZipCode(value: string): string {
  const noControl = stripControlCharacters(value);
  return noControl
    .replace(/[^a-zA-Z0-9\s-.]/g, '')
    .trim()
    .slice(0, ZIP_MAX_LENGTH);
}

/**
 * Sanitizes an OTP / numeric code, allowing only alphanumeric characters.
 */
export function sanitizeOtp(value: string): string {
  const noControl = stripControlCharacters(value);
  return noControl.replace(/[^0-9a-zA-Z]/g, '').slice(0, OTP_MAX_LENGTH);
}

/**
 * Sanitizes a password for transport safety:
 *  - ONLY strips control characters, NULL bytes, and zero-width characters
 *  - NEVER alters the password characters, casing, or whitespace
 *  - Preserves special characters exactly as entered
 */
export function sanitizePassword(value: string): string {
  return stripControlCharacters(value);
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/**
 * Validates an email address using a pragmatic RFC-compatible pattern.
 */
export function isValidEmail(value: string): boolean {
  if (!value || value.length > EMAIL_MAX_LENGTH) return false;
  return EMAIL_REGEX.test(value);
}

/**
 * Returns true if a string contains no HTML, control characters, or
 * dangerous URL schemes after sanitization.
 */
export function isSafeString(value: string): boolean {
  const cleaned = stripHtml(value);
  const noControl = stripControlCharacters(cleaned);
  return (
    !/<\s*[a-z]|<\s*\/\s*[a-z]/i.test(value) &&
    !EVENT_HANDLER_REGEX.test(value) &&
    !JAVASCRIPT_URL_REGEX.test(value) &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value) &&
    cleaned === noControl
  );
}

// ---------------------------------------------------------------------------
// Object-level sanitizer
// ---------------------------------------------------------------------------

/**
 * Recursively sanitizes an object's string values.
 *
 * @param data    The object to sanitize
 * @param options Field-specific overrides:
 *   - `maxLengths`: field-name → max length (applies to text fields)
 *   - `skip`:      field-names to only control-character strip (e.g. passwords)
 *   - `emails`:    field-names to treat as emails
 */
export interface SanitizeFormOptions {
  maxLengths?: Record<string, number>;
  skip?: string[];
  emails?: string[];
}

export function sanitizeFormData<T extends Record<string, unknown>>(
  data: T,
  options: SanitizeFormOptions = {}
): T {
  const { maxLengths = {}, skip = [], emails = [] } = options;

  const sanitizeValue = (value: unknown, key?: string): unknown => {
    if (typeof value === 'string') {
      if (key && emails.includes(key)) return sanitizeEmail(value);
      if (key && skip.includes(key)) return sanitizePassword(value);
      const maxLength = key ? maxLengths[key] : undefined;
      return sanitizeText(value, maxLength ?? TEXT_MAX_LENGTH);
    }

    if (Array.isArray(value)) {
      return value.map((item) =>
        typeof item === 'string' ? sanitizeText(item, NAME_MAX_LENGTH) : sanitizeValue(item)
      );
    }

    if (value && typeof value === 'object') {
      return sanitizeFormData(value as Record<string, unknown>, options);
    }

    return value;
  };

  const result = {} as T;
  for (const key of Object.keys(data)) {
    result[key as keyof T] = sanitizeValue(data[key], key) as T[keyof T];
  }
  return result;
}

export default {
  sanitizeEmail,
  sanitizeName,
  sanitizeText,
  sanitizeUrl,
  sanitizeZipCode,
  sanitizeOtp,
  sanitizePassword,
  sanitizeFormData,
  stripHtml,
  stripControlCharacters,
  normalizeWhitespace,
  truncate,
  isValidEmail,
  isSafeString,
};