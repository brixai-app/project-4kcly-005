import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Filter, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useApp, Recipe } from "@/mock";
import SearchBar from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";
import PreferencesPanel from "@/components/PreferencesPanel";
import { showInfoToast, showSuccessToast, showErrorToast } from "@/components/Toast";
import {
  Button,
  Badge,
  Separator,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/shadcn";

/**
 * SearchPage
 *
 * 100% frontend-only search and discovery surface for TactileChef.
 * All data, AI generation, filters, and persistence are mocked in src/mock.ts
 * using localStorage – there is NO backend.
 */

const PAGE_SIZE = 6;

const SearchPage: React.FC = () => {
  const { searchRecipes, generateRecipe, state, filterByPreferences } = useApp();
  const navigate = useNavigate();

  const [rawQuery, setRawQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Debounce query from SearchBar immediate changes
  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedQuery(rawQuery.trim());
      setVisibleCount(PAGE_SIZE);
    }, 260);
    return () => window.clearTimeout(id);
  }, [rawQuery]);

  const baseResults: Recipe[] = useMemo(() => {
    if (!debouncedQuery) {
      // When no query, show recipes filtered only by preferences
      return filterByPreferences([...state.recipes, ...state.generatedRecipes]);
    }
    return searchRecipes(debouncedQuery);
  }, [debouncedQuery, searchRecipes, state.recipes, state.generatedRecipes, filterByPreferences]);

  const visibleResults = useMemo(
    () => baseResults.slice(0, visibleCount),
    [baseResults, visibleCount],
  );

  const hasMore = visibleCount < baseResults.length;

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, baseResults.length]);

  const handleSearchSubmit = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      setRawQuery(trimmed);
      setDebouncedQuery(trimmed);
      setVisibleCount(PAGE_SIZE);
      showInfoToast("Search updated", `Exploring recipes for “${trimmed}”.`);
    },
    [],
  );

  const handleGenerateClick = useCallback(
    async (value: string) => {
      const q = value.trim();
      if (!q) {
        showErrorToast("Add a few ingredients first", "Describe what you feel like cooking.");
        return;
      }
      try {
        setIsGenerating(true);
        showInfoToast("Simulated AI is thinking…", "Crafting a cozy recipe just for you.");
        const recipe = await generateRecipe(q);
        showSuccessToast("New recipe created", "Opening your AI-crafted dish.");
        navigate(`/recipe/${recipe.id}`);
      } catch (err) {
        console.error(err);
        showErrorToast("Could not generate recipe", "Because this is mocked in the browser, try again.");
      } finally {
        setIsGenerating(false);
      }
    },
    [generateRecipe, navigate],
  );

  const activeFiltersSummary = useMemo(() => {
    const dietary = state.preferences.dietaryRestrictions;
    const cuisines = state.preferences.preferredCuisines;
    const maxTime = state.preferences.maxPrepTimeMinutes;

    const parts: string[] = [];
    if (dietary.length) parts.push(`${dietary.length} dietary preference${dietary.length > 1 ? "s" : ""}`);
    if (cuisines.length) parts.push(`${cuisines.length} cuisine${cuisines.length > 1 ? "s" : ""}`);
    if (maxTime) parts.push(`≤ ${maxTime} min prep`);

    if (!parts.length) return "No filters applied";
    return parts.join(" · ");
  }, [state.preferences]);

  const showAiRail = Boolean(debouncedQuery);

  return (
    <main className="w-full min-h-screen bg-[#f9f5f0] text-[#3e2c23] pt-4 pb-16">
      {/* Top section with search and filters */}
      <section className="w-full border-b border-[#e1d5c7]/70 bg-[#f9f2ea]">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-6 lg:py-8 flex flex-col gap-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="uppercase tracking-[0.2em] text-[11px] text-[#8c6e5a] mb-1">Explore the library</p>
              <h1 className="text-3xl lg:text-4xl font-semibold leading-tight font-['Playfair_Display']">
                Search recipes by mood, ingredient, or craving
              </h1>
              <p className="mt-2 text-sm lg:text-base text-[#8c6e5a] max-w-2xl">
                Everything you see here is generated and filtered entirely in your browser.
                No servers, no network calls — just tactile inspiration.
              </p>
            </div>
            <div className="flex flex-row items-center gap-3 mt-2 lg:mt-0">
              <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }} className="min-w-0">
                <Button
                  variant="outline"
                  className="rounded-full border-[#d2b59c] bg-white/70 hover:bg-white text-sm flex items-center gap-2 px-4 py-2"
                  onClick={() => setShowPreferences(true)}
                >
                  <Filter className="w-4 h-4" />
                  <span>Adjust filters</span>
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SearchBar
              value={rawQuery}
              onImmediateChange={setRawQuery}
              onChange={setDebouncedQuery}
              onSubmit={handleSearchSubmit}
              onGenerateClick={handleGenerateClick}
              className="w-full max-w-[900px]"
            />

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8c6e5a]">
              <span className="font-medium">Active filters:</span>
              <span>{activeFiltersSummary}</span>
              <span className="mx-2 h-3 w-px bg-[#d9c6b3]" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-[0.18em]">
                {baseResults.length} recipe{baseResults.length === 1 ? "" : "s"} match
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content section with AI rail + results */}
      <section className="w-full">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left column: AI suggestion rail (on large screens) */}
            <div className="lg:col-span-4 min-w-0 flex flex-col gap-4 order-2 lg:order-1">
              <AnimatePresence mode="wait">
                {showAiRail && (
                  <motion.div
                    key="ai-rail"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  >
                    <Card className="border-[#e1d5c7] bg-white/80 backdrop-blur-sm shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <CardTitle className="font-['Playfair_Display'] text-lg">
                              Let the mock chef improvise
                            </CardTitle>
                            <CardDescription className="mt-1 text-xs text-[#8c6e5a]">
                              Use simulated AI to spin your keywords into a fresh recipe. All in-browser,
                              no network involved.
                            </CardDescription>
                          </div>
                          <Badge className="rounded-full bg-[#d94f4f]/10 text-[#d94f4f] border-[#d94f4f]/30 text-[11px] px-3 py-1">
                            100% Mocked
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <div className="text-xs text-[#6f5646] leading-relaxed">
                          <p>
                            You&apos;re searching for
                            <span className="font-medium"> “{debouncedQuery}”</span>. Ask our front-end-only
                            chef to build a recipe around it — it will be generated deterministically using
                            your current preferences.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px] text-[#8c6e5a]">
                          {state.preferences.dietaryRestrictions.map((flag) => (
                            <span
                              key={flag}
                              className="rounded-full bg-[#f3e4d5] px-3 py-1 border border-[#e1d5c7]"
                            >
                              {flag.replace("-", " ")}
                            </span>
                          ))}
                          {state.preferences.preferredCuisines.slice(0, 3).map((cuisine) => (
                            <span
                              key={cuisine}
                              className="rounded-full bg-[#f3e4d5] px-3 py-1 border border-[#e1d5c7]"
                            >
                              {cuisine}
                            </span>
                          ))}
                          {state.preferences.spiceLevel && (
                            <span className="rounded-full bg-[#f3e4d5] px-3 py-1 border border-[#e1d5c7]">
                              Spice level {state.preferences.spiceLevel}/5
                            </span>
                          )}
                        </div>
                        <Separator className="bg-[#e1d5c7]" />
                        <div className="flex flex-col gap-2">
                          <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                            <Button
                              className="w-full rounded-full bg-[#d94f4f] hover:bg-[#c34646] text-white text-sm flex items-center justify-center gap-2 py-2"
                              onClick={() => handleGenerateClick(debouncedQuery)}
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Sparkles className="w-4 h-4" />
                              )}
                              <span>
                                {isGenerating ? "Generating in your browser…" : "Generate a recipe from this"}
                              </span>
                            </Button>
                          </motion.div>
                          <p className="text-[11px] text-[#8c6e5a] leading-relaxed">
                            Generation is entirely local to your browser and uses only mocked logic from
                            <code className="ml-1 rounded bg-[#f5e8dc] px-1.5 py-0.5 text-[10px]">
                              src/mock.ts
                            </code>
                            . No real AI calls are made.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Small info card about infinite scroll & mocking */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.3 }}
              >
                <Card className="border-dashed border-[#e1d5c7] bg-[#fcf6ef]">
                  <CardContent className="pt-4 pb-4 text-[11px] text-[#8c6e5a] space-y-1.5 leading-relaxed">
                    <p>
                      This search surface runs entirely on the client. Recipes, favorites, and preferences
                      are persisted via
                      <span className="font-medium"> localStorage</span> through our single
                      <span className="font-medium"> src/mock.ts</span> state layer.
                    </p>
                    <p>
                      Scroll to the end of the grid to progressively reveal more matches using an
                      <span className="font-medium"> IntersectionObserver</span>-driven infinite loader.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right column: results grid */}
            <div className="lg:col-span-8 min-w-0 order-1 lg:order-2">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-['Playfair_Display'] text-xl lg:text-2xl">
                  {debouncedQuery ? "Matching recipes" : "For tonight, consider"}
                </h2>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#8c6e5a]">
                  Showing {visibleResults.length} of {baseResults.length}
                </span>
              </div>

              {baseResults.length === 0 ? (
                <div className="border border-dashed border-[#e1d5c7] bg-[#fcf6ef] rounded-xl px-6 py-8 flex flex-col items-start gap-3">
                  <p className="text-sm font-medium">
                    Nothing quite matches those filters yet.
                  </p>
                  <p className="text-sm text-[#8c6e5a] max-w-md">
                    Try broadening your dietary preferences or removing the prep time limit. You can
                    also ask the mock AI to improvise a brand new recipe from your keywords.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Button
                      variant="outline"
                      className="rounded-full border-[#d2b59c] bg-white/80 hover:bg-white text-xs px-4 py-1.5"
                      onClick={() => setShowPreferences(true)}
                    >
                      Relax filters
                    </Button>
                    {debouncedQuery && (
                      <Button
                        className="rounded-full bg-[#d94f4f] hover:bg-[#c34646] text-white text-xs px-4 py-1.5 flex items-center gap-2"
                        onClick={() => handleGenerateClick(debouncedQuery)}
                        disabled={isGenerating}
                      >
                        <Sparkles className="w-3 h-3" />
                        {isGenerating ? "Generating" : "Generate recipe instead"}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6"
                  >
                    <AnimatePresence>
                      {visibleResults.map((recipe) => (
                        <motion.div
                          key={recipe.id}
                          layout
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 18 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                          <RecipeCard recipe={recipe} showFavoriteToggle />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  <div ref={loadMoreRef} className="mt-8 flex flex-col items-center gap-3">
                    {hasMore ? (
                      <>
                        <Loader2 className="w-5 h-5 text-[#b58a6a] animate-spin" />
                        <p className="text-xs text-[#8c6e5a]">
                          Scrolling reveals more tactile ideas as you linger.
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-[#8c6e5a]">
                        You&apos;ve reached the end of this mocked catalog. Generate more to expand it.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Preferences slide-over; this component is fully mocked and uses src/mock.ts */}
      <PreferencesPanel open={showPreferences} onOpenChange={setShowPreferences} />
    </main>
  );
};

export default SearchPage;