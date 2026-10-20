import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Flame } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/shadcn';
import { Recipe } from '@/mock';

export interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onOpen: (recipeId: string) => void;
  onToggleFavorite: (recipeId: string) => void;
}

const difficultyLabel: Record<Recipe['difficulty'], string> = {
  easy: 'Gentle',
  medium: 'Weekend project',
  hard: 'Slow & elaborate',
};

const difficultyColor: Record<Recipe['difficulty'], string> = {
  easy: 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700/60',
  medium:
    'bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700/60',
  hard: 'bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-700/60',
};

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onOpen,
  onToggleFavorite,
}) => {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  const handleCardActivate = () => {
    onOpen(recipe.id);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardActivate();
    }
  };

  const handleFavoriteClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    onToggleFavorite(recipe.id);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="h-full min-w-0"
    >
      <Card
        role="button"
        tabIndex={0}
        aria-label={`Open recipe: ${recipe.title}`}
        onClick={handleCardActivate}
        onKeyDown={handleKeyDown}
        className="group flex h-full flex-col overflow-hidden border border-orange-100/70 bg-gradient-to-b from-orange-50/60 via-amber-50/40 to-stone-50/60 text-left shadow-sm transition-colors duration-200 hover:border-orange-300/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80 dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-950 dark:border-stone-800 dark:hover:border-amber-500/70"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          {/* soft shine overlay on hover */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-stone-950/10 via-transparent to-amber-100/40 mix-blend-soft-light"
          />
        </div>

        <CardHeader className="flex flex-1 flex-col gap-3 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <CardTitle className="font-['Playfair_Display'] text-lg font-semibold leading-snug text-stone-900 dark:text-stone-100">
                {recipe.title}
              </CardTitle>
              {recipe.cuisine && (
                <CardDescription className="text-sm text-stone-600 dark:text-stone-300/80">
                  {recipe.cuisine}
                </CardDescription>
              )}
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                  onClick={handleFavoriteClick}
                  className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-100 bg-white/70 text-rose-500 shadow-sm transition-colors duration-150 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-900/50 dark:bg-stone-900/80 dark:text-rose-300 dark:hover:bg-rose-900/30 dark:hover:text-rose-200"
                >
                  <Heart
                    className={`h-4 w-4 transition-transform duration-150 ${
                      isFavorite ? 'fill-current scale-110' : 'scale-100'
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-stone-900 text-stone-50">
                <p className="text-xs font-medium">
                  {isFavorite ? 'Saved to your table' : 'Save to favorites'}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full bg-stone-900/5 px-2.5 py-1 text-xs font-medium text-stone-700 ring-1 ring-stone-200/80 dark:bg-stone-800 dark:text-stone-100 dark:ring-stone-700">
              <Clock className="mr-1.5 h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
              <span>{totalTime} min</span>
            </div>

            <div
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${difficultyColor[recipe.difficulty]}`}
            >
              <Flame className="mr-1.5 h-3.5 w-3.5" />
              <span>{difficultyLabel[recipe.difficulty]}</span>
            </div>

            {recipe.isGenerated && (
              <Badge
                variant="outline"
                className="rounded-full border-dashed border-amber-400/70 bg-amber-50/70 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:border-amber-500/60 dark:bg-amber-900/30 dark:text-amber-200"
              >
                Mock AI
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-4 pt-0">
          {recipe.description && (
            <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-stone-700 dark:text-stone-200/90">
              {recipe.description}
            </p>
          )}

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {recipe.tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-full border-stone-200 bg-stone-50/80 px-2.5 py-0.5 text-xs font-medium lowercase tracking-tight text-stone-700 transition-colors duration-150 group-hover:border-orange-300 group-hover:bg-orange-50/80 group-hover:text-orange-800 dark:border-stone-700 dark:bg-stone-800/70 dark:text-stone-200 dark:group-hover:border-amber-400/80 dark:group-hover:bg-amber-900/20 dark:group-hover:text-amber-200"
                >
                  {tag}
                </Badge>
              ))}
              {recipe.tags.length > 4 && (
                <span className="text-[11px] font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  +{recipe.tags.length - 4} more
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecipeCard;