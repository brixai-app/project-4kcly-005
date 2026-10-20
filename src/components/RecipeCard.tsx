import React from "react";
import { motion } from "framer-motion";
import { BookmarkPlus, BookmarkMinus, ExternalLink } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/shadcn";
import {
  GeneratedRecipe,
  FavoriteRecipe,
  getCuisineById,
  getDietaryLabel,
} from "@/mock";

export type RecipeCardMode = "save" | "remove";

export interface RecipeCardProps {
  recipe: GeneratedRecipe | FavoriteRecipe;
  /**
   * When true, shows a primary action button (save/remove).
   * Helpful when reusing the card in read-only contexts like About copy.
   */
  showPrimaryAction?: boolean;
  /**
   * Controls whether the card is currently favorited. In generator view this
   * may be false even for the same logical recipe until user clicks save.
   */
  isFavorited?: boolean;
  /**
   * Explicit mode override. When omitted, we infer from isFavorited flag.
   */
  mode?: RecipeCardMode;
  /**
   * Called when user clicks the primary action. Parent is responsible for
   * invoking saveFavorite/removeFavorite from the mocked state in src/mock.ts
   * and triggering Sonner toasts.
   */
  onPrimaryAction?: (recipe: GeneratedRecipe | FavoriteRecipe) => void;
  /**
   * Optional compact variant for dense layouts.
   */
  variant?: "default" | "compact";
  className?: string;
}

const hoverMotion = {
  initial: { y: 0, opacity: 0.98 },
  whileHover: { y: -4, boxShadow: "0 18px 45px rgba(15, 23, 42, 0.22)" },
  whileTap: { scale: 0.99 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: [0.23, 0.68, 0.24, 0.99] },
};

const buttonMotion = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.16, ease: "easeOut" as const },
};

function getPrimaryLabel(mode: RecipeCardMode, isFavorited: boolean | undefined): string {
  if (mode === "remove") return "Remove from favorites";
  return isFavorited ? "Saved" : "Save to favorites";
}

function getPrimaryIcon(mode: RecipeCardMode, isFavorited: boolean | undefined) {
  if (mode === "remove") return <BookmarkMinus className="h-4 w-4" />;
  return <BookmarkPlus className="h-4 w-4" />;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  showPrimaryAction = true,
  isFavorited,
  mode,
  onPrimaryAction,
  variant = "default",
  className,
}) => {
  const effectiveMode: RecipeCardMode = mode ?? (isFavorited ? "remove" : "save");
  const cuisine = getCuisineById(recipe.cuisineId);

  const handlePrimaryClick = () => {
    if (!onPrimaryAction) return;
    onPrimaryAction(recipe);
  };

  const containerPadding = variant === "compact" ? "p-4" : "p-6";
  const showImage = Boolean(recipe.imageUrl);

  return (
    <motion.div
      {...hoverMotion}
      className={`relative h-full ${className ?? ""}`}
    >
      <Card
        className={`group flex h-full flex-col overflow-hidden border border-zinc-200/70 bg-zinc-50/80 text-zinc-900 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-zinc-300/90 dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:text-zinc-50 dark:hover:border-zinc-700`}
      >
        {showImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-200/70 dark:bg-zinc-800">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/55 via-zinc-950/10 to-transparent" />
            {cuisine && (
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <Badge className="border border-white/40 bg-zinc-950/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-50 backdrop-blur">
                  {cuisine.name}
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader className={`${containerPadding} pb-3`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="font-['Playfair_Display'] text-xl tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-2xl">
                {recipe.title}
              </CardTitle>
              {"description" in recipe && recipe.description && (
                <CardDescription className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {recipe.description}
                </CardDescription>
              )}
            </div>

            {showPrimaryAction && (
              <motion.div {...buttonMotion} className="shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={effectiveMode === "remove" ? "outline" : "default"}
                      size="sm"
                      onClick={handlePrimaryClick}
                      className={`flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-50 shadow-sm transition-colors duration-200 hover:bg-zinc-800 dark:border-zinc-200/80 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-100 ${
                        effectiveMode === "remove"
                          ? "border-zinc-400/80 bg-transparent text-zinc-800 hover:bg-zinc-100 dark:border-zinc-500/80 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-zinc-800"
                          : ""
                      } ${isFavorited && effectiveMode === "save" ? "cursor-default opacity-80" : ""}`}
                      disabled={effectiveMode === "save" && isFavorited}
                    >
                      {getPrimaryIcon(effectiveMode, isFavorited)}
                      <span>{getPrimaryLabel(effectiveMode, isFavorited)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="end"
                    className="border border-zinc-800/80 bg-zinc-950 text-xs text-zinc-50 dark:border-zinc-200/80 dark:bg-zinc-50 dark:text-zinc-900"
                  >
                    {effectiveMode === "remove"
                      ? "This updates only your local Atelier collection in this browser."
                      : "Favoriting stays entirely in localStorage on this device — no backend, no account."}
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {cuisine && (
              <Badge className="border border-zinc-300/80 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-800 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900/80 dark:text-zinc-100">
                {cuisine.region}
              </Badge>
            )}
            {recipe.dietaryTags?.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-zinc-300/80 bg-zinc-100/70 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-700 dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-200"
              >
                {getDietaryLabel(tag)}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className={`${containerPadding} pt-0`}
        >
          <div className="grid gap-6 border-t border-dashed border-zinc-200/80 pt-5 text-sm text-zinc-800 dark:border-zinc-800/80 dark:text-zinc-100 sm:grid-cols-5 sm:gap-7">
            <div className="sm:col-span-2">
              <h3 className="font-['Playfair_Display'] text-xs font-semibold tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                INGREDIENTS
              </h3>
              <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed">
                {recipe.ingredients.map((line, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-1 h-[3px] w-[10px] shrink-0 rounded-full bg-zinc-800/70 dark:bg-zinc-200/80" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sm:col-span-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-['Playfair_Display'] text-xs font-semibold tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  STUDIO METHOD
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
                  <ExternalLink className="h-3 w-3" />
                  <span>In-Browser Mock AI</span>
                </div>
              </div>
              <ol className="mt-3 space-y-2.5 text-[13px] leading-relaxed">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-zinc-300/80 bg-white/80 text-center text-[11px] font-semibold leading-[18px] text-zinc-800 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900/80 dark:text-zinc-50">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </CardContent>

        <CardFooter className={`${containerPadding} pt-0`}
        >
          <div className="flex w-full items-center justify-between gap-4 border-t border-dotted border-zinc-200/80 pt-4 text-[11px] uppercase tracking-[0.22em] text-zinc-400 dark:border-zinc-800/80 dark:text-zinc-500">
            <span>
              Crafted locally in this browser · Mock AI · {new Date(recipe.createdAt).toLocaleDateString()}
            </span>
            <span className="hidden sm:inline-flex">No server, no upload — purely client-side.</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RecipeCard;