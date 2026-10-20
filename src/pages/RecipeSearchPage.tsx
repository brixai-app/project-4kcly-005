import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Badge,
  Switch,
  Slider,
} from "@/components/ui/shadcn";
import { ChevronDown, Leaf, Timer, X } from "lucide-react";
import RecipeList from "@/components/RecipeList";
import {
  CuisineType,
  DietTag,
  Recipe,
  RecipeSearchFilters,
  upsertPreferences,
  useMockStore,
  searchRecipes,
} from "@/mock";

// NOTE: This page works entirely with the mocked client-side store in src/mock.ts.
// There is NO backend – search, filters, and preferences are all handled in-memory
// with localStorage persistence via the mock helpers.

const ALL_CUISINES: (CuisineType | "any")[] = [
  "any",
  "mediterranean",
  "italian",
  "mexican",
  "asian",
  "middle-eastern",
  "indian",
  "american",
  "fusion",
];

const DIET_TAGS: { key: DietTag; label: string }[] = [
  { key: "vegan", label: "Vegan" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "pescatarian", label: "Pescatarian" },
  { key: "gluten-free", label: "Gluten-free" },
  { key: "dairy-free", label: "Dairy-free" },
  { key: "low-carb", label: "Low carb" },
  { key: "high-protein", label: "High protein" },
  { key: "comfort", label: "Comfort" },
];

const DEFAULT_PAGE_SIZE = 9;

const cuisineLabel = (c: CuisineType | "any" | undefined) => {
  if (!c || c === "any") return "Any cuisine";
  switch (c) {
    case "middle-eastern":
      return "Middle Eastern";
    case "high-protein":
      return "High protein";
    default:
      return c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ");
  }
};

const RecipeSearchPage: React.FC = () => {
  const preferences = useMockStore((s) => s.preferences);
  const allRecipes = useMockStore((s) => s.recipes);

  const [query, setQuery] = useState(preferences.lastSearchQuery ?? "");
  const [cuisine, setCuisine] = useState<CuisineType | "any">(
    preferences.lastSearchCuisine ?? "any"
  );
  const [selectedDietTags, setSelectedDietTags] = useState<DietTag[]>(
    preferences.lastSearchDietTags ?? []
  );
  const [maxPrepTime, setMaxPrepTime] = useState<number | undefined>(
    preferences.maxPrepTimeMinutes
  );
  const [sliderValue, setSliderValue] = useState<number[]>([
    preferences.maxPrepTimeMinutes ?? 45,
  ]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Pagination state (client-side)
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Persist search preferences whenever they change
  useEffect(() => {
    if (!isHydrated) return;
    upsertPreferences({
      lastSearchQuery: query,
      lastSearchCuisine: cuisine,
      lastSearchDietTags: selectedDietTags,
      maxPrepTimeMinutes: maxPrepTime,
    });
  }, [query, cuisine, selectedDietTags, maxPrepTime, isHydrated]);

  const filters: RecipeSearchFilters = useMemo(
    () => ({
      cuisine,
      dietTags: selectedDietTags,
      maxPrepTimeMinutes: maxPrepTime,
    }),
    [cuisine, selectedDietTags, maxPrepTime]
  );

  const filteredRecipes: Recipe[] = useMemo(
    () => searchRecipes(query, filters),
    [query, filters]
  );

  // Reset page when filters / query change
  useEffect(() => {
    setPage(1);
  }, [query, cuisine, selectedDietTags, maxPrepTime]);

  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / DEFAULT_PAGE_SIZE));
  const paginatedRecipes = useMemo(
    () =>
      filteredRecipes.slice(0, page * DEFAULT_PAGE_SIZE),
    [filteredRecipes, page]
  );

  const handleToggleDietTag = (tag: DietTag) => {
    setSelectedDietTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setQuery("");
    setCuisine("any");
    setSelectedDietTags([]);
    setMaxPrepTime(undefined);
    setSliderValue([45]);
  };

  const handleSliderCommit = (value: number[]) => {
    const v = value[0];
    if (v <= 10) {
      setMaxPrepTime(undefined);
    } else {
      setMaxPrepTime(v);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[rgb(20,15,10)] text-stone-50 flex flex-col">
      {/* Hero / Filter Section */}
      <section className="w-full relative overflow-hidden bg-gradient-to-b from-[rgb(41,26,18)] via-[rgb(33,22,17)] to-[rgb(24,17,13)]">
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light bg-[radial-gradient(circle_at_0%_0%,rgba(244,162,97,0.22),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(233,196,106,0.22),transparent_55%),radial-gradient(circle_at_0%_100%,rgba(42,157,143,0.25),transparent_55%)]" />
        <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-medium tracking-[0.16em] uppercase text-amber-200/80">
                Explore the test kitchen
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight font-['Playfair_Display'] text-stone-50 whitespace-normal break-words">
                Search recipes that match your cravings and rhythm of the day.
              </h1>
              <p className="text-sm sm:text-base text-stone-200/80 max-w-2xl whitespace-normal break-words">
                Filter by cuisine, prep time, and dietary mood. Everything runs 100% in your
                browser – including our mocked AI recipe brain.
              </p>
              <div className="inline-flex flex-wrap items-center gap-3 text-xs text-stone-300/80">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[0.7rem]">
                    AI
                  </span>
                  <span>Instant client-side filtering. No accounts, no backend.</span>
                </div>
              </div>
            </div>

            {/* Filters Card */}
            <Card className="border border-stone-700/70 bg-[rgb(27,20,15)]/95 backdrop-blur-sm shadow-lg shadow-black/40">
              <CardContent className="pt-6 pb-5 flex flex-col gap-5">
                {/* Search input */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-stone-200/90 tracking-wide">
                    Search recipes
                  </label>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1 min-w-0">
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type ingredients, vibes, or recipe names..."
                        className="w-full bg-[rgb(22,16,12)]/95 border-stone-700/80 text-stone-50 placeholder:text-stone-400 focus-visible:ring-amber-400/70 focus-visible:border-amber-300/80"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClearFilters}
                      className="inline-flex items-center justify-center gap-2 border-stone-700/80 bg-[rgb(24,18,13)] text-stone-100 hover:bg-[rgb(33,24,18)] hover:text-stone-50 transition-colors px-4 py-2"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm">Clear</span>
                    </Button>
                  </div>
                </div>

                {/* Filter row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 items-start">
                  {/* Cuisine filter */}
                  <div className="md:col-span-4 flex flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium text-stone-200/90 tracking-wide">
                        Cuisine
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between border-stone-700/80 bg-[rgb(23,17,13)] text-stone-100 hover:bg-[rgb(32,23,17)] hover:text-stone-50"
                        >
                          <span className="text-sm whitespace-normal break-words">
                            {cuisineLabel(cuisine)}
                          </span>
                          <ChevronDown className="w-4 h-4 ml-2 shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-[rgb(24,18,13)] border-stone-700/80 text-stone-50">
                        {ALL_CUISINES.map((c) => (
                          <DropdownMenuItem
                            key={c}
                            className="flex items-center justify-between gap-2 text-sm focus:bg-[rgb(36,26,19)]"
                            onClick={() => setCuisine(c)}
                          >
                            <span>{cuisineLabel(c)}</span>
                            {cuisine === c && (
                              <span className="h-2 w-2 rounded-full bg-amber-400" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Dietary tags filter */}
                  <div className="md:col-span-5 flex flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium text-stone-200/90 tracking-wide">
                        Dietary mood
                      </span>
                      <span className="text-[0.7rem] text-stone-400">
                        Choose one or more
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {DIET_TAGS.map(({ key, label }) => {
                        const active = selectedDietTags.includes(key);
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleToggleDietTag(key)}
                            className={
                              "rounded-full px-3.5 py-1.5 border text-xs font-medium flex items-center gap-1.5 transition-colors " +
                              (active
                                ? "border-emerald-300 bg-emerald-500/20 text-emerald-100"
                                : "border-stone-700/80 bg-[rgb(23,17,13)] text-stone-200 hover:border-emerald-300/70 hover:text-emerald-100")
                            }
                          >
                            <Leaf className="w-3.5 h-3.5" />
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Prep time slider */}
                  <div className="md:col-span-3 flex flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium text-stone-200/90 tracking-wide flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-amber-300" />
                        Max prep time
                      </span>
                      <span className="text-[0.75rem] text-stone-300">
                        {maxPrepTime ? `${maxPrepTime} min` : "Any"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <Slider
                          value={sliderValue}
                          min={10}
                          max={60}
                          step={5}
                          onValueChange={(value) => setSliderValue(value)}
                          onValueCommit={handleSliderCommit}
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={!!maxPrepTime}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              setMaxPrepTime(undefined);
                              setSliderValue([45]);
                            } else {
                              const val = sliderValue[0] || 45;
                              setMaxPrepTime(val);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active filter summary */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[0.72rem] uppercase tracking-[0.18em] text-stone-500">
                    Active filters
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cuisine !== "any" && (
                      <Badge
                        variant="outline"
                        className="border-amber-300/80 text-amber-100 bg-amber-500/10 text-[0.7rem] rounded-full px-2.5 py-1"
                      >
                        {cuisineLabel(cuisine)}
                      </Badge>
                    )}
                    {selectedDietTags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-emerald-500/20 text-emerald-100 border-emerald-300/80 text-[0.7rem] rounded-full px-2.5 py-1"
                      >
                        {DIET_TAGS.find((t) => t.key === tag)?.label ?? tag}
                      </Badge>
                    ))}
                    {maxPrepTime && (
                      <Badge
                        className="bg-sky-500/15 text-sky-100 border-sky-300/80 text-[0.7rem] rounded-full px-2.5 py-1"
                      >
                        
                        ≤ {maxPrepTime} min prep
                      </Badge>
                    )}
                    {cuisine === "any" && selectedDietTags.length === 0 && !maxPrepTime && (
                      <span className="text-[0.7rem] text-stone-400">
                        None – browsing everything.
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="w-full flex-1 bg-[rgb(16,11,8)] pt-6 pb-14">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex flex-col gap-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold font-['Playfair_Display'] text-stone-50 whitespace-normal break-words">
                {filteredRecipes.length === 0
                  ? "No recipes match these filters yet"
                  : "Browse your curated results"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 whitespace-normal break-words">
                Showing {Math.min(paginatedRecipes.length, filteredRecipes.length)} of {" "}
                {filteredRecipes.length} recipes
                {query.trim()
                  ? ` for "${query.trim()}"`
                  : filteredRecipes.length !== allRecipes.length
                  ? " based on your filters"
                  : " from the test kitchen"}
                .
              </p>
            </div>
            <div className="flex items-center gap-2 text-[0.7rem] text-stone-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                Live client-side filtering
              </span>
            </div>
          </div>

          <RecipeList
            recipes={paginatedRecipes}
            loading={!isHydrated}
            emptyStateMessage={
              filteredRecipes.length === 0
                ? "Try softening your filters – remove a dietary tag or expand prep time."
                : "No recipes to show yet."
            }
            pageSize={DEFAULT_PAGE_SIZE}
            enableInfiniteScroll
          />

          {/* Manual pagination fallback */}
          {filteredRecipes.length > paginatedRecipes.length && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-6 py-2 border-amber-300/80 bg-[rgb(26,19,13)] text-amber-100 hover:bg-amber-500/15 hover:text-amber-50"
              >
                Load more recipes
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RecipeSearchPage;