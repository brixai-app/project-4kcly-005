import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Clock, Flame, Users, Star, Sparkles } from "lucide-react";

import {
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
} from "@/components/ui/shadcn";

import { Recipe, toggleSavedRecipe, useMockStore } from "@/mock";
import ReviewSection from "./ReviewSection";
import { cn } from "@/lib/utils";

export interface RecipeDetailProps {
  recipe?: Recipe;
}

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const organicShapeVariants = {
  initial: { scale: 1.05, opacity: 0.7 },
  animate: {
    scale: 1,
    opacity: 0.95,
    transition: {
      duration: 8,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const,
    },
  },
};

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
  const savedIds = useMockStore((s) => s.savedRecipeIds);

  if (!recipe) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center px-6 lg:px-12 bg-gradient-to-b from-stone-100/70 via-stone-50 to-stone-100 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900">
        <div className="max-w-[640px] w-full bg-white/70 dark:bg-stone-900/70 border border-stone-200/70 dark:border-stone-700/80 rounded-3xl shadow-md px-8 py-10 backdrop-blur-md">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3 font-['Playfair_Display'] text-stone-900 dark:text-stone-50">
            Recipe not found
          </h1>
          <p className="text-sm md:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            This recipe may have been removed or never existed. Try heading back to the
            home or search page to explore other dishes from the mock AI kitchen.
          </p>
        </div>
      </div>
    );
  }

  const isSaved = savedIds.includes(recipe.id);

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  const handleToggleSave = () => {
    // Mock-only: this updates in-memory + localStorage state via src/mock.ts
    toggleSavedRecipe(recipe.id);
  };

  const accentBg = `${recipe.accentColor}1F`; // low opacity overlay using hex with alpha

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 text-stone-900 dark:text-stone-50">
      {/* HERO SECTION */}
      <section className="w-full min-h-[60vh] relative overflow-hidden">
        {/* Hero image */}
        <div className="absolute inset-0">
          <img
            src={recipe.heroImageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />
        </div>

        {/* Organic overlay shape */}
        <motion.div
          className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-[55%]"
          style={{
            background:
              "radial-gradient(circle at 10% 20%, rgba(244,162,97,0.75), transparent 60%), radial-gradient(circle at 80% 80%, rgba(233,196,106,0.75), transparent 55%)",
          }}
          variants={organicShapeVariants}
          initial="initial"
          animate="animate"
        />

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-16 flex flex-col gap-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[840px] bg-stone-950/40 border border-white/10 rounded-3xl px-6 md:px-8 py-6 md:py-7 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className="rounded-full bg-stone-900/80 text-stone-100 border border-white/10 text-xs uppercase tracking-[0.18em] px-3 py-1"
                >
                  {recipe.isAIgenerated ? "AI Crafted" : "Curated"}
                </Badge>
                <Badge
                  style={{ backgroundColor: recipe.accentColor }}
                  className="rounded-full text-[11px] font-medium text-stone-900 px-3 py-1 bg-opacity-90"
                >
                  {recipe.cuisine.replace("-", " ")}
                </Badge>
              </div>

              {recipe.averageRating && recipe.ratingCount ? (
                <div className="flex items-center gap-2 text-amber-200">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span className="text-sm font-medium">
                    {recipe.averageRating.toFixed(1)}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-amber-100/70">
                    {recipe.ratingCount} reviews
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-stone-200/80">
                  <Sparkles className="w-4 h-4" />
                  <span>Be the first to review this mock recipe</span>
                </div>
              )}
            </div>

            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-tight text-stone-50 whitespace-normal break-words mb-3">
              {recipe.title}
            </h1>

            {recipe.subtitle && (
              <p className="text-sm md:text-base text-stone-200/90 leading-relaxed mb-4">
                {recipe.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-5">
              <div className="flex items-center gap-2 text-stone-100/90 text-xs md:text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{totalTime} mins</span>
                <span className="text-stone-300/80 text-[11px]">total</span>
              </div>
              <Separator orientation="vertical" className="h-5 bg-stone-600/70" />
              <div className="flex items-center gap-2 text-stone-100/90 text-xs md:text-sm">
                <Users className="w-4 h-4" />
                <span className="font-medium">Serves {recipe.servings}</span>
              </div>
              <Separator orientation="vertical" className="h-5 bg-stone-600/70" />
              <div className="flex items-center gap-2 text-stone-100/90 text-xs md:text-sm">
                <Flame className="w-4 h-4" />
                <span className="capitalize font-medium">{recipe.difficulty}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              {recipe.dietTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-stone-500/70 bg-stone-900/60 text-[11px] md:text-xs text-stone-100 px-3 py-1"
                >
                  {tag.replace("-", " ")}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs md:text-sm text-stone-200/95 max-w-[520px] leading-relaxed">
                {recipe.description}
              </p>

              <motion.div whileTap={{ scale: 0.96 }}>
                <Button
                  type="button"
                  onClick={handleToggleSave}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-md border border-white/15 transition-colors duration-150",
                    isSaved
                      ? "bg-white text-stone-900 hover:bg-amber-100/90"
                      : "bg-amber-300/95 text-stone-950 hover:bg-amber-200",
                  )}
                >
                  <Bookmark
                    className={cn(
                      "w-4 h-4",
                      isSaved ? "fill-stone-900" : "fill-stone-950/80",
                    )}
                  />
                  {isSaved ? "Saved" : "Save recipe"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BODY SECTION */}
      <section className="w-full relative z-10 -mt-10 md:-mt-16 pb-16 lg:pb-24">
        <div
          className="w-full max-w-[1600px] mx-auto px-6 lg:px-12"
          style={{
            // subtle accent-tinted surface under content
            background: `linear-gradient(to bottom, ${accentBg}, transparent 40%)`,
          }}
        >
          <div className="bg-stone-50/95 dark:bg-stone-900/95 border border-stone-200/80 dark:border-stone-800 rounded-3xl shadow-[0_18px_55px_rgba(15,23,42,0.35)] backdrop-blur-xl px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-9">
            <Tabs defaultValue="ingredients" className="w-full">
              <div className="flex flex-col gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <TabsList className="bg-stone-100 dark:bg-stone-800 rounded-full p-1 inline-flex">
                    <TabsTrigger
                      value="ingredients"
                      className="rounded-full data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm px-4 py-1.5 text-xs md:text-sm"
                    >
                      Ingredients
                    </TabsTrigger>
                    <TabsTrigger
                      value="instructions"
                      className="rounded-full data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm px-4 py-1.5 text-xs md:text-sm"
                    >
                      Instructions
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="rounded-full data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm px-4 py-1.5 text-xs md:text-sm"
                    >
                      Reviews
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-stone-600 dark:text-stone-300">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-stone-500" />
                      <span>
                        Prep {recipe.prepTimeMinutes} min · Cook {recipe.cookTimeMinutes} min
                      </span>
                    </div>
                    <Separator orientation="vertical" className="hidden md:block h-5 bg-stone-200 dark:bg-stone-700" />
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-stone-500" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-stone-200 dark:bg-stone-800" />
              </div>

              {/* INGREDIENTS TAB */}
              <TabsContent value="ingredients" className="mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="ingredients"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
                  >
                    <div className="lg:col-span-7 min-w-0 flex flex-col gap-4">
                      <h2 className="font-['Playfair_Display'] text-xl md:text-2xl font-semibold text-stone-900 dark:text-stone-50">
                        What you&apos;ll need
                      </h2>
                      <p className="text-sm md:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                        These amounts are a cozy starting point from the mock AI kitchen. Adjust to
                        taste, mood, and who&apos;s gathering around your table.
                      </p>

                      <motion.ul
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-2 space-y-2.5"
                      >
                        {recipe.ingredients.map((ingredient, index) => (
                          <motion.li
                            key={ingredient.id}
                            variants={itemVariants}
                            className="flex items-start gap-3 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 px-3.5 py-3"
                          >
                            <div
                              className="mt-1 h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-semibold"
                              style={{
                                backgroundColor: recipe.accentColor,
                                color: "#1f2933",
                              }}
                            >
                              {index + 1}
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-sm md:text-[15px] font-medium text-stone-900 dark:text-stone-50">
                                  {ingredient.name}
                                </span>
                                <span className="text-xs md:text-[13px] text-stone-600 dark:text-stone-300">
                                  {ingredient.quantity}
                                </span>
                              </div>
                              {ingredient.notes && (
                                <p className="text-[11px] md:text-xs text-stone-500 dark:text-stone-400">
                                  {ingredient.notes}
                                </p>
                              )}
                            </div>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>

                    <div className="lg:col-span-5 min-w-[320px] flex flex-col gap-4">
                      <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-gradient-to-br from-white via-amber-50/70 to-stone-50 dark:from-stone-900 dark:via-stone-900/80 dark:to-stone-900 px-4 md:px-5 py-4 md:py-5 shadow-sm">
                        <h3 className="font-['Playfair_Display'] text-lg font-semibold mb-2 text-stone-900 dark:text-stone-50">
                          Pantry vibes
                        </h3>
                        <p className="text-xs md:text-sm text-stone-700 dark:text-stone-300 mb-3 leading-relaxed">
                          This is a fully mocked experience — the AI recipe ideas are generated in
                          your browser using the ingredients you share, with no real backend or
                          model calls.
                        </p>
                        {recipe.aiPromptSummary && (
                          <div className="rounded-2xl border border-amber-200/80 dark:border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/40 px-3 py-3 text-xs md:text-sm text-amber-900 dark:text-amber-100">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span className="font-semibold tracking-wide text-[11px] uppercase">
                                Prompt that inspired this
                              </span>
                            </div>
                            <p className="leading-relaxed whitespace-normal break-words">
                              {recipe.aiPromptSummary}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              {/* INSTRUCTIONS TAB */}
              <TabsContent value="instructions" className="mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="instructions"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
                  >
                    <div className="lg:col-span-7 min-w-0 flex flex-col gap-4">
                      <h2 className="font-['Playfair_Display'] text-xl md:text-2xl font-semibold text-stone-900 dark:text-stone-50">
                        Step-by-step flow
                      </h2>
                      <p className="text-sm md:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                        Move through these steps at your own pace. They&apos;re written for real home
                        kitchens, not test labs — feel free to improvise.
                      </p>

                      <motion.ol
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-3 space-y-3 md:space-y-3.5"
                      >
                        {recipe.instructions.map((step, index) => (
                          <motion.li
                            key={`${index}-${step.slice(0, 10)}`}
                            variants={itemVariants}
                            className="relative flex gap-4"
                          >
                            <div className="flex flex-col items-center mr-1">
                              <div
                                className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border shadow-sm"
                                style={{
                                  backgroundColor: "#fefce8",
                                  borderColor: recipe.accentColor,
                                  color: "#1f2933",
                                }}
                              >
                                {index + 1}
                              </div>
                              {index < recipe.instructions.length - 1 && (
                                <div className="flex-1 w-px bg-gradient-to-b from-stone-300 via-stone-300/70 to-transparent dark:from-stone-700 dark:via-stone-700/70 mt-1" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 px-3.5 py-3">
                              <p className="text-sm md:text-[15px] text-stone-800 dark:text-stone-100 leading-relaxed whitespace-normal break-words">
                                {step}
                              </p>
                            </div>
                          </motion.li>
                        ))}
                      </motion.ol>
                    </div>

                    <div className="lg:col-span-5 min-w-[320px] flex flex-col gap-4">
                      <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-gradient-to-br from-stone-50 via-stone-100/70 to-amber-50/70 dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-900 px-4 md:px-5 py-4 md:py-5 shadow-sm">
                        <h3 className="font-['Playfair_Display'] text-lg font-semibold mb-2 text-stone-900 dark:text-stone-50">
                          Serving notes
                        </h3>
                        <ul className="text-xs md:text-sm text-stone-700 dark:text-stone-300 space-y-2.5 leading-relaxed">
                          <li>
                            Taste as you go — this mock recipe is a starting point. Layer in acid,
                            salt, and richness until it feels right for you.
                          </li>
                          <li>
                            Use the steps as a loose timeline. If something looks ready earlier,
                            trust your eyes and nose over the clock.
                          </li>
                          <li>
                            This entire experience is powered by a frontend-only mock state in your
                            browser&apos;s localStorage. Clearing your data will reset the recipes.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              {/* REVIEWS TAB */}
              <TabsContent value="reviews" className="mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="reviews"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
                  >
                    <div className="lg:col-span-7 min-w-0">
                      <h2 className="font-['Playfair_Display'] text-xl md:text-2xl font-semibold mb-3 text-stone-900 dark:text-stone-50">
                        Reviews from the test kitchen
                      </h2>
                      <p className="text-sm md:text-sm text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">
                        Share how this mock recipe played out in your own kitchen — riffs,
                        substitutions, and cozy tweaks are all welcome.
                      </p>
                      <ReviewSection recipeId={recipe.id} />
                    </div>

                    <div className="lg:col-span-5 min-w-[320px] flex flex-col gap-4">
                      <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-gradient-to-br from-white via-emerald-50/70 to-stone-50 dark:from-stone-900 dark:via-stone-900/80 dark:to-stone-900 px-4 md:px-5 py-4 md:py-5 shadow-sm">
                        <h3 className="font-['Playfair_Display'] text-lg font-semibold mb-2 text-stone-900 dark:text-stone-50">
                          How feedback works here
                        </h3>
                        <p className="text-xs md:text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-2.5">
                          Ratings and reviews are stored entirely in this browser using the shared
                          mock state from <span className="font-mono text-[11px]">src/mock.ts</span>.
                          There&apos;s no backend — just a playful preview of what a full platform
                          could be.
                        </p>
                        <p className="text-xs md:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                          Refreshing the page keeps your reviews thanks to localStorage
                          persistence; clearing site data will wipe the slate clean.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecipeDetail;