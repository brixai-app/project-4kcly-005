import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, BookOpen, Clock, Users, Flame, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
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

function Favorites() {
  const [favorites, setFavorites] = useState<RecipeType[]>([]);
  const [toDelete, setToDelete] = useState<RecipeType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = useCallback((recipe: RecipeType) => {
    setToDelete(recipe);
  }, []);

  const confirmRemove = useCallback(() => {
    if (!toDelete) return;
    const updated = favorites.filter(r => r.id !== toDelete.id);
    saveFavorites(updated);
    setFavorites(updated);
    toast('Removed from favorites', {
      icon: <Trash2 className="w-5 h-5 text-rose-500" />,
    });
    setToDelete(null);
  }, [toDelete, favorites]);

  const handleView = useCallback((id: string) => {
    navigate(`/recipe/${id}`);
  }, [navigate]);

  const handleClearAll = useCallback(() => {
    if (favorites.length === 0) return;
    saveFavorites([]);
    setFavorites([]);
    toast('All favorites cleared', {
      icon: <Trash2 className="w-5 h-5 text-rose-500" />,
    });
  }, [favorites.length]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-10"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tighter text-slate-900 dark:text-white leading-tight mb-1">
              <Heart className="inline-block w-7 h-7 text-emerald-400 mr-2 align-middle" />
              Your Favorite Recipes
            </h1>
            <div className="text-base text-slate-600 dark:text-slate-400">
              All your saved recipes in one place. Click a card to view details, or manage your favorites below.
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-medium transition-all duration-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back Home
            </Link>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={favorites.length === 0}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 border border-rose-200 dark:border-rose-900/20",
                "bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/20 hover:-translate-y-0.5",
                favorites.length === 0 && "opacity-60 pointer-events-none"
              )}
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>
      </motion.div>
      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center min-h-[40vh] gap-4"
        >
          <Heart className="w-10 h-10 text-emerald-400 animate-pulse" />
          <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">No favorites yet.</div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white font-semibold shadow-sm border border-slate-900 dark:border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            <ArrowRight className="w-4 h-4" /> Generate a Recipe
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {favorites.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="group bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-white/10 shadow-xl overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:-translate-y-1"
              tabIndex={0}
              role="button"
              aria-label={`View recipe: ${recipe.title}`}
              onClick={() => handleView(recipe.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') handleView(recipe.id);
              }}
            >
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  crossOrigin="anonymous"
                  className="w-full h-56 object-cover object-center rounded-t-2xl transition-all duration-300 group-hover:scale-105"
                  draggable={false}
                />
                <button
                  type="button"
                  aria-label="Remove from favorites"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(recipe);
                  }}
                  className="absolute top-4 right-4 z-10 rounded-xl p-2 bg-white/80 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 shadow transition-all duration-300 hover:scale-110 active:scale-95 text-rose-500 hover:text-rose-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
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
                <h2 className="text-xl font-bold font-serif tracking-tight text-slate-900 dark:text-white mb-1 line-clamp-2">{recipe.title}</h2>
                <div className="text-base text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{recipe.description}</div>
                <div className="flex items-center gap-3 mt-auto pt-2">
                  <span className="inline-flex items-center gap-1 text-emerald-500 font-medium text-sm">
                    <BookOpen className="w-4 h-4" /> {recipe.ingredients.length} ingredients
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-400 font-medium text-sm">
                    <Star className="w-4 h-4" /> {recipe.steps.length} steps
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <Dialog.Root open={!!toDelete} onOpenChange={open => !open && setToDelete(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-white/10 shadow-2xl max-w-sm w-full p-6 focus:outline-none">
            <Dialog.Title className="text-lg font-bold font-serif tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-500" /> Remove Recipe
            </Dialog.Title>
            <div className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Are you sure you want to remove <span className="font-semibold text-slate-900 dark:text-white">{toDelete?.title}</span> from your favorites?
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white font-medium transition-all duration-300 border border-slate-900 dark:border-white/10 shadow-sm"
                onClick={confirmRemove}
              >
                Remove
              </button>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-medium transition-all duration-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
              </Dialog.Close>
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
  );
}

export default Favorites;