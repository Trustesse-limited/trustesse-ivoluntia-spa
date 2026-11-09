"use client";

/* The raw <img> stages intentionally bypass the next/image optimizer as a
   resilience fallback (optimized → direct → placeholder), so this rule is
   disabled for this file on purpose. */
/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type SmartImageProps = {
  /** Image URL (usually from an API). Empty/invalid values show the fallback immediately. */
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  /** Fill the nearest positioned parent — same semantics as `next/image`'s `fill`. */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
  /** Last-resort image when the source (and all retries) fail. Defaults to /placeholder.svg. */
  fallbackSrc?: string;
  /** How many times each strategy is retried before escalating to the next one. */
  maxRetries?: number;
  /** Base delay between retries; grows linearly with each attempt. */
  retryDelayMs?: number;
  /** Treat as failed (and retry) if neither `load` nor `error` fires within this window. */
  loadTimeoutMs?: number;
  objectFit?: "contain" | "cover";
  /** Extra classes for the wrapper (sizing, rounding, margins). */
  className?: string;
  /** Extra classes for the inner <img>. */
  imgClassName?: string;
  /** Show a pulsing skeleton while loading. */
  showSkeleton?: boolean;
  onLoad?: () => void;
  /** Fires only when the image AND its fallback both failed. */
  onFinalError?: () => void;
};

/** Stages of the resilience ladder: optimized → direct → fallback → dead. */
type Stage = "optimized" | "direct" | "fallback" | "dead";

const isValidSrc = (value?: string | null): value is string =>
  !!value && value.trim().length > 0 && /^(https?:\/\/|\/\/|data:|blob:|\/)/i.test(value.trim());

export function SmartImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  quality,
  unoptimized,
  fallbackSrc = "/placeholder.svg",
  maxRetries = 2,
  retryDelayMs = 500,
  loadTimeoutMs = 15000,
  objectFit = "cover",
  className = "",
  imgClassName = "",
  showSkeleton = true,
  onLoad,
  onFinalError,
}: SmartImageProps) {
  const [stage, setStage] = useState<Stage>(() =>
    isValidSrc(src) ? "optimized" : isValidSrc(fallbackSrc) ? "fallback" : "dead"
  );
  const [renderKey, setRenderKey] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const stageRef = useRef<Stage>(stage);
  const attemptRef = useRef(0);
  const finalErrorFiredRef = useRef(false);
  const srcRef = useRef(src);
  const fallbackRef = useRef(fallbackSrc);
  srcRef.current = src;
  fallbackRef.current = fallbackSrc;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /** Advance to the next (more resilient) loading strategy. */
  const escalate = useCallback(() => {
    if (stageRef.current === "optimized") {
      stageRef.current = isValidSrc(srcRef.current)
        ? "direct"
        : isValidSrc(fallbackRef.current)
          ? "fallback"
          : "dead";
    } else if (stageRef.current === "direct") {
      stageRef.current = isValidSrc(fallbackRef.current) ? "fallback" : "dead";
    } else {
      stageRef.current = "dead";
    }
    attemptRef.current = 0;
    if (stageRef.current === "dead") setLoaded(true); // the dead-state glyph must stay visible
    setStage(stageRef.current);
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[SmartImage] escalating to "${stageRef.current}" stage for`, srcRef.current);
    }
    if (stageRef.current === "dead" && !finalErrorFiredRef.current) {
      finalErrorFiredRef.current = true;
      onFinalError?.();
    }
  }, [onFinalError]);

  const handleFailure = useCallback(() => {
    if (stageRef.current === "dead") return;
    clearTimer();
    if (attemptRef.current < maxRetries) {
      // Same strategy, new attempt after a growing delay (remount via renderKey).
      attemptRef.current += 1;
      const delay = retryDelayMs * attemptRef.current;
      timerRef.current = window.setTimeout(() => setRenderKey((key) => key + 1), delay);
      return;
    }
    escalate();
  }, [clearTimer, escalate, maxRetries, retryDelayMs]);

  const handleLoad = useCallback(() => {
    clearTimer();
    setLoaded(true);
    onLoad?.();
  }, [clearTimer, onLoad]);
  // A new source = brand new lifecycle (stage, retries and fade all reset).
  useEffect(() => {
    stageRef.current = isValidSrc(src)
      ? "optimized"
      : isValidSrc(fallbackSrc)
        ? "fallback"
        : "dead";
    attemptRef.current = 0;
    finalErrorFiredRef.current = false;
    setStage(stageRef.current);
    setRenderKey(0);
    setLoaded(stageRef.current === "dead");
    clearTimer();
    return clearTimer;
  }, [src, fallbackSrc, clearTimer]);

  // Fast/cached images can finish loading before hydration attaches the handlers.
  useEffect(() => {
    const img = imgRef.current;
    if (stage !== "dead" && img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, [stage, renderKey, src]);

  // Watchdog: hung or silently-failed requests count as errors and get retried.
  useEffect(() => {
    if (stage === "dead" || loaded) return;
    clearTimer();
    timerRef.current = window.setTimeout(handleFailure, loadTimeoutMs);
    return clearTimer;
  }, [stage, renderKey, loaded, loadTimeoutMs, handleFailure, clearTimer]);

  // Cache-bust direct retries so a poisoned cached response cannot loop forever.
  const effectiveSrc = useMemo(() => {
    if (stage === "fallback") return fallbackSrc;
    if (stage === "direct" && isValidSrc(src)) {
      if (attemptRef.current === 0) return src;
      const sep = src.includes("?") ? "&" : "?";
      return `${src}${sep}smartretry=${renderKey}-${Date.now()}`;
    }
    return null;
  }, [stage, renderKey, src, fallbackSrc]);

  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";
  const fadeClass = `transition-opacity duration-500 ease-out ${loaded ? "opacity-100" : "opacity-0"}`;
  const innerClass = `h-full w-full ${fitClass} ${fadeClass} ${fill ? "absolute inset-0 " : ""}${imgClassName}`.trim();
  const wrapperClass = `${fill ? "absolute inset-0" : "relative"} overflow-hidden ${className}`.trim();

  return (
    <div className={wrapperClass} data-smart-image-stage={stage}>
      {showSkeleton && !loaded && stage !== "dead" && (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-gray-200" />
      )}

      {stage === "dead" ? (
        <div
          role="img"
          aria-label={alt}
          className={`flex h-full w-full min-h-6 min-w-6 items-center justify-center bg-gray-100 text-gray-400 ${fadeClass}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
      ) : stage === "optimized" ? (
        <Image
          key={`optimized-${renderKey}`}
          ref={imgRef}
          src={src as string}
          alt={alt}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          sizes={sizes}
          priority={priority}
          quality={quality}
          unoptimized={unoptimized}
          onLoad={handleLoad}
          onError={handleFailure}
          className={innerClass}
        />
      ) : (
        <img
          key={`${stage}-${renderKey}`}
          ref={imgRef}
          src={effectiveSrc ?? undefined}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={handleLoad}
          onError={handleFailure}
          className={innerClass}
        />
      )}
    </div>
  );
}

export default SmartImage;

