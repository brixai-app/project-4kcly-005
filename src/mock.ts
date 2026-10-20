import { safeStorage } from '@/lib/utils';

// NOTE: This entire file is a frontend-only mock implementation.
// There is NO backend; all data, "AI" generation, and persistence
// are simulated in-memory with localStorage via safeStorage.

// -----------------------------
// Types
// -----------------------------

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Ingredient {
  name: string;
  quantity: string; // human readable, e.g. "2 tsp"
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: Difficulty;
  cuisine?: string;
  createdAt: string; // ISO string
  isGenerated?: boolean; // client-side mock AI flag
}

export interface UserPreferences {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  lowSpice: boolean;
  mediumSpice: boolean;
  highSpice: boolean;
  maxTotalTimeMinutes: number | null;
  favoriteTags: string[];
  preferredCuisines: string[];
}

export interface AppState {
  recipes: Recipe[];
  favorites: string[]; // recipe ids
  preferences: UserPreferences;
  lastGeneratedRecipeId: string | null;
}

// -----------------------------
// Constants & Helpers
// -----------------------------

const STORAGE_KEY = 'saffron_sage_app_state_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  dairyFree: false,
  lowSpice: true,
  mediumSpice: true,
  highSpice: false,
  maxTotalTimeMinutes: null,
  favoriteTags: [],
  preferredCuisines: [],
};

const nowIso = () => new Date().toISOString();

// Simple deterministic pseudo-random generator (Mulberry32)
function createSeededRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function stringToSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

const allUnique = <T,>(arr: T[]): T[] => Array.from(new Set(arr));

// -----------------------------
// Mock Initial Recipes
// -----------------------------

// These recipes are hand-crafted mocks with rich details.
const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'golden_morning_porridge',
    title: 'Golden Morning Cardamom Porridge',
    description:
      'A creamy oat porridge gently simmered with saffron, cardamom, and honey, topped with toasted pistachios and seasonal fruit.',
    imageUrl:
      'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ingredients: [
      { name: 'rolled oats', quantity: '1 cup' },
      { name: 'whole milk or oat milk', quantity: '2 1/4 cups' },
      { name: 'saffron threads', quantity: 'a pinch (about 8–10 threads)' },
      { name: 'ground cardamom', quantity: '1/2 tsp' },
      { name: 'honey or maple syrup', quantity: '2–3 tbsp, to taste' },
      { name: 'sea salt', quantity: 'a small pinch' },
      { name: 'pistachios, roughly chopped', quantity: '2 tbsp' },
      { name: 'fresh figs or berries', quantity: '1/2 cup, sliced' },
      { name: 'orange zest', quantity: '1/2 tsp (optional)' },
    ],
    instructions: [
      'Warm the milk in a small saucepan over low heat. Crush the saffron threads between your fingers and stir into the milk. Let infuse for 3–4 minutes until the milk turns a soft golden color.',
      'Add oats, cardamom, and a small pinch of sea salt to the pan. Increase heat to medium-low and bring to a gentle simmer, stirring frequently.',
      'Cook for 8–10 minutes until the oats are creamy and tender, adding a splash more milk if needed for a looser texture.',
      'Remove from heat and stir in honey or maple syrup to taste. Grate in the orange zest if using.',
      'Spoon the porridge into warm bowls. Top with chopped pistachios and sliced figs or berries.',
      'Serve immediately while steaming, adding an extra drizzle of honey just before serving for a glossy finish.',
    ],
    tags: ['breakfast', 'comforting', 'saffron', 'vegetarian'],
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    difficulty: 'easy',
    cuisine: 'Modern Middle Eastern',
    createdAt: nowIso(),
  },
  {
    id: 'roasted_tomato_sage_pasta',
    title: 'Slow-Roasted Tomato & Sage Butter Pasta',
    description:
      'Caramelized cherry tomatoes tossed with silky sage brown butter and al dente pasta for a weeknight-friendly yet luxurious bowl.',
    imageUrl:
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ingredients: [
      { name: 'cherry tomatoes', quantity: '3 cups, whole' },
      { name: 'olive oil', quantity: '3 tbsp' },
      { name: 'unsalted butter', quantity: '4 tbsp' },
      { name: 'fresh sage leaves', quantity: '8–10 leaves' },
      { name: 'garlic cloves', quantity: '3, thinly sliced' },
      { name: 'dried chili flakes', quantity: '1/4 tsp, optional' },
      { name: 'spaghetti or tagliatelle', quantity: '12 oz (340 g)' },
      { name: 'Parmesan cheese, finely grated', quantity: '1/2 cup, plus more to serve' },
      { name: 'salt & black pepper', quantity: 'to taste' },
    ],
    instructions: [
      'Preheat oven to 375°F (190°C). Toss cherry tomatoes with olive oil, salt, and pepper on a baking sheet. Roast for 25–30 minutes until blistered and jammy.',
      'Bring a large pot of generously salted water to a boil. Cook pasta until al dente, reserving 1 cup of the starchy cooking water.',
      'In a wide skillet, melt the butter over medium heat. Add sage leaves and cook until the butter foams and turns nutty golden, 3–4 minutes.',
      'Add sliced garlic and chili flakes to the browned butter, cooking just until fragrant and lightly golden. Remove sage leaves and set aside for garnish.',
      'Tip the roasted tomatoes and their juices into the skillet, gently crushing them with a spoon to create a glossy sauce.',
      'Transfer the drained pasta to the skillet with a splash of pasta water. Toss over low heat, sprinkling in Parmesan until a silky emulsion forms. Adjust seasoning.',
      'Serve immediately, topped with crispy sage leaves, extra Parmesan, and a twist of black pepper.',
    ],
    tags: ['dinner', 'pasta', 'sage', 'comforting'],
    prepTimeMinutes: 10,
    cookTimeMinutes: 30,
    difficulty: 'medium',
    cuisine: 'Italian-inspired',
    createdAt: nowIso(),
  },
  {
    id: 'citrus_herb_sheet_salmon',
    title: 'Citrus Herb Sheet Pan Salmon & Vegetables',
    description:
      'A one-pan salmon dinner with roasted citrus, fennel, and baby potatoes, finished with a bright herb oil.',
    imageUrl:
      'https://images.pexels.com/photos/3296273/pexels-photo-3296273.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ingredients: [
      { name: 'salmon fillets', quantity: '4 (about 5 oz / 140 g each)' },
      { name: 'baby potatoes', quantity: '1 lb (450 g), halved' },
      { name: 'fennel bulb', quantity: '1, cored and thinly sliced' },
      { name: 'lemon', quantity: '1, thinly sliced' },
      { name: 'orange', quantity: '1, thinly sliced' },
      { name: 'olive oil', quantity: '4 tbsp, divided' },
      { name: 'fresh dill', quantity: '2 tbsp, chopped' },
      { name: 'fresh parsley', quantity: '2 tbsp, chopped' },
      { name: 'garlic clove', quantity: '1, grated' },
      { name: 'sea salt & pepper', quantity: 'to taste' },
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). On a large sheet pan, toss potatoes and fennel with 2 tbsp olive oil, salt, and pepper. Roast for 15 minutes.',
      'Remove the pan and push the vegetables to the sides, creating space for the salmon fillets in the center.',
      'Pat salmon dry and place onto the pan. Season with salt and pepper, then layer lemon and orange slices over and around the fish.',
      'Return the pan to the oven and roast for 12–15 minutes, until the salmon is just opaque and flakes easily.',
      'In a small bowl, whisk together remaining 2 tbsp olive oil, chopped dill, parsley, and grated garlic.',
      'Drizzle the herb oil over the hot salmon and vegetables. Serve straight from the pan for a relaxed, communal feel.',
    ],
    tags: ['dinner', 'sheet pan', 'seafood', 'weeknight'],
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    difficulty: 'easy',
    cuisine: 'Mediterranean-inspired',
    createdAt: nowIso(),
  },
  {
    id: 'spiced_roast_vegetable_grain_bowl',
    title: 'Warm Spiced Roast Vegetable Grain Bowl',
    description:
      'Roasted seasonal vegetables tossed with fragrant spices over a bed of nutty grains, finished with tahini lemon drizzle.',
    imageUrl:
      'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ingredients: [
      { name: 'sweet potato', quantity: '1 large, cubed' },
      { name: 'cauliflower florets', quantity: '2 cups' },
      { name: 'chickpeas, drained & rinsed', quantity: '1 can (15 oz / 425 g)' },
      { name: 'olive oil', quantity: '3 tbsp' },
      { name: 'ground cumin', quantity: '1 tsp' },
      { name: 'smoked paprika', quantity: '1 tsp' },
      { name: 'ground coriander', quantity: '1/2 tsp' },
      { name: 'cooked farro or quinoa', quantity: '2 cups' },
      { name: 'baby spinach', quantity: '2 large handfuls' },
      { name: 'tahini', quantity: '3 tbsp' },
      { name: 'lemon juice', quantity: '2 tbsp' },
      { name: 'warm water', quantity: '2–3 tbsp, to loosen dressing' },
      { name: 'salt & pepper', quantity: 'to taste' },
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). Toss sweet potato, cauliflower, and chickpeas with olive oil, cumin, smoked paprika, coriander, salt, and pepper.',
      'Spread vegetables on a parchment-lined sheet pan and roast for 25–30 minutes, tossing once, until caramelized at the edges.',
      'In a bowl, whisk tahini, lemon juice, and a pinch of salt. Thin with warm water, 1 tbsp at a time, until pourable.',
      'Warm the cooked farro or quinoa and divide between bowls. Add a handful of baby spinach to each, allowing the grains to gently wilt the leaves.',
      'Top with the roasted vegetables and drizzle generously with tahini lemon dressing.',
      'Serve warm, with extra lemon wedges on the side.',
    ],
    tags: ['bowl', 'vegetarian', 'weeknight', 'meal prep'],
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    difficulty: 'easy',
    cuisine: 'Mediterranean-inspired',
    createdAt: nowIso(),
  },
  {
    id: 'chai_spiced_poached_pears',
    title: 'Chai-Spiced Poached Pears with Saffron Cream',
    description:
      'Tender pears gently poached in a chai-scented syrup and served over softly whipped saffron cream.',
    imageUrl:
      'https://images.pexels.com/photos/4110006/pexels-photo-4110006.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ingredients: [
      { name: 'firm pears', quantity: '4, peeled with stems intact' },
      { name: 'water', quantity: '3 cups' },
      { name: 'brown sugar', quantity: '1/2 cup' },
      { name: 'black tea bags', quantity: '2' },
      { name: 'cinnamon stick', quantity: '1' },
      { name: 'cardamom pods', quantity: '4, lightly crushed' },
      { name: 'fresh ginger', quantity: '4 slices' },
      { name: 'star anise', quantity: '1 whole' },
      { name: 'heavy cream or coconut cream', quantity: '1 cup, chilled' },
      { name: 'saffron threads', quantity: 'a pinch' },
      { name: 'vanilla extract', quantity: '1/2 tsp' },
    ],
    instructions: [
      'In a saucepan just large enough to hold the pears upright, combine water, brown sugar, cinnamon stick, cardamom pods, ginger, and star anise. Bring to a simmer, stirring to dissolve sugar.',
      'Add tea bags and simmer for 3 minutes, then remove the bags to prevent bitterness.',
      'Gently lower the peeled pears into the liquid. Cover with a round of parchment directly on the surface and poach at a bare simmer for 20–25 minutes, rotating occasionally, until tender.',
      'Meanwhile, lightly crush saffron threads and stir into the chilled cream. Add vanilla extract and whip until soft peaks form. Keep refrigerated.',
      'Allow the pears to cool slightly in the syrup. For a glossy finish, reduce some of the poaching liquid to a light syrup.',
      'Serve pears warm or at room temperature over a pillow of saffron cream, drizzled with the chai syrup.',
    ],
    tags: ['dessert', 'saffron', 'make-ahead', 'gluten-free'],
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    difficulty: 'medium',
    cuisine: 'Modern',
    createdAt: nowIso(),
  },
];

// -----------------------------
// Persistence Helpers (localStorage via safeStorage)
// -----------------------------

function loadState(): AppState | null {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || !Array.isArray(parsed.recipes) || !Array.isArray(parsed.favorites)) {
      return null;
    }
    // Basic defensive merge with defaults
    return {
      recipes: parsed.recipes.map((r) => ({ ...r })),
      favorites: [...parsed.favorites],
      preferences: { ...DEFAULT_PREFERENCES, ...(parsed.preferences || {}) },
      lastGeneratedRecipeId: parsed.lastGeneratedRecipeId ?? null,
    };
  } catch {
    return null;
  }
}

function saveState(state: AppState): void {
  try {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore write errors (e.g. private mode)
  }
}

export function resetState(): AppState {
  const state = getInitialState();
  saveState(state);
  return state;
}

// -----------------------------
// Initial / Hydrated State
// -----------------------------

export function getInitialState(): AppState {
  return {
    recipes: INITIAL_RECIPES.map((r) => ({ ...r })),
    favorites: [],
    preferences: { ...DEFAULT_PREFERENCES },
    lastGeneratedRecipeId: null,
  };
}

export function hydrateState(): AppState {
  const loaded = loadState();
  if (loaded) {
    return loaded;
  }
  const initial = getInitialState();
  saveState(initial);
  return initial;
}

// -----------------------------
// Core State Operations (pure functions)
// These all return a NEW state object; caller is responsible
// for persisting via saveState if desired.
// -----------------------------

export function upsertPreferences(
  state: AppState,
  partial: Partial<UserPreferences>,
): AppState {
  const next: AppState = {
    ...state,
    preferences: {
      ...state.preferences,
      ...partial,
    },
  };
  saveState(next);
  return next;
}

export function toggleFavorite(state: AppState, recipeId: string): AppState {
  const exists = state.favorites.includes(recipeId);
  const favorites = exists
    ? state.favorites.filter((id) => id !== recipeId)
    : [...state.favorites, recipeId];

  const next: AppState = { ...state, favorites };
  saveState(next);
  return next;
}

export function removeFavorite(state: AppState, recipeId: string): AppState {
  if (!state.favorites.includes(recipeId)) return state;
  const favorites = state.favorites.filter((id) => id !== recipeId);
  const next: AppState = { ...state, favorites };
  saveState(next);
  return next;
}

export function addRecipe(state: AppState, recipe: Omit<Recipe, 'id' | 'createdAt'>): AppState {
  const id = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `recipe_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const full: Recipe = {
    ...recipe,
    id,
    createdAt: nowIso(),
  };
  const next: AppState = {
    ...state,
    recipes: [full, ...state.recipes],
    lastGeneratedRecipeId: state.lastGeneratedRecipeId,
  };
  saveState(next);
  return next;
}

// -----------------------------
// Mock AI Recipe Generation
// -----------------------------

export interface GenerateInput {
  ingredients: string[]; // plain strings from user input
  mood?: string;
  notes?: string;
}

export function generateRecipeFromIngredients(
  state: AppState,
  input: GenerateInput,
  prefs: UserPreferences,
): { state: AppState; recipe: Recipe } {
  const baseText = `${input.ingredients.sort().join(',')}|${input.mood ?? ''}|${
    input.notes ?? ''
  }|${prefs.vegetarian ? 'veg' : ''}|${prefs.vegan ? 'vgn' : ''}|${
    prefs.glutenFree ? 'gf' : ''
  }|${prefs.highSpice ? 'hot' : prefs.lowSpice ? 'mild' : 'balanced'}`;

  const seed = stringToSeed(baseText);
  const rng = createSeededRng(seed);

  const titleAdjectives = [
    'Warm',
    'Sunlit',
    'Harbor',
    'Garden',
    'Twilight',
    'Silk',
    'Ember',
    'Weekend',
  ];

  const titleNouns = [
    'Skillet',
    'Tangle',
    'Bowl',
    'Toast',
    'Pilaf',
    'Salad',
    'Stew',
    'Flatbread',
  ];

  const chosenIngredient =
    input.ingredients[Math.floor(rng() * input.ingredients.length)] || 'pantry';

  const adjective = titleAdjectives[Math.floor(rng() * titleAdjectives.length)];
  const noun = titleNouns[Math.floor(rng() * titleNouns.length)];

  const title = `${adjective} ${chosenIngredient.replace(/\b\w/g, (c) => c.toUpperCase())} ${noun}`;

  const spiceTag = prefs.highSpice
    ? 'spicy'
    : prefs.lowSpice
    ? 'gentle'
    : 'balanced';
  const dietTags: string[] = [];
  if (prefs.vegan) dietTags.push('vegan');
  else if (prefs.vegetarian) dietTags.push('vegetarian');
  if (prefs.glutenFree) dietTags.push('gluten-free');
  if (prefs.dairyFree) dietTags.push('dairy-free');

  const baseTags: string[] = ['weeknight', 'mock-ai', spiceTag, ...dietTags];

  if (input.mood?.toLowerCase().includes('comfort')) baseTags.push('comforting');
  if (input.mood?.toLowerCase().includes('light')) baseTags.push('fresh');

  const prepTimeCandidates = [10, 15, 20, 25];
  const cookTimeCandidates = [10, 15, 20, 30];
  let prepTime = prepTimeCandidates[Math.floor(rng() * prepTimeCandidates.length)];
  let cookTime = cookTimeCandidates[Math.floor(rng() * cookTimeCandidates.length)];

  const maxTotal = prefs.maxTotalTimeMinutes;
  if (maxTotal && prepTime + cookTime > maxTotal) {
    const scale = maxTotal / (prepTime + cookTime);
    prepTime = Math.max(5, Math.round(prepTime * scale));
    cookTime = Math.max(5, Math.round(cookTime * scale));
  }

  const difficulty: Difficulty = ((): Difficulty => {
    const total = prepTime + cookTime;
    if (total <= 20) return 'easy';
    if (total <= 40) return 'medium';
    return 'hard';
  })();

  const ingredients: Ingredient[] = input.ingredients.map((name) => ({
    name: name.trim(),
    quantity: rng() > 0.5 ? '1 cup' : 'to taste',
  }));

  if (ingredients.length === 0) {
    ingredients.push({ name: 'olive oil', quantity: '2 tbsp' });
    ingredients.push({ name: 'sea salt', quantity: 'to taste' });
  }

  // Build simple step-by-step mock instructions
  const instructions: string[] = [];
  instructions.push(
    'Gather and prepare all of your ingredients, slicing and measuring before you begin so the cooking feels unhurried.',
  );
  if (ingredients.length > 0) {
    instructions.push(
      `Warm a wide skillet over medium heat with a drizzle of olive oil. Add the ${
        ingredients[0].name
      } and cook until fragrant and just beginning to soften.`,
    );
  }
  instructions.push(
    'Layer in the remaining ingredients in stages, adjusting the heat as needed so nothing scorches. Season thoughtfully as you go.',
  );
  instructions.push(
    `Simmer or roast gently until the flavors feel cohesive and the texture is to your liking, about ${cookTime} minutes.`,
  );
  instructions.push(
    'Taste and adjust with acid (lemon, vinegar), salt, and a whisper of sweetness if needed. Serve in warm bowls with a relaxed, lived-in table setting.',
  );

  const descriptionParts: string[] = [];
  descriptionParts.push(
    'A softly improvised recipe tailored from what you have on hand, leaning into pantry ease and cozy, tactile cooking.',
  );
  if (input.mood) {
    descriptionParts.push(`Mood cue: ${input.mood.trim()}.`);
  }
  if (input.notes) {
    descriptionParts.push(`Notes from you: ${input.notes.trim()}.`);
  }

  const description = descriptionParts.join(' ');

  const id = `generated_${stringToSeed(title + Date.now().toString())}_${Math.floor(
    rng() * 10000,
  )}`;

  // lightly reuse one of the existing images to keep things visually coherent
  const referenceImage = INITIAL_RECIPES[
    Math.floor(rng() * INITIAL_RECIPES.length)
  ]?.imageUrl;

  const cuisineFromPrefs = prefs.preferredCuisines[0];

  const recipe: Recipe = {
    id,
    title,
    description,
    imageUrl:
      referenceImage ||
      'https://images.pexels.com/photos/6287524/pexels-photo-6287524.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ingredients,
    instructions,
    tags: allUnique(baseTags),
    prepTimeMinutes: prepTime,
    cookTimeMinutes: cookTime,
    difficulty,
    cuisine: cuisineFromPrefs || 'Intuitive Home Cooking',
    createdAt: nowIso(),
    isGenerated: true,
  };

  const nextState: AppState = {
    ...state,
    recipes: [recipe, ...state.recipes],
    lastGeneratedRecipeId: recipe.id,
  };

  saveState(nextState);

  return { state: nextState, recipe };
}

// -----------------------------
// Search & Filter Helpers
// -----------------------------

export interface BrowseFilters {
  query?: string;
  tags?: string[];
  difficulty?: Difficulty | 'all';
  maxPrepTimeMinutes?: number | null;
}

export function matchesQuery(recipe: Recipe, query?: string): boolean {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    recipe.title,
    recipe.description,
    recipe.cuisine || '',
    ...recipe.tags,
    ...recipe.ingredients.map((i) => i.name),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export function filterByTags(recipe: Recipe, tags?: string[]): boolean {
  if (!tags || tags.length === 0) return true;
  const tagSet = new Set(recipe.tags.map((t) => t.toLowerCase()));
  return tags.every((tag) => tagSet.has(tag.toLowerCase()));
}

export function filterByDifficulty(
  recipe: Recipe,
  difficulty?: Difficulty | 'all',
): boolean {
  if (!difficulty || difficulty === 'all') return true;
  return recipe.difficulty === difficulty;
}

export function filterByPrepTime(
  recipe: Recipe,
  maxPrepTimeMinutes?: number | null,
): boolean {
  if (!maxPrepTimeMinutes || maxPrepTimeMinutes <= 0) return true;
  return recipe.prepTimeMinutes <= maxPrepTimeMinutes;
}

export function applyBrowseFilters(
  recipes: Recipe[],
  filters: BrowseFilters,
): Recipe[] {
  const { query, tags, difficulty, maxPrepTimeMinutes } = filters;
  return recipes.filter((recipe) => {
    if (!matchesQuery(recipe, query)) return false;
    if (!filterByTags(recipe, tags)) return false;
    if (!filterByDifficulty(recipe, difficulty)) return false;
    if (!filterByPrepTime(recipe, maxPrepTimeMinutes)) return false;
    return true;
  });
}

// -----------------------------
// Pagination Helper
// -----------------------------

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export function paginateRecipes(
  recipes: Recipe[],
  page: number,
  pageSize: number,
): PaginatedResult<Recipe> {
  const safePageSize = Math.max(1, pageSize);
  const totalItems = recipes.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const start = (clampedPage - 1) * safePageSize;
  const end = start + safePageSize;
  const items = recipes.slice(start, end);

  return {
    items,
    page: clampedPage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
  };
}

// -----------------------------
// Convenience Selectors
// -----------------------------

export function getRecipeById(state: AppState, id: string | null | undefined): Recipe | undefined {
  if (!id) return undefined;
  return state.recipes.find((r) => r.id === id);
}

export function getFavoriteRecipes(state: AppState): Recipe[] {
  const favoriteSet = new Set(state.favorites);
  return state.recipes.filter((r) => favoriteSet.has(r.id));
}

export function getAllTags(state: AppState): string[] {
  const tags = state.recipes.flatMap((r) => r.tags);
  return allUnique(tags).sort((a, b) => a.localeCompare(b));
}

export function getAllIngredientsCatalog(state: AppState): string[] {
  const names = state.recipes.flatMap((r) => r.ingredients.map((i) => i.name));
  return allUnique(names).sort((a, b) => a.localeCompare(b));
}

export function getAllCuisines(state: AppState): string[] {
  const cuisines = state.recipes
    .map((r) => r.cuisine)
    .filter((c): c is string => Boolean(c));
  return allUnique(cuisines).sort((a, b) => a.localeCompare(b));
}

// -----------------------------
// Summary (for developer reference only)
// -----------------------------
// This file provides a complete frontend-only mock data layer with:
// - typed models (Ingredient, Recipe, UserPreferences, AppState)
// - rich initial recipes
// - localStorage persistence (safeStorage)
// - pure state operations (favorites, preferences, add, generate)
// - deterministic mock "AI" recipe generation
// - helpers for search, filtering, pagination, and basic selectors.