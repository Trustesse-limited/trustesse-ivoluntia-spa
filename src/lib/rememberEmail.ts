/**
 * iVoluntia — Remembered Email Utility
 *
 * Persists the user's email address ONLY when the user explicitly ticks
 * the "Remember me" checkbox. When unchecked (or on logout), the email is
 * removed from storage.
 *
 * This util is the single source of truth for remembered-email persistence.
 * It is intentionally separate from the auth/onboarding stores so that
 * email is NEVER implicitly stored by middleware rehydration.
 */

const REMEMBERED_EMAIL_KEY = 'ivoluntia_remembered_email';

/**
 * Saves the user's email to localStorage (only called when "Remember me" is ticked).
 */
export function saveRememberedEmail(email: string): void {
  try {
    if (typeof window === 'undefined') return;
    const sanitized = email.trim().toLowerCase();
    if (!sanitized) {
      clearRememberedEmail();
      return;
    }
    window.localStorage.setItem(REMEMBERED_EMAIL_KEY, sanitized);
  } catch (error) {
    console.error('[rememberEmail] Failed to save remembered email:', error);
  }
}

/**
 * Reads the remembered email from localStorage, if any.
 */
export function getRememberedEmail(): string {
  try {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
  } catch (error) {
    console.error('[rememberEmail] Failed to read remembered email:', error);
    return '';
  }
}

/**
 * Removes the remembered email from localStorage.
 */
export function clearRememberedEmail(): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  } catch (error) {
    console.error('[rememberEmail] Failed to clear remembered email:', error);
  }
}

export { REMEMBERED_EMAIL_KEY };