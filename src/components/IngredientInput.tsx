import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { BookOpen, Check, X, Sparkles } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

type IngredientInputProps = {
  onRecipeGenerated?: (id: string) => void;
};

const DIETARY_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'Keto', value: 'keto' },
  { label: 'Pescatarian', value: 'pescatarian' },
];

const MEAL_TYPES = [
  { label: 'Any', value: '' },
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
  { label: 'Snack', value: 'snack' },
  { label: 'Dessert', value: 'dessert' },
];

function validateIngredients(input: string): string | null {
  if (!input.trim()) return 'Please enter at least one ingredient.';
  if (input.length > 300) return 'Ingredient list is too long (max 300 characters).';
  const items = input.split(/,|\n/).map(i => i.trim()).filter(Boolean);
  if (items.length === 0) return 'Please enter at least one valid ingredient.';
  if (items.length > 20) return 'Too many ingredients (max 20).';
  if (items.some(i => i.length > 40)) return 'Each ingredient must be under 40 characters.';
  return null;
}

function generateRecipeId(ingredients: string, dietary: string, meal: string): string {
  const base = [ingredients, dietary, meal, Date.now(), Math.random()].join('|');
  return btoa(unescape(encodeURIComponent(base))).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
}

function IngredientInput({ onRecipeGenerated }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('');
  const [mealType, setMealType] = useState('');
  const [servings, setServings] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setIngredients(e.target.value);
    setError(null);
  }

  function handleDietaryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDietary(e.target.value);
  }

  function handleMealTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setMealType(e.target.value);
  }

  function handleServingsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= 12) setServings(val);
  }

  function handleBlur() {
    const err = validateIngredients(ingredients);
    setError(err);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateIngredients(ingredients);
    if (err) {
      setError(err);
      toast(err, { icon: <X className="w-5 h-5 text-rose-500" /> });
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const id = generateRecipeId(ingredients, dietary, mealType);
      toast('Recipe generated!', { icon: <Check className="w-5 h-5 text-emerald-500" /> });
      setIngredients('');
      setError(null);
      if (onRecipeGenerated) onRecipeGenerated(id);
    }, 1200);
  }

  function handlePasteExample() {
    setIngredients('Eggs, Spinach, Feta, Cherry Tomatoes, Olive Oil, Salt, Pepper');
    setError(null);
    inputRef.current?.focus();
    toast('Example ingredients pasted', { icon: <BookOpen className="w-5 h-5 text-emerald-500" /> });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-5"
      autoComplete="off"
      spellCheck={false}
      aria-label="Ingredient input form"
    >
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="ingredients" className="block text-base font-semibold text-slate-900 dark:text-white tracking-tight">
            Ingredients
          </label>
          <button
            type="button"
            tabIndex={0}
            onClick={() => setShowHelp(true)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-200 focus:outline-none"
            aria-label="How to use"
          >
            <Sparkles className="w-3.5 h-3.5" /> How to use?
          </button>
        </div>
        <motion.textarea
          id="ingredients"
          ref={inputRef}
          rows={4}
          maxLength={300}
          value={ingredients}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="e.g. Chicken breast, Lemon, Garlic, Olive oil, Salt, Pepper"
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-zinc-800 text-base text-slate-900 dark:text-white font-medium transition-all duration-300 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500",
            error ? "border-rose-400 dark:border-rose-500" : "border-slate-200 dark:border-white/10"
          )}
          disabled={loading}
          aria-invalid={!!error}
          aria-describedby={error ? "ingredients-error" : undefined}
          initial={false}
          animate={error ? { scale: 1.02 } : { scale: 1 }}
        />
        <div className="flex items-center justify-between mt-1">
          <button
            type="button"
            tabIndex={0}
            onClick={handlePasteExample}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline focus:outline-none"
          >
            Paste example
          </button>
          <span className={cn(
            "text-xs",
            ingredients.length > 280 ? "text-rose-500" : "text-slate-400 dark:text-slate-500"
          )}>
            {ingredients.length}/300
          </span>
        </div>
        {error && (
          <motion.div
            id="ingredients-error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-rose-500 text-sm mt-1 flex items-center gap-1"
          >
            <X className="w-4 h-4" /> {error}
          </motion.div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor="dietary" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dietary</label>
          <select
            id="dietary"
            value={dietary}
            onChange={handleDietaryChange}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500"
            disabled={loading}
          >
            {DIETARY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor="meal-type" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meal Type</label>
          <select
            id="meal-type"
            value={mealType}
            onChange={handleMealTypeChange}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500"
            disabled={loading}
          >
            {MEAL_TYPES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor="servings" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Servings</label>
          <input
            id="servings"
            type="number"
            min={1}
            max={12}
            value={servings}
            onChange={handleServingsChange}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500"
            disabled={loading}
          />
        </div>
      </div>
      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 border shadow-sm",
          "bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white border-slate-900 dark:border-white/10",
          "hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
          loading && "opacity-60 pointer-events-none"
        )}
        aria-busy={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin" /> Generating...
          </span>
        ) : (
          <>
            <BookOpen className="w-5 h-5" /> Generate Recipe
          </>
        )}
      </motion.button>
      <Dialog.Root open={showHelp} onOpenChange={setShowHelp}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-white/10 shadow-2xl max-w-md w-full p-7 focus:outline-none">
            <Dialog.Title className="text-lg font-bold font-serif tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" /> How to Use
            </Dialog.Title>
            <div className="text-slate-600 dark:text-slate-400 text-base mb-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Enter your available ingredients, separated by commas or new lines.</li>
                <li>Optionally select dietary preferences, meal type, and servings.</li>
                <li>Click <span className="font-semibold text-emerald-600 dark:text-emerald-400">Generate Recipe</span> to get a custom AI recipe.</li>
                <li>Save your favorites and manage them anytime.</li>
              </ul>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4 mb-4 border border-slate-100 dark:border-white/10">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Example:</div>
              <div className="font-mono text-sm text-slate-900 dark:text-white">
                Eggs, Spinach, Feta, Cherry Tomatoes, Olive Oil, Salt, Pepper
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowHelp(false);
                handlePasteExample();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white font-medium transition-all duration-300 border border-slate-900 dark:border-white/10 shadow-sm hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" /> Paste Example
            </button>
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
    </form>
  );
}

export default IngredientInput;