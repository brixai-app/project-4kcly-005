import React, { ChangeEvent, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Switch,
  Input,
  Badge,
} from "@/components/ui/shadcn";
import {
  usePreferences,
  useMockStore,
  useRecipes,
  useSavedRecipeIds,
  upsertPreferences,
  listSavedRecipes,
  clearAllData,
  setState,
  getState,
  toggleSavedRecipe,
} from "@/mock";
import {
  Bookmark,
  Download,
  Flame,
  Leaf,
  Sparkles,
  Trash2,
  Upload,
  UtensilsCrossed,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// NOTE: This entire page works against a 100% frontend-only mocked store
// implemented in src/mock.ts with safe localStorage persistence. There is
// NO real backend or AI – everything is simulated in-browser for the MVP.

const cuisineLabels: Record<string, string> = {
  mediterranean: "Mediterranean",
  italian: "Italian",
  mexican: "Mexican",
  asian: "Asian",
  "middle-eastern": "Middle Eastern",
  indian: "Indian",
  american: "American",
  fusion: "Fusion",
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const preferences = usePreferences();
  const recipes = useRecipes();
  const savedRecipeIds = useSavedRecipeIds();
  const savedRecipes = useMemo(() => listSavedRecipes(), []);
  const stateVersion = useMockStore((s) => s.version);

  // Local UI state
  const [nameInput, setNameInput] = useState(preferences.name);
  const [maxPrepTime, setMaxPrepTime] = useState<string>(
    preferences.maxPrepTimeMinutes ? String(preferences.maxPrepTimeMinutes) : ""
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importing, setImporting] = useState(false);

  const handleDietToggle = (key: keyof typeof preferences.dietary) => (checked: boolean) => {
    upsertPreferences({
      dietary: {
        ...preferences.dietary,
        [key]: checked,
      },
    });
    toast.success("Preferences updated", {
      description: "Dietary preference saved in your local profile.",
    });
  };

  const handleCuisineToggle = (cuisine: string) => {
    const set = new Set(preferences.favoriteCuisines);
    if (set.has(cuisine as any)) {
      set.delete(cuisine as any);
    } else {
      set.add(cuisine as any);
    }
    upsertPreferences({ favoriteCuisines: Array.from(set) as any });
    toast.success("Cuisine preferences updated", {
      description: "Your favorite cuisines have been refreshed.",
    });
  };

  const handleNameBlur = () => {
    if (!nameInput.trim() || nameInput.trim() === preferences.name) return;
    upsertPreferences({ name: nameInput.trim() });
    toast.success("Profile name updated", {
      description: "We will greet you with this name from now on.",
    });
  };

  const handleMaxPrepBlur = () => {
    const trimmed = maxPrepTime.trim();
    if (!trimmed) {
      upsertPreferences({ maxPrepTimeMinutes: undefined });
      toast("Prep time preference cleared");
      return;
    }
    const value = Number(trimmed);
    if (Number.isNaN(value) || value <= 0) {
      setMaxPrepTime(preferences.maxPrepTimeMinutes ? String(preferences.maxPrepTimeMinutes) : "");
      toast.error("Enter a valid number of minutes");
      return;
    }
    upsertPreferences({ maxPrepTimeMinutes: value });
    toast.success("Prep time preference updated");
  };

  const handleClearSaved = () => {
    const current = getState();
    if (!current.savedRecipeIds.length) {
      toast("No saved recipes to clear");
      return;
    }
    setState({ savedRecipeIds: [] });
    toast.success("Saved recipes cleared", {
      description: "Your saved list has been reset on this device.",
    });
  };

  const handleClearAll = () => {
    clearAllData();
    toast.success("All local data cleared", {
      description: "The app has been reset to its fresh demo state.",
    });
  };

  const handleExport = () => {
    const snapshot = getState();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-recipe-profile-v${snapshot.version}-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Profile exported", {
      description: "Your current mock data has been saved as a JSON file.",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || typeof parsed.version !== "number") {
        throw new Error("Invalid profile format");
      }
      // We trust the mock.ts migration logic to handle version differences
      setState(parsed);
      toast.success("Profile imported", {
        description:
          "Local mock data has been replaced with the imported snapshot. Reload if things look odd.",
      });
    } catch (err: any) {
      toast.error("Import failed", {
        description: err?.message || "Could not read the selected file.",
      });
    } finally {
      setImporting(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const totalRecipes = recipes.length;

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(circle_at_top,_#fff7f2,_#f7efe9)] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 pb-16">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 pt-24 space-y-10">
        {/* Header / Hero Strip */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/70 px-4 py-1 text-sm font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-50">
              <Sparkles className="h-4 w-4" />
              <span>Local-only demo profile · v{stateVersion}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 font-['Playfair_Display'] whitespace-normal break-words">
              Your flavor profile & kitchen moodboard
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-neutral-700 dark:text-neutral-300 whitespace-normal break-words">
              Tune your dietary preferences, favorite cuisines, and saved recipes. Everything here
              lives only in your browser – a private playground for exploring the AI test kitchen.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 lg:justify-end"
          >
            <Button
              variant="outline"
              className="border-amber-200/70 bg-white/70 text-amber-900 hover:bg-amber-100/80 hover:text-amber-950 dark:border-amber-700/70 dark:bg-amber-950/40 dark:text-amber-50 dark:hover:bg-amber-900/60"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              className="border-neutral-200/80 bg-white/80 text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-50 dark:hover:bg-neutral-800"
              onClick={handleImportClick}
              disabled={importing}
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? "Importing..." : "Import JSON"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImportChange}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left column: Profile + preferences */}
          <div className="lg:col-span-7 min-w-0 space-y-6">
            {/* Identity card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <Card className="border-none shadow-sm bg-white/80 backdrop-blur-md dark:bg-neutral-900/70">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold text-white shadow-md"
                      style={{ backgroundColor: preferences.avatarColor || "#E76F51" }}
                    >
                      {preferences.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <CardTitle className="text-xl font-semibold tracking-tight whitespace-normal break-words font-['Playfair_Display']">
                        Personal profile
                      </CardTitle>
                      <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-normal break-words">
                        This profile is stored in your browser only and powers search defaults and
                        AI suggestions.
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right text-xs text-neutral-500 dark:text-neutral-400">
                    <span>{totalRecipes} recipes in library</span>
                    <span>{savedRecipeIds.length} saved favorites</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
                        Display name
                      </label>
                      <Input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onBlur={handleNameBlur}
                        placeholder="How should we call you?"
                        className="bg-white/70 dark:bg-neutral-950/70 border-neutral-200/80 dark:border-neutral-700 focus-visible:ring-amber-500"
                      />
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 whitespace-normal break-words">
                        Used for review defaults and as a friendly greeting – never sent anywhere.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
                        Ideal prep time
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={maxPrepTime}
                          onChange={(e) => setMaxPrepTime(e.target.value)}
                          onBlur={handleMaxPrepBlur}
                          placeholder="e.g. 30"
                          inputMode="numeric"
                          className="bg-white/70 dark:bg-neutral-950/70 border-neutral-200/80 dark:border-neutral-700 focus-visible:ring-amber-500"
                        />
                        <span className="text-sm text-neutral-600 dark:text-neutral-300">min</span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 whitespace-normal break-words">
                        We&apos;ll use this as a soft cap when suggesting recipes or pre-filling filters.
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-neutral-100 dark:bg-neutral-800" />

                  {/* Dietary toggles */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="space-y-0.5">
                        <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 whitespace-normal break-words">
                          Dietary preferences
                        </h2>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-normal break-words">
                          Shape AI suggestions around how you like to eat most days.
                        </p>
                      </div>
                      <Badge className="rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200/80 dark:bg-emerald-900/40 dark:text-emerald-50 dark:border-emerald-700/60">
                        Flexible
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 bg-white/70 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950/70">
                        <div className="flex items-center gap-2 min-w-0">
                          <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                          <span className="font-medium text-neutral-900 dark:text-neutral-50">
                            Vegan
                          </span>
                        </div>
                        <Switch
                          checked={preferences.dietary.vegan}
                          onCheckedChange={handleDietToggle("vegan")}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 bg-white/70 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950/70">
                        <div className="flex items-center gap-2 min-w-0">
                          <Leaf className="h-4 w-4 text-lime-600 dark:text-lime-300" />
                          <span className="font-medium text-neutral-900 dark:text-neutral-50">
                            Vegetarian
                          </span>
                        </div>
                        <Switch
                          checked={preferences.dietary.vegetarian}
                          onCheckedChange={handleDietToggle("vegetarian")}
                          className="data-[state=checked]:bg-lime-500"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 bg-white/70 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950/70">
                        <div className="flex items-center gap-2 min-w-0">
                          <Flame className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                          <span className="font-medium text-neutral-900 dark:text-neutral-50">
                            Gluten-free leaning
                          </span>
                        </div>
                        <Switch
                          checked={preferences.dietary.glutenFree}
                          onCheckedChange={handleDietToggle("glutenFree")}
                          className="data-[state=checked]:bg-amber-500"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 bg-white/70 px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950/70">
                        <div className="flex items-center gap-2 min-w-0">
                          <Flame className="h-4 w-4 text-rose-500 dark:text-rose-300" />
                          <span className="font-medium text-neutral-900 dark:text-neutral-50">
                            Dairy-light
                          </span>
                        </div>
                        <Switch
                          checked={preferences.dietary.dairyFree}
                          onCheckedChange={handleDietToggle("dairyFree")}
                          className="data-[state=checked]:bg-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Favorite cuisines */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="space-y-0.5">
                        <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 whitespace-normal break-words">
                          Favorite cuisines
                        </h2>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-normal break-words">
                          Tap to highlight the flavors you gravitate toward. AI uses these as a soft
                          nudge.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {Object.entries(cuisineLabels).map(([key, label]) => {
                        const active = preferences.favoriteCuisines.includes(key as any);
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleCuisineToggle(key)}
                            className={`rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 border transition-colors duration-150
                            ${active
                              ? "border-amber-500 bg-amber-100/80 text-amber-900 shadow-sm dark:border-amber-400 dark:bg-amber-900/40 dark:text-amber-50"
                              : "border-neutral-200 bg-white/80 text-neutral-800 hover:border-amber-300 hover:bg-amber-50/60 dark:border-neutral-700 dark:bg-neutral-950/60 dark:text-neutral-200 dark:hover:border-amber-400/70 dark:hover:bg-amber-950/30"}
                          `}
                          >
                            <UtensilsCrossed className="h-4 w-4" />
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Data management */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Card className="border border-rose-100/80 bg-rose-50/60 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/30">
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold text-rose-900 dark:text-rose-50 whitespace-normal break-words">
                      Local data controls
                    </CardTitle>
                    <CardDescription className="text-xs text-rose-900/80 dark:text-rose-200/80 whitespace-normal break-words">
                      This affects only your current browser. Clearing data will not be reversible.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="border-rose-300/80 bg-rose-100/60 text-rose-900 hover:bg-rose-100 hover:text-rose-950 dark:border-rose-800 dark:bg-rose-900/40 dark:text-rose-50 dark:hover:bg-rose-900/70"
                    onClick={handleClearSaved}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Clear saved recipes
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-rose-600 hover:bg-rose-700 text-rose-50 shadow-sm"
                    onClick={handleClearAll}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear all local data
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right column: Saved recipes overview */}
          <div className="lg:col-span-5 min-w-[340px] space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
            >
              <Card className="border-none bg-[#fef7f1]/90 shadow-sm backdrop-blur-md dark:bg-neutral-900/80">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between w-full gap-2">
                    <CardTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-50 whitespace-normal break-words">
                      Saved recipes
                    </CardTitle>
                    <Badge className="rounded-full bg-amber-500/90 text-amber-50 border border-amber-400/80">
                      {savedRecipeIds.length} saved
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-neutral-700 dark:text-neutral-400 whitespace-normal break-words">
                    A quick glance at the dishes you&apos;ve bookmarked. Tap a card to open details or
                    unsave.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {savedRecipes.length === 0 ? (
                    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-amber-300/70 bg-amber-50/80 px-4 py-5 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-50">
                      <p className="whitespace-normal break-words">
                        You haven&apos;t saved anything yet. Explore recipes and tap the bookmark icon to
                        build your personal cookbook.
                      </p>
                      <Button
                        size="sm"
                        className="bg-amber-600 text-amber-50 hover:bg-amber-700 shadow-sm"
                        onClick={() => navigate("/search")}
                      >
                        <Sparkles className="h-4 w-4 mr-1.5" />
                        Discover recipes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {savedRecipes.map((recipe) => {
                        const isSaved = savedRecipeIds.includes(recipe.id);
                        return (
                          <motion.button
                            key={recipe.id}
                            type="button"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.18 }}
                            onClick={(e) => {
                              // Navigate when clicking the main body; toggle save when clicking icon
                              const target = e.target as HTMLElement;
                              if (target.closest("[data-unsave]") == null) {
                                navigate(`/recipes/${recipe.id}`);
                              }
                            }}
                            className="w-full rounded-2xl border border-neutral-100 bg-white/90 px-3 py-3.5 text-left shadow-xs hover:border-amber-300/80 hover:bg-amber-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-neutral-800 dark:bg-neutral-950/80 dark:hover:border-amber-500/70 dark:hover:bg-amber-950/30"
                          >
                            <div className="flex gap-3 items-start">
                              <div className="h-14 w-16 flex-shrink-0 rounded-xl bg-cover bg-center bg-neutral-200 dark:bg-neutral-800" style={{ backgroundImage: `url(${recipe.heroImageUrl})` }} />
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 whitespace-normal break-words">
                                    {recipe.title}
                                  </p>
                                  <button
                                    type="button"
                                    data-unsave
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      toggleSavedRecipe(recipe.id);
                                      toast.success(
                                        isSaved ? "Removed from saved" : "Recipe saved",
                                        {
                                          description: isSaved
                                            ? "This dish has been removed from your favorites."
                                            : "We&apos;ll keep this one handy for later.",
                                        }
                                      );
                                    }}
                                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-medium transition-colors duration-150
                                      ${isSaved
                                        ? "border-amber-500 bg-amber-500/90 text-amber-50"
                                        : "border-neutral-200 bg-white text-neutral-700 hover:border-amber-400 hover:text-amber-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-amber-400 dark:hover:text-amber-300"}
                                    `}
                                  >
                                    <Bookmark className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>
                                      {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min total
                                    </span>
                                  </span>
                                  <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                  <span className="capitalize">{cuisineLabels[recipe.cuisine]}</span>
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Session context / quick actions */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <Card className="border-none bg-neutral-900 text-neutral-50 shadow-md overflow-hidden relative">
                <div className="pointer-events-none absolute inset-0 opacity-80" style={{
                  background:
                    "radial-gradient(circle at top left, #f4a26133, transparent 60%), radial-gradient(circle at bottom right, #e76f5133, transparent 60%)",
                }} />
                <div className="relative z-10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between w-full gap-2">
                      <CardTitle className="text-base font-semibold whitespace-normal break-words">
                        Tonight&apos;s kitchen mood
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-neutral-300 whitespace-normal break-words">
                      Use your profile as a compass – shift preferences, then let the AI generator
                      riff with you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center gap-3 pt-1">
                    <Button
                      size="sm"
                      className="bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-sm"
                      onClick={() => navigate("/generate")}
                    >
                      <Sparkles className="h-4 w-4 mr-1.5" />
                      Open AI kitchen
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-neutral-600 bg-transparent text-neutral-100 hover:bg-neutral-800/80"
                      onClick={() => navigate("/search")}
                    >
                      <UtensilsCrossed className="h-4 w-4 mr-1.5" />
                      Browse recipes
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;