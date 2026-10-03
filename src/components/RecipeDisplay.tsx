import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, BookOpen, Clock, Users, Flame, Share2, Trash2, ArrowRight } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type RecipeType = {
  id: string;
  title: string;
  image: string;
  ingredients: string[];
  steps: string[];
  prepTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
};

type RecipeDisplayProps = {
  recipe: RecipeType;
  onGenerateNew?: () => void;
};

function getFavorites(): RecipeType[] {
  try {
    const raw = localStorage.getItem('ai-recipes-favorites');
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}

function saveFavorites(favs: RecipeType[]) {
  localStorage.setItem('ai-recipes-favorites', JSON.stringify(favs));
}

function isRecipeInFavorites(recipe: RecipeType): boolean {
  const favs = getFavorites();
  return favs.some(r => r.id === recipe.id);
}

function RecipeDisplay({ recipe, onGenerateNew }: RecipeDisplayProps) {
  const [isFavorite, setIsFavorite] = useState(() => isRecipeInFavorites(recipe));
  const [showShare, setShowShare] = useState(false);

  const handleFavorite = useCallback(() => {
    let favs = getFavorites();
    if (isRecipeInFavorites(recipe)) {
      favs = favs.filter(r => r.id !== recipe.id);
      saveFavorites(favs);
      setIsFavorite(false);
      toast('Removed from favorites', {
        icon: <Trash2 className="w-5 h-5 text-rose-500" />,
      });
    } else {
      favs = [recipe, ...favs.filter(r => r.id !== recipe.id)];
      saveFavorites(favs);
      setIsFavorite(true);
      toast('Recipe saved to favorites', {
        icon: <Heart className="w-5 h-5 text-emerald-500" />,
      });
    }
  }, [recipe]);

  const handleShare = useCallback(() => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast('Recipe link copied!', {
        icon: <Share2 className="w-5 h-5 text-indigo-500" />,
      });
    } else {
      setShowShare(true);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-white/10 shadow-xl overflow-hidden"
    >
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          crossOrigin="anonymous"
          className="w-full h-64 object-cover object-center rounded-t-2xl"
          draggable={false}
        />
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={handleFavorite}
            className={cn(
              "rounded-xl p-2 bg-white/80 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 shadow transition-all duration-300 hover:scale-110 active:scale-95",
              isFavorite ? "text-emerald-500" : "text-slate-400 hover:text-emerald-400"
            )}
            type="button"
          >
            <Heart className={cn("w-5 h-5", isFavorite ? "fill-emerald-400/90" : "")} />
          </button>
          <Dialog.Root open={showShare} onOpenChange={setShowShare}>
            <Dialog.Trigger asChild>
              <button
                aria-label="Share recipe"
                onClick={handleShare}
                className="rounded-xl p-2 bg-white/80 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 shadow transition-all duration-300 hover:scale-110 active:scale-95 text-indigo-500"
                type="button"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-white/10 shadow-2xl max-w-sm w-full p-6 focus:outline-none">
                <Dialog.Title className="text-lg font-bold font-serif tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-indigo-500" /> Share Recipe
                </Dialog.Title>
                <div className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  Copy and share this link with friends!
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white text-sm font-mono"
                    onFocus={e => e.currentTarget.select()}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 rounded-lg bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white font-medium transition-all duration-300 border border-slate-900 dark:border-white/10 shadow-sm"
                    onClick={() => {
                      navigator?.clipboard?.writeText(window.location.href);
                      toast('Link copied to clipboard', {
                        icon: <Share2 className="w-5 h-5 text-indigo-500" />,
                      });
                      setShowShare(false);
                    }}
                  >
                    Copy
                  </button>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                      <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <div className="p-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tighter text-slate-900 dark:text-white leading-tight">
            {recipe.title}
          </h1>
          <div className="flex items-center gap-3 mt-2 md:mt-0">
            <span className={cn(
              "inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border transition-all",
              recipe.difficulty === 'Easy'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : recipe.difficulty === 'Medium'
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-300'
                : 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-300'
            )}>
              <Flame className="w-3.5 h-3.5" /> {recipe.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" /> {recipe.prepTime}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" /> {recipe.servings} servings
            </span>
          </div>
        </div>
        <div className="text-base text-slate-600 dark:text-slate-400 mb-6">{recipe.description}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold font-serif tracking-tight text-slate-900 dark:text-white">Ingredients</h2>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-200 text-base">
              {recipe.ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold font-serif tracking-tight text-slate-900 dark:text-white">Instructions</h2>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-200 text-base">
              {recipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </motion.div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mt-10">
          <button
            type="button"
            onClick={onGenerateNew}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white font-semibold shadow-sm border border-slate-900 dark:border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            <ArrowRight className="w-4 h-4" /> Generate New Recipe
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default RecipeDisplay;