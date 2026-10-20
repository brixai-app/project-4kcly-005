import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Salad, Sparkles, Timer, Soup } from 'lucide-react';
import { toast } from 'sonner';

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Textarea,
  Switch,
  Slider,
  Badge,
  Separator,
} from '@/components/ui/shadcn';

import IngredientInput from '@/components/IngredientInput';
import RecipeDetailSheet from '@/components/RecipeDetailSheet';
import type { AppState, Recipe, UserPreferences, GenerateInput } from '@/mock';
import { generateRecipeFromIngredients } from '@/mock';

export interface GeneratePageProps {
  state: AppState;
  onStateChange: (next: AppState) => void;
  onToggleFavorite: (recipeId: string) => void;
}

const shimmerVariants = {
  initial: { opacity: 0.4 },
  animate: {
    opacity: [0.4, 0.8, 0.4],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
};

const panelVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const GeneratePage: React.FC<GeneratePageProps> = ({ state, onStateChange, onToggleFavorite }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [mood, setMood] = useState('Cozy, unhurried evening at home');
  const [notes, setNotes] = useState('Soft spice, lots of texture, minimal dishes.');
  const [cuisineVibe, setCuisineVibe] = useState<'any' | 'med' | 'italian' | 'indian' | 'asian'>('any');
  const [dietTab, setDietTab] = useState<'balanced' | 'veg' | 'vegan'>('balanced');
  const [spiceLevel, setSpiceLevel] = useState<0 | 1 | 2>(1); // 0 low, 1 med, 2 high
  const [maxTime, setMaxTime] = useState<number | null>(40);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const preferencesForGeneration: UserPreferences = useMemo(() => {
    const base: UserPreferences = state.preferences;

    let vegetarian = base.vegetarian;
    let vegan = base.vegan;

    if (dietTab === 'veg') {
      vegetarian = true;
      vegan = false;
    } else if (dietTab === 'vegan') {
      vegetarian = false;
      vegan = true;
    }

    const lowSpice = spiceLevel === 0;
    const mediumSpice = spiceLevel === 1;
    const highSpice = spiceLevel === 2;

    const preferredCuisines: string[] = (() => {
      if (cuisineVibe === 'any') return base.preferredCuisines;
      if (cuisineVibe === 'med') return ['Mediterranean-inspired'];
      if (cuisineVibe === 'italian') return ['Italian-inspired'];
      if (cuisineVibe === 'indian') return ['Indian-inspired'];
      if (cuisineVibe === 'asian') return ['Asian-inspired'];
      return base.preferredCuisines;
    })();

    return {
      ...base,
      vegetarian,
      vegan,
      lowSpice,
      mediumSpice,
      highSpice,
      maxTotalTimeMinutes: maxTime,
      preferredCuisines,
    };
  }, [state.preferences, dietTab, spiceLevel, cuisineVibe, maxTime]);

  const isFavorite = useMemo(() => {
    if (!generatedRecipe) return false;
    return state.favorites.includes(generatedRecipe.id);
  }, [generatedRecipe, state.favorites]);

  const handleGenerate = async () => {
    if (isGenerating) return;

    if (selectedIngredients.length === 0) {
      toast('Add at least one ingredient to start', {
        description: 'Think about what is already in your pantry.',
      });
      return;
    }

    setIsGenerating(true);

    const input: GenerateInput = {
      ingredients: selectedIngredients,
      mood: mood.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    // Simulated delay for mock AI generation
    setTimeout(() => {
      const { state: nextState, recipe } = generateRecipeFromIngredients(
        state,
        input,
        preferencesForGeneration,
      );

      onStateChange(nextState);
      setGeneratedRecipe(recipe);
      setIsDetailOpen(true);
      setIsGenerating(false);

      toast.success('New recipe generated', {
        description: `${recipe.title} is ready to cook. This is all mock AI – no backend!`,
      });
    }, 900);
  };

  const handleFavoriteToggle = (recipeId: string) => {
    onToggleFavorite(recipeId);
    const nowFavorite = !state.favorites.includes(recipeId);
    toast(nowFavorite ? 'Saved to favorites' : 'Removed from favorites', {
      description: nowFavorite
        ? 'You can find this bowl again under Favorites.'
        : 'Cleared from your saved list – you can always regenerate.',
    });
  };

  const handleTimeChange = (values: number[]) => {
    const value = values[0];
    if (value === 0) {
      setMaxTime(null);
    } else {
      setMaxTime(value);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0c0a09] text-neutral-50">
      <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
        <div className="mb-10 lg:mb-12 flex flex-col gap-4 lg:gap-5">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-amber-300/80">
              Mock AI Kitchen
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-amber-50 font-['Playfair_Display']">
              Let&apos;s improvise dinner with what you already have.
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-neutral-300 leading-relaxed">
              Saffron &amp; Sage lives entirely in your browser. We mock the feel of an AI
              cooking companion – no accounts, no backend – just gently guided ideas born
              from your pantry and preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Controls column */}
          <div className="lg:col-span-7 min-w-0 flex flex-col gap-6">
            <Card className="bg-[#111827]/70 border-amber-900/40 shadow-md shadow-black/40 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between w-full gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl text-amber-50 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      Ingredient-led idea sketch
                    </CardTitle>
                    <CardDescription className="mt-1 text-neutral-300">
                      Choose what&apos;s on your counter, then we&apos;ll improvise a warm,
                      tactile recipe around it.
                    </CardDescription>
                  </div>
                  <Badge className="bg-amber-500/15 text-amber-200 border border-amber-500/30 rounded-full text-xs px-3 py-1">
                    100% frontend mock
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <IngredientInput
                  value={selectedIngredients}
                  onChange={setSelectedIngredients}
                  suggestions={[]}
                  aria-label="Ingredients you have"
                  label="What ingredients are you working with?"
                  placeholder="e.g. cherry tomatoes, sage, chickpeas, oat milk"
                  helperText="Start broad – you can list fridge scraps, pantry anchors, herbs, or flavors you&apos;re craving."
                />

                <Separator className="bg-amber-900/50" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 flex items-center gap-2">
                      <Salad className="w-4 h-4" />
                      Dietary mood
                    </p>
                    <Tabs
                      value={dietTab}
                      onValueChange={(val) => setDietTab(val as typeof dietTab)}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 bg-black/20">
                        <TabsTrigger
                          value="balanced"
                          className="text-xs sm:text-[0.78rem] data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-100"
                        >
                          Easygoing
                        </TabsTrigger>
                        <TabsTrigger
                          value="veg"
                          className="text-xs sm:text-[0.78rem] data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-100"
                        >
                          Vegetarian
                        </TabsTrigger>
                        <TabsTrigger
                          value="vegan"
                          className="text-xs sm:text-[0.78rem] data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-100"
                        >
                          Vegan
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="balanced" className="mt-3 text-xs text-neutral-300">
                        We&apos;ll happily lean on butter, cheese, and eggs alongside
                        plants.
                      </TabsContent>
                      <TabsContent value="veg" className="mt-3 text-xs text-neutral-300">
                        No meat or fish. Dairy and eggs are welcome for coziness.
                      </TabsContent>
                      <TabsContent value="vegan" className="mt-3 text-xs text-neutral-300">
                        Plant-only, but still lush and satisfying.
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="space-y-4 min-w-0">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 flex items-center gap-2">
                        <Flame className="w-4 h-4" />
                        Spice glow
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          { label: 'Gentle', value: 0 as const },
                          { label: 'Balanced', value: 1 as const },
                          { label: 'Bold', value: 2 as const },
                        ].map((level) => {
                          const active = spiceLevel === level.value;
                          return (
                            <button
                              key={level.value}
                              type="button"
                              onClick={() => setSpiceLevel(level.value)}
                              className={[
                                'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors',
                                active
                                  ? 'border-amber-400 bg-amber-500/20 text-amber-50'
                                  : 'border-amber-900/60 bg-black/20 text-neutral-300 hover:border-amber-500/50 hover:text-amber-100',
                              ].join(' ')}
                            >
                              <Flame
                                className={`w-3.5 h-3.5 ${
                                  level.value === 0
                                    ? 'text-amber-200/80'
                                    : level.value === 1
                                    ? 'text-orange-300'
                                    : 'text-red-400'
                                }`}
                              />
                              <span>{level.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between w-full gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 flex items-center gap-2">
                          <Timer className="w-4 h-4" />
                          Time window
                        </p>
                        <span className="text-[0.7rem] text-neutral-300">
                          {maxTime ? `${maxTime} minutes-ish` : 'No rush'}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={70}
                        step={5}
                        value={[maxTime ?? 0]}
                        onValueChange={handleTimeChange}
                        className="cursor-pointer"
                      />
                      <p className="text-[0.7rem] text-neutral-400">
                        Slide to nudge us toward a quick skillet supper or a slower
                        weekend project. Drag all the way down to remove the limit.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-amber-900/50" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 flex items-center gap-2">
                      <Soup className="w-4 h-4" />
                      Cuisine vibe
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { id: 'any', label: 'Let it wander' },
                        { id: 'med', label: 'Mediterranean-ish' },
                        { id: 'italian', label: 'Italian leaning' },
                        { id: 'indian', label: 'Soft Indian echoes' },
                        { id: 'asian', label: 'Pan-Asian pantry' },
                      ].map((vibe) => {
                        const active = cuisineVibe === vibe.id;
                        return (
                          <button
                            key={vibe.id}
                            type="button"
                            onClick={() => setCuisineVibe(vibe.id as typeof cuisineVibe)}
                            className={[
                              'inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium transition-colors',
                              active
                                ? 'border-emerald-400 bg-emerald-500/15 text-emerald-50'
                                : 'border-emerald-900/60 bg-black/20 text-neutral-300 hover:border-emerald-500/50 hover:text-emerald-100',
                            ].join(' ')}
                          >
                            {vibe.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[0.7rem] text-neutral-400">
                      These are gentle nudges, not strict rules. We stay playful and
                      pantry-aware.
                    </p>
                  </div>

                  <div className="space-y-3 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                      Finishing touches
                    </p>
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="space-y-0.5">
                        <p className="text-xs text-neutral-200">Favor make-ahead vibes</p>
                        <p className="text-[0.7rem] text-neutral-400">
                          We&apos;ll gently bias toward bowls, braises, and things that
                          hold well.
                        </p>
                      </div>
                      <Switch disabled checked className="data-[state=checked]:bg-amber-500" />
                    </div>
                    <p className="text-[0.7rem] text-neutral-500">
                      This toggle is part of the mock experience and doesn&apos;t change
                      real backend behavior.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center justify-between w-full gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                        Table mood
                      </p>
                    </div>
                    <Textarea
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      rows={3}
                      className="resize-none bg-black/30 border-amber-900/60 focus-visible:ring-amber-500 text-sm"
                      placeholder="Describe the vibe – slow Sunday morning, rainy weekday, friends dropping by..."
                    />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                      Gentle notes
                    </p>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="resize-none bg-black/30 border-amber-900/60 focus-visible:ring-amber-500 text-sm"
                      placeholder="Anything you want to avoid, a favorite texture, how many you&apos;re feeding..."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-amber-900/50 bg-black/30">
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                  <span>
                    All &ldquo;AI&rdquo; is mocked locally – recipes live only in your
                    browser via localStorage.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-amber-700/70 bg-transparent text-amber-100 hover:bg-amber-500/10 hover:border-amber-400/80"
                    onClick={() => {
                      setSelectedIngredients([]);
                      setMood('Cozy, unhurried evening at home');
                      setNotes('Soft spice, lots of texture, minimal dishes.');
                      setDietTab('balanced');
                      setCuisineVibe('any');
                      setSpiceLevel(1);
                      setMaxTime(40);
                    }}
                  >
                    Clear sketch
                  </Button>
                  <Button
                    type="button"
                    className="bg-amber-500 text-amber-950 hover:bg-amber-400 px-5 shadow-sm shadow-amber-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    <AnimatePresence initial={false} mode="wait">
                      {isGenerating ? (
                        <motion.span
                          key="generating"
                          className="inline-flex items-center gap-2"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.16 }}
                        >
                          <motion.span
                            className="h-4 w-4 rounded-full bg-amber-900/40"
                            variants={shimmerVariants}
                            initial="initial"
                            animate="animate"
                          />
                          Thinking in flavors...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="label"
                          className="inline-flex items-center gap-2"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.16 }}
                        >
                          <Sparkles className="w-4 h-4" />
                          Sketch a recipe
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Preview / output column */}
          <div className="lg:col-span-5 min-w-[340px] flex flex-col gap-4">
            <motion.div
              className="rounded-3xl border border-amber-900/50 bg-gradient-to-b from-amber-900/20 via-black/60 to-black/80 shadow-lg shadow-black/50 overflow-hidden"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div className="px-5 pt-5 pb-4 border-b border-amber-900/60 flex items-center justify-between w-full gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                    Live idea preview
                  </p>
                  <p className="text-[0.76rem] text-neutral-300">
                    Once generated, your recipe will float here and stay saved on this
                    device.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <p className="text-[0.7rem] text-neutral-400">Saved recipes</p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 border border-amber-900/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90" />
                    <span className="text-xs text-amber-100 font-medium">
                      {state.favorites.length} favorited
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {isGenerating && (
                    <motion.div
                      key="loading"
                      className="space-y-4"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <motion.div
                        className="h-40 rounded-2xl bg-gradient-to-r from-amber-900/30 via-amber-700/10 to-amber-900/30 border border-amber-900/60"
                        variants={shimmerVariants}
                        initial="initial"
                        animate="animate"
                      />
                      <div className="space-y-3">
                        <motion.div
                          className="h-4 w-2/3 rounded-full bg-amber-900/60"
                          variants={shimmerVariants}
                          initial="initial"
                          animate="animate"
                        />
                        <motion.div
                          className="h-3 w-1/2 rounded-full bg-amber-900/40"
                          variants={shimmerVariants}
                          initial="initial"
                          animate="animate"
                        />
                        <motion.div
                          className="space-y-2 mt-3"
                          variants={shimmerVariants}
                          initial="initial"
                          animate="animate"
                        >
                          <div className="h-3 w-full rounded-full bg-amber-900/40" />
                          <div className="h-3 w-5/6 rounded-full bg-amber-900/40" />
                          <div className="h-3 w-2/3 rounded-full bg-amber-900/40" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {!isGenerating && generatedRecipe && (
                    <motion.div
                      key={generatedRecipe.id}
                      className="space-y-4"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <div className="overflow-hidden rounded-2xl border border-amber-900/60 bg-black/40">
                        <div
                          className="h-40 sm:h-48 w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${generatedRecipe.imageUrl})` }}
                          aria-label={generatedRecipe.title}
                        />
                        <div className="p-4 sm:p-5 space-y-3">
                          <div className="flex items-center justify-between w-full gap-3">
                            <div className="space-y-1 min-w-0">
                              <h2 className="text-base sm:text-lg font-semibold text-amber-50 whitespace-normal break-words">
                                {generatedRecipe.title}
                              </h2>
                              <p className="text-[0.78rem] text-neutral-300 leading-relaxed">
                                {generatedRecipe.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {generatedRecipe.tags.slice(0, 4).map((tag) => (
                              <Badge
                                key={tag}
                                className="rounded-full border border-amber-800/80 bg-amber-900/40 text-amber-100 text-[0.7rem] px-3 py-1"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-[0.78rem] text-neutral-300">
                            <span>
                              {(generatedRecipe.prepTimeMinutes ?? 0) +
                                (generatedRecipe.cookTimeMinutes ?? 0)}{' '}
                              min-ish
                            </span>
                            <span className="h-1 w-1 rounded-full bg-amber-500/70" />
                            <span className="capitalize">{generatedRecipe.difficulty} flow</span>
                            {generatedRecipe.cuisine && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-amber-500/70" />
                                <span>{generatedRecipe.cuisine}</span>
                              </>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center justify-between w-full gap-3 pt-1">
                            <Button
                              type="button"
                              size="sm"
                              className="bg-amber-500 text-amber-950 hover:bg-amber-400 px-4"
                              onClick={() => setIsDetailOpen(true)}
                            >
                              Open full recipe
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={isFavorite ? 'outline' : 'ghost'}
                              className={[
                                'border-amber-700/80 text-xs',
                                isFavorite
                                  ? 'bg-amber-500/10 text-amber-100 hover:bg-amber-500/25'
                                  : 'text-amber-200 hover:bg-amber-900/40',
                              ].join(' ')}
                              onClick={() => handleFavoriteToggle(generatedRecipe.id)}
                            >
                              {isFavorite ? 'Saved to favorites' : 'Save this idea'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!isGenerating && !generatedRecipe && (
                    <motion.div
                      key="empty"
                      className="flex flex-col items-start gap-3 border border-dashed border-amber-900/70 rounded-2xl bg-black/30 px-5 py-6"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="inline-flex items-center justify-center rounded-full bg-amber-500/15 border border-amber-700/70 p-2">
                        <Sparkles className="w-4 h-4 text-amber-200" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-amber-50">
                          Waiting for your first sketch.
                        </p>
                        <p className="text-xs text-neutral-300 max-w-sm">
                          Start by listing whatever you actually have on hand – bruised
                          tomatoes, the last of a bag of rice, that lonely lemon. We&apos;ll
                          respond with a gentle, story-like recipe idea.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 border-amber-700/80 text-amber-100 hover:bg-amber-500/10"
                        onClick={() => {
                          setSelectedIngredients(['cherry tomatoes', 'sage', 'pasta']);
                          toast('Seeded a tiny pantry for you', {
                            description:
                              'We dropped a few example ingredients in – feel free to edit them.',
                          });
                        }}
                      >
                        Try with a pantry example
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <RecipeDetailSheet
        recipe={generatedRecipe}
        isOpen={isDetailOpen}
        isFavorite={isFavorite}
        onOpenChange={setIsDetailOpen}
        onToggleFavorite={handleFavoriteToggle}
      />
    </div>
  );
};

export default GeneratePage;