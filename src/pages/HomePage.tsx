import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

import { useFeaturedRecipes } from "@/mock";
import AIRecipeGenerator from "@/components/AIRecipeGenerator";
import RecipeCard from "@/components/RecipeCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Button, Card, CardContent } from "@/components/ui/shadcn";

// HomePage is fully driven by the mocked client-side store in src/mock.ts.
// There is NO real backend or AI – everything is generated and persisted in-browser.

const carouselVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const featured = useFeaturedRecipes();

  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const hasFeatured = featured && featured.length > 0;

  const safeIndex = hasFeatured
    ? ((index % featured.length) + featured.length) % featured.length
    : 0;

  const goTo = (next: number) => {
    if (!hasFeatured) return;
    setDirection(next > index ? 1 : -1);
    setIndex(((next % featured.length) + featured.length) % featured.length);
  };

  const goNext = () => {
    if (!hasFeatured) return;
    setDirection(1);
    setIndex((prev) => (prev + 1) % featured.length);
  };

  const goPrev = () => {
    if (!hasFeatured) return;
    setDirection(-1);
    setIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const currentRecipe = hasFeatured ? featured[safeIndex] : undefined;

  return (
    <div className="w-full min-h-screen bg-[#f8f1ea] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[70vh] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-[url('https://images.pexels.com/photos/3731474/pexels-photo-3731474.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center"
            aria-hidden="true"
          />
          {/* Warm organic overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(248,241,234,0.92)] via-[rgba(244,162,97,0.38)] to-[rgba(36,24,18,0.92)] mix-blend-multiply" />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[140%] h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_60%)] opacity-70" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col gap-12 lg:gap-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Copy column */}
            <div className="lg:col-span-6 min-w-0 flex flex-col gap-6">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                className="inline-flex items-center gap-3 rounded-full bg-[rgba(255,255,255,0.85)] dark:bg-[rgba(15,10,8,0.95)] border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.08)] px-4 py-2 shadow-sm backdrop-blur-md w-fit"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E76F51] text-white text-xs font-semibold shadow-md">
                  AI
                </span>
                <p className="text-xs sm:text-sm font-medium tracking-wide text-neutral-800 dark:text-neutral-100">
                  100% frontend mock · Your private test kitchen in the browser
                </p>
              </motion.div>

              <motion.h1
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl xl:text-[3.7rem] leading-tight text-neutral-900 dark:text-amber-50 whitespace-normal break-words"
              >
                Cook the way you
                <span className="block text-[#E76F51] dark:text-[#F4A261] mt-1">
                  actually eat on weeknights.
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.12 }}
                className="text-sm sm:text-base lg:text-lg text-neutral-800/90 dark:text-neutral-100/90 max-w-xl"
              >
                Describe what&apos;s in your fridge, choose a vibe, and let the in-browser
                AI mock generator dream up flexible recipes – no account, no backend,
                no data leaving your device.
              </motion.p>

              <motion.div
                initial={{ y: 26, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
                className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2"
              >
                <Button
                  size="lg"
                  className="bg-[#E76F51] hover:bg-[#e45d3c] text-white shadow-md shadow-[rgba(228,93,60,0.35)]"
                  onClick={() => {
                    const el = document.getElementById("ai-generator");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate a recipe
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/80 dark:bg-neutral-900/70 border-neutral-200/70 dark:border-neutral-700/80 hover:bg-white dark:hover:bg-neutral-900"
                  onClick={() => navigate("/recipes")}
                >
                  Browse all recipes
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-800/80 dark:text-neutral-200/80"
              >
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full border-2 border-[#f8f1ea] dark:border-neutral-950 bg-[url('https://images.pexels.com/photos/3760851/pexels-photo-3760851.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center" />
                  <div className="h-8 w-8 rounded-full border-2 border-[#f8f1ea] dark:border-neutral-950 bg-[url('https://images.pexels.com/photos/1181680/pexels-photo-1181680.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center" />
                  <div className="h-8 w-8 rounded-full border-2 border-[#f8f1ea] dark:border-neutral-950 bg-[url('https://images.pexels.com/photos/2837009/pexels-photo-2837009.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center" />
                </div>
                <p>
                  Mocked for local dev: featured recipes, ratings, and reviews are all
                  generated and stored in your browser.
                </p>
              </motion.div>
            </div>

            {/* Carousel column */}
            <div className="lg:col-span-6 min-h-[260px] sm:min-h-[320px]">
              <Card className="relative overflow-hidden border-none bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(12,10,8,0.95)] shadow-xl shadow-[rgba(15,10,8,0.45)]/70 backdrop-blur-xl">
                <CardContent className="p-0">
                  <div className="relative h-full min-h-[260px] sm:min-h-[320px]">
                    {!hasFeatured && (
                      <div className="flex h-full items-center justify-center p-10">
                        <LoadingSkeleton />
                      </div>
                    )}

                    {hasFeatured && currentRecipe && (
                      <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                          key={currentRecipe.id}
                          custom={direction}
                          variants={carouselVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="absolute inset-0 flex flex-col lg:flex-row"
                        >
                          {/* Image side */}
                          <div className="relative w-full lg:w-1/2 h-48 sm:h-56 lg:h-auto overflow-hidden">
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${currentRecipe.heroImageUrl})`,
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                              <div className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 backdrop-blur-sm">
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                                Live mock data
                              </div>
                              <div className="flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 backdrop-blur-sm">
                                <span className="font-semibold">
                                  {currentRecipe.prepTimeMinutes + currentRecipe.cookTimeMinutes}
                                </span>
                                <span className="uppercase tracking-wide text-[10px]">
                                  min total
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Details side */}
                          <div className="w-full lg:w-1/2 p-5 sm:p-6 flex flex-col gap-3 sm:gap-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                                Featured mock recipe
                              </p>
                              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                                {currentRecipe.difficulty}
                              </div>
                            </div>

                            <h2 className="font-['Playfair_Display'] text-xl sm:text-2xl text-neutral-900 dark:text-amber-50 leading-snug line-clamp-2">
                              {currentRecipe.title}
                            </h2>
                            {currentRecipe.subtitle && (
                              <p className="text-xs sm:text-sm text-neutral-700/90 dark:text-neutral-200/80 line-clamp-2">
                                {currentRecipe.subtitle}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-neutral-700/90 dark:text-neutral-200/80">
                              <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-900 px-2 py-1">
                                {currentRecipe.cuisine}
                              </span>
                              {currentRecipe.dietTags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-900 px-2 py-1"
                                >
                                  {tag}
                                </span>
                              ))}
                              {currentRecipe.dietTags.length > 3 && (
                                <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
                                  +{currentRecipe.dietTags.length - 3} more
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs sm:text-sm text-neutral-700/90 dark:text-neutral-200/80 line-clamp-3">
                              {currentRecipe.description}
                            </p>

                            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                              <Button
                                size="sm"
                                className="bg-neutral-900 dark:bg-amber-50 text-amber-50 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-amber-100"
                                onClick={() => navigate(`/recipes/${currentRecipe.id}`)}
                              >
                                View recipe
                              </Button>
                              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                                <span>
                                  Serves {currentRecipe.servings}
                                </span>
                                {typeof currentRecipe.averageRating === "number" && (
                                  <span className="inline-flex items-center gap-1">
                                    <span>·</span>
                                    <span>{currentRecipe.averageRating.toFixed(1)}★</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Carousel controls */}
                    {hasFeatured && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 sm:px-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="pointer-events-auto h-8 w-8 rounded-full bg-white/85 dark:bg-neutral-900/85 border-none shadow-md text-neutral-800 dark:text-neutral-100"
                          onClick={goPrev}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="pointer-events-auto h-8 w-8 rounded-full bg-white/85 dark:bg-neutral-900/85 border-none shadow-md text-neutral-800 dark:text-neutral-100"
                          onClick={goNext}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* Dots */}
                    {hasFeatured && (
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        {featured.map((r, i) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => goTo(i)}
                            className={`h-1.5 rounded-full transition-all duration-200 ${
                              i === safeIndex
                                ? "w-5 bg-neutral-900 dark:bg-amber-50"
                                : "w-2 bg-neutral-500/60 dark:bg-neutral-500/70"
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 lg:px-10 pb-20 flex flex-col gap-16">
        {/* AI Generator */}
        <section id="ai-generator" className="scroll-mt-24">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-neutral-900 dark:text-amber-50">
                In-browser AI recipe generator
              </h2>
              <p className="mt-1 text-sm text-neutral-700/90 dark:text-neutral-200/80 max-w-xl">
                All prompts and generated recipes stay in your browser. Refreshing the
                page will keep them around via localStorage.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-900 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-300">
              <Sparkles className="h-3 w-3" />
              mock-only
            </span>
          </div>

          <AIRecipeGenerator />
        </section>

        {/* Featured grid */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-neutral-900 dark:text-amber-50">
                Featured mock recipes
              </h2>
              <p className="mt-1 text-sm text-neutral-700/90 dark:text-neutral-200/80">
                These are seeded examples powered by the client-side store – perfect
                for prototyping listing/detail views.
              </p>
            </div>
            <Link
              to="/recipes"
              className="text-sm font-medium text-[#E76F51] hover:text-[#e45d3c]"
            >
              View all
            </Link>
          </div>

          {!hasFeatured && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </div>
          )}

          {hasFeatured && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;