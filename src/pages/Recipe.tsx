import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, ArrowLeft, ArrowRight, Share2, BookOpen, Clock, Users, Flame, Utensils, Trash2 } from 'lucide-react';
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

function generateMockRecipe(id: string): RecipeType {
  const titles = [
    'Creamy Garlic Mushroom Pasta',
    'Spicy Chickpea Shakshuka',
    'Lemon Herb Grilled Chicken',
    'Vegan Thai Green Curry',
    'Hearty Lentil Stew',
    'Classic Caprese Salad',
    'Roasted Veggie Quinoa Bowl',
    'Zesty Shrimp Tacos',
    'Butternut Squash Risotto',
    'Savory Breakfast Frittata',
  ];
  const images = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=800&q=80',
  ];
  const ingredientSets = [
    ['Pasta', 'Mushrooms', 'Garlic', 'Heavy Cream', 'Parmesan', 'Parsley', 'Olive Oil', 'Salt', 'Pepper'],
    ['Chickpeas', 'Tomatoes', 'Onion', 'Bell Pepper', 'Paprika', 'Cumin', 'Eggs', 'Cilantro', 'Olive Oil'],
    ['Chicken Breast', 'Lemon', 'Rosemary', 'Thyme', 'Garlic', 'Olive Oil', 'Salt', 'Pepper'],
    ['Tofu', 'Coconut Milk', 'Green Curry Paste', 'Basil', 'Bell Pepper', 'Zucchini', 'Jasmine Rice'],
    ['Lentils', 'Carrots', 'Celery', 'Onion', 'Tomato Paste', 'Vegetable Broth', 'Bay Leaf', 'Parsley'],
    ['Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil', 'Balsamic Glaze', 'Salt', 'Pepper'],
    ['Quinoa', 'Broccoli', 'Sweet Potato', 'Red Onion', 'Chickpeas', 'Spinach', 'Tahini'],
    ['Shrimp', 'Corn Tortillas', 'Cabbage', 'Lime', 'Avocado', 'Cilantro', 'Chili Powder'],
    ['Butternut Squash', 'Arborio Rice', 'Parmesan', 'Sage', 'Vegetable Broth', 'Shallot', 'White Wine'],
    ['Eggs', 'Spinach', 'Feta', 'Cherry Tomatoes', 'Red Onion', 'Milk', 'Parsley'],
  ];
  const stepSets = [
    [
      'Cook pasta according to package instructions.',
      'Sauté mushrooms and garlic in olive oil until golden.',
      'Add heavy cream and simmer until thickened.',
      'Stir in cooked pasta and parmesan.',
      'Season with salt, pepper, and parsley. Serve hot.',
    ],
    [
      'Sauté onion and bell pepper in olive oil.',
      'Add chickpeas, tomatoes, and spices. Simmer 10 min.',
      'Make wells and crack eggs in. Cover and cook until set.',
      'Garnish with cilantro and serve with bread.',
    ],
    [
      'Marinate chicken with lemon, garlic, rosemary, thyme, salt, and pepper.',
      'Grill chicken until cooked through and golden.',
      'Let rest, then slice and serve with lemon wedges.',
    ],
    [
      'Sauté tofu and vegetables in olive oil.',
      'Add green curry paste and coconut milk. Simmer 10 min.',
      'Serve curry over jasmine rice, topped with basil.',
    ],
    [
      'Sauté onion, carrot, and celery in olive oil.',
      'Add lentils, tomato paste, broth, and bay leaf.',
      'Simmer until lentils are tender. Remove bay leaf.',
      'Season and garnish with parsley.',
    ],
    [
      'Slice tomatoes and mozzarella.',
      'Layer with basil leaves on a platter.',
      'Drizzle with olive oil and balsamic glaze.',
      'Season with salt and pepper.',
    ],
    [
      'Roast sweet potato and broccoli until tender.',
      'Cook quinoa according to package.',
      'Toss veggies, quinoa, chickpeas, and spinach.',
      'Drizzle with tahini and serve.',
    ],
    [
      'Season shrimp with chili powder and lime.',
      'Sauté shrimp until pink.',
      'Warm tortillas and fill with shrimp, cabbage, avocado.',
      'Top with cilantro and extra lime.',
    ],
    [
      'Sauté shallot and squash in olive oil.',
      'Add arborio rice and toast.',
      'Gradually add broth and wine, stirring until creamy.',
      'Stir in parmesan and sage. Serve warm.',
    ],
    [
      'Whisk eggs and milk. Sauté onion and spinach.',
      'Add tomatoes and feta. Pour in egg mixture.',
      'Cook until set. Garnish with parsley.',
    ],
  ];
  const descriptions = [
    'A rich, creamy pasta dish with earthy mushrooms and a hint of garlic. Perfect for cozy nights.',
    'A vibrant, protein-packed shakshuka with a spicy kick, ideal for brunch or dinner.',
    'Juicy grilled chicken infused with fresh herbs and zesty lemon, great for any occasion.',
    'A fragrant, vegan Thai curry bursting with fresh veggies and creamy coconut milk.',
    'A comforting, hearty stew loaded with lentils and vegetables for a nourishing meal.',
    'A classic Italian salad with ripe tomatoes, creamy mozzarella, and fresh basil.',
    'A nutritious bowl packed with roasted veggies, quinoa, and a creamy tahini drizzle.',
    'Bright, zesty shrimp tacos with crunchy cabbage and creamy avocado.',
    'Creamy risotto with sweet butternut squash and aromatic sage.',
    'A savory breakfast frittata loaded with veggies and feta cheese.',
  ];
  const prepTimes = ['20 min', '30 min', '25 min', '35 min', '40 min', '10 min', '30 min', '20 min', '45 min', '25 min'];
  const servings = [2, 4, 3, 2, 6, 2, 4, 3, 4, 2];
  const difficulties: RecipeType['difficulty'][] = ['Easy', 'Medium', 'Easy', 'Medium', 'Medium', 'Easy', 'Easy', 'Easy', 'Hard', 'Easy'];

  const idx = Math.abs(parseInt(id, 36)) % titles.length;
  return {
    id,
    title: titles[idx],
    image: images[idx],
    ingredients: ingredientSets[idx],
    steps: stepSets[idx],
    prepTime: prepTimes[idx],
    servings: servings[idx],
    difficulty: difficulties[idx],
    description: descriptions[idx],
  };
}

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

function Recipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    const rec = generateMockRecipe(id);
    setRecipe(rec);
    setIsFavorite(isRecipeInFavorites(rec));
  }, [id, navigate]);

  const handleFavorite = useCallback(() => {
    if (!recipe) return;
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
    if (!recipe) return;
    const url = window.location.href;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      toast('Recipe link copied!', {
        icon: <Share2 className="w-5 h-5 text-indigo-500" />,
      });
    } else {
      setShowShare(true);
    }
  }, [recipe]);

  const handleGenerateNew = useCallback(() => {
    const newId = Math.random().toString(36).slice(2, 10);
    navigate(`/recipe/${newId}`);
  }, [navigate]);

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <Utensils className="w-8 h-8 text-emerald-400 animate-pulse" />
          <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">Loading recipe...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-10">
            <div className="flex gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-medium transition-all duration-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:-translate-y-0.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back Home
              </Link>
              <Link
                to="/favorites"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-medium transition-all duration-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:-translate-y-0.5"
              >
                <Heart className="w-4 h-4" /> Favorites
              </Link>
            </div>
            <button
              type="button"
              onClick={handleGenerateNew}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white font-semibold shadow-sm border border-slate-900 dark:border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            >
              <ArrowRight className="w-4 h-4" /> Generate New Recipe
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Recipe;