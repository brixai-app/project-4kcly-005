import React, { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, Clock, Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Badge,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/shadcn";
import { Recipe, useMockStore, toggleSavedRecipe } from "@/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface RecipeCardProps {
  recipe: Recipe;
  /** Optional className for outer wrapper */
  className?: string;
}

// Note: This component uses fully mocked client-side state via src/mock.ts.
// There is NO real backend – save/unsave and data are purely in-browser.

const MotionCard = motion(Card);
const MotionButton = motion(Button);

const hoverVariants = {
  initial: { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: {
    y: -4,
    boxShadow:
      "0 18px 45px rgba(15, 23, 42, 0.16)",
    transition: {
      duration: 0.22,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

const imageVariants = {
  initial: { scale: 1.02, y: 0 },
  hover: {
    scale: 1.05,
    y: -4,
    transition: {
      duration: 0.35,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className }) => {
  const navigate = useNavigate();
  const savedIds = useMockStore((s) => s.savedRecipeIds);
  const isSaved = savedIds.includes(recipe.id);

  const handleCardClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleToggleSave = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleSavedRecipe(recipe.id);

    toast(isSaved ? "Removed from saved" : "Recipe saved", {
      description: isSaved
        ? "This recipe is no longer in your saved collection."
        : "Find it anytime in your profile's saved recipes.",
    });
  };

  const accentBg = recipe.accentColor || "#E29578";

  return (
    <MotionCard
      role="article"
      tabIndex={0}
      aria-label={recipe.title}
      className={cn(
        "group flex h-full flex-col overflow-hidden border border-slate-200/70 bg-[rgb(252,248,244)]/90",
        "dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl",
        "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70",
        className
      )}
      initial="initial"
      whileHover="hover"
      variants={hoverVariants}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <div className="relative overflow-hidden">
        <motion.div
          variants={imageVariants}
          className="relative h-52 w-full overflow-hidden bg-slate-200 dark:bg-slate-800"
        >
          <img
            src={recipe.heroImageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* Organic color wash overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply"
            style={{ background: accentBg }}
          />

          {/* Soft bottom gradient for legibility */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-5 pb-4 pt-6 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <CardTitle className="font-['Playfair_Display'] text-lg font-semibold leading-snug tracking-tight text-white whitespace-normal break-words">
                  {recipe.title}
                </CardTitle>
                {recipe.subtitle && (
                  <CardDescription className="text-xs font-medium text-slate-100/90 whitespace-normal break-words">
                    {recipe.subtitle}
                  </CardDescription>
                )}
              </div>

              {typeof recipe.averageRating === "number" && recipe.ratingCount ? (
                <div className="flex shrink-0 flex-col items-end gap-0.5 rounded-full bg-black/30 px-3 py-1 text-right text-xs font-medium text-amber-100 backdrop-blur-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{recipe.averageRating.toFixed(1)}</span>
                  </span>
                  <span className="text-[10px] text-amber-50/80">
                    {recipe.ratingCount} review{recipe.ratingCount === 1 ? "" : "s"}
                  </span>
                </div>
              ) : (
                <div className="flex shrink-0 items-center rounded-full bg-black/30 px-3 py-1 text-[11px] font-medium text-amber-100 backdrop-blur-sm">
                  New
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-slate-900 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-amber-100"
              >
                {recipe.cuisine.replace("-", " ")}
              </Badge>
              {recipe.dietTags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-full border-white/60 bg-white/90 px-2.5 py-0.5 text-[11px] font-medium lowercase text-slate-900 shadow-sm backdrop-blur-sm dark:border-slate-600/80 dark:bg-slate-900/80 dark:text-slate-100"
                >
                  {tag}
                </Badge>
              ))}
              {recipe.dietTags.length > 2 && (
                <Badge
                  variant="outline"
                  className="rounded-full border-white/50 bg-transparent px-2 py-0.5 text-[11px] font-medium text-slate-100 backdrop-blur-sm dark:border-slate-600/60"
                >
                  +{recipe.dietTags.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <CardHeader className="space-y-3 pb-2 pt-4">
        <p className="text-sm text-slate-700/90 dark:text-slate-100/90 whitespace-normal break-words font-['Inter']">
          {recipe.description}
        </p>
      </CardHeader>

      <CardContent className="mt-auto flex flex-col gap-3 pb-2">
        <div className="flex items-center justify-between gap-4 text-xs font-medium text-slate-700/90 dark:text-slate-200/90">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-100/5 dark:text-slate-100"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: accentBg }}
              />
              {recipe.difficulty === "easy"
                ? "Relaxed"
                : recipe.difficulty === "medium"
                ? "Balanced"
                : "Weekend Project"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
              <span>
                {recipe.prepTimeMinutes} min prep
              </span>
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-400/60 dark:bg-slate-500/80" />
            <span>{recipe.cookTimeMinutes} min cook</span>
            <span className="h-1 w-1 rounded-full bg-slate-400/60 dark:bg-slate-500/80" />
            <span>Serves {recipe.servings}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 border-t border-slate-200/70 bg-white/70 px-5 py-3.5 dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Tap to see full recipe · ingredients · reviews
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <MotionButton
              type="button"
              variant={isSaved ? "default" : "outline"}
              size="icon"
              aria-pressed={isSaved}
              aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
              onClick={handleToggleSave}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-150",
                isSaved
                  ? "border-transparent bg-amber-600 text-amber-50 hover:bg-amber-700"
                  : "border-slate-300 bg-white text-slate-700 hover:border-amber-400 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-200"
              )}
            >
              <Bookmark
                className={cn(
                  "h-4 w-4 transition-colors duration-150",
                  isSaved && "fill-current"
                )}
              />
            </MotionButton>
          </TooltipTrigger>
          <TooltipContent side="top" className="font-['Inter'] text-xs">
            {isSaved ? "Remove from saved" : "Save for later"}
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </MotionCard>
  );
};

export default RecipeCard;