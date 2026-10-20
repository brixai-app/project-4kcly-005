import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

/**
 * IMPORTANT NOTE
 * 100% FRONTEND-ONLY MOCK IMPLEMENTATION – NO BACKEND.
 * All data, AI generation, and persistence are simulated in-memory with
 * localStorage. This file is the single source of truth for the app.
 */

// ---------- Types ----------

export type DietaryFlag = "vegan" | "vegetarian" | "gluten-free" | "nut-free" | "dairy-free";

export interface Ingredient {
  id: string;
  name: string;
  quantity?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string; // URL or data URI
  cuisine: string;
  tags: string[];
  dietary: DietaryFlag[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
  isGenerated?: boolean;
}

export interface UserPreferences {
  dietaryRestrictions: DietaryFlag[];
  preferredCuisines: string[];
  spiceLevel: 1 | 2 | 3 | 4 | 5; // 1=mild, 5=very spicy
  maxPrepTimeMinutes?: number;
}

export interface RatingState {
  recipeId: string;
  rating: number; // 1-5
}

export interface AppState {
  recipes: Recipe[];
  generatedRecipes: Recipe[];
  favorites: string[]; // recipe IDs
  preferences: UserPreferences;
  recentSearches: string[];
  ratings: RatingState[];
}

// ---------- Safe Storage Helpers (mocked persistence) ----------

const STORAGE_KEY = "tactilechef_app_state_v1";

const safeStorage = {
  get(): AppState | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AppState;
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
    } catch {
      return null;
    }
  },
  set(state: AppState) {
    if (typeof window === "undefined") return;
    try {
      const serialized = JSON.stringify(state);
      window.localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      // ignore write errors (private mode, quota, etc.)
    }
  },
  clear() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};

// ---------- Mock Data (no backend) ----------

// NOTE: Images are mocked with simple gradient placeholders to avoid heavy assets.

const now = () => new Date().toISOString();

const baseMockRecipes: Recipe[] = [
  {
    id: "mock-1",
    title: "Slow-Roasted Tomato Bucatini",
    description:
      "Thick bucatini pasta tangled with slow-roasted tomatoes, garlic, and silky olive oil, finished with basil and a touch of chili heat.",
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23f8e3d7'/><stop offset='1' stop-color='%23e0b9a0'/></linearGradient></defs><rect width='1200' height='800' fill='url(%23g)'/><text x='50%' y='52%' text-anchor='middle' fill='%233e2c23' font-family='serif' font-size='56'>Tomato Bucatini</text></svg>",
    cuisine: "Italian",
    tags: ["pasta", "comfort", "weeknight"],
    dietary: ["vegetarian"],
    prepTimeMinutes: 20,
    cookTimeMinutes: 35,
    servings: 4,
    ingredients: [
      { id: "i1", name: "bucatini", quantity: "400g" },
      { id: "i2", name: "ripe tomatoes", quantity: "600g" },
      { id: "i3", name: "garlic cloves", quantity: "4" },
      { id: "i4", name: "extra-virgin olive oil", quantity: "4 tbsp" },
      { id: "i5", name: "fresh basil", quantity: "1 handful" },
      { id: "i6", name: "chili flakes", quantity: "1/2 tsp" },
      { id: "i7", name: "salt" },
    ],
    instructions: [
      "Heat oven to 160°C (320°F). Halve tomatoes, toss with olive oil, sliced garlic, chili, and salt.",
      "Roast tomatoes cut-side up for 35–40 minutes until jammy and caramelized at the edges.",
      "Cook bucatini in well-salted water until just al dente. Reserve a mug of cooking water.",
      "Tip roasted tomatoes and all pan juices into a wide skillet. Gently mash with a spoon.",
      "Add drained bucatini with a splash of pasta water. Toss over low heat until glossy.",
      "Finish with torn basil and a final drizzle of olive oil. Serve immediately.",
    ],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "mock-2",
    title: "Citrus-Ginger Sheet Pan Salmon",
    description:
      "Roasted salmon nestled among caramelized citrus and tender greens, brushed with a gingery glaze that feels both bright and comforting.",
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23f6f2e8'/><stop offset='1' stop-color='%23f3c39b'/></linearGradient></defs><rect width='1200' height='800' fill='url(%23g)'/><text x='50%' y='52%' text-anchor='middle' fill='%233e2c23' font-family='serif' font-size='52'>Citrus Salmon</text></svg>",
    cuisine: "Modern",
    tags: ["sheet pan", "seafood", "weeknight"],
    dietary: ["gluten-free"],
    prepTimeMinutes: 15,
    cookTimeMinutes: 18,
    servings: 3,
    ingredients: [
      { id: "s1", name: "salmon fillets", quantity: "3" },
      { id: "s2", name: "orange", quantity: "1, sliced" },
      { id: "s3", name: "lemon", quantity: "1, sliced" },
      { id: "s4", name: "fresh ginger", quantity: "2 tsp, grated" },
      { id: "s5", name: "honey", quantity: "1 tbsp" },
      { id: "s6", name: "tamari (gluten-free soy)", quantity: "1 tbsp" },
      { id: "s7", name: "baby kale or spinach", quantity: "2 cups" },
    ],
    instructions: [
      "Heat oven to 200°C (400°F). Line a sheet pan with parchment.",
      "Whisk ginger, honey, tamari, and 1 tbsp olive oil into a loose glaze.",
      "Arrange citrus slices on the tray, then lay salmon on top. Brush generously with glaze.",
      "Roast for 10–12 minutes, until salmon is just opaque but still glossy.",
      "Scatter greens around salmon, toss with pan juices, and return to oven for 2 minutes.",
      "Serve with spoonfuls of the sticky citrus juices.",
    ],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "mock-3",
    title: "Charred Miso Sesame Vegetables over Rice",
    description:
      "Smoky skillet-charred vegetables tossed in a savory-sweet miso sesame dressing, piled over fluffy rice for a deeply satisfying bowl.",
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23f5eee2'/><stop offset='1' stop-color='%23d3c6aa'/></linearGradient></defs><rect width='1200' height='800' fill='url(%23g)'/><text x='50%' y='52%' text-anchor='middle' fill='%233e2c23' font-family='serif' font-size='50'>Miso Veg Bowl</text></svg>",
    cuisine: "Asian",
    tags: ["bowl", "vegan", "meal prep"],
    dietary: ["vegan", "dairy-free"],
    prepTimeMinutes: 25,
    cookTimeMinutes: 20,
    servings: 4,
    ingredients: [
      { id: "m1", name: "short-grain rice", quantity: "2 cups cooked" },
      { id: "m2", name: "broccoli florets", quantity: "2 cups" },
      { id: "m3", name: "carrots", quantity: "2, sliced" },
      { id: "m4", name: "snap peas", quantity: "1 cup" },
      { id: "m5", name: "white miso", quantity: "2 tbsp" },
      { id: "m6", name: "rice vinegar", quantity: "1 tbsp" },
      { id: "m7", name: "toasted sesame oil", quantity: "2 tsp" },
      { id: "m8", name: "sesame seeds", quantity: "1 tbsp" },
    ],
    instructions: [
      "Whisk miso, rice vinegar, 1 tbsp water, and sesame oil into a loose dressing.",
      "Heat a large skillet until very hot. Add a thin film of neutral oil.",
      "Add vegetables in a single layer. Let char deeply before tossing.",
      "When tender-crisp with dark edges, remove from heat and toss with dressing.",
      "Serve vegetables over warm rice, finishing with sesame seeds.",
    ],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "mock-4",
    title: "Warm Cinnamon-Cardamom Baked Oats",
    description:
      "Custardy baked oats scented with cinnamon and cardamom, scattered with nuts and fruit, like a cozy breakfast crumble.",
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23f7e9d8'/><stop offset='1' stop-color='%23e2bb8f'/></linearGradient></defs><rect width='1200' height='800' fill='url(%23g)'/><text x='50%' y='52%' text-anchor='middle' fill='%233e2c23' font-family='serif' font-size='50'>Baked Oats</text></svg>",
    cuisine: "Brunch",
    tags: ["breakfast", "baked", "comfort"],
    dietary: ["vegetarian", "nut-free"],
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 6,
    ingredients: [
      { id: "b1", name: "rolled oats", quantity: "2 cups" },
      { id: "b2", name: "milk or plant-based milk", quantity: "2 1/2 cups" },
      { id: "b3", name: "eggs or flax eggs", quantity: "2" },
      { id: "b4", name: "brown sugar", quantity: "1/3 cup" },
      { id: "b5", name: "ground cinnamon", quantity: "1 1/2 tsp" },
      { id: "b6", name: "ground cardamom", quantity: "1/2 tsp" },
      { id: "b7", name: "berries or sliced fruit", quantity: "1 1/2 cups" },
    ],
    instructions: [
      "Heat oven to 180°C (350°F). Grease a medium baking dish.",
      "Whisk milk, eggs, sugar, cinnamon, and cardamom until smooth.",
      "Fold in oats and most of the fruit. Pour into the dish.",
      "Scatter remaining fruit on top.",
      "Bake 28–32 minutes until just set in the center with golden edges.",
      "Serve warm with yogurt or cream.",
    ],
    createdAt: now(),
    updatedAt: now(),
  },
];

// ---------- Defaults ----------

export const defaultPreferences: UserPreferences = {
  dietaryRestrictions: [],
  preferredCuisines: ["Italian", "Asian", "Mexican", "Modern"],
  spiceLevel: 2,
  maxPrepTimeMinutes: undefined,
};

const defaultState: AppState = {
  recipes: baseMockRecipes,
  generatedRecipes: [],
  favorites: [],
  preferences: defaultPreferences,
  recentSearches: [],
  ratings: [],
};

// ---------- Utility helpers ----------

const ensureUnique = (arr: string[]): string[] => Array.from(new Set(arr));

const normalizeQuery = (q: string) => q.trim().toLowerCase();

const deriveAllRecipes = (state: AppState): Recipe[] => [
  ...state.recipes,
  ...state.generatedRecipes,
];

const findRating = (ratings: RatingState[], recipeId: string): number => {
  const r = ratings.find((x) => x.recipeId === recipeId);
  return r ? r.rating : 0;
};

// A deterministic pseudo-random number generator based on a string seed.
const seededRandom = (seed: string): number => {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h << 5) - h + seed.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    h |= 0;
  }
  const x = Math.sin(h) * 10000;
  return x - Math.floor(x);
};

const randomIntFromSeed = (seed: string, min: number, max: number): number => {
  const r = seededRandom(seed);
  return Math.floor(r * (max - min + 1)) + min;
};

const titleCase = (text: string): string =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// ---------- Simulated AI Recipe Generator (mock, client-side only) ----------

export interface GenerateRecipeOptions {
  query: string;
  preferences: UserPreferences;
}

const buildGeneratedRecipe = ({ query, preferences }: GenerateRecipeOptions): Recipe => {
  const normalized = normalizeQuery(query) || "pantry supper";
  const titleSeed = titleCase(normalized.replace(/[,.;]+/g, " "));

  const cuisineCandidates = preferences.preferredCuisines.length
    ? preferences.preferredCuisines
    : ["Modern", "Italian", "Asian", "Mexican", "Brunch"];

  const cuisineIndex = randomIntFromSeed(`${normalized}-cuisine`, 0, cuisineCandidates.length - 1);
  const cuisine = cuisineCandidates[cuisineIndex];

  const dietary: DietaryFlag[] = [...preferences.dietaryRestrictions];

  // Add derived dietary hints
  if (!dietary.includes("vegan") && normalized.includes("tofu")) dietary.push("vegan");
  if (!dietary.includes("gluten-free") && normalized.includes("rice"))
    dietary.push("gluten-free");

  const seedBase = `${normalized}-${cuisine}-${preferences.spiceLevel}`;

  const prepTime = preferences.maxPrepTimeMinutes
    ? Math.min(
        preferences.maxPrepTimeMinutes,
        randomIntFromSeed(`${seedBase}-prep`, 10, 40),
      )
    : randomIntFromSeed(`${seedBase}-prep`, 12, 35);

  const cookTime = randomIntFromSeed(`${seedBase}-cook`, 10, 40);

  const servings = randomIntFromSeed(`${seedBase}-servings`, 2, 6);

  const keyIngredients = normalized
    .split(/[ ,]+/)
    .filter((x) => x.length > 2)
    .slice(0, 6);

  const ingredients: Ingredient[] = (keyIngredients.length
    ? keyIngredients
    : ["olive oil", "garlic", "onion", "lemon", "herbs"]
  ).map((name, idx) => ({
    id: `g-${name}-${idx}`,
    name,
    quantity:
      idx % 2 === 0
        ? `${randomIntFromSeed(`${seedBase}-${idx}`, 1, 3)} ${
            idx % 3 === 0 ? "tbsp" : "cups"
          }`
        : undefined,
  }));

  const spiceText =
    preferences.spiceLevel <= 2
      ? "gentle warmth"
      : preferences.spiceLevel <= 4
      ? "noticeable heat"
      : "fiery heat";

  const description = `A tactile, pantry-friendly ${cuisine.toLowerCase()}-inspired dish built around ${
    keyIngredients.slice(0, 2).join(" and ") || "simple staples"
  }, with ${spiceText} and a cozy, weeknight-friendly feel.`;

  const baseTags = ["AI-crafted", "weeknight", "one-bowl"];
  const cuisineTag = cuisine;
  const dietTags = dietary.map((d) => titleCase(d.replace("-", " ")));

  const tags = ensureUnique([...baseTags, cuisineTag, ...dietTags]);

  const dietaryStr = dietary.length
    ? `${dietary
        .map((d) => d.replace("-", " "))
        .join(", ")}`
    : "flexible";

  // dietaryStr is currently unused but kept for potential future UI use
  void dietaryStr;

  const instructions: string[] = [
    `Prep your ingredients: gather ${ingredients
      .slice(0, 4)
      .map((i) => i.name)
      .join(", ")}, plus any extras you love.`,
    "Warm a wide pan over medium heat with a slick of olive oil. Soften aromatics, then layer in your key ingredients so they caramelize at the edges.",
    `Deglaze the pan with a splash of stock, water, or wine, scraping up all the flavorful bits. Adjust seasoning with salt, acidity, and ${spiceText}.`,
    "Fold everything together until glossy and cohesive. If serving with grains or pasta, loosen with a little cooking water for a silky coating.",
    "Finish with something bright—lemon, herbs, or a drizzle of good oil—and serve immediately while the textures are still vivid.",
  ];

  const createdAt = now();

  const id = `gen-${
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (crypto as any).randomUUID()
      : Math.random().toString(36).slice(2)
  }`;

  const image =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>` +
        `<defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>` +
        `<stop offset='0' stop-color='#f9f5f0'/><stop offset='1' stop-color='#f1c3a5'/>` +
        `</linearGradient></defs>` +
        `<rect width='1200' height='800' fill='url(%23g)'/>` +
        `<text x='50%' y='46%' text-anchor='middle' fill='#3e2c23' font-family='serif' font-size='48'>${titleSeed}</text>` +
        `<text x='50%' y='58%' text-anchor='middle' fill='#7a5c4a' font-family='sans-serif' font-size='22'>AI-crafted ${cuisine} comfort</text>` +
        `</svg>`,
    );

  return {
    id,
    title: titleSeed || "Pantry Supper Bowl",
    description,
    image,
    cuisine,
    tags,
    dietary,
    prepTimeMinutes: prepTime,
    cookTimeMinutes: cookTime,
    servings,
    ingredients,
    instructions,
    createdAt,
    updatedAt: createdAt,
    isGenerated: true,
  };
};

// ---------- Context & Provider ----------

export interface AppContextValue {
  state: AppState;
  allRecipes: Recipe[];
  getRecipeById: (id: string) => Recipe | undefined;
  isFavorite: (id: string) => boolean;
  getRating: (id: string) => number;

  // actions
  generateRecipe: (query: string) => Promise<Recipe>;
  toggleFavorite: (id: string) => void;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  addRecentSearch: (query: string) => void;
  searchRecipes: (query: string) => Recipe[];
  filterByPreferences: (recipes: Recipe[]) => Recipe[];
  rateRecipe: (id: string, rating: number) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const fromStorage = safeStorage.get();
    if (!fromStorage) return defaultState;

    // Merge with defaults to avoid missing fields when we add new ones.
    return {
      ...defaultState,
      ...fromStorage,
      preferences: {
        ...defaultPreferences,
        ...(fromStorage.preferences || {}),
      },
      recipes:
        fromStorage.recipes && fromStorage.recipes.length > 0
          ? fromStorage.recipes
          : baseMockRecipes,
    };
  });

  // Persist on change (front-end mock only)
  useEffect(() => {
    safeStorage.set(state);
  }, [state]);

  const allRecipes = useMemo(() => deriveAllRecipes(state), [state]);

  const getRecipeById = useCallback(
    (id: string) => allRecipes.find((r) => r.id === id),
    [allRecipes],
  );

  const isFavorite = useCallback(
    (id: string) => state.favorites.includes(id),
    [state.favorites],
  );

  const getRating = useCallback(
    (id: string) => findRating(state.ratings, id),
    [state.ratings],
  );

  const setPreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...prefs,
      },
    }));
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    const normalized = normalizeQuery(query);
    if (!normalized) return;
    setState((prev) => {
      const updated = [normalized, ...prev.recentSearches.filter((q) => q !== normalized)];
      return {
        ...prev,
        recentSearches: updated.slice(0, 10),
      };
    });
  }, []);

  const filterByPreferences = useCallback(
    (recipes: Recipe[]): Recipe[] => {
      const { dietaryRestrictions, preferredCuisines, maxPrepTimeMinutes } = state.preferences;

      return recipes.filter((r) => {
        if (preferredCuisines.length && !preferredCuisines.includes(r.cuisine)) return false;

        if (maxPrepTimeMinutes && r.prepTimeMinutes > maxPrepTimeMinutes) return false;

        if (
          dietaryRestrictions.length &&
          !dietaryRestrictions.every((flag) => r.dietary.includes(flag))
        ) {
          return false;
        }

        return true;
      });
    },
    [state.preferences],
  );

  const searchRecipes = useCallback(
    (query: string): Recipe[] => {
      const q = normalizeQuery(query);
      if (!q) return filterByPreferences(allRecipes);

      const results = allRecipes.filter((recipe) => {
        const haystack = [
          recipe.title,
          recipe.description,
          recipe.cuisine,
          recipe.tags.join(" "),
          recipe.ingredients.map((i) => i.name).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });

      return filterByPreferences(results);
    },
    [allRecipes, filterByPreferences],
  );

  const generateRecipe = useCallback(
    async (query: string): Promise<Recipe> => {
      const trimmed = query.trim();
      const baseQuery = trimmed || "pantry supper";

      // simulate network latency (purely mocked)
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

      const recipe = buildGeneratedRecipe({ query: baseQuery, preferences: state.preferences });

      setState((prev) => ({
        ...prev,
        generatedRecipes: [recipe, ...prev.generatedRecipes],
      }));

      addRecentSearch(baseQuery);

      return recipe;
    },
    [state.preferences, addRecentSearch],
  );

  const toggleFavorite = useCallback((id: string) => {
    setState((prev) => {
      const isFav = prev.favorites.includes(id);
      return {
        ...prev,
        favorites: isFav
          ? prev.favorites.filter((f) => f !== id)
          : [...prev.favorites, id],
      };
    });
  }, []);

  const rateRecipe = useCallback((id: string, rating: number) => {
    const safeRating = Math.min(5, Math.max(1, Math.round(rating)));
    setState((prev) => {
      const existingIndex = prev.ratings.findIndex((r) => r.recipeId === id);
      const nextRatings = [...prev.ratings];
      if (existingIndex >= 0) {
        nextRatings[existingIndex] = { recipeId: id, rating: safeRating };
      } else {
        nextRatings.push({ recipeId: id, rating: safeRating });
      }
      return {
        ...prev,
        ratings: nextRatings,
      };
    });
  }, []);

  const resetState = useCallback(() => {
    setState(defaultState);
    safeStorage.clear();
  }, []);

  const value: AppContextValue = {
    state,
    allRecipes,
    getRecipeById,
    isFavorite,
    getRating,
    generateRecipe,
    toggleFavorite,
    setPreferences,
    addRecentSearch,
    searchRecipes,
    filterByPreferences,
    rateRecipe,
    resetState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
};

// ---------- Lightweight selectors for convenience ----------

export const useAllRecipes = (): Recipe[] => {
  const { allRecipes } = useApp();
  return allRecipes;
};

export const useFavorites = (): Recipe[] => {
  const { allRecipes, state } = useApp();
  return useMemo(
    () => allRecipes.filter((r) => state.favorites.includes(r.id)),
    [allRecipes, state.favorites],
  );
};

export const usePreferences = (): UserPreferences => {
  const {
    state: { preferences },
  } = useApp();
  return preferences;
};

export const useRecentSearches = (): string[] => {
  const {
    state: { recentSearches },
  } = useApp();
  return recentSearches;
};