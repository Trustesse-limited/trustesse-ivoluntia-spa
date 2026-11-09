import type { Viewport } from 'next';

/**
 * Viewport configuration for the application.
 *
 * Moved from the root layout's metadata (`viewport` field) because
 * Next.js 15+ only supports specific viewport properties in metadata
 * and recommends the generateViewport() API instead.
 */
export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  };
}