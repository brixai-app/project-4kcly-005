import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Flame, Heart, HeartOff, Utensils, Check } from "lucide-react";
import { Recipe, useApp } from "@/mock";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Separator,
} from "@/components/ui/shadcn";
import { cn } from "@/lib/utils";

export interface RecipeDetailProps {
  recipe: Recipe;
  /**
   * Optional flag indicating if this detail view is rendered inside a modal/dialog.
   * Used only for minor layout tweaks (no behavioral changes).
   */
  inDialog?: boolean;
}

/**
 * Detailed recipe view component.
 *
 * NOTE: This is 100% frontend-only and uses mocked state from src/mock.ts.
 * Favorites and ratings are persisted via localStorage through the AppProvider mock.
 * Ingredient checklist state is intentionally ephemeral and lives only in this component.
 */
const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, inDialog = false }) => {
  const { isFavorite, toggleFavorite, getRating, rateRecipe } = useApp();

  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">(
    "ingredients",
  );
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const currentRating = getRating(recipe.id);

  const totalTime = useMemo(
    () => recipe.prepTimeMinutes + recipe.cookTimeMinutes,
    [recipe.prepTimeMinutes, recipe.cookTimeMinutes],
  );

  const handleToggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRatingClick = (value: number) => {
    rateRecipe(recipe.id, value);
  };

  const favorite = isFavorite(recipe.id);

  const dietaryChips = recipe.dietary;

  const ratingLabel = currentRating ? `${currentRating} out of 5 stars` : "Not yet rated";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "w-full",
        !inDialog && "py-4 lg:py-6",
      )}
      aria-label={`Full recipe for ${recipe.title}`}
    >
      <Card className="border border-[#e2d7cc] bg-[#f9f5f0]/70 backdrop-blur-sm shadow-sm overflow-hidden">
        {/* Hero image */}
        <div className="w-full overflow-hidden bg-[#f0e3d3]">
          <motion.img
            src={recipe.image}
            loading="lazy"
            alt={recipe.title}
            className="w-full h-64 md:h-80 lg:h-96 object-cover"
            initial={{ scale: 1.02, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        <CardHeader className="space-y-4 pb-3 sm:pb-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-['Playfair_Display'] tracking-tight text-[#3e2c23] whitespace-normal break-words">
                  {recipe.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    className="rounded-full bg-[#e5c7b2] text-[#3e2c23] px-3 py-1 text-xs font-medium tracking-wide"
                    aria-label={`Cuisine: ${recipe.cuisine}`}
                  >
                    <Utensils className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                    {recipe.cuisine}
                  </Badge>
                </div>
              </div>

              <CardDescription className="text-sm sm:text-base text-[#6b5443] whitespace-normal break-words">
                {recipe.description}
              </CardDescription>
            </div>

            {/* Meta info & actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#6b5443]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#d94f4f]" aria-hidden="true" />
                  <span className="font-medium">Total:</span>
                  <span>{totalTime} min</span>
                </div>
                <Separator orientation="vertical" className="h-4 hidden sm:block bg-[#d9c8b6]" />
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Prep:</span>
                  <span>{recipe.prepTimeMinutes} min</span>
                </div>
                <Separator orientation="vertical" className="h-4 hidden sm:block bg-[#d9c8b6]" />
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Cook:</span>
                  <span>{recipe.cookTimeMinutes} min</span>
                </div>
                <Separator orientation="vertical" className="h-4 hidden sm:block bg-[#d9c8b6]" />
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Serves:</span>
                  <span>{recipe.servings}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Rating stars */}
                <div className="flex items-center gap-1.5" aria-label={`Rating controls: ${ratingLabel}`}>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1;
                    const filled = value <= currentRating;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingClick(value)}
                        className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d94f4f] focus-visible:ring-offset-[#f9f5f0] rounded-full"
                        aria-label={`Set rating to ${value} ${value === 1 ? "star" : "stars"}`}
                      >
                        <Star
                          className={cn(
                            "w-4 h-4 transition-colors duration-150",
                            filled ? "text-[#d94f4f] fill-[#d94f4f]" : "text-[#c3a899]",
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                  <span className="sr-only">{ratingLabel}</span>
                </div>

                {/* Favorite toggle */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFavorite(recipe.id)}
                  className={cn(
                    "border-[#e0c8b6] bg-white/80 text-[#3e2c23] hover:bg-[#f5e5d7] hover:text-[#3e2c23] transition-colors duration-150",
                  )}
                  aria-pressed={favorite}
                  aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
                >
                  {favorite ? (
                    <HeartOff className="w-4 h-4 mr-1.5 text-[#d94f4f]" aria-hidden="true" />
                  ) : (
                    <Heart className="w-4 h-4 mr-1.5 text-[#d94f4f]" aria-hidden="true" />
                  )}
                  <span className="text-xs sm:text-sm font-medium">
                    {favorite ? "Saved" : "Save"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-[#e1d3c4]" />

        <CardContent className="pt-4 sm:pt-6">
          {/* Tags & dietary chips */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex flex-col gap-3 mb-5"
          >
            <div className="flex flex-wrap gap-2.5">
              {recipe.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="rounded-full bg-white text-[#5a4334] border border-[#e0c8b6] px-3 py-1 text-[11px] uppercase tracking-[0.14em] font-semibold"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {dietaryChips.length > 0 && (
              <div className="flex flex-wrap gap-2.5" aria-label="Dietary information">
                {dietaryChips.map((flag) => (
                  <div
                    key={flag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e0c8b6] bg-[#f4e5d7] px-3 py-1 text-xs font-medium text-[#4a3629]"
                  >
                    <Flame className="w-3.5 h-3.5 text-[#d94f4f]" aria-hidden="true" />
                    <span className="capitalize">{flag.replace("-", " ")}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Main sections with tabs on small screens and split layout on large */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Tabs wrapper for mobile/tablet */}
            <div className="lg:hidden mb-1">
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as "ingredients" | "instructions")}
              >
                <TabsList className="grid grid-cols-2 bg-[#f1e3d6]">
                  <TabsTrigger
                    value="ingredients"
                    className="data-[state=active]:bg-white data-[state=active]:text-[#3e2c23] text-xs sm:text-sm"
                    aria-label="Show ingredients"
                  >
                    Ingredients
                  </TabsTrigger>
                  <TabsTrigger
                    value="instructions"
                    className="data-[state=active]:bg-white data-[state=active]:text-[#3e2c23] text-xs sm:text-sm"
                    aria-label="Show instructions"
                  >
                    Instructions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ingredients" className="mt-4">
                  <IngredientsSection
                    recipe={recipe}
                    checkedIngredients={checkedIngredients}
                    onToggleIngredient={handleToggleIngredient}
                  />
                </TabsContent>
                <TabsContent value="instructions" className="mt-4">
                  <InstructionsSection recipe={recipe} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop / large layout: 2-column workbench style */}
            <div className="hidden lg:block lg:col-span-5 min-w-0">
              <IngredientsSection
                recipe={recipe}
                checkedIngredients={checkedIngredients}
                onToggleIngredient={handleToggleIngredient}
              />
            </div>
            <div className="hidden lg:block lg:col-span-7 min-w-0">
              <InstructionsSection recipe={recipe} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-4 border-t border-[#e1d3c4] bg-[#f7eee6]">
          <p className="text-xs sm:text-sm text-[#7a5c4a] whitespace-normal break-words">
            This recipe is part of the TactileChef demo experience. All data, favorites, and
            ratings are stored only in your browser via mocked localStorage, with no backend
            involved.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {recipe.isGenerated && (
              <Badge className="rounded-full bg-[#d94f4f] text-white px-3 py-1 text-[11px] font-semibold tracking-[0.16em] uppercase">
                AI-crafted
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.section>
  );
};

interface IngredientsSectionProps {
  recipe: Recipe;
  checkedIngredients: Record<string, boolean>;
  onToggleIngredient: (id: string) => void;
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  recipe,
  checkedIngredients,
  onToggleIngredient,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="space-y-4"
      aria-labelledby="ingredients-heading"
    >
      <div className="flex items-center justify-between w-full">
        <h2
          id="ingredients-heading"
          className="text-lg lg:text-xl font-semibold font-['Playfair_Display'] text-[#3e2c23] whitespace-normal break-words"
        >
          Ingredients
        </h2>
        <span className="text-xs text-[#7a5c4a]">
          Tap to check items as you cook
        </span>
      </div>
      <ul className="space-y-2" aria-label="Ingredients list with checkable items">
        {recipe.ingredients.map((ingredient) => {
          const checked = checkedIngredients[ingredient.id] ?? false;
          return (
            <li key={ingredient.id} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => onToggleIngredient(ingredient.id)}
                className={cn(
                  "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#d5c2b0] bg-white text-[#3e2c23]",
                  checked && "bg-[#d94f4f] border-[#d94f4f] text-white",
                )}
                aria-pressed={checked}
                aria-label={
                  checked
                    ? `Mark ${ingredient.name} as not used`
                    : `Mark ${ingredient.name} as used`
                }
              >
                {checked && <Check className="w-3 h-3" aria-hidden="true" />}
              </button>
              <p
                className={cn(
                  "text-sm text-[#4a3629] whitespace-normal break-words",
                  checked && "line-through text-[#a58a78]",
                )}
              >
                <span className="font-medium">
                  {ingredient.quantity ? `${ingredient.quantity} ` : null}
                </span>
                {ingredient.name}
              </p>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
};

interface InstructionsSectionProps {
  recipe: Recipe;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({ recipe }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12 }}
      className="space-y-4"
      aria-labelledby="instructions-heading"
    >
      <div className="flex items-center justify-between w-full">
        <h2
          id="instructions-heading"
          className="text-lg lg:text-xl font-semibold font-['Playfair_Display'] text-[#3e2c23] whitespace-normal break-words"
        >
          Instructions
        </h2>
      </div>
      <ol className="space-y-3 list-decimal list-inside text-sm text-[#4a3629]">
        {recipe.instructions.map((step, index) => (
          <li key={index} className="pl-0 whitespace-normal break-words">
            <p className="leading-relaxed">{step}</p>
          </li>
        ))}
      </ol>
    </motion.section>
  );
};

export default RecipeDetail;