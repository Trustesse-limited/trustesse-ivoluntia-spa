'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store';
import { registerSessionExpiredHandler } from '@/lib/axios';
import { refreshTokenAction } from '@/app/actions/auth';
import logger from '@/lib/logger';
import SessionExpiredModal from './SessionExpiredModal';

/**
 * Refresh the access token this long before it expires, so a user who is
 * actively using the app never sees the session-expired modal.
 */
const REFRESH_LEAD_MS = 5 * 60 * 1000;
/**
 * How often the expiration cookie is re-checked. Covers login mid-session,
 * clock drift, laptop sleep, and refreshes triggered by other components.
 */
const RECHECK_INTERVAL_MS = 60 * 1000;

/**
 * Read a client-readable cookie value (or undefined when absent).
 */
function readCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionExpired, setSessionExpired, isAuthenticated } = useAuthStore();
  // Guards against overlapping refreshes (scheduled timer + interval + tab
  // visibility can all fire close together)
  const isRefreshingRef = useRef(false);

  /**
   * Background session renewal: while the user is authenticated, refresh the
   * access token REFRESH_LEAD_MS before it expires. The server action rotates
   * the tokens and rewrites the token_expiration / refresh_token_expiration
   * cookies, so the schedule below self-adjusts after every refresh.
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    let refreshTimeout: NodeJS.Timeout | null = null;

    const refreshNow = async () => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;
      try {
        const result = await refreshTokenAction();
        if (result.success) {
          logger.log('[SessionRefresh] Access token refreshed ahead of expiry');
          // The session is healthy again — close the expiry modal if a
          // previous lapse (e.g. laptop sleep) had opened it
          setSessionExpired(false);
          // Re-arm against the NEW expiration the server action just stored
          scheduleRefresh();
        } else {
          // Do NOT re-arm immediately: if the refresh token is dead this
          // would loop at delay 0. The 60s recheck retries instead, and the
          // existing expiry modal surfaces when the access token actually
          // runs out.
          logger.error('[SessionRefresh] Automatic refresh failed:', result.error);
        }
      } catch (error) {
        logger.error('[SessionRefresh] Automatic refresh errored:', error);
      } finally {
        isRefreshingRef.current = false;
      }
    };

    const scheduleRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);

      const raw = readCookie('token_expiration');
      const expirationTime = raw ? parseInt(raw, 10) : NaN;
      if (Number.isNaN(expirationTime)) {
        // No expiration cookie yet (e.g. right before first login) — the
        // periodic recheck will pick it up once it exists
        return;
      }

      // delay 0 when we're already inside the 5-minute lead window (covers
      // page loads where the token is about to expire, and recovery after
      // sleep where the token may have already expired but the refresh
      // token is still valid)
      const delay = Math.max(0, expirationTime - REFRESH_LEAD_MS - Date.now());
      refreshTimeout = setTimeout(refreshNow, delay);
    };

    // Arm the timer for the current token, then keep re-checking
    scheduleRefresh();
    const intervalId = setInterval(scheduleRefresh, RECHECK_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') scheduleRefresh();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, setSessionExpired]);

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      // Never surface the modal without an authenticated session: after a
      // logout, late 401s from in-flight requests (whose cookies were just
      // cleared) must not reopen the modal on the login screen.
      if (!useAuthStore.getState().isAuthenticated) {
        return;
      }

      // A 401 can be produced by a request that was already in flight with
      // the old (pre-refresh) access token. The refresh flow rotates the
      // token and updates the client-readable token_expiration cookie
      // server-side, so if the stored access token is not actually expired
      // yet, ignore the 401 — otherwise the modal re-appears immediately
      // after a successful refresh. (Server-side revocation of a
      // still-unexpired token is still caught by DashboardLayout's periodic
      // validateToken check.)
      const expirationTime = readCookie('token_expiration');
      if (
        expirationTime &&
        !Number.isNaN(parseInt(expirationTime, 10)) &&
        Date.now() < parseInt(expirationTime, 10)
      ) {
        return;
      }

      setSessionExpired(true);
    });
  }, [setSessionExpired]);

  // The modal is non-dismissable via backdrop click or an X button (neither
  // calls onClose). onClose only fires from the modal's own success paths —
  // e.g. after a successful "Refresh Session" — so it must actually close the
  // modal. Previously it was a no-op, which left the modal open over the app
  // even after the token refresh API succeeded.
  return (
    <>
      {children}
      <SessionExpiredModal
        isOpen={sessionExpired}
        onClose={() => setSessionExpired(false)}
        canRefresh={true}
      />
    </>
  );
}