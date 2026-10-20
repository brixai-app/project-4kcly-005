import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, X, ChevronDown, Wand2 } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Sheet,
  SheetTrigger,
  SheetContent,
  Switch,
  Badge,
} from "@/components/ui/shadcn";

import {
  AIRecipeParams,
  CuisineType,
  useAIStatus,
  usePreferences,
  upsertPreferences,
  generateAIRecipe,
} from "@/mock";
import LoadingSkeleton from "./LoadingSkeleton";

// NOTE: This component talks only to the mocked client-side store in src/mock.ts.
// There is NO real backend or AI – generation is fully simulated in-browser.

const CUISINE_LABELS: Record<CuisineType | "surprise", string> = {
  mediterranean: "Mediterranean sunshine",
  italian: "Cozy Italian",
  mexican: "Zesty Mexican",
  asian: "Bright Asian",
  "middle-eastern": "Spiced Middle Eastern",
  indian: "Comforting Indian",
  american: "Casual American",
  fusion: "Playful Fusion",
  surprise: "Surprise me",
};

const CUISINE_OPTIONS: (CuisineType | "surprise")[] = [
  "surprise",
  "mediterranean",
  "italian",
  "mexican",
  "asian",
  "middle-eastern",
  "indian",
  "american",
  "fusion",
];

interface IngredientChipProps {
  value: string;
  onRemove: () => void;
}

const IngredientChip: React.FC<IngredientChipProps> = ({ value, onRemove }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.96 }}
    className="inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-amber-50/80 px-3 py-1 text-xs font-medium text-amber-900 shadow-sm hover:border-amber-300 hover:bg-amber-50 dark:border-amber-700/70 dark:bg-amber-900/40 dark:text-amber-50 dark:hover:bg-amber-900/70 transition-colors"
    onClick={onRemove}
  >
    <span className="whitespace-normal break-words">{value}</span>
    <X className="h-3.5 w-3.5" aria-hidden="true" />
  </motion.button>
);

const sheetMotion = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

const buttonMotion = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
};

const containerMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const dietaryAccentClasses = {
  label: "text-sm font-medium text-stone-800 dark:text-stone-100",
  description:
    "text-xs text-stone-500 dark:text-stone-400 whitespace-normal break-words",
};

const AIRecipeGenerator: React.FC = () => {
  const navigate = useNavigate();
  const aiStatus = useAIStatus();
  const preferences = usePreferences();

  const [open, setOpen] = useState(false);
  const [ingredientsText, setIngredientsText] = useState(
    preferences.lastSearchQuery || ""
  );
  const [ingredientInput, setIngredientInput] = useState("");
  const [chips, setChips] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<CuisineType | "surprise">("surprise");
  const [dietary, setDietary] = useState({
    vegan: preferences.dietary.vegan,
    vegetarian: preferences.dietary.vegetarian,
    glutenFree: preferences.dietary.glutenFree,
    dairyFree: preferences.dietary.dairyFree,
  });

  const isLoading = aiStatus.isLoading;

  const mergedIngredientsText = useMemo(() => {
    const manualText = ingredientsText.trim();
    if (!chips.length) return manualText;
    const chipText = chips.join(", ");
    if (!manualText) return chipText;
    return `${manualText}, ${chipText}`;
  }, [chips, ingredientsText]);

  const handleAddChip = useCallback(() => {
    const value = ingredientInput.trim();
    if (!value) return;
    setChips((prev) =>
      prev.includes(value) ? prev : [...prev, value].slice(0, 12)
    );
    setIngredientInput("");
  }, [ingredientInput]);

  const handleChipKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddChip();
    }
  };

  const handleToggleDietary = (key: keyof typeof dietary) => {
    setDietary((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      upsertPreferences({ dietary: next });
      return next;
    });
  };

  const handleCuisineChange = (value: CuisineType | "surprise") => {
    setCuisine(value);
    // Persist last search cuisine only when not surprise
    if (value !== "surprise") {
      upsertPreferences({ lastSearchCuisine: value });
    }
  };

  const handleGenerate = async () => {
    const trimmedPrompt = mergedIngredientsText.trim();

    const params: AIRecipeParams = {
      ingredientsText: trimmedPrompt,
      dietary,
      cuisineVibe: cuisine,
    };

    upsertPreferences({ lastSearchQuery: trimmedPrompt });

    try {
      const recipe = await generateAIRecipe(params);
      toast.success("New AI recipe created", {
        description:
          "We saved it to your collection. Explore the details or tweak it as you like.",
      });
      setOpen(false);
      navigate(`/recipes/${recipe.id}`);
    } catch (error: any) {
      const message: string =
        (error && typeof error.message === "string" && error.message) ||
        "Something went wrong in the test kitchen.";
      toast.error("Could not generate recipe", {
        description: message,
        action: {
          label: "Retry",
          onClick: () => {
            void handleGenerate();
          },
        },
      });
    }
  };

  const disabledGenerate = isLoading;

  const heroCopy = useMemo(
    () =>
      aiStatus.lastPrompt
        ? "We remember your last craving – refine it or dream up something new."
        : "Describe your ingredients, mood, or cravings and let the AI kitchen riff.",
    [aiStatus.lastPrompt]
  );

  return (
    <section className="w-full py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-stone-50 via-amber-50/60 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <motion.div
          {...containerMotion}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch"
        >
          {/* Summary / Lifestyle pitch */}
          <div className="lg:col-span-5 min-w-0 flex flex-col justify-center space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/70 px-3 py-1 text-xs font-medium text-amber-900 shadow-sm dark:bg-amber-900/40 dark:text-amber-50">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>In-browser AI test kitchen (mocked)</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl leading-snug text-stone-900 dark:text-stone-50 whitespace-normal break-words">
                Turn stray ingredients into
                <span className="text-amber-700 dark:text-amber-300"> warm, camera-ready recipes</span>
              </h2>
              <p className="font-['Inter'] text-sm sm:text-base text-stone-600 dark:text-stone-300 whitespace-normal break-words">
                No real backend, no actual AI model – just a playful, fully mocked
                generator that lives right in your browser. Every dish it dreams up
                is stored locally so you can revisit, rate, and riff on it later.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/60">
              <p className="font-['Inter'] text-xs sm:text-sm text-stone-700 dark:text-stone-200 whitespace-normal break-words">
                {heroCopy}
              </p>
              {aiStatus.lastError && (
                <p className="mt-2 text-xs text-rose-600 dark:text-rose-300 whitespace-normal break-words">
                  Last hiccup: {aiStatus.lastError}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <motion.div {...buttonMotion}>
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button
                      size="lg"
                      className="rounded-full bg-amber-700 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-amber-800 focus-visible:ring-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400"
                    >
                      <Wand2 className="mr-2 h-4 w-4" aria-hidden="true" />
                      Open AI generator
                    </Button>
                  </SheetTrigger>

                  <SheetContent
                    side="right"
                    className="w-full sm:max-w-md md:max-w-lg border-l border-stone-200 bg-gradient-to-b from-stone-50 via-amber-50/60 to-stone-100 dark:border-stone-700 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 px-0"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isLoading ? "loading" : "content"}
                        variants={sheetMotion}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="h-full overflow-y-auto px-4 pb-6 pt-4 sm:px-6"
                      >
                        <header className="mb-4 space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                            AI Recipe Studio (Mocked)
                          </p>
                          <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl text-stone-900 dark:text-stone-50 whitespace-normal break-words">
                            Sketch your cravings, we’ll plate the idea
                          </h3>
                          <p className="font-['Inter'] text-xs sm:text-sm text-stone-600 dark:text-stone-300 whitespace-normal break-words">
                            Type a few ingredients, add a mood or occasion, toggle
                            dietary needs, then let the mocked AI kitchen build a
                            cozy, scroll-stopping recipe for you.
                          </p>
                        </header>

                        {isLoading ? (
                          <div className="mt-4">
                            <LoadingSkeleton variant="text" count={3} className="mb-4" />
                            <LoadingSkeleton variant="card" />
                          </div>
                        ) : (
                          <Card className="border-amber-100/70 bg-white/90 shadow-sm backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/70">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between w-full gap-2">
                                <CardTitle className="font-['Playfair_Display'] text-lg text-stone-900 dark:text-stone-50 whitespace-normal break-words">
                                  Your fridge, elevated
                                </CardTitle>
                                <Badge className="rounded-full bg-amber-100 text-[11px] font-semibold text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                  Instant mock
                                </Badge>
                              </div>
                              <CardDescription className="font-['Inter'] text-xs text-stone-600 dark:text-stone-300 whitespace-normal break-words">
                                Start with what you have on hand – herbs, leftovers,
                                a craving – and we’ll sketch a restaurant-worthy dish
                                for tonight.
                              </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                              {/* Ingredients free text */}
                              <div className="space-y-2">
                                <label className="block text-xs font-medium text-stone-700 dark:text-stone-200">
                                  Ingredients, cravings, or occasion
                                </label>
                                <Input
                                  value={ingredientsText}
                                  onChange={(e) => setIngredientsText(e.target.value)}
                                  placeholder="e.g. roasted veggies, leftover rice, something cozy but not too heavy"
                                  className="h-10 rounded-xl border-stone-200 bg-amber-50/40 text-sm placeholder:text-stone-400 focus-visible:border-amber-400 focus-visible:ring-amber-400 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-50 dark:placeholder:text-stone-500"
                                />
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 whitespace-normal break-words">
                                  Be as poetic or as practical as you like – the
                                  mocked generator simply uses this text to craft a
                                  flavorful-sounding recipe.
                                </p>
                              </div>

                              {/* Ingredient chips */}
                              <div className="space-y-2">
                                <label className="block text-xs font-medium text-stone-700 dark:text-stone-200">
                                  Quick ingredient chips
                                </label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={ingredientInput}
                                    onChange={(e) => setIngredientInput(e.target.value)}
                                    onKeyDown={handleChipKeyDown}
                                    placeholder="Add ingredient and hit Enter"
                                    className="h-9 flex-1 rounded-full border-stone-200 bg-white text-xs placeholder:text-stone-400 focus-visible:border-amber-400 focus-visible:ring-amber-400 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-50 dark:placeholder:text-stone-500"
                                  />
                                  <motion.div {...buttonMotion}>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="outline"
                                      onClick={handleAddChip}
                                      className="h-9 w-9 rounded-full border-amber-200 bg-amber-100/70 text-amber-900 hover:bg-amber-200 hover:text-amber-900 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-900"
                                    >
                                      <Plus className="h-4 w-4" aria-hidden="true" />
                                      <span className="sr-only">Add ingredient chip</span>
                                    </Button>
                                  </motion.div>
                                </div>
                                {chips.length > 0 && (
                                  <div className="flex flex-wrap gap-2.5 pt-1">
                                    {chips.map((chip) => (
                                      <IngredientChip
                                        key={chip}
                                        value={chip}
                                        onRemove={() =>
                                          setChips((prev) =>
                                            prev.filter((item) => item !== chip)
                                          )
                                        }
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Dietary toggles */}
                              <div className="space-y-3 rounded-xl bg-amber-50/70 p-3.5 dark:bg-stone-900/70 border border-amber-100/80 dark:border-stone-700">
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
                                    Dietary mood
                                  </span>
                                  <span className="text-[11px] text-stone-500 dark:text-stone-400 whitespace-normal break-words">
                                    We’ll bias recipes to fit these vibes.
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleDietary("vegan")}
                                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                                      dietary.vegan
                                        ? "border-emerald-500/80 bg-emerald-50/80 dark:border-emerald-400/80 dark:bg-emerald-900/40"
                                        : "border-stone-200 bg-white/80 hover:border-emerald-300/80 hover:bg-emerald-50/60 dark:border-stone-700 dark:bg-stone-900/80 dark:hover:border-emerald-500/70 dark:hover:bg-emerald-900/30"
                                    }`}
                                  >
                                    <div className="space-y-0.5">
                                      <p className={dietaryAccentClasses.label}>Plant-led</p>
                                      <p className={dietaryAccentClasses.description}>
                                        Vegan-friendly, dairy free by default.
                                      </p>
                                    </div>
                                    <Switch
                                      checked={dietary.vegan}
                                      onCheckedChange={() =>
                                        handleToggleDietary("vegan")
                                      }
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleDietary("vegetarian")}
                                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                                      dietary.vegetarian
                                        ? "border-lime-500/80 bg-lime-50/80 dark:border-lime-400/80 dark:bg-lime-900/40"
                                        : "border-stone-200 bg-white/80 hover:border-lime-300/80 hover:bg-lime-50/60 dark:border-stone-700 dark:bg-stone-900/80 dark:hover:border-lime-500/70 dark:hover:bg-lime-900/30"
                                    }`}
                                  >
                                    <div className="space-y-0.5">
                                      <p className={dietaryAccentClasses.label}>Vegetarian</p>
                                      <p className={dietaryAccentClasses.description}>
                                        Eggs & dairy welcome, no meat.
                                      </p>
                                    </div>
                                    <Switch
                                      checked={dietary.vegetarian}
                                      onCheckedChange={() =>
                                        handleToggleDietary("vegetarian")
                                      }
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleDietary("glutenFree")}
                                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                                      dietary.glutenFree
                                        ? "border-amber-500/80 bg-amber-50/80 dark:border-amber-400/80 dark:bg-amber-900/40"
                                        : "border-stone-200 bg-white/80 hover:border-amber-300/80 hover:bg-amber-50/60 dark:border-stone-700 dark:bg-stone-900/80 dark:hover:border-amber-500/70 dark:hover:bg-amber-900/30"
                                    }`}
                                  >
                                    <div className="space-y-0.5">
                                      <p className={dietaryAccentClasses.label}>Gluten gentle</p>
                                      <p className={dietaryAccentClasses.description}>
                                        We’ll lean away from breads & pasta.
                                      </p>
                                    </div>
                                    <Switch
                                      checked={dietary.glutenFree}
                                      onCheckedChange={() =>
                                        handleToggleDietary("glutenFree")
                                      }
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleDietary("dairyFree")}
                                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                                      dietary.dairyFree
                                        ? "border-orange-500/80 bg-orange-50/80 dark:border-orange-400/80 dark:bg-orange-900/40"
                                        : "border-stone-200 bg-white/80 hover:border-orange-300/80 hover:bg-orange-50/60 dark:border-stone-700 dark:bg-stone-900/80 dark:hover:border-orange-500/70 dark:hover:bg-orange-900/30"
                                    }`}
                                  >
                                    <div className="space-y-0.5">
                                      <p className={dietaryAccentClasses.label}>Lactose light</p>
                                      <p className={dietaryAccentClasses.description}>
                                        Fewer creamy sauces, more brightness.
                                      </p>
                                    </div>
                                    <Switch
                                      checked={dietary.dairyFree}
                                      onCheckedChange={() =>
                                        handleToggleDietary("dairyFree")
                                      }
                                    />
                                  </button>
                                </div>
                              </div>

                              {/* Cuisine vibe */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between w-full">
                                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-200">
                                    Cuisine vibe
                                  </label>
                                  <span className="text-[11px] text-stone-500 dark:text-stone-400 whitespace-normal break-words">
                                    Not a filter, just a gentle nudge.
                                  </span>
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="flex w-full items-center justify-between rounded-xl border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 hover:border-amber-300 hover:bg-amber-50/60 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-50 dark:hover:border-amber-500/70 dark:hover:bg-amber-900/30"
                                    >
                                      <span className="whitespace-normal break-words text-left">
                                        {CUISINE_LABELS[cuisine]}
                                      </span>
                                      <ChevronDown className="h-4 w-4 text-stone-500" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start" className="w-64">
                                    {CUISINE_OPTIONS.map((option) => (
                                      <DropdownMenuItem
                                        key={option}
                                        onClick={() => handleCuisineChange(option)}
                                        className="flex flex-col items-start gap-0.5 whitespace-normal break-words"
                                      >
                                        <span className="text-xs font-medium text-stone-800 dark:text-stone-50">
                                          {CUISINE_LABELS[option]}
                                        </span>
                                        <span className="text-[11px] text-stone-500 dark:text-stone-400">
                                          {option === "surprise"
                                            ? "Let the mocked AI pick the mood for you."
                                            : `Skews textures and language toward ${CUISINE_LABELS[option].toLowerCase()}.`}
                                        </span>
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              {/* Generate button */}
                              <div className="pt-2">
                                <motion.div {...buttonMotion}>
                                  <Button
                                    type="button"
                                    size="lg"
                                    disabled={disabledGenerate}
                                    onClick={handleGenerate}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-700 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-amber-800 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-500 dark:hover:bg-amber-400"
                                  >
                                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                                    {isLoading ? "Whisking up your recipe…" : "Generate recipe with AI (mock)"}
                                  </Button>
                                </motion.div>
                                <p className="mt-2 text-[11px] text-stone-500 dark:text-stone-400 whitespace-normal break-words">
                                  This experience is fully mocked and runs entirely in
                                  your browser. Expect playful randomness and the
                                  occasional intentional "oops" toast.
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </SheetContent>
                </Sheet>
              </motion.div>

              <p className="font-['Inter'] text-xs text-stone-500 dark:text-stone-400 whitespace-normal break-words">
                Or scroll the curated recipes below if you’d rather follow
                something tried-and-true tonight.
              </p>
            </div>
          </div>

          {/* Ambient preview / mood column */}
          <div className="lg:col-span-7 min-w-0">
            <motion.div
              className="relative h-full min-h-[220px] rounded-3xl border border-amber-100/70 bg-[radial-gradient(circle_at_top,_#fef3c7,_#f5f5f4)] p-5 shadow-md overflow-hidden dark:border-stone-700 dark:bg-[radial-gradient(circle_at_top,_#451a03,_#020617)]"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="absolute inset-0 opacity-60 mix-blend-multiply pointer-events-none">
                <div className="h-full w-full bg-[radial-gradient(circle_at_10%_20%,rgba(244,162,97,0.28)_0,transparent_60%),radial-gradient(circle_at_80%_0,rgba(233,196,106,0.25)_0,transparent_55%),radial-gradient(circle_at_0_100%,rgba(42,157,143,0.3)_0,transparent_55%)]" />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-stone-800 shadow-sm backdrop-blur-sm dark:bg-stone-900/70 dark:text-stone-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Live mock preview
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl text-stone-900 dark:text-stone-50 whitespace-normal break-words">
                    Watch ideas simmer into recipes
                  </h3>
                  <p className="font-['Inter'] text-xs sm:text-sm text-stone-700 dark:text-stone-200 whitespace-normal break-words max-w-[34rem]">
                    The moment you tap generate, we spin your prompts into a
                    complete, shareable recipe card – right here in the browser.
                    No login, no servers, just a cozy taste of what a full AI
                    cooking companion could feel like.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
                  <div className="rounded-2xl bg-white/80 p-3 shadow-sm backdrop-blur-sm border border-amber-100/80 dark:bg-stone-950/60 dark:border-stone-700">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                      Step 1
                    </p>
                    <p className="font-['Inter'] text-[13px] text-stone-800 dark:text-stone-100 whitespace-normal break-words">
                      Pour in your ingredients & cravings.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-3 shadow-sm backdrop-blur-sm border border-amber-100/80 dark:bg-stone-950/60 dark:border-stone-700">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                      Step 2
                    </p>
                    <p className="font-['Inter'] text-[13px] text-stone-800 dark:text-stone-100 whitespace-normal break-words">
                      We mock up a full recipe – ingredients, steps, and story.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-3 shadow-sm backdrop-blur-sm border border-amber-100/80 dark:bg-stone-950/60 dark:border-stone-700">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                      Step 3
                    </p>
                    <p className="font-['Inter'] text-[13px] text-stone-800 dark:text-stone-100 whitespace-normal break-words">
                      Save, rate, and revisit – all stored safely in localStorage.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIRecipeGenerator;