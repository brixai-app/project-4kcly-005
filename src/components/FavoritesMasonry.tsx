import React from "react";
import { motion } from "framer-motion";
import { FavoriteRecipe } from "@/mock";
import { RecipeCard, type RecipeCardProps } from "./RecipeCard";

export interface FavoritesMasonryProps {
  favorites: FavoriteRecipe[];
  onRemove?: (recipeId: string) => void;
}

// Utility to pick a masonry span based on index for an asymmetric feel
function getRowSpan(index: number): string {
  const pattern = [
    "row-span-7",
    "row-span-9",
    "row-span-6",
    "row-span-8",
    "row-span-7",
  ]; // using base 12px auto-rows
  return pattern[index % pattern.length];
}

export const FavoritesMasonry: React.FC<FavoritesMasonryProps> = ({
  favorites,
  onRemove,
}) => {
  const handleRemove = (id: string) => {
    if (onRemove) onRemove(id);
  };

  // Constrain to valid RecipeCard mode
  const recipeCardMode: RecipeCardProps["mode"] = "remove";

  return (
    <section className="w-full py-10 lg:py-16 bg-gradient-to-b from-neutral-50 via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <header className="mb-8 lg:mb-10 flex flex-col gap-2">
          <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 dark:text-neutral-400">
            Atelier Collection
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-['Playfair_Display'] tracking-tight text-neutral-900 dark:text-neutral-50">
            Saved compositions
          </h2>
          <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Your favorite in-browser mock recipes are arranged in a loose, gallery-style grid. Each card
            is generated and stored locally in this browser only—no backend, no real AI.
          </p>
        </header>

        {favorites.length === 0 ? (
          <div className="border border-dashed border-neutral-300/80 dark:border-neutral-700/80 rounded-2xl px-6 py-10 lg:px-10 lg:py-16 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm flex flex-col items-start gap-4 transition-colors duration-200">
            <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 dark:text-neutral-400">
              Empty gallery
            </p>
            <h3 className="text-xl sm:text-2xl font-semibold font-['Playfair_Display'] text-neutral-900 dark:text-neutral-50">
              No favorites yet
            </h3>
            <p className="max-w-xl text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
              When you compose a recipe in the AtelierAI generator, you can save it to your collection.
              We keep everything entirely on this device using mock localStorage state—perfect for
              exploring without commitment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 auto-rows-[12px]">
            {favorites.map((recipe, index) => {
              const spanClass = getRowSpan(index);

              return (
                <motion.article
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.03 }}
                  className={[
                    "group relative flex",
                    "rounded-2xl overflow-hidden",
                    "bg-neutral-50/80 dark:bg-neutral-900/70",
                    "border border-neutral-200/80 dark:border-neutral-800/80",
                    "shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.65)]",
                    "backdrop-blur-sm",
                    spanClass,
                  ].join(" ")}
                >
                  {/* Subtle overlay for editorial image-first feel */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-neutral-50/20 via-transparent to-neutral-900/10 dark:from-neutral-950/40 dark:via-transparent dark:to-black/40" />

                  <div className="relative flex-1 flex flex-col">
                    <RecipeCard
                      recipe={recipe}
                      mode={recipeCardMode}
                      // Favorited recipes already live in the collection; allow RecipeCard to
                      // trigger removal via the favorites id.
                      onRemove={handleRemove}
                      // Allow RecipeCard to stretch; we manage rounded corners & shadows here
                      className="h-full border-0 shadow-none bg-transparent"
                    />
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FavoritesMasonry;