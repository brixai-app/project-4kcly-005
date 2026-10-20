import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Filter, X, ChevronDown, Clock } from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Separator,
  Skeleton,
  Slider,
} from '@/components/ui/shadcn';
import type { AppState, BrowseFilters, Difficulty, Recipe } from '@/mock';
import { applyBrowseFilters, getAllTags, paginateRecipes } from '@/mock';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetailSheet from '@/components/RecipeDetailSheet';

export interface BrowsePageProps {
  state: AppState;
  onToggleFavorite: (recipeId: string) => void;
}

const PAGE_SIZE = 6;

const difficultyOptions: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'Any difficulty' },
  { value: 'easy', label: 'Easy & gentle' },
  { value: 'medium', label: 'A little involved' },
  { value: 'hard', label: 'Weekend project' },
];

const prepTimePresets = [
  { label: 'Any prep time', value: null },
  { label: 'Under 15 min', value: 15 },
  { label: 'Under 25 min', value: 25 },
  { label: 'Under 40 min', value: 40 },
];

const BrowsePage: React.FC<BrowsePageProps> = ({ state, onToggleFavorite }) => {
  const allTags = useMemo(() => getAllTags(state), [state]);

  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [maxPrepTime, setMaxPrepTime] = useState<number | null>(null);
  const [sliderPrep, setSliderPrep] = useState<number[]>([45]);
  const [page, setPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isInitialLoading] = useState(false); // placeholder for potential skeletons

  const filters: BrowseFilters = useMemo(
    () => ({
      query,
      tags: selectedTags,
      difficulty,
      maxPrepTimeMinutes: maxPrepTime ?? undefined,
    }),
    [query, selectedTags, difficulty, maxPrepTime],
  );

  const filteredRecipes = useMemo(
    () => applyBrowseFilters(state.recipes, filters),
    [state.recipes, filters],
  );

  const paginated = useMemo(
    () => paginateRecipes(filteredRecipes, page, PAGE_SIZE),
    [filteredRecipes, page],
  );

  const isFavorite = (id: string) => state.favorites.includes(id);

  const handleTagToggle = (tag: string) => {
    setPage(1);
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleDifficultyChange = (value: Difficulty | 'all') => {
    setPage(1);
    setDifficulty(value);
  };

  const handlePrepPreset = (value: number | null) => {
    setPage(1);
    setMaxPrepTime(value);
    if (value === null) {
      setSliderPrep([45]);
    } else {
      setSliderPrep([value]);
    }
  };

  const handleSliderCommit = (values: number[]) => {
    const val = values[0];
    setSliderPrep([val]);
    setMaxPrepTime(val === 60 ? null : val);
    setPage(1);
  };

  const handleOpenRecipe = (recipeId: string) => {
    const recipe = state.recipes.find((r) => r.id === recipeId) || null;
    setSelectedRecipe(recipe);
    setIsSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setSelectedRecipe(null);
    }
  };

  const handleClearFilters = () => {
    setQuery('');
    setSelectedTags([]);
    setDifficulty('all');
    setMaxPrepTime(null);
    setSliderPrep([45]);
    setPage(1);
  };

  const activeFilterCount =
    (query.trim() ? 1 : 0) +
    (selectedTags.length ? 1 : 0) +
    (difficulty !== 'all' ? 1 : 0) +
    (maxPrepTime ? 1 : 0);

  return (
    <div className="w-full min-h-screen bg-[#080706] text-slate-50">
      {/* Top ribbon / intro */}
      <section className="w-full border-b border-white/5 bg-gradient-to-b from-[#15100e] via-[#070605] to-[#080706]">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-8 lg:py-10 flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-amber-100 font-['Playfair_Display'] whitespace-normal break-words">
                Browse the Saffron & Sage kitchen
              </h1>
              <p className="max-w-2xl text-sm lg:text-base text-amber-100/80 whitespace-normal break-words">
                Search across warm, tactile recipes. Layer on filters for weeknights,
                moodier weekend projects, or whatever your pantry feels like today.
                All results are mocked on the frontend—no real AI or backend calls yet.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs lg:text-sm text-amber-100/80">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/40 border border-amber-700/40">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Fully client-side filters</span>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <Card className="bg-[#120f0d]/80 backdrop-blur border-white/10 shadow-md">
            <CardContent className="pt-4 pb-4 lg:pt-5 lg:pb-5 flex flex-col gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
                {/* Search input */}
                <div className="lg:col-span-4 min-w-0 flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.16em] text-amber-200/80">
                    Search
                  </label>
                  <div className="relative">
                    <Input
                      value={query}
                      onChange={(e) => {
                        setPage(1);
                        setQuery(e.target.value);
                      }}
                      placeholder="Ingredients, moods, tags, or dish names"
                      className="bg-black/40 border-amber-700/40 text-amber-50 placeholder:text-amber-200/60 focus-visible:ring-amber-400/60"
                      aria-label="Search recipes"
                    />
                  </div>
                </div>

                {/* Difficulty & prep time */}
                <div className="lg:col-span-4 min-w-0 flex flex-col gap-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs uppercase tracking-[0.16em] text-amber-200/80">
                      Effort & pacing
                    </span>
                    <Tabs
                      value={difficulty}
                      onValueChange={(v) => handleDifficultyChange(v as Difficulty | 'all')}
                    >
                      <TabsList className="bg-black/40 border border-amber-700/40">
                        <TabsTrigger
                          value="all"
                          className="px-3 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-50"
                        >
                          Any
                        </TabsTrigger>
                        <TabsTrigger
                          value="easy"
                          className="px-3 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-50"
                        >
                          Easy
                        </TabsTrigger>
                        <TabsTrigger
                          value="medium"
                          className="px-3 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-50"
                        >
                          Medium
                        </TabsTrigger>
                        <TabsTrigger
                          value="hard"
                          className="px-3 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-50"
                        >
                          Weekend
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-amber-100/80 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Max prep time</span>
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-3 rounded-full border border-amber-700/40 bg-black/30 text-amber-100 hover:bg-amber-800/40"
                            aria-label="Choose prep-time shortcut"
                          >
                            <span className="text-xs">
                              {
                                prepTimePresets.find((p) => p.value === maxPrepTime)?.label ??
                                'Custom'
                              }
                            </span>
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#120f0d] border-amber-700/40 text-amber-50">
                          {prepTimePresets.map((preset) => (
                            <DropdownMenuItem
                              key={preset.label}
                              className="text-xs hover:bg-amber-800/40 focus:bg-amber-800/40"
                              onClick={() => handlePrepPreset(preset.value)}
                            >
                              {preset.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={sliderPrep}
                        max={60}
                        min={5}
                        step={5}
                        onValueChange={setSliderPrep}
                        onValueCommit={handleSliderCommit}
                        className="flex-1"
                        aria-label="Maximum prep time in minutes"
                      />
                      <span className="w-14 text-right text-xs text-amber-100/80">
                        {maxPrepTime ? `${maxPrepTime}m` : 'No cap'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tag filters */}
                <div className="lg:col-span-4 min-w-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs uppercase tracking-[0.16em] text-amber-200/80">
                      Mood & tags
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-3 rounded-full text-[11px] text-amber-100/80 hover:bg-amber-900/40"
                      onClick={() => setSelectedTags([])}
                      disabled={selectedTags.length === 0}
                    >
                      Clear tags
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2.5 mt-1">
                    {allTags.map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`rounded-full px-3.5 py-1.5 border text-xs font-medium flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#120f0d] ${
                            active
                              ? 'border-amber-500 bg-amber-700/40 text-amber-50'
                              : 'border-amber-700/40 bg-black/30 text-amber-100 hover:bg-amber-900/40'
                          }`}
                          aria-pressed={active}
                        >
                          <span className="capitalize">{tag}</span>
                          {active && <X className="w-3 h-3" aria-hidden="true" />}
                        </button>
                      );
                    })}
                    {allTags.length === 0 && (
                      <span className="text-xs text-amber-100/70">
                        Tags will appear as the recipe collection grows.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="bg-amber-900/60" />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-amber-100/80">
                  <Badge className="bg-amber-700/70 text-amber-50 border-amber-400/70 rounded-full px-3 py-1 text-[11px] font-medium">
                    {paginated.totalItems} recipe
                    {paginated.totalItems === 1 ? '' : 's'}
                  </Badge>
                  {activeFilterCount > 0 && (
                    <span className="text-amber-100/70">
                      {activeFilterCount} active filter
                      {activeFilterCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 rounded-full text-xs text-amber-100/90 hover:bg-amber-900/50"
                    onClick={handleClearFilters}
                    disabled={activeFilterCount === 0}
                  >
                    Reset all
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 rounded-full border-amber-500/70 text-amber-50 bg-amber-800/40 hover:bg-amber-700/60"
                  >
                    <Filter className="w-3.5 h-3.5 mr-1.5" />
                    Refine
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results grid */}
      <section className="w-full">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-8 lg:py-10 flex flex-col gap-6">
          {isInitialLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                <Card
                  key={idx}
                  className="bg-[#120f0d]/80 border-white/10 overflow-hidden flex flex-col"
                >
                  <Skeleton className="h-40 w-full bg-amber-900/30" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4 bg-amber-900/40" />
                    <Skeleton className="h-3 w-full bg-amber-900/30" />
                    <Skeleton className="h-3 w-2/3 bg-amber-900/30" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : paginated.items.length === 0 ? (
            <Card className="bg-[#120f0d]/80 border-dashed border-amber-700/60">
              <CardHeader>
                <CardTitle className="text-amber-100">
                  No recipes match this moment just yet
                </CardTitle>
                <CardDescription className="text-amber-100/80">
                  Try softening your filters—clear a tag, widen prep time, or use a
                  broader search term. Remember: everything here is a mock preview,
                  generated and filtered entirely on the frontend.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="rounded-full border-amber-500/80 text-amber-50 bg-amber-800/40 hover:bg-amber-700/60"
                  onClick={handleClearFilters}
                >
                  Soften filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <AnimatePresence mode="sync">
                <motion.div
                  key={`${page}-${query}-${difficulty}-${maxPrepTime}-${selectedTags.join(',')}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {paginated.items.map((recipe) => (
                    <motion.div
                      key={recipe.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <RecipeCard
                        recipe={recipe}
                        isFavorite={isFavorite(recipe.id)}
                        onOpen={handleOpenRecipe}
                        onToggleFavorite={onToggleFavorite}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2 text-xs text-amber-100/80">
                  <span>
                    Page {paginated.page} of {paginated.totalPages}
                  </span>
                  <span className="text-amber-100/60">·</span>
                  <span>
                    Showing {paginated.items.length} of {paginated.totalItems} recipes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-amber-700/70 text-amber-100 bg-black/40 hover:bg-amber-900/50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={paginated.page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-amber-500/80 text-amber-50 bg-amber-800/50 hover:bg-amber-700/70"
                    onClick={() =>
                      setPage((p) => Math.min(paginated.totalPages, p + 1))
                    }
                    disabled={paginated.page >= paginated.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <RecipeDetailSheet
        recipe={selectedRecipe}
        isOpen={isSheetOpen}
        isFavorite={selectedRecipe ? isFavorite(selectedRecipe.id) : false}
        onOpenChange={handleSheetOpenChange}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
};

export default BrowsePage;