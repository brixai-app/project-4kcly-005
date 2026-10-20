import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/shadcn";
import type { Recipe } from "@/mock";
import RecipeCard from "./RecipeCard";

export interface RecipeListProps {
  /** Recipes to render in the list */
  recipes: Recipe[];
  /** Optional flag to show loading state (used by pages when searching/filtering) */
  loading?: boolean;
  /** Optional copy to show when there are no recipes */
  emptyStateMessage?: string;
  /** Optional page size override (defaults to 9) */
  pageSize?: number;
  /** Enable intersection-observer based infinite scroll in addition to button */
  enableInfiniteScroll?: boolean;
  /** Optional className for outer wrapper */
  className?: string;
}

/**
 * RecipeList renders a full-width, responsive, masonry-like grid of RecipeCards
 * with client-side pagination and optional infinite scroll. This is a purely
 * frontend component; all recipe data is mocked and comes from src/mock.ts.
 */
const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  loading = false,
  emptyStateMessage = "No recipes match your current filters. Try adjusting your search or generate something new with AI.",
  pageSize = 9,
  enableInfiniteScroll = true,
  className,
}) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination when the recipe list changes significantly
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [recipes, pageSize]);

  const hasMore = useMemo(() => visibleCount < recipes.length, [visibleCount, recipes.length]);

  const visibleRecipes = useMemo(
    () => recipes.slice(0, visibleCount),
    [recipes, visibleCount]
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + pageSize, recipes.length));
  };

  // Optional intersection observer for infinite scroll behavior
  useEffect(() => {
    if (!enableInfiniteScroll) return;
    if (!hasMore) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleLoadMore();
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px 200px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [enableInfiniteScroll, hasMore, pageSize, recipes.length]);

  const showEmpty = !loading && recipes.length === 0;

  return (
    <section
      className={cn(
        "w-full py-8 sm:py-10 lg:py-12 bg-gradient-to-b from-stone-50 via-stone-50/95 to-stone-100/90 dark:from-stone-900 dark:via-stone-900/95 dark:to-stone-950/95",
        className
      )}
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Header row for context, can be extended by parent via composition if needed */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 font-['Playfair_Display'] whitespace-normal break-words">
              Explore recipes
            </h2>
            <p className="mt-1 text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl whitespace-normal break-words">
              Scroll through cozy bowls, vibrant salads, and AI-crafted ideas. Everything
              here is generated and stored locally in your browser.
            </p>
          </div>
        </div>

        {/* Empty state */}
        {showEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300/70 dark:border-stone-700/80 bg-white/70 dark:bg-stone-900/70 px-6 py-12 text-center shadow-sm"
          >
            <p className="text-base sm:text-lg text-stone-800 dark:text-stone-100 font-medium mb-2 whitespace-normal break-words">
              {emptyStateMessage}
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-lg whitespace-normal break-words">
              This app is fully mocked in-browser with no real backend or AI model. Try
              adjusting filters or using the AI generator to create a brand new recipe.
            </p>
          </motion.div>
        )}

        {/* Masonry-like grid */}
        <div className="mt-2 sm:mt-4">
          <AnimatePresence mode="sync">
            {loading && recipes.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-7"
              >
                {Array.from({ length: pageSize }).map((_, index) => (
                  <div
                    key={index}
                    className="h-72 sm:h-80 rounded-2xl bg-stone-200/70 dark:bg-stone-800/70 animate-pulse"
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                layout
                className={cn(
                  "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-7",
                  "[&>*:nth-child(6n+1)]:sm:row-span-2 [&>*:nth-child(6n+3)]:xl:row-span-2",
                  "auto-rows-[minmax(0,1fr)]"
                )}
              >
                {visibleRecipes.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="min-h-[260px] flex"
                  >
                    <RecipeCard recipe={recipe} className="flex-1" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination / Load more */}
        {!showEmpty && recipes.length > 0 && (
          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3">
            {hasMore ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLoadMore}
                  className="rounded-full px-6 sm:px-8 py-2.5 text-sm sm:text-base font-medium border-stone-400/80 dark:border-stone-600/80 bg-amber-50/80 hover:bg-amber-100/90 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 text-stone-900 dark:text-amber-100 shadow-sm transition-colors"
                >
                  Load more recipes
                </Button>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 whitespace-normal break-words">
                  Showing {visibleRecipes.length} of {recipes.length} recipes
                </p>
              </>
            ) : (
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 whitespace-normal break-words">
                You&apos;ve reached the end of your current recipe collection. New AI recipes
                you generate will appear here automatically.
              </p>
            )}
            {/* Intersection observer sentinel for optional infinite scroll */}
            {enableInfiniteScroll && hasMore && (
              <div ref={loadMoreRef} className="h-6 w-full" aria-hidden="true" />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecipeList;