import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartOff, Sparkles, ArrowRight, BookmarkMinus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { AppState, Recipe } from '@/mock';
import { getFavoriteRecipes } from '@/mock';

import RecipeCard from '@/components/RecipeCard';
import RecipeDetailSheet from '@/components/RecipeDetailSheet';

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Separator,
} from '@/components/ui/shadcn';

export interface FavoritesPageProps {
  state: AppState;
  onToggleFavorite: (recipeId: string) => void;
}

const gridVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.04, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const FavoritesPage: React.FC<FavoritesPageProps> = ({ state, onToggleFavorite }) => {
  const navigate = useNavigate();
  const favoriteRecipes = getFavoriteRecipes(state);

  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(
    favoriteRecipes[0] ?? null,
  );
  const [detailOpen, setDetailOpen] = React.useState(false);

  React.useEffect(() => {
    if (!selectedRecipe) return;
    const stillExists = state.recipes.find((r) => r.id === selectedRecipe.id);
    const stillFavorite = state.favorites.includes(selectedRecipe.id);
    if (!stillExists || !stillFavorite) {
      setDetailOpen(false);
      if (favoriteRecipes.length > 0) {
        setSelectedRecipe(favoriteRecipes[0]);
      } else {
        setSelectedRecipe(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.recipes, state.favorites]);

  const handleOpenRecipe = (recipeId: string) => {
    const recipe = state.recipes.find((r) => r.id === recipeId) || null;
    setSelectedRecipe(recipe);
    setDetailOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setDetailOpen(open);
    if (!open && selectedRecipe) {
      const latest = state.recipes.find((r) => r.id === selectedRecipe.id) || null;
      setSelectedRecipe(latest);
    }
  };

  const hasFavorites = favoriteRecipes.length > 0;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#f8eee6] via-[#fdf7f2] to-[#f3ece3] dark:from-[#15100e] dark:via-[#171211] dark:to-[#120f0d] pt-8 pb-16">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-amber-700/80 dark:text-amber-300/80">
              Saved tastes
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-['Playfair_Display'] text-stone-900 dark:text-amber-50 whitespace-normal break-words">
              Your Saffron & Sage favorites
            </h1>
            <p className="text-sm sm:text-base text-stone-700/90 dark:text-stone-300/90 max-w-xl">
              A warm little archive of the recipes you keep coming back to. Revisit, un-save,
              or wander out to discover something new.
            </p>
          </div>

          <Card className="border-none bg-white/70 dark:bg-stone-900/80 backdrop-blur-md shadow-sm flex-1 max-w-md">
            <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
              <div className="space-y-1 min-w-0">
                <CardTitle className="text-base font-semibold text-stone-900 dark:text-amber-50 whitespace-normal break-words">
                  Shelf count
                </CardTitle>
                <CardDescription className="text-xs text-stone-600 dark:text-stone-300/80 whitespace-normal break-words">
                  Favorites live only in this browser. This is a fully mocked, frontend-only
                  experience—no accounts, no servers.
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200 px-3 py-1 text-xs font-medium">
                  <HeartOff className="w-3.5 h-3.5" />
                  {favoriteRecipes.length} saved
                </span>
                {favoriteRecipes.some((r) => r.isGenerated) && (
                  <Badge
                    variant="outline"
                    className="border-amber-500/40 text-amber-900/80 dark:text-amber-100 dark:border-amber-400/60 bg-amber-50/60 dark:bg-amber-900/20 text-[10px] tracking-wide uppercase"
                  >
                    mock ai recipes included
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex flex-wrap gap-3 items-center">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-stone-300/80 text-stone-800 dark:border-stone-700 dark:text-stone-100 bg-amber-50/40 dark:bg-stone-900/80 hover:bg-amber-100/80 dark:hover:bg-stone-800/80 px-4"
                onClick={() => navigate('/browse')}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Browse more
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full text-amber-900 dark:text-amber-200 hover:bg-amber-100/70 dark:hover:bg-amber-900/30 px-3"
                onClick={() => navigate('/generate')}
              >
                Generate from pantry
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </CardContent>
          </Card>
        </header>

        <Separator className="bg-stone-200/80 dark:bg-stone-800/80" />

        {!hasFavorites ? (
          <section className="w-full flex flex-col items-center justify-center text-center py-16 sm:py-20">
            <Card className="w-full max-w-xl bg-white/80 dark:bg-stone-950/80 border-dashed border-amber-300/70 dark:border-amber-800/70 shadow-sm">
              <CardContent className="pt-8 pb-8 flex flex-col items-center gap-6">
                <div className="inline-flex items-center justify-center rounded-full bg-amber-100/90 dark:bg-amber-900/40 text-amber-800 dark:text-amber-100 p-4">
                  <HeartOff className="w-7 h-7" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h2 className="text-xl sm:text-2xl font-semibold font-['Playfair_Display'] text-stone-900 dark:text-amber-50 whitespace-normal break-words">
                    No favorites yet—your shelf is waiting
                  </h2>
                  <p className="text-sm sm:text-base text-stone-700/90 dark:text-stone-300/90">
                    Tap the little heart on any recipe to tuck it onto this page. Or let our
                    mock "AI" dream something up from whatever is in your kitchen.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    size="sm"
                    className="rounded-full bg-amber-700 hover:bg-amber-800 text-amber-50 shadow-sm px-5"
                    onClick={() => navigate('/browse')}
                  >
                    Browse recipes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-stone-300/90 text-stone-800 dark:border-stone-700 dark:text-stone-50 bg-amber-50/50 dark:bg-stone-900/70 hover:bg-amber-100/80 dark:hover:bg-stone-800/80 px-4"
                    onClick={() => navigate('/generate')}
                  >
                    Mock generate
                    <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        ) : (
          <section className="w-full flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg sm:text-xl font-semibold text-stone-900 dark:text-amber-50 font-['Playfair_Display'] whitespace-normal break-words">
                  Saved recipes
                </h2>
                <Badge className="rounded-full bg-amber-600/90 text-amber-50 px-3 py-1 text-xs font-medium">
                  {favoriteRecipes.length} {favoriteRecipes.length === 1 ? 'recipe' : 'recipes'}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300/80 max-w-md">
                Favorites are stored in localStorage on this device only—this is a fully mocked
                frontend demo with no real backend.
              </p>
            </div>

            <AnimatePresence mode="sync">
              <motion.div
                key={favoriteRecipes.length}
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {favoriteRecipes.map((recipe) => (
                  <motion.div key={recipe.id} variants={itemVariants} layout>
                    <RecipeCard
                      recipe={recipe}
                      isFavorite={state.favorites.includes(recipe.id)}
                      onOpen={handleOpenRecipe}
                      onToggleFavorite={onToggleFavorite}
                    />
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        asChild
                        variant="ghost"
                        className="h-7 px-2.5 text-xs rounded-full text-amber-900 dark:text-amber-100 hover:bg-amber-100/80 dark:hover:bg-amber-900/40"
                      >
                        <button
                          type="button"
                          aria-label={`Open ${recipe.title}`}
                          onClick={() => handleOpenRecipe(recipe.id)}
                        >
                          Open details
                        </button>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2.5 text-xs rounded-full border-rose-200/70 text-rose-700 hover:bg-rose-50/80 dark:border-rose-900/60 dark:text-rose-200 dark:hover:bg-rose-950/60 flex items-center gap-1.5"
                        type="button"
                        onClick={() => onToggleFavorite(recipe.id)}
                      >
                        <BookmarkMinus className="w-3.5 h-3.5" />
                        Remove
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </section>
        )}
      </div>

      <RecipeDetailSheet
        recipe={selectedRecipe}
        isOpen={detailOpen && !!selectedRecipe}
        isFavorite={selectedRecipe ? state.favorites.includes(selectedRecipe.id) : false}
        onOpenChange={handleOpenChange}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
};

export default FavoritesPage;