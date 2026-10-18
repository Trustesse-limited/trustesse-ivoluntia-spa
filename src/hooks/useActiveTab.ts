'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Tab state persisted in the URL query string (e.g. ?tab=active).
 *
 * Keeps the active tab in sync with the URL so that:
 * - refreshing the page preserves the active tab
 * - tabs can be deep-linked / shared as URLs
 * - browser back/forward navigation moves between tabs
 *
 * @param defaultTab Tab to use when the URL has no (or an invalid) param
 * @param allowedTabs List of valid tab keys for this page
 * @param paramName Query string param name (defaults to "tab")
 */
export function useActiveTab<T extends string = string>(
  defaultTab: T,
  allowedTabs: readonly T[],
  paramName: string = 'tab'
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramValue = searchParams.get(paramName);

  const isValidTab = useCallback(
    (value: string | null): value is T =>
      value !== null && (allowedTabs as readonly string[]).includes(value),
    [allowedTabs]
  );

  const [activeTab, setActiveTabState] = useState<T>(() =>
    isValidTab(paramValue) ? paramValue : defaultTab
  );

  // Sync state when the URL changes (back/forward, navigation from another
  // page, or a direct load with a ?tab= param)
  useEffect(() => {
    if (isValidTab(paramValue)) {
      setActiveTabState(paramValue);
    } else {
      setActiveTabState(defaultTab);
    }
  }, [paramValue, defaultTab, isValidTab]);

  const setActiveTab = useCallback(
    (tab: T) => {
      setActiveTabState(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramName, tab);
      // replace (not push) so tab switches don't spam the history stack
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, paramName]
  );

  return [activeTab, setActiveTab] as const;
}
