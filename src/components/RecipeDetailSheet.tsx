import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Clock, Flame, ChefHat, CheckCircle2, Copy, X } from "lucide-react";
import { toast } from "sonner";

import { Recipe } from "@/mock";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Button,
  Badge,
  Separator,
} from "@/components/ui/shadcn";

export interface RecipeDetailSheetProps {
  recipe: Recipe | null;
  isOpen: boolean;
  isFavorite: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFavorite: (recipeId: string) => void;
}

const difficultyLabel: Record<Recipe["difficulty"], string> = {
  easy: "Gentle",
  medium: "Involved",
  hard: "Weekend Project",
};

const difficultyColorClasses: Record<Recipe["difficulty"], string> = {
  easy: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-700/60",
  medium:
    "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-50 dark:border-amber-700/60",
  hard: "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-900/30 dark:text-rose-50 dark:border-rose-700/60",
};

function totalTime(recipe: Recipe | null): number | null {
  if (!recipe) return null;
  return recipe.prepTimeMinutes + recipe.cookTimeMinutes;
}

async function copyIngredientsToClipboard(recipe: Recipe | null) {
  if (!recipe || !navigator?.clipboard) {
    toast.error("Clipboard not available");
    return;
  }

  try {
    const list = recipe.ingredients
      .map((ing) => `• ${ing.quantity} ${ing.name}`.trim())
      .join("\n");
    const header = `${recipe.title} – Shopping / Mise en Place List`;
    await navigator.clipboard.writeText(`${header}\n\n${list}`);
    toast.success("Ingredients copied to clipboard");
  } catch (err) {
    console.error("Failed to copy ingredients", err);
    toast.error("Unable to copy ingredients right now");
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0 },
};

const RecipeDetailSheet: React.FC<RecipeDetailSheetProps> = ({
  recipe,
  isOpen,
  isFavorite,
  onOpenChange,
  onToggleFavorite,
}) => {
  const timeTotal = totalTime(recipe);

  const handleToggleFavorite = () => {
    if (!recipe) return;
    onToggleFavorite(recipe.id);
    toast.success(
      isFavorite ? "Removed from your warm little favorites stack" : "Tucked into your favorites",
    );
  };

  const handleCopyIngredients = () => {
    copyIngredientsToClipboard(recipe);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl px-0 sm:px-0 border-l border-amber-100/60 dark:border-amber-900/40 bg-gradient-to-b from-stone-50 via-amber-50/40 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950/95"
      >
        <div className="flex flex-col h-full w-full">
          <SheetHeader className="px-6 pt-4 pb-3 border-b border-amber-100/80 dark:border-stone-800/80 bg-gradient-to-r from-amber-50/80 via-stone-50/80 to-rose-50/60 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950/80 backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <SheetTitle className="font-['Playfair_Display'] text-left text-xl sm:text-2xl md:text-3xl leading-snug text-stone-900 dark:text-amber-50 whitespace-normal break-words">
                  {recipe ? recipe.title : "Recipe"}
                </SheetTitle>
                {recipe?.description && (
                  <SheetDescription className="mt-1 text-left text-sm sm:text-[0.95rem] text-stone-600 dark:text-stone-300 whitespace-normal break-words">
                    {recipe.description}
                  </SheetDescription>
                )}
                {recipe && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge
                      className={`border text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 ${difficultyColorClasses[recipe.difficulty]}`}
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>{difficultyLabel[recipe.difficulty]}</span>
                    </Badge>
                    {timeTotal != null && (
                      <Badge className="border border-amber-200 bg-amber-50/70 text-amber-900 text-xs font-medium rounded-full px-3 py-1 flex items-center gap-1 dark:bg-amber-900/20 dark:text-amber-50 dark:border-amber-800/70">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{timeTotal} min total</span>
                      </Badge>
                    )}
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        className="border border-stone-200 bg-stone-50/80 text-stone-800 dark:border-stone-700/70 dark:bg-stone-900/60 dark:text-stone-100 text-[0.7rem] font-medium rounded-full px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {recipe.isGenerated && (
                      <Badge className="border border-rose-200 bg-rose-50/80 text-rose-900 dark:border-rose-800/70 dark:bg-rose-900/30 dark:text-rose-50 text-[0.7rem] font-medium rounded-full px-3 py-1 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        Mock AI
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  {recipe && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
                      onClick={handleToggleFavorite}
                      className={`h-9 w-9 rounded-full border transition-colors duration-200 ${
                        isFavorite
                          ? "border-rose-300 bg-rose-100 text-rose-700 hover:bg-rose-200 dark:border-rose-700 dark:bg-rose-900/50 dark:text-rose-100 dark:hover:bg-rose-900"
                          : "border-stone-200 bg-white/80 text-stone-700 hover:bg-rose-50/80 hover:text-rose-600 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-100 dark:hover:bg-stone-800"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Close details"
                    onClick={() => onOpenChange(false)}
                    className="h-9 w-9 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100/80 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800/80 border border-transparent"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {recipe?.cuisine && (
                  <p className="text-[0.72rem] uppercase tracking-[0.14em] text-amber-700/80 dark:text-amber-200/80 font-semibold">
                    {recipe.cuisine}
                  </p>
                )}
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent dark:scrollbar-thumb-stone-700">
            <AnimatePresence mode="wait" initial={false}>
              {recipe && (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="flex flex-col gap-4 pb-6"
                >
                  {/* Hero image */}
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative w-full overflow-hidden rounded-none sm:rounded-2xl border-b sm:border border-amber-100/80 dark:border-stone-800/80 bg-stone-200/60 dark:bg-stone-900/60 shadow-sm"
                  >
                    <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover transform transition-[filter,transform] duration-500 hover:scale-[1.03] hover:brightness-[1.03]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/55 via-stone-950/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-amber-50 backdrop-blur-sm">
                          <Clock className="w-3.5 h-3.5" />
                          {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min table-ready
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-3 py-1 text-xs font-medium text-stone-100 backdrop-blur-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Hands-on {recipe.prepTimeMinutes} min
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Actions row */}
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.33, delay: 0.05, ease: "easeOut" }}
                    className="px-6 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleToggleFavorite}
                        className={`rounded-full px-4 h-9 text-sm font-medium shadow-sm transition-colors duration-200 flex items-center gap-2 ${
                          isFavorite
                            ? "bg-rose-500 hover:bg-rose-600 text-rose-50 dark:bg-rose-500 dark:hover:bg-rose-400"
                            : "bg-amber-600 hover:bg-amber-700 text-amber-50 dark:bg-amber-500 dark:hover:bg-amber-400"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                        {isFavorite ? "Saved to your stack" : "Save to favorites"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleCopyIngredients}
                        className="rounded-full h-9 px-3 text-xs sm:text-sm border-amber-200 bg-white/70 text-stone-800 hover:bg-amber-50/80 hover:text-amber-900 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-100 dark:hover:bg-stone-800/80 flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy ingredients
                      </Button>
                    </div>

                    <div className="flex flex-col items-end text-[0.7rem] text-stone-500 dark:text-stone-400 leading-tight">
                      <span>
                        Prep {recipe.prepTimeMinutes} min · Cook {recipe.cookTimeMinutes} min
                      </span>
                      <span>Created {new Date(recipe.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>

                  <Separator className="mt-1 mb-1 bg-amber-100/80 dark:bg-stone-800/80" />

                  {/* Ingredients & Instructions */}
                  <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                    {/* Ingredients */}
                    <motion.section
                      variants={sectionVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
                      className="md:col-span-5 min-w-0"
                    >
                      <h3 className="font-['Playfair_Display'] text-lg text-stone-900 dark:text-amber-50 mb-2">
                        Ingredients
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                        Think of this as a gentle guideline—swap in what you actually have and keep the
                        spirit of the bowl.
                      </p>
                      <ul className="space-y-2">
                        <AnimatePresence initial={false}>
                          {recipe.ingredients.map((ing, index) => (
                            <motion.li
                              key={`${ing.name}-${index}`}
                              variants={listItemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              transition={{
                                duration: 0.22,
                                ease: "easeOut",
                                delay: 0.02 * index,
                              }}
                              className="flex items-start gap-2 text-sm text-stone-800 dark:text-stone-100"
                            >
                              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-amber-500/90 dark:bg-amber-400/90 flex-shrink-0" />
                              <span className="flex-1 whitespace-normal break-words">
                                <span className="font-medium text-stone-900 dark:text-stone-50">
                                  {ing.quantity}
                                </span>{" "}
                                <span className="text-stone-700 dark:text-stone-200">{ing.name}</span>
                              </span>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    </motion.section>

                    {/* Instructions */}
                    <motion.section
                      variants={sectionVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.38, delay: 0.07, ease: "easeOut" }}
                      className="md:col-span-7 min-w-0"
                    >
                      <h3 className="font-['Playfair_Display'] text-lg text-stone-900 dark:text-amber-50 mb-2">
                        Method
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                        Cook slowly enough that you can tidy as you go, sip something, and enjoy the
                        rhythm. These are steps, not rules.
                      </p>
                      <ol className="space-y-3">
                        <AnimatePresence initial={false}>
                          {recipe.instructions.map((step, index) => (
                            <motion.li
                              key={index}
                              variants={listItemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              transition={{
                                duration: 0.24,
                                ease: "easeOut",
                                delay: 0.03 * index,
                              }}
                              className="relative pl-7 text-sm text-stone-800 dark:text-stone-100 whitespace-normal break-words"
                            >
                              <span className="absolute left-0 top-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/90 text-[0.7rem] font-semibold text-amber-50 shadow-sm dark:bg-amber-500">
                                {index + 1}
                              </span>
                              {step}
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ol>
                    </motion.section>
                  </div>

                  {/* Tags row */}
                  {recipe.tags.length > 0 && (
                    <motion.div
                      variants={sectionVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }}
                      className="px-6 pb-3"
                    >
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
                          Tagged under
                        </span>
                        {recipe.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="rounded-full border border-stone-200 bg-stone-50/80 text-[0.7rem] font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-900/70 dark:text-stone-100 px-3 py-1"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RecipeDetailSheet;