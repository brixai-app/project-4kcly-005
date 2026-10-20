import React, { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { useAllRecipes, useApp, Recipe } from "@/mock";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetail from "@/components/RecipeDetail";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
} from "@/components/ui/shadcn";
import { showErrorToast, showSuccessToast } from "@/components/Toast";
import SearchBar from "@/components/SearchBar";

// NOTE: All data and "AI" behavior are 100% frontend mocks wired to src/mock.ts.
// There is NO real backend or network request; generation is simulated client-side.

const HERO_BG_BASE64 =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'>
      <defs>
        <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0' stop-color='#f9f5f0'/>
          <stop offset='0.5' stop-color='#f3e0cf'/>
          <stop offset='1' stop-color='#e9c2a8'/>
        </linearGradient>
        <pattern id='grain' patternUnits='userSpaceOnUse' width='60' height='60'>
          <circle cx='8' cy='10' r='1.2' fill='#e2b79c' opacity='0.5'/>
          <circle cx='30' cy='28' r='1.3' fill='#d59a78' opacity='0.5'/>
          <circle cx='50' cy='12' r='1.1' fill='#c58463' opacity='0.45'/>
          <circle cx='22' cy='50' r='1.4' fill='#e6bfa4' opacity='0.45'/>
        </pattern>
        <clipPath id='tableCurve'>
          <path d='M0,150 C260,220 460,180 800,210 C1160,245 1360,210 1600,170 L1600,900 L0,900 Z'/>
        </clipPath>
      </defs>
      <rect width='1600' height='900' fill='url(#g)'/>
      <g clip-path='url(#tableCurve)'>
        <rect y='140' width='1600' height='760' fill='#f3e0cf'/>
        <rect y='140' width='1600' height='760' fill='url(#grain)' opacity='0.7'/>
      </g>
      <g opacity='0.38'>
        <circle cx='260' cy='360' r='150' fill='#f7d4b4'/>
        <circle cx='270' cy='340' r='128' fill='#f2c199'/>
        <ellipse cx='270' cy='385' rx='165' ry='22' fill='#d9a37e'/>
        <circle cx='270' cy='315' r='18' fill='#fdf6ef'/>
        <circle cx='245' cy='365' r='16' fill='#fdf6ef'/>
        <circle cx='302' cy='370' r='16' fill='#fdf6ef'/>
        <circle cx='272' cy='340' r='6' fill='#d98657'/>
        <circle cx='252' cy='365' r='5' fill='#d98657'/>
        <circle cx='302' cy='368' r='5' fill='#d98657'/>
      </g>
      <g opacity='0.45'>
        <ellipse cx='1120' cy='390' rx='190' ry='110' fill='#f6d9bb'/>
        <ellipse cx='1120' cy='395' rx='135' ry='78' fill='#f2c39c'/>
        <ellipse cx='1120' cy='430' rx='180' ry='25' fill='#d89f76'/>
        <path d='M1010,350 C1035,320 1065,308 1095,305 C1130,302 1170,310 1195,328 C1215,343 1228,365 1228,390 C1205,410 1169,423 1120,423 C1070,423 1030,410 1002,392 C1002,376 1004,362 1010,350 Z' fill='#fdf5ee'/>
        <path d='M1045,350 C1063,343 1083,340 1098,340 C1125,340 1150,346 1171,356 C1180,366 1187,376 1190,386 C1170,397 1147,404 1120,404 C1094,404 1071,398 1051,389 C1048,376 1046,363 1045,350 Z' fill='#f5d0ae'/>
      </g>
    </svg>`
  );

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.25, ease: "easeOut" },
  }),
};

const HomePage: React.FC = () => {
  const { generateRecipe, toggleFavorite, isFavorite } = useApp();
  const allRecipes = useAllRecipes();

  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<Recipe | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleGenerate = useCallback(
    async (query?: string) => {
      const q = (query ?? input).trim();
      if (!q) {
        showErrorToast("Add a few ingredients first", "Try something like ‘tomato basil pasta’.");
        return;
      }
      try {
        setIsGenerating(true);
        const recipe = await generateRecipe(q);
        setGenerated(recipe);
        setDialogOpen(true);
        showSuccessToast("Recipe created", "Your AI-crafted dish is ready to explore.");
      } catch (error) {
        console.error(error);
        showErrorToast("Couldn’t generate recipe", "This is a frontend-only mock — please try again.");
      } finally {
        setIsGenerating(false);
      }
    },
    [generateRecipe, input],
  );

  const heroFeatured = useMemo(() => allRecipes.slice(0, 4), [allRecipes]);
  const moreFeatured = useMemo(() => allRecipes.slice(4, 12), [allRecipes]);

  const onSaveFavoriteFromDialog = useCallback(() => {
    if (!generated) return;
    toggleFavorite(generated.id);
    const nowFav = isFavorite(generated.id);
    if (!nowFav) {
      showSuccessToast("Added to favorites", "Find it anytime in your Favorites.");
    } else {
      showInfoToast("Removed from favorites", "You can always regenerate something new.");
    }
  }, [generated, isFavorite, toggleFavorite]);

  return (
    <div className="w-full min-h-screen bg-[#f9f5f0] text-[#3e2c23]">
      {/* Hero Section */}
      <section className="relative w-full min-h-[72vh] overflow-hidden bg-[#f9f5f0]">
        <div
          className="pointer-events-none absolute inset-0 opacity-90 mix-blend-normal"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${HERO_BG_BASE64})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f9f5f0] via-[#f9f5f0]/92 to-[#f9f5f0]/40" />

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col gap-12">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            {/* Left: Copy + generator */}
            <div className="lg:col-span-7 min-w-0 flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#e3d4c3] px-3 py-1 text-xs font-medium tracking-wide text-[#8b5e3c] shadow-sm backdrop-blur-sm w-max">
                <Sparkles className="w-3.5 h-3.5 text-[#d94f4f]" aria-hidden="true" />
                <span>100% client-side · Mock AI recipe studio</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] leading-tight font-['Playfair_Display'] font-semibold tracking-tight whitespace-normal break-words">
                  Discover Your Next Favorite Recipe
                </h1>
                <p className="max-w-2xl text-base sm:text-lg text-[#6b4a33] leading-relaxed">
                  Whisper a few ingredients, a mood, or a craving. TactileChef’s mock AI layers them
                  into richly textured recipes — all generated instantly in your browser with no
                  real backend.
                </p>
              </div>

              {/* AI Generator Bar */}
              <Card className="border border-[#e1d3c2] bg-white/80 backdrop-blur-sm shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold tracking-wide text-[#8b5e3c] uppercase">
                    AI Recipe Sketchpad
                  </CardTitle>
                  <CardDescription className="text-[0.9rem] text-[#7b6048]">
                    Type a prompt like “crispy tofu rice bowl, 20 minutes” and we’ll sketch a full
                    recipe using our deterministic, frontend-only generator.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SearchBar
                    value={input}
                    onChange={setInput}
                    onImmediateChange={setInput}
                    onSubmit={(value) => handleGenerate(value)}
                    emphasis
                    className="w-full"
                    onGenerateClick={(value) => handleGenerate(value)}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#8b6a4f]">
                    <span>
                      This is a <span className="font-semibold">simulation</span>: recipes live only
                      in your browser via localStorage.
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setInput("late-night pantry pasta with tomatoes and chili")}
                        className="rounded-full border border-[#e1d3c2] bg-[#f9f5f0] px-3 py-1 text-[0.7rem] font-medium text-[#7b5a3f] hover:bg-white hover:text-[#3e2c23] transition-colors"
                      >
                        Try: pantry pasta
                      </button>
                      <button
                        type="button"
                        onClick={() => setInput("crispy miso tofu rice bowl, crunchy veg")}
                        className="rounded-full border border-[#e1d3c2] bg-[#f9f5f0] px-3 py-1 text-[0.7rem] font-medium text-[#7b5a3f] hover:bg-white hover:text-[#3e2c23] transition-colors"
                      >
                        Try: tofu bowl
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <p className="text-xs text-[#8b6a4f]">
                      No accounts, no servers — just playful, tactile recipes generated on the fly.
                    </p>
                    <Button
                      type="button"
                      size="lg"
                      className="inline-flex items-center gap-2 rounded-full bg-[#d94f4f] hover:bg-[#c44646] text-white px-5 py-2.5 text-sm font-semibold shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                      onClick={() => handleGenerate()}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          Generating…
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" aria-hidden="true" />
                          Generate recipe
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Highlighted cards */}
            <div className="lg:col-span-5 min-w-0 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {heroFeatured.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3, ease: "easeOut" }}
                    className={
                      index === 0
                        ? "col-span-2 sm:col-span-1 sm:row-span-2"
                        : "col-span-2 sm:col-span-1"
                    }
                  >
                    <RecipeCard recipe={recipe} showFavoriteToggle dense={index !== 0} />
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-[#8b6a4f]">
                Featured picks are seeded mock recipes — new AI creations will quietly join the
                gallery below.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Recipes Masonry Section */}
      <section className="w-full bg-[#f7efe5] border-t border-[#e1d3c2] py-10 lg:py-14">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 space-y-6 lg:space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-['Playfair_Display'] font-semibold tracking-tight">
                Tactile Table of Ideas
              </h2>
              <p className="text-sm sm:text-base text-[#7b6048] max-w-2xl">
                Wander through a mix of hand-crafted mock recipes and your own AI-generated dishes.
                Everything here is stored only in your browser.
              </p>
            </div>
          </div>

          {/* Masonry-like layout using CSS columns on large screens */}
          <div className="hidden lg:block" aria-label="Featured recipes grid">
            <div className="columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
              {moreFeatured.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  custom={index}
                  variants={gridItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="mb-6 break-inside-avoid"
                >
                  <RecipeCard recipe={recipe} showFavoriteToggle />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Fallback responsive grid on small / medium screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-5" aria-label="Featured recipes grid">
            {moreFeatured.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                custom={index}
                variants={gridItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <RecipeCard recipe={recipe} showFavoriteToggle />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Result Dialog */}
      <Dialog open={dialogOpen && !!generated} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#f9f5f0] border border-[#e1d3c2]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-['Playfair_Display'] text-2xl">
              AI-Crafted Recipe Preview
            </DialogTitle>
            <DialogDescription className="text-sm text-[#7b6048]">
              This recipe was generated entirely on the client using our deterministic mock AI.
              Adjust, riff, and favorite it to keep it around.
            </DialogDescription>
          </DialogHeader>

          {generated && (
            <div className="mt-2">
              <RecipeDetail recipe={generated} inDialog />
            </div>
          )}

          <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-[#8b6a4f]">
              Favorites, ratings, and generated recipes are all mocked and stored in localStorage
              only.
            </p>
            <div className="flex flex-wrap gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                className="border-[#d7c6b1] text-[#7b6048] hover:bg-[#f3e4d4]"
                onClick={() => setDialogOpen(false)}
              >
                Close
              </Button>
              {generated && (
                <Button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-[#d94f4f] hover:bg-[#c44646] text-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors"
                  onClick={onSaveFavoriteFromDialog}
                >
                  {isFavorite(generated.id) ? "Remove from favorites" : "Save to favorites"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;