// src/mock.ts
// Centralized mock data store and client-side state for the AI Recipe Generator app.
// NOTE: This is a 100% frontend-only mock implementation with localStorage persistence.
// There is NO real backend or AI model – all generation and data are simulated in-browser.

import { useEffect, useSyncExternalStore } from "react";

// ----------------------
// Types & Interfaces
// ----------------------

export type CuisineType =
  | "mediterranean"
  | "italian"
  | "mexican"
  | "asian"
  | "middle-eastern"
  | "indian"
  | "american"
  | "fusion";

export type DietTag =
  | "vegan"
  | "vegetarian"
  | "pescetarian"
  | "pescatarian"
  | "gluten-free"
  | "dairy-free"
  | "low-carb"
  | "high-protein"
  | "comfort";

export interface Ingredient {
  id: string;
  name: string;
  quantity: string; // e.g. "1 cup", "2 tbsp"
  notes?: string;
}

export interface Review {
  id: string;
  recipeId: string;
  authorName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO string
}

export interface Recipe {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  heroImageUrl: string;
  accentColor: string; // for cards / hero surfaces
  cuisine: CuisineType;
  dietTags: DietTag[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: "easy" | "medium" | "advanced";
  ingredients: Ingredient[];
  instructions: string[]; // ordered steps
  createdAt: string;
  updatedAt: string;
  isAIgenerated?: boolean;
  aiPromptSummary?: string;
  averageRating?: number; // derived but persisted for simplicity
  ratingCount?: number; // derived but persisted for simplicity
}

export interface UserPreferences {
  id: string; // single user in this mock implementation
  name: string;
  avatarColor: string;
  dietary: {
    vegan: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
  favoriteCuisines: CuisineType[];
  maxPrepTimeMinutes?: number;
  lastSearchQuery?: string;
  lastSearchCuisine?: CuisineType | "any";
  lastSearchDietTags?: DietTag[];
}

export interface AIGenerationStatus {
  isLoading: boolean;
  lastPrompt?: string;
  lastError?: string | null;
  lastGeneratedId?: string | null;
}

export interface AIRecipeParams {
  ingredientsText: string;
  dietary: {
    vegan?: boolean;
    vegetarian?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
  };
  cuisineVibe?: CuisineType | "surprise";
}

export interface RecipeSearchFilters {
  cuisine?: CuisineType | "any";
  dietTags?: DietTag[];
  maxPrepTimeMinutes?: number;
}

export interface PersistedState {
  version: number;
  recipes: Recipe[];
  featuredIds: string[];
  savedRecipeIds: string[];
  preferences: UserPreferences;
  aiStatus: AIGenerationStatus;
  lastGeneratedId: string | null;
  reviews: Review[];
}

// ----------------------
// Constants & Safe Storage
// ----------------------

const STORAGE_KEY = "ai-recipe-generator-state";
const SCHEMA_VERSION = 1;

const isBrowser = typeof window !== "undefined";

const safeStorage = {
  getItem(key: string): string | null {
    if (!isBrowser) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore quota / privacy errors
    }
  },
  removeItem(key: string): void {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

// ----------------------
// Utilities
// ----------------------

const nowIso = () => new Date().toISOString();

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 10);
};

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

// ----------------------
// Initial Seed Data
// ----------------------

const seedRecipes = (): Recipe[] => {
  const baseDate = new Date();

  const recipe1Id = createId();
  const recipe2Id = createId();
  const recipe3Id = createId();
  const recipe4Id = createId();

  return [
    {
      id: recipe1Id,
      title: "Roasted Citrus Herb Salmon Bowl",
      subtitle: "Bright, zesty, and vibrant weeknight dinner",
      description:
        "Slow-roasted salmon with charred citrus, herby quinoa, and crunchy seasonal vegetables. A sunlit bowl that tastes like a weekend escape.",
      heroImageUrl:
        "https://images.pexels.com/photos/3296583/pexels-photo-3296583.jpeg?auto=compress&cs=tinysrgb&w=1600",
      accentColor: "#F4A261", // warm apricot
      cuisine: "mediterranean",
      dietTags: ["pescatarian", "gluten-free", "high-protein"],
      prepTimeMinutes: 20,
      cookTimeMinutes: 25,
      servings: 2,
      difficulty: "medium",
      ingredients: [
        {
          id: createId(),
          name: "Salmon fillets",
          quantity: "2 x 150 g",
          notes: "skin-on if possible",
        },
        {
          id: createId(),
          name: "Orange",
          quantity: "1",
          notes: "thinly sliced",
        },
        {
          id: createId(),
          name: "Lemon",
          quantity: "1",
          notes: "thinly sliced",
        },
        {
          id: createId(),
          name: "Cooked quinoa",
          quantity: "1 1/2 cups",
        },
        {
          id: createId(),
          name: "Olive oil",
          quantity: "2 tbsp",
        },
        {
          id: createId(),
          name: "Fresh dill",
          quantity: "2 tbsp",
          notes: "chopped",
        },
        {
          id: createId(),
          name: "Roasted vegetables",
          quantity: "2 cups",
          notes: "e.g. broccolini, carrots, fennel",
        },
      ],
      instructions: [
        "Preheat the oven to 180°C / 350°F and line a baking tray with parchment.",
        "Arrange citrus slices on the tray, drizzle with olive oil, and place salmon on top.",
        "Season salmon with salt, pepper, and half of the chopped dill.",
        "Roast for 18–22 minutes, until salmon is just opaque and flakes easily.",
        "Warm the cooked quinoa and toss with remaining dill, olive oil, and a squeeze of lemon.",
        "Assemble bowls with quinoa, roasted vegetables, and salmon with citrus on top.",
      ],
      createdAt: baseDate.toISOString(),
      updatedAt: baseDate.toISOString(),
      isAIgenerated: false,
      aiPromptSummary: undefined,
      averageRating: 4.7,
      ratingCount: 34,
    },
    {
      id: recipe2Id,
      title: "Cozy Charred Tomato Rigatoni",
      subtitle: "Silky sauce, blistered tomatoes, and crunchy herbed crumbs",
      description:
        "A hug-in-a-bowl pasta with slow-cooked garlic, charred cherry tomatoes, and a whisper of chili, finished with lemony breadcrumbs.",
      heroImageUrl:
        "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1600",
      accentColor: "#E76F51", // terracotta
      cuisine: "italian",
      dietTags: ["vegetarian", "comfort"],
      prepTimeMinutes: 15,
      cookTimeMinutes: 25,
      servings: 3,
      difficulty: "easy",
      ingredients: [
        {
          id: createId(),
          name: "Rigatoni",
          quantity: "300 g",
        },
        {
          id: createId(),
          name: "Cherry tomatoes",
          quantity: "400 g",
        },
        {
          id: createId(),
          name: "Garlic cloves",
          quantity: "4",
          notes: "thinly sliced",
        },
        {
          id: createId(),
          name: "Crushed chili flakes",
          quantity: "1/2 tsp",
        },
        {
          id: createId(),
          name: "Panko breadcrumbs",
          quantity: "1/2 cup",
        },
        {
          id: createId(),
          name: "Parmesan cheese",
          quantity: "1/2 cup",
          notes: "finely grated",
        },
        {
          id: createId(),
          name: "Fresh basil",
          quantity: "1/3 cup",
          notes: "torn",
        },
      ],
      instructions: [
        "Cook rigatoni in salted boiling water until al dente; reserve 1 cup of pasta water.",
        "In a large skillet, warm olive oil and gently cook sliced garlic until fragrant.",
        "Add cherry tomatoes and chili flakes; cook on high heat until tomatoes blister and burst.",
        "Fold in cooked pasta with splashes of pasta water, tossing to create a glossy sauce.",
        "Toast panko in a dry pan with olive oil and a pinch of salt until golden, then mix with lemon zest and parmesan.",
        "Serve pasta topped with herbed crumbs and plenty of fresh basil.",
      ],
      createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      updatedAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      isAIgenerated: false,
      aiPromptSummary: undefined,
      averageRating: 4.9,
      ratingCount: 58,
    },
    {
      id: recipe3Id,
      title: "Golden Turmeric Coconut Lentil Stew",
      subtitle: "Vibrant plant-based comfort in one pot",
      description:
        "Creamy red lentils simmered with coconut milk, turmeric, and ginger, finished with lime and crunchy seeds.",
      heroImageUrl:
        "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600",
      accentColor: "#E9C46A", // golden turmeric
      cuisine: "indian",
      dietTags: ["vegan", "gluten-free", "high-protein", "comfort"],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
      difficulty: "easy",
      ingredients: [
        {
          id: createId(),
          name: "Red lentils",
          quantity: "1 1/2 cups",
          notes: "rinsed",
        },
        {
          id: createId(),
          name: "Coconut milk",
          quantity: "1 can (400 ml)",
        },
        {
          id: createId(),
          name: "Vegetable stock",
          quantity: "3 cups",
        },
        {
          id: createId(),
          name: "Onion",
          quantity: "1",
          notes: "finely chopped",
        },
        {
          id: createId(),
          name: "Fresh ginger",
          quantity: "2 tbsp",
          notes: "grated",
        },
        {
          id: createId(),
          name: "Ground turmeric",
          quantity: "1 1/2 tsp",
        },
        {
          id: createId(),
          name: "Spinach",
          quantity: "3 cups",
          notes: "roughly chopped",
        },
      ],
      instructions: [
        "Sauté onion in coconut oil until translucent, then add garlic and ginger.",
        "Stir in turmeric and lentils, coating them in the aromatics.",
        "Pour in vegetable stock and coconut milk, bring to a simmer.",
        "Cook for 20–25 minutes, stirring occasionally, until lentils are tender and creamy.",
        "Fold in spinach until wilted; season with salt, pepper, and lime juice.",
        "Serve with warm flatbread or over fluffy rice, topped with toasted seeds.",
      ],
      createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 48).toISOString(),
      updatedAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 48).toISOString(),
      isAIgenerated: false,
      aiPromptSummary: undefined,
      averageRating: 4.8,
      ratingCount: 41,
    },
    {
      id: recipe4Id,
      title: "Crispy Sesame Tofu Lettuce Wraps",
      subtitle: "Fresh, crunchy, and weeknight-fast",
      description:
        "Crisp-edged tofu tossed in a glossy sesame sauce, tucked into cool lettuce cups with quick pickles.",
      heroImageUrl:
        "https://images.pexels.com/photos/3731474/pexels-photo-3731474.jpeg?auto=compress&cs=tinysrgb&w=1600",
      accentColor: "#2A9D8F", // teal green
      cuisine: "asian",
      dietTags: ["vegan", "dairy-free", "low-carb"],
      prepTimeMinutes: 20,
      cookTimeMinutes: 20,
      servings: 3,
      difficulty: "medium",
      ingredients: [
        {
          id: createId(),
          name: "Firm tofu",
          quantity: "400 g",
          notes: "pressed and cubed",
        },
        {
          id: createId(),
          name: "Cornstarch",
          quantity: "3 tbsp",
        },
        {
          id: createId(),
          name: "Soy sauce or tamari",
          quantity: "3 tbsp",
        },
        {
          id: createId(),
          name: "Maple syrup",
          quantity: "1 1/2 tbsp",
        },
        {
          id: createId(),
          name: "Rice vinegar",
          quantity: "1 tbsp",
        },
        {
          id: createId(),
          name: "Sesame oil",
          quantity: "2 tsp",
        },
        {
          id: createId(),
          name: "Butter lettuce leaves",
          quantity: "12",
        },
      ],
      instructions: [
        "Toss tofu cubes in cornstarch and a pinch of salt until coated.",
        "Pan-fry tofu in neutral oil over medium-high heat until crisp on all sides.",
        "Whisk soy sauce, maple syrup, rice vinegar, garlic, and sesame oil in a bowl.",
        "Pour sauce over tofu and cook until thickened and glossy.",
        "Serve tofu in lettuce leaves with pickled veggies, herbs, and toasted sesame seeds.",
      ],
      createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 72).toISOString(),
      updatedAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 72).toISOString(),
      isAIgenerated: false,
      aiPromptSummary: undefined,
      averageRating: 4.6,
      ratingCount: 29,
    },
  ];
};

const seedPreferences = (): UserPreferences => ({
  id: "mock-user-1",
  name: "Guest Foodie",
  avatarColor: "#E76F51",
  dietary: {
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    dairyFree: false,
  },
  favoriteCuisines: ["mediterranean", "italian", "asian"],
  maxPrepTimeMinutes: 40,
  lastSearchQuery: "",
  lastSearchCuisine: "any",
  lastSearchDietTags: [],
});

const seedReviews = (recipes: Recipe[]): Review[] => {
  const [r1, r2, r3] = recipes;
  const base = new Date();
  return [
    {
      id: createId(),
      recipeId: r1.id,
      authorName: "Amelia",
      rating: 5,
      comment: "Made this on a Sunday and it tasted like vacation. The citrus is magic!",
      createdAt: new Date(base.getTime() - 1000 * 60 * 60 * 10).toISOString(),
    },
    {
      id: createId(),
      recipeId: r2.id,
      authorName: "Jonas",
      rating: 5,
      comment: "The lemony breadcrumbs absolutely make this. New weeknight staple.",
      createdAt: new Date(base.getTime() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: createId(),
      recipeId: r3.id,
      authorName: "Priya",
      rating: 4,
      comment:
        "So cozy and vibrant. I added roasted cauliflower on top and it was perfect.",
      createdAt: new Date(base.getTime() - 1000 * 60 * 60 * 30).toISOString(),
    },
  ];
};

const createInitialState = (): PersistedState => {
  const recipes = seedRecipes();
  const reviews = seedReviews(recipes);

  const featuredIds = recipes.slice(0, 3).map((r) => r.id);

  return {
    version: SCHEMA_VERSION,
    recipes,
    featuredIds,
    savedRecipeIds: [recipes[1].id],
    preferences: seedPreferences(),
    aiStatus: {
      isLoading: false,
      lastPrompt: undefined,
      lastError: null,
      lastGeneratedId: null,
    },
    lastGeneratedId: null,
    reviews,
  };
};

// ----------------------
// Persistence & Migration
// ----------------------

export const loadState = (): PersistedState => {
  const raw = safeStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createInitialState();
  }
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedState>;

    // basic shape validation and migration
    const version = typeof parsed.version === "number" ? parsed.version : 0;

    if (version !== SCHEMA_VERSION) {
      // simple migration approach: start fresh but try to carry over user prefs and saved recipes
      const fresh = createInitialState();
      return {
        ...fresh,
        savedRecipeIds: parsed.savedRecipeIds ?? fresh.savedRecipeIds,
        preferences: parsed.preferences ?? fresh.preferences,
      };
    }

    const freshFallback = createInitialState();

    return {
      version: SCHEMA_VERSION,
      recipes:
        parsed.recipes && Array.isArray(parsed.recipes)
          ? parsed.recipes
          : freshFallback.recipes,
      featuredIds:
        parsed.featuredIds && Array.isArray(parsed.featuredIds)
          ? parsed.featuredIds
          : freshFallback.featuredIds,
      savedRecipeIds:
        parsed.savedRecipeIds && Array.isArray(parsed.savedRecipeIds)
          ? parsed.savedRecipeIds
          : freshFallback.savedRecipeIds,
      preferences: parsed.preferences ?? freshFallback.preferences,
      aiStatus: parsed.aiStatus ?? freshFallback.aiStatus,
      lastGeneratedId:
        typeof parsed.lastGeneratedId === "string" || parsed.lastGeneratedId === null
          ? parsed.lastGeneratedId
          : freshFallback.lastGeneratedId,
      reviews:
        parsed.reviews && Array.isArray(parsed.reviews)
          ? parsed.reviews
          : freshFallback.reviews,
    };
  } catch {
    return createInitialState();
  }
};

let state: PersistedState = loadState();

const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) {
    try {
      listener();
    } catch {
      // ignore individual listener errors
    }
  }
};

const persist = () => {
  safeStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      // Ensure version consistency
      version: SCHEMA_VERSION,
    })
  );
};

// ----------------------
// Store Core Helpers
// ----------------------

export const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getState = (): PersistedState => state;

export const setState = (partial: Partial<PersistedState>): void => {
  state = { ...state, ...partial };
  persist();
  notify();
};

// React hook for convenient subscription in components
export const useMockStore = <T,>(selector: (s: PersistedState) => T): T => {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(state)
  );
};

// ----------------------
// Domain Helpers
// ----------------------

export const upsertPreferences = (patch: Partial<UserPreferences>): void => {
  const current = state.preferences;
  const updated: UserPreferences = {
    ...current,
    ...patch,
    dietary: {
      ...current.dietary,
      ...(patch.dietary ?? {}),
    },
    favoriteCuisines: patch.favoriteCuisines ?? current.favoriteCuisines,
  };
  setState({ preferences: updated });
};

export const toggleSavedRecipe = (id: string): void => {
  const exists = state.savedRecipeIds.includes(id);
  const savedRecipeIds = exists
    ? state.savedRecipeIds.filter((r) => r !== id)
    : [...state.savedRecipeIds, id];
  setState({ savedRecipeIds });
};

export interface ReviewInput {
  authorName: string;
  rating: number;
  comment: string;
}

export const addReview = (recipeId: string, input: ReviewInput): Review | null => {
  const recipe = state.recipes.find((r) => r.id === recipeId);
  if (!recipe) return null;

  const review: Review = {
    id: createId(),
    recipeId,
    authorName: input.authorName.trim() || "Anonymous",
    rating: clamp(Math.round(input.rating), 1, 5),
    comment: input.comment.trim(),
    createdAt: nowIso(),
  };

  const reviews = [...state.reviews, review];

  const recipeReviews = reviews.filter((r) => r.recipeId === recipeId);
  const total = recipeReviews.reduce((sum, r) => sum + r.rating, 0);
  const avg = recipeReviews.length ? total / recipeReviews.length : undefined;

  const recipes = state.recipes.map((r) =>
    r.id === recipeId
      ? {
          ...r,
          averageRating: avg,
          ratingCount: recipeReviews.length,
          updatedAt: nowIso(),
        }
      : r
  );

  setState({ reviews, recipes });

  return review;
};

export const rateRecipe = (recipeId: string, rating: number): void => {
  // simple rating shortcut: record anonymous review with empty comment
  addReview(recipeId, {
    authorName: "",
    rating,
    comment: "",
  });
};

export const addRecipe = (
  recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">
): Recipe => {
  const id = createId();
  const timestamp = nowIso();
  const fullRecipe: Recipe = {
    ...recipe,
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const recipes = [fullRecipe, ...state.recipes];
  setState({
    recipes,
    lastGeneratedId: fullRecipe.isAIgenerated ? id : state.lastGeneratedId,
  });
  return fullRecipe;
};

export const updateRecipe = (recipe: Recipe): Recipe | null => {
  const exists = state.recipes.find((r) => r.id === recipe.id);
  if (!exists) return null;

  const updated: Recipe = {
    ...exists,
    ...recipe,
    updatedAt: nowIso(),
  };

  const recipes = state.recipes.map((r) => (r.id === recipe.id ? updated : r));
  setState({ recipes });
  return updated;
};

export const deleteRecipe = (id: string): void => {
  const recipes = state.recipes.filter((r) => r.id !== id);
  const savedRecipeIds = state.savedRecipeIds.filter((rid) => rid !== id);
  const featuredIds = state.featuredIds.filter((rid) => rid !== id);
  const reviews = state.reviews.filter((rev) => rev.recipeId !== id);

  setState({ recipes, savedRecipeIds, featuredIds, reviews });
};

export const getRecipeById = (id: string): Recipe | undefined => {
  return state.recipes.find((r) => r.id === id);
};

export const searchRecipes = (
  query: string,
  filters: RecipeSearchFilters
): Recipe[] => {
  const text = query.trim().toLowerCase();

  return state.recipes.filter((recipe) => {
    if (filters.cuisine && filters.cuisine !== "any" && recipe.cuisine !== filters.cuisine) {
      return false;
    }

    if (
      filters.maxPrepTimeMinutes &&
      recipe.prepTimeMinutes > filters.maxPrepTimeMinutes
    ) {
      return false;
    }

    if (filters.dietTags && filters.dietTags.length > 0) {
      const hasAllTags = filters.dietTags.every((tag) => recipe.dietTags.includes(tag));
      if (!hasAllTags) return false;
    }

    if (!text) return true;

    const haystack = (
      recipe.title +
      " " +
      (recipe.subtitle || "") +
      " " +
      recipe.description +
      " " +
      recipe.ingredients.map((i) => i.name).join(" ") +
      " " +
      recipe.dietTags.join(" ") +
      " " +
      recipe.cuisine
    ).toLowerCase();

    return haystack.includes(text);
  });
};

export const getFeaturedRecipes = (): Recipe[] => {
  const { recipes, featuredIds } = state;
  const featured = featuredIds
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r): r is Recipe => Boolean(r));

  if (featured.length === 0) {
    return recipes.slice(0, 3);
  }
  return featured;
};

export const listSavedRecipes = (): Recipe[] => {
  const { recipes, savedRecipeIds } = state;
  const map = new Set(savedRecipeIds);
  return recipes.filter((r) => map.has(r.id));
};

// ----------------------
// AI Recipe Generation (Mock)
// ----------------------

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const cuisineVibes: Record<
  CuisineType,
  {
    accentColor: string;
    titleSuffix: string[];
    heroCopy: string[];
  }
> = {
  mediterranean: {
    accentColor: "#F4A261",
    titleSuffix: ["Sun Bowl", "Coastal Platter", "Olive Grove Feast"],
    heroCopy: [
      "Bright, herby flavors with citrusy edges and seaside energy.",
      "A breezy bowl layered with crunch, creaminess, and sunshine.",
    ],
  },
  italian: {
    accentColor: "#E76F51",
    titleSuffix: ["Weeknight Pasta", "Slow Sunday Bake", "Rustic Skillet"],
    heroCopy: [
      "Silky, soulful comfort with just the right amount of drama.",
      "Cozy, carb-forward and designed for long, chatty dinners.",
    ],
  },
  mexican: {
    accentColor: "#E9C46A",
    titleSuffix: ["Taco Night", "Street-Style Skillet", "Fiesta Bowl"],
    heroCopy: [
      "Limey, crunchy, and a touch smoky – built for sharing.",
      "Colorful layers of heat, crunch, and cooling toppings.",
    ],
  },
  asian: {
    accentColor: "#2A9D8F",
    titleSuffix: ["Noodle Bowl", "Stir-Fry", "Brothy Supper"],
    heroCopy: [
      "Layered aromatics, gentle heat, and a glossy finish.",
      "Comfort built on ginger, garlic, and gentle spice.",
    ],
  },
  "middle-eastern": {
    accentColor: "#D98E73",
    titleSuffix: ["Spiced Traybake", "Warm Grain Salad", "Market Platter"],
    heroCopy: [
      "Toasted spices, slow sweetness, and herby pops of green.",
      "A table-friendly dish meant for scooping and sharing.",
    ],
  },
  indian: {
    accentColor: "#E29578",
    titleSuffix: ["One-Pot Dal", "Layered Curry", "Fragrant Rice Bowl"],
    heroCopy: [
      "Deep, cozy spices with a creamy, spoonable texture.",
      "Comfort built on toasty aromatics and vibrant color.",
    ],
  },
  american: {
    accentColor: "#F6AE2D",
    titleSuffix: ["Sheet Pan Supper", "Backyard Bowl", "Cozy Skillet"],
    heroCopy: [
      "Casual, crowd-friendly comfort with little fuss.",
      "A familiar favorite with a fresh, colorful twist.",
    ],
  },
  fusion: {
    accentColor: "#9B5DE5",
    titleSuffix: ["Weeknight Mash-Up", "Borderless Bowl", "Playful Platter"],
    heroCopy: [
      "Unexpected pairings that somehow just work.",
      "A playful mix of textures, sauces, and global cravings.",
    ],
  },
};

const heroImagePool: string[] = [
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/5531454/pexels-photo-5531454.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3731476/pexels-photo-3731476.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3731475/pexels-photo-3731475.jpeg?auto=compress&cs=tinysrgb&w=1600",
];

const difficultyFromIngredients = (count: number): Recipe["difficulty"] => {
  if (count <= 6) return "easy";
  if (count <= 10) return "medium";
  return "advanced";
};

export const generateAIRecipe = async (params: AIRecipeParams): Promise<Recipe> => {
  const prompt = params.ingredientsText.trim();

  const prepState: AIGenerationStatus = {
    isLoading: true,
    lastPrompt: prompt,
    lastError: null,
    lastGeneratedId: state.lastGeneratedId,
  };
  setState({ aiStatus: prepState });

  // Simulated latency 900–1800ms
  const delay = 900 + Math.random() * 900;

  // Introduce a small failure chance (10%) to mimic real AI behavior
  const shouldFail = Math.random() < 0.1;

  await new Promise((resolve) => setTimeout(resolve, delay));

  if (!prompt || shouldFail) {
    const errorMessage = !prompt
      ? "Describe a few ingredients or cravings to generate a recipe."
      : "The AI kitchen got a bit too steamy. Try generating again in a moment.";

    const failState: AIGenerationStatus = {
      isLoading: false,
      lastPrompt: prompt,
      lastError: errorMessage,
      lastGeneratedId: state.lastGeneratedId,
    };
    setState({ aiStatus: failState });
    throw new Error(errorMessage);
  }

  // Determine cuisine vibe
  let cuisine: CuisineType;
  if (!params.cuisineVibe || params.cuisineVibe === "surprise") {
    const keys = Object.keys(cuisineVibes) as CuisineType[];
    cuisine = pickRandom(keys);
  } else {
    cuisine = params.cuisineVibe;
  }

  const vibe = cuisineVibes[cuisine];

  // Basic parsing of ingredients text into ingredient list
  const rawItems = prompt
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const ingredientNames = rawItems.length > 0 ? rawItems : ["Pantry ingredients"];

  const ingredients: Ingredient[] = ingredientNames.map((name) => ({
    id: createId(),
    name,
    quantity: "to taste",
  }));

  const ingredientCount = ingredients.length;
  const difficulty = difficultyFromIngredients(ingredientCount);

  const baseTitle =
    ingredientNames.length > 0
      ? ingredientNames[0]
          .split(" ")
          .slice(0, 3)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Freestyle Kitchen";

  const titleRaw = `${baseTitle} ${pickRandom(vibe.titleSuffix)}`;
  const title = titleRaw.replace(/\s+/g, " ").trim();

  const heroCopy = pickRandom(vibe.heroCopy);

  const dietaryTags: DietTag[] = [];
  if (params.dietary.vegan) dietaryTags.push("vegan", "dairy-free");
  else if (params.dietary.vegetarian) dietaryTags.push("vegetarian");
  if (params.dietary.glutenFree) dietaryTags.push("gluten-free");
  if (params.dietary.dairyFree && !dietaryTags.includes("dairy-free"))
    dietaryTags.push("dairy-free");

  if (dietaryTags.length === 0) {
    dietaryTags.push("comfort");
  }

  const prepTimeMinutes = clamp(10 + ingredientCount * 3, 10, 45);
  const cookTimeMinutes = clamp(ingredientCount * 4 + 10, 15, 60);
  const servings = [2, 3, 4][Math.floor(Math.random() * 3)];

  const instructions: string[] = [
    "Gather and prep all of your ingredients, chopping everything into comfortable, bite-sized pieces.",
    "Warm a large pan or pot over medium heat with a generous drizzle of oil.",
    "Layer in aromatics first (onions, garlic, ginger, spices), cooking until fragrant and just golden.",
    "Add the remaining ingredients in stages, starting with those that take longer to soften.",
    "Splash in water, stock, or coconut milk as needed to create a glossy sauce or cozy broth.",
    "Simmer gently, tasting and adjusting with salt, acidity (like lemon or vinegar), and a touch of sweetness.",
    "Finish with something fresh – herbs, citrus zest, crunchy toppings – and serve while everything is warm and vibrant.",
  ];

  const newRecipe: Omit<Recipe, "id" | "createdAt" | "updatedAt"> = {
    title,
    subtitle: heroCopy,
    description:
      "Generated by the in-browser AI test kitchen based on your ingredients and cravings. Tweak, riff, and make it your own.",
    heroImageUrl: pickRandom(heroImagePool),
    accentColor: vibe.accentColor,
    cuisine,
    dietTags: Array.from(new Set(dietaryTags)),
    prepTimeMinutes,
    cookTimeMinutes,
    servings,
    difficulty,
    ingredients,
    instructions,
    isAIgenerated: true,
    aiPromptSummary: prompt,
    averageRating: undefined,
    ratingCount: 0,
  };

  const stored = addRecipe(newRecipe);

  const successStatus: AIGenerationStatus = {
    isLoading: false,
    lastPrompt: prompt,
    lastError: null,
    lastGeneratedId: stored.id,
  };

  setState({ aiStatus: successStatus, lastGeneratedId: stored.id });

  return stored;
};

// ----------------------
// Convenience Hooks / Actions
// ----------------------

export const useRecipes = () => useMockStore((s) => s.recipes);
export const useFeaturedRecipes = () => useMockStore(getFeaturedRecipes);
export const useSavedRecipeIds = () => useMockStore((s) => s.savedRecipeIds);
export const usePreferences = () => useMockStore((s) => s.preferences);
export const useAIStatus = () => useMockStore((s) => s.aiStatus);
export const useReviewsForRecipe = (recipeId: string | undefined) =>
  useMockStore((s) =>
    recipeId ? s.reviews.filter((r) => r.recipeId === recipeId) : ([] as Review[])
  );

// Allow components to clear all local data (used in Profile / Settings)
export const clearAllData = () => {
  const fresh = createInitialState();
  state = fresh;
  persist();
  notify();
};

// Keep preferences in sync with localStorage even if hook not used yet
if (isBrowser) {
  // Ensure initial persist in case this file was loaded but nothing changed yet
  if (!safeStorage.getItem(STORAGE_KEY)) {
    persist();
  }
}

// Informational summary for developers: This file mocks all data/state in-memory
// with safe localStorage persistence, simulating a backend + AI while remaining
// 100% client-side for a smooth MVP experience.