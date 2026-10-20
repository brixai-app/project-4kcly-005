import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
} from "@/components/ui/shadcn";
import { Recipe, useApp } from "@/mock";

export interface RecipeCardProps {
  recipe: Recipe;
  /**
   * When true, renders a favorite toggle icon button in the header.
   * Uses mocked favorite state from src/mock.ts (localStorage only, no backend).
   */
  showFavoriteToggle?: boolean;
  /**
   * Optional flag to render a more compact layout (for side rails, etc.)
   */
  dense?: boolean;
}

const imageMotion = {
  rest: { scale: 1, opacity: 1 },
  hover: { scale: 1.03, opacity: 1 },
};

const cardMotion = {
  rest: { y: 0, boxShadow: "0 8px 24px rgba(20, 12, 8, 0.03)" },
  hover: { y: -4, boxShadow: "0 14px 32px rgba(20, 12, 8, 0.12)" },
};

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  showFavoriteToggle = true,
  dense = false,
}) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useApp();

  const favorite = isFavorite(recipe.id);

  const handleNavigate = () => {
    navigate(`/recipe/${encodeURIComponent(recipe.id)}`);
  };

  const handleFavoriteClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(recipe.id);
  };

  const previewSnippet = React.useMemo(() => {
    const base = recipe.description || recipe.instructions[0] || "";
    if (base.length <= 120) return base;
    return `${base.slice(0, 117)}...`;
  }, [recipe.description, recipe.instructions]);

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardMotion}
      transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.9 }}
      className="h-full"
    >
      <Card
        role="button"
        aria-label={`View recipe: ${recipe.title}`}
        tabIndex={0}
        onClick={handleNavigate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigate();
          }
        }}
        className="group flex h-full flex-col overflow-hidden border border-[#e0d2c4]/80 bg-[#fdf8f3] text-[#3e2c23] shadow-sm transition-colors duration-200 hover:border-[#d6b9a0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d94f4f]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f5f0] dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
      >
        <div className="relative w-full overflow-hidden bg-[#f3e4d6] dark:bg-neutral-900">
          <motion.img
            loading="lazy"
            decoding="async"
            src={recipe.image}
            alt={recipe.title}
            variants={imageMotion}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="h-52 w-full object-cover transition-[filter] duration-300 group-hover:brightness-[1.04] sm:h-56 md:h-60"
          />
        </div>

        <CardHeader className="flex flex-1 flex-col gap-3 pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="font-['Playfair_Display'] text-lg font-semibold leading-snug tracking-tight text-[#3e2c23] dark:text-neutral-50">
              {recipe.title}
            </CardTitle>

            {showFavoriteToggle && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
                onClick={handleFavoriteClick}
                className="mt-0.5 h-8 w-8 shrink-0 rounded-full border border-transparent bg-white/70 text-[#d94f4f] shadow-sm transition-colors duration-200 hover:border-[#f3c0b8] hover:bg-[#fef4f3] dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-neutral-800"
              >
                <Heart
                  className={`h-4 w-4 transition-colors duration-200 ${
                    favorite ? "fill-current" : "fill-transparent"
                  }`}
                />
              </Button>
            )}
          </div>

          <CardDescription className="text-[0.8rem] font-medium uppercase tracking-[0.18em] text-[#a27c5b] dark:text-amber-200/80">
            {recipe.cuisine} • {totalTime} min • Serves {recipe.servings}
          </CardDescription>

          {!dense && (
            <CardContent className="mt-1.5 px-0 pb-0">
              <p className="text-sm leading-relaxed text-[#5b4335] dark:text-neutral-300">
                {previewSnippet}
              </p>
            </CardContent>
          )}
        </CardHeader>

        <CardContent className="mt-auto flex flex-col gap-3 pt-0">
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-[#e0c7ae] bg-[#f9f0e7] px-3 py-1 text-[0.7rem] font-medium tracking-wide text-[#5b4335] transition-colors duration-200 group-hover:border-[#d6b9a0] group-hover:bg-[#f4e3d3] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
              >
                {tag}
              </Badge>
            ))}
            {recipe.isGenerated && (
              <Badge
                variant="outline"
                className="rounded-full border-[#f0b8aa] bg-[#fef1ee] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#c53c3c] transition-colors duration-200 group-hover:border-[#e69584] group-hover:bg-[#ffe4dc] dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-200"
              >
                AI Crafted
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pb-3">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#a27c5b]/90 dark:text-neutral-400">
              Tap to open recipe
            </span>

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full border-[#d3b399] bg-white/80 px-3 text-xs font-semibold tracking-wide text-[#7a5036] shadow-sm transition-[background-color,border-color,color] duration-200 group-hover:border-[#c28f6e] group-hover:bg-[#f6e2cf] group-hover:text-[#5b3420] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:bg-neutral-800"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
};

export default RecipeCard;