import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Separator,
} from "@/components/ui/shadcn";
import { BookmarkPlus, Sparkles, Loader2 } from "lucide-react";
import {
  generateRecipe,
  saveFavorite,
  type GeneratedRecipe,
  type DietaryTag,
} from "@/mock";
import { IngredientInput, type IngredientInputProps } from "@/components/IngredientInput";
import {
  DietaryPreferences,
  type DietaryPreferencesProps,
} from "@/components/DietaryPreferences";
import { CuisineSelect } from "@/components/CuisineSelect";

// NOTE: This page works entirely against the mocked, in-browser engine in src/mock.ts.
// There is NO real backend or AI; all generation and favorites are local to this browser
// and persisted only via localStorage as defined in the mock module.

export const RecipeGeneratorPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([]);
  const [cuisineId, setCuisineId] = useState<string | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<GeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isGenerating) return;

      if (!ingredients.length && !cuisineId && !dietaryTags.length) {
        toast("Add a detail or two", {
          description:
            "Share at least one ingredient, preference, or cuisine so AtelierAI can compose.",
        });
        return;
      }

      setIsGenerating(true);
      // Mock generation: synchronous, but we add a tiny delay for perception.
      window.setTimeout(() => {
        const result = generateRecipe({
          ingredients,
          dietaryTags,
          cuisineId,
        });

        if (result.status === "success" && result.payload) {
          setCurrentRecipe(result.payload as GeneratedRecipe);
          toast.success("Recipe composed", {
            description: result.message,
          });
        } else {
          toast.error("Unable to compose", {
            description:
              result.message || "The in-browser engine could not create a recipe.",
          });
        }

        setIsGenerating(false);
      }, 380);
    },
    [ingredients, dietaryTags, cuisineId, isGenerating]
  );

  const handleSave = useCallback(() => {
    if (!currentRecipe) return;
    const result = saveFavorite(currentRecipe);
    if (result.status === "success") {
      toast.success("Saved to Atelier", {
        description: result.message,
      });
    } else {
      toast.error("Already collected", {
        description: result.message,
      });
    }
  }, [currentRecipe]);

  // Explicitly satisfy IngredientInputProps and DietaryPreferencesProps
  const ingredientInputProps: IngredientInputProps = {
    // IngredientInput expects a value prop representing the current list
    value: ingredients,
    onChange: setIngredients,
    placeholder: "Heirloom tomatoes, burrata, good olive oil…",
  };

  const dietaryPreferencesProps: DietaryPreferencesProps = {
    // DietaryPreferences expects the currently selected tags via value
    value: dietaryTags,
    onChange: setDietaryTags,
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0b0a] text-zinc-50 pt-20 pb-16">
      {/* Page shell uses generous horizontal padding but remains full-bleed */}
      <main className="w-full px-6 lg:px-12">
        <motion.section
          className="w-full max-w-[1600px] mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Intro band */}
          <div className="w-full grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start mb-12 lg:mb-16">
            <div className="space-y-4 lg:space-y-6">
              <p className="uppercase tracking-[0.3em] text-xs text-zinc-400">AtelierAI Recipes</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight font-['Playfair_Display']">
                Compose a&nbsp;
                <span className="border-b border-zinc-600 pb-1">one-of-one</span>
                &nbsp;recipe from what you have.
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl">
                This is a fully mocked, in-browser generator. It weaves your ingredients with
                curated templates and never leaves this device&mdash;no servers, no uploads, just
                local imagination and localStorage.
              </p>
            </div>

            <div className="relative">
              <Card className="bg-gradient-to-br from-zinc-900/80 via-zinc-900/40 to-zinc-800/80 border-zinc-700/60 shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-normal tracking-[0.25em] text-zinc-300 uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Live mock engine
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400">
                    Every plate is generated in memory using templates, ingredients and your
                    mood&mdash;then optionally saved to this browser.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 text-[11px] text-zinc-200">
                  <Badge variant="outline" className="border-zinc-600/70 bg-zinc-900/60 rounded-full px-3 py-1">
                    No backend
                  </Badge>
                  <Badge variant="outline" className="border-zinc-600/70 bg-zinc-900/60 rounded-full px-3 py-1">
                    Mocked AI composition
                  </Badge>
                  <Badge variant="outline" className="border-zinc-600/70 bg-zinc-900/60 rounded-full px-3 py-1">
                    LocalStorage favorites
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Generator layout */}
          <div className="w-full grid gap-12 xl:gap-16 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.1fr)] items-start">
            {/* Form side */}
            <section aria-label="Recipe generator form" className="w-full">
              <Card className="bg-zinc-950/80 border-zinc-800/80 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                  <CardTitle className="font-['Playfair_Display'] text-2xl text-zinc-50">
                    Curate your palette
                  </CardTitle>
                  <CardDescription className="text-sm text-zinc-400">
                    Start with ingredients, layer in how you like to eat, then let the
                    Atelier engine sketch a plate.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerate} className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-sm font-medium text-zinc-200">
                          Ingredients on hand
                        </label>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                          Free text & curated list
                        </span>
                      </div>
                      <IngredientInput {...ingredientInputProps} />
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Type what&apos;s in your kitchen, then pull from Atelier&apos;s pantry to
                        refine. The engine will infer structure from whatever you share.
                      </p>
                    </div>

                    <Separator className="bg-zinc-800" />

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-sm font-medium text-zinc-200">
                            Dietary mood
                          </label>
                          <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                            Optional
                          </span>
                        </div>
                        <DietaryPreferences {...dietaryPreferencesProps} />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-sm font-medium text-zinc-200">
                            Cuisine lens
                          </label>
                          <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                            Optional
                          </span>
                        </div>
                        <CuisineSelect value={cuisineId} onChange={setCuisineId} />
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Choose a direction or leave it as <span className="italic">Any</span> to
                          let the mock engine wander across its templates.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                      <motion.div whileHover={{ y: -1 }} whileTap={{ y: 1 }}>
                        <Button
                          type="submit"
                          disabled={isGenerating}
                          className="inline-flex items-center gap-2 rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200/90 disabled:bg-zinc-700 disabled:text-zinc-300 px-7 py-2 text-sm font-medium tracking-wide transition-colors duration-200"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Composing
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Generate a recipe
                            </>
                          )}
                        </Button>
                      </motion.div>
                      <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed">
                        Results are instantly generated from mock data in this browser. Nothing
                        is uploaded or stored beyond your local favorites.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </section>

            {/* Result side */}
            <section aria-label="Generated recipe" className="w-full">
              {!currentRecipe ? (
                <motion.div
                  className="border border-dashed border-zinc-700/80 bg-zinc-950/60 rounded-3xl px-6 sm:px-8 py-10 sm:py-12 flex flex-col justify-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">
                    Canvas waiting
                  </p>
                  <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-zinc-50 mb-3 max-w-xl">
                    Describe your pantry, then watch a composed plate appear here.
                  </h2>
                  <p className="text-sm text-zinc-400 max-w-xl">
                    Once you generate, Atelier will sketch a title, ingredient list, and plated
                    flow using only its mock templates and your words.
                  </p>
                </motion.div>
              ) : (
                <motion.article
                  key={currentRecipe.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950/80 shadow-[0_40px_120px_rgba(0,0,0,0.75)]"
                >
                  <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] gap-0">
                    {/* Textual content */}
                    <div className="p-6 sm:p-8 flex flex-col gap-6">
                      <header className="space-y-3">
                        <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500 flex items-center gap-3">
                          Atelier composition
                          <span className="inline-flex h-px flex-1 bg-zinc-700/70" />
                        </p>
                        <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl leading-snug text-zinc-50">
                          {currentRecipe.title}
                        </h2>
                        <p className="text-sm text-zinc-300 max-w-xl">
                          {currentRecipe.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {currentRecipe.dietaryTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="rounded-full border-zinc-700/80 bg-zinc-900/70 text-[11px] font-normal tracking-wide uppercase"
                            >
                              {tag.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </header>

                      <Separator className="bg-zinc-800" />

                      <div className="grid gap-6 md:grid-cols-2">
                        <section aria-label="Ingredients" className="space-y-3">
                          <h3 className="text-xs tracking-[0.22em] uppercase text-zinc-400">
                            Ingredients
                          </h3>
                          <ul className="space-y-2 text-sm text-zinc-200">
                            {currentRecipe.ingredients.map((item, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="mt-[7px] h-[3px] w-3 rounded-full bg-zinc-500/70" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </section>

                        <section aria-label="Method" className="space-y-3">
                          <h3 className="text-xs tracking-[0.22em] uppercase text-zinc-400">
                            Method
                          </h3>
                          <ol className="space-y-3 text-sm text-zinc-200">
                            {currentRecipe.instructions.map((step, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="text-[11px] mt-0.5 h-5 w-5 flex items-center justify-center rounded-full border border-zinc-600/80 text-zinc-300">
                                  {idx + 1}
                                </span>
                                <p>{step}</p>
                              </li>
                            ))}
                          </ol>
                        </section>
                      </div>

                      <footer className="pt-1 flex flex-wrap items-center gap-4 justify-between">
                        <motion.div whileHover={{ y: -1 }} whileTap={{ y: 1 }}>
                          <Button
                            type="button"
                            onClick={handleSave}
                            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200/90 px-6 py-2 text-xs font-semibold tracking-[0.16em] uppercase transition-colors duration-200"
                          >
                            <BookmarkPlus className="w-4 h-4" />
                            Save to favorites
                          </Button>
                        </motion.div>
                        <p className="text-[11px] text-zinc-500">
                          Stored as a mock favorite in this browser only. Clearable anytime.
                        </p>
                      </footer>
                    </div>

                    {/* Image band */}
                    <div className="relative h-full min-h-[240px] bg-zinc-900/80 overflow-hidden">
                      {currentRecipe.imageUrl ? (
                        <motion.img
                          key={currentRecipe.imageUrl}
                          src={currentRecipe.imageUrl}
                          alt={currentRecipe.title}
                          className="h-full w-full object-cover object-center opacity-90"
                          initial={{ scale: 1.03, opacity: 0 }}
                          animate={{ scale: 1.02, opacity: 0.96 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,250,249,0.12),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(161,161,170,0.18),_transparent_55%)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0a] via-black/10 to-transparent" />
                      <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between gap-3 text-[11px] text-zinc-200">
                        <span className="uppercase tracking-[0.26em] bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-zinc-700/70">
                          Generated mock
                        </span>
                        <span className="text-zinc-300/80">
                          {new Date(currentRecipe.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )}
            </section>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default RecipeGeneratorPage;