import React from "react";
import { Skeleton } from "@/components/ui/shadcn";

export type SkeletonVariant = "card" | "list" | "hero" | "text";

export interface LoadingSkeletonProps {
  /**
   * Visual variant of the skeleton block.
   */
  variant?: SkeletonVariant;
  /**
   * Number of items for list-like variants.
   */
  count?: number;
  /**
   * Optional additional className for the outer wrapper.
   */
  className?: string;
}

/**
 * Reusable skeleton primitives with warm, lifestyle-oriented proportions.
 *
 * NOTE: This is purely a visual loading component – it does not fetch data.
 * All actual data and state are mocked client-side in src/mock.ts (no backend).
 */
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = "card",
  count = 3,
  className = "",
}) => {
  if (variant === "hero") {
    return <HeroSkeleton className={className} />;
  }

  if (variant === "list") {
    return (
      <div
        className={`w-full space-y-4 sm:space-y-5 animate-pulse ${className}`}
        aria-hidden="true"
     >
        {Array.from({ length: Math.max(1, count) }).map((_, idx) => (
          <CardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (variant === "text") {
    return <TextSkeletonLines count={count} className={className} />;
  }

  // default: single card
  return (
    <div className={className} aria-hidden="true">
      <CardSkeleton />
    </div>
  );
};

interface HeroSkeletonProps {
  className?: string;
}

const HeroSkeleton: React.FC<HeroSkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full min-h-[320px] sm:min-h-[420px] md:min-h-[520px] overflow-hidden rounded-none bg-gradient-to-br from-[#fdf4ed] via-[#f9e6d8] to-[#f5d5c0] dark:from-[#1f130f] dark:via-[#1a1715] dark:to-[#251c17] ${className}`}
      aria-hidden="true"
    >
      {/* Shimmer overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.35),_transparent_55%)] opacity-60 dark:opacity-30" />

      <div className="relative h-full w-full flex items-center">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 sm:py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7 min-w-0 flex flex-col gap-4 sm:gap-6">
            <Skeleton className="h-8 sm:h-10 w-32 rounded-full bg-[#f3c0a0]/80 dark:bg-[#3a241b]" />
            <div className="space-y-3 sm:space-y-4">
              <Skeleton className="h-10 sm:h-12 w-4/5 max-w-[480px] rounded-lg bg-[#fbe1c7]/90 dark:bg-[#3b2b22]" />
              <Skeleton className="h-6 w-3/5 max-w-[360px] rounded-md bg-[#fbe1c7]/80 dark:bg-[#3b2b22]" />
            </div>
            <div className="space-y-2 sm:space-y-3 mt-2 sm:mt-4">
              <Skeleton className="h-4 w-full sm:w-4/5 max-w-[540px] rounded-md bg-[#fbe1c7]/80 dark:bg-[#3b2b22]" />
              <Skeleton className="h-4 w-11/12 sm:w-3/4 max-w-[520px] rounded-md bg-[#fbe1c7]/70 dark:bg-[#3b2b22]" />
            </div>
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
              <Skeleton className="h-11 sm:h-12 w-36 sm:w-40 rounded-full bg-[#f4a261] dark:bg-[#e29578]" />
              <Skeleton className="h-11 sm:h-12 w-32 sm:w-36 rounded-full bg-[#f6c29b] dark:bg-[#9e5c3c]" />
            </div>
          </div>

          <div className="lg:col-span-5 min-w-[280px] min-w-0 flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl bg-[#f2d0b6] dark:bg-[#2b201a] overflow-hidden shadow-md shadow-orange-900/10 dark:shadow-black/40">
              <Skeleton className="absolute inset-4 rounded-2xl bg-[#f9e0cf] dark:bg-[#3b2b2a]" />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,_rgba(255,255,255,0)_0%,_rgba(255,255,255,0.6)_40%,_rgba(255,255,255,0)_80%)] animate-[shimmer_1.8s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CardSkeletonProps {
  compact?: boolean;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ compact = false }) => {
  return (
    <div className="w-full rounded-3xl border border-orange-100/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 shadow-sm overflow-hidden">
      <div className="relative w-full h-40 sm:h-52 md:h-56 overflow-hidden bg-gradient-to-tr from-[#fbe1c7] via-[#f6c29b] to-[#f4a261] dark:from-[#2b1c16] dark:via-[#3b261d] dark:to-[#4b2d21]">
        <Skeleton className="absolute inset-0 rounded-none bg-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,_rgba(255,255,255,0)_0%,_rgba(255,255,255,0.65)_45%,_rgba(255,255,255,0)_80%)] animate-[shimmer_1.6s_infinite]" />
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
        <Skeleton className="h-5 sm:h-6 w-2/3 rounded-md bg-orange-100/90 dark:bg-neutral-800" />
        <Skeleton className="h-4 w-3/4 rounded-md bg-orange-100/80 dark:bg-neutral-800" />
        {!compact && (
          <>
            <Skeleton className="h-4 w-full rounded-md bg-orange-50/90 dark:bg-neutral-800" />
            <Skeleton className="h-4 w-11/12 rounded-md bg-orange-50/80 dark:bg-neutral-800" />
          </>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-full bg-orange-50/90 dark:bg-neutral-800" />
          <Skeleton className="h-6 w-14 rounded-full bg-orange-50/80 dark:bg-neutral-800" />
          <Skeleton className="h-6 w-20 rounded-full bg-orange-50/70 dark:bg-neutral-800" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-24 rounded-md bg-orange-50/90 dark:bg-neutral-800" />
          <Skeleton className="h-9 w-24 rounded-full bg-[#2a9d8f]/80 dark:bg-[#2a9d8f]" />
        </div>
      </div>
    </div>
  );
};

interface TextSkeletonLinesProps {
  count?: number;
  className?: string;
}

const TextSkeletonLines: React.FC<TextSkeletonLinesProps> = ({
  count = 4,
  className = "",
}) => {
  const safeCount = Math.max(1, count);
  return (
    <div className={`space-y-2 sm:space-y-3 ${className}`} aria-hidden="true">
      {Array.from({ length: safeCount }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={`h-4 rounded-md bg-orange-50/80 dark:bg-neutral-800 ${
            idx === safeCount - 1 ? "w-2/3" : "w-full"
          }`}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;

/**
 * Tailwind keyframes (to be added once in your global CSS if not present):
 *
 * @layer utilities {
 *   @keyframes shimmer {
 *     0% { transform: translateX(-100%); }
 *     100% { transform: translateX(100%); }
 *   }
 *   .animate-shimmer {
 *     animation: shimmer 1.6s infinite linear;
 *   }
 * }
 *
 * This file only defines React components. Animation utility classes above are
 * referenced via arbitrary values like `animate-[shimmer_1.6s_infinite]`.
 */