// src/mock.ts
// Single source of truth for all mock data, types, and client-side state with localStorage.
// This is a 100% frontend-only mock; there is NO backend or real AI involved.

// IMPORTANT: UI components should import from this module directly for data & state helpers.

// We intentionally do not import React here to keep this file framework-agnostic.

// ---------- Types ----------

export type DietaryTag =
  | "vegan"
  | "vegetarian"
  | "gluten_free"
  | "dairy_free"
  | "nut_free"
  | "high_protein"
  | "low_carb";

export interface Ingredient {
  id: string;
  name: string;
  category:
    | "produce"
    | "protein"
    | "grain"
    | "dairy"
    | "spice"
    | "fat"
    | "sweetener"
    | "liquid";
  flavorProfile: ("bright" | "earthy" | "umami" | "fresh" | "smoky" | "sweet" | "bitter" | "rich")[];
}

export interface Cuisine {
  id: string;
  name: string;
  region: string;
  accentIngredients: string[]; // ingredient ids or names
}

export interface RecipeTemplateSection {
  title: string;
  steps: string[]; // Sentence fragments that we can remix
}

export interface RecipeTemplate {
  id: string;
  titlePattern: string; // e.g. "Silken {MAIN} with {ACCENT}"
  descriptionPattern: string; // Short editorial description
  suitableCuisines: string[]; // cuisine ids
  baseDietaryTags: DietaryTag[];
  emphasis: "minimalist" | "comfort" | "celebratory" | "weekday" | "brunch";
  sections: RecipeTemplateSection[];
}

export interface GeneratedRecipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cuisineId: string | null;
  dietaryTags: DietaryTag[];
  imageUrl?: string;
  createdAt: string; // ISO
  // source metadata to explain in About copy if needed
  templateId: string;
  sourceType: "generated";
}

export interface FavoriteRecipe extends GeneratedRecipe {
  favoritedAt: string; // ISO
}

export type Recipe = GeneratedRecipe | FavoriteRecipe;

export interface PlaceholderImage {
  id: string;
  url: string;
  credit?: string;
  orientation: "landscape" | "portrait";
}

export interface GenerateRecipeInput {
  ingredients: string[]; // user normalized ingredient names
  dietaryTags: DietaryTag[];
  cuisineId: string | null; // null => any
}

export type ActionStatus = "success" | "error";

export interface ActionResult<TPayload = unknown> {
  status: ActionStatus;
  message: string;
  payload?: TPayload;
}

// ---------- Local Storage Safe Wrapper ----------

const STORAGE_KEYS = {
  favorites: "atelierai:favorites:v1",
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

const safeStorage = {
  getItem(key: string): string | null {
    if (!isBrowser()) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore quota or privacy-mode failures
    }
  },
  removeItem(key: string): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

// ---------- Mock Data (In-Memory) ----------
// These datasets are carefully curated for an editorial, high-end culinary feel.

export const ingredients: Ingredient[] = [
  {
    id: "heirloom_tomato",
    name: "Heirloom tomato",
    category: "produce",
    flavorProfile: ["bright", "sweet"],
  },
  {
    id: "burrata",
    name: "Burrata",
    category: "dairy",
    flavorProfile: ["rich"],
  },
  {
    id: "sourdough",
    name: "Sourdough bread",
    category: "grain",
    flavorProfile: ["earthy"],
  },
  {
    id: "olive_oil",
    name: "Cold-pressed olive oil",
    category: "fat",
    flavorProfile: ["rich", "earthy"],
  },
  {
    id: "lemon_zest",
    name: "Lemon zest",
    category: "produce",
    flavorProfile: ["bright"],
  },
  {
    id: "basil",
    name: "Fresh basil",
    category: "produce",
    flavorProfile: ["fresh"],
  },
  {
    id: "chili_flake",
    name: "Calabrian chili flakes",
    category: "spice",
    flavorProfile: ["smoky", "bright"],
  },
  {
    id: "garlic",
    name: "Young garlic",
    category: "produce",
    flavorProfile: ["umami"],
  },
  {
    id: "wild_mushroom",
    name: "Wild mushrooms",
    category: "produce",
    flavorProfile: ["earthy", "umami"],
  },
  {
    id: "parmesan",
    name: "Aged Parmesan",
    category: "dairy",
    flavorProfile: ["umami", "rich"],
  },
  {
    id: "oat_milk",
    name: "Barista oat milk",
    category: "dairy",
    flavorProfile: ["sweet"],
  },
  {
    id: "vanilla_pod",
    name: "Madagascar vanilla pod",
    category: "sweetener",
    flavorProfile: ["sweet"],
  },
  {
    id: "espresso",
    name: "Freshly pulled espresso",
    category: "liquid",
    flavorProfile: ["bitter", "rich"],
  },
  {
    id: "almond_praline",
    name: "Almond praline",
    category: "sweetener",
    flavorProfile: ["sweet", "rich"],
  },
  {
    id: "seasonal_berries",
    name: "Seasonal berries",
    category: "produce",
    flavorProfile: ["bright", "sweet"],
  },
  {
    id: "tofu",
    name: "Silken tofu",
    category: "protein",
    flavorProfile: ["rich"],
  },
  {
    id: "chickpea",
    name: "Slow-cooked chickpeas",
    category: "protein",
    flavorProfile: ["earthy", "umami"],
  },
  {
    id: "quinoa",
    name: "Tri-colour quinoa",
    category: "grain",
    flavorProfile: ["earthy"],
  },
  {
    id: "labneh",
    name: "Labneh",
    category: "dairy",
    flavorProfile: ["rich", "bright"],
  },
  {
    id: "pistachio",
    name: "Roasted pistachios",
    category: "protein",
    flavorProfile: ["rich", "earthy"],
  },
];

export const cuisines: Cuisine[] = [
  {
    id: "mediterranean",
    name: "Mediterranean",
    region: "Coastal Europe & Levant",
    accentIngredients: ["olive_oil", "lemon_zest", "basil", "labneh"],
  },
  {
    id: "modern_european",
    name: "Modern European",
    region: "Europe",
    accentIngredients: ["wild_mushroom", "parmesan", "sourdough"],
  },
  {
    id: "plant_forward",
    name: "Plant-Forward",
    region: "Global",
    accentIngredients: ["tofu", "chickpea", "quinoa"],
  },
  {
    id: "espresso_bar",
    name: "Espresso Bar Dessert",
    region: "Global",
    accentIngredients: ["espresso", "almond_praline", "seasonal_berries", "vanilla_pod"],
  },
];

export const dietaryOptions: { id: DietaryTag; label: string; description?: string }[] = [
  { id: "vegan", label: "Vegan", description: "No animal products." },
  { id: "vegetarian", label: "Vegetarian", description: "No meat or fish." },
  { id: "gluten_free", label: "Gluten-Free", description: "Avoids gluten-containing grains." },
  { id: "dairy_free", label: "Dairy-Free", description: "Excludes dairy ingredients." },
  { id: "nut_free", label: "Nut-Free", description: "Free from tree nuts and peanuts." },
  { id: "high_protein", label: "High-Protein" },
  { id: "low_carb", label: "Low-Carb" },
];

export const placeholderImages: PlaceholderImage[] = [
  {
    id: "minimalist_table",
    url: "https://images.pexels.com/photos/5710173/pexels-photo-5710173.jpeg?auto=compress&cs=tinysrgb&w=1600",
    credit: "Pexels / Public Domain-esque placeholder",
    orientation: "landscape",
  },
  {
    id: "styled_plate",
    url: "https://images.pexels.com/photos/3218467/pexels-photo-3218467.jpeg?auto=compress&cs=tinysrgb&w=1600",
    credit: "Pexels / Styled plate",
    orientation: "landscape",
  },
  {
    id: "espresso_scene",
    url: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600",
    credit: "Pexels / Espresso cup",
    orientation: "portrait",
  },
  {
    id: "kitchen_overhead",
    url: "https://images.pexels.com/photos/4085266/pexels-photo-4085266.jpeg?auto=compress&cs=tinysrgb&w=1600",
    credit: "Pexels / Kitchen overhead",
    orientation: "landscape",
  },
];

export const templates: RecipeTemplate[] = [
  {
    id: "crudo_salad_minimalist",
    titlePattern: "Studio Salad of {MAIN} with {ACCENT}",
    descriptionPattern:
      "A restrained, gallery-worthy composition that layers {MAIN} with {ACCENT} and quiet textural contrast.",
    suitableCuisines: ["mediterranean", "modern_european"],
    baseDietaryTags: ["vegetarian"],
    emphasis: "minimalist",
    sections: [
      {
        title: "Prepare the produce",
        steps: [
          "Slice the {MAIN} into elegant, paper-thin rounds and arrange them in a loose spiral on a chilled plate.",
          "Season the {MAIN} with a whisper of flaky salt to coax out its natural sweetness.",
        ],
      },
      {
        title: "Build the dressing",
        steps: [
          "In a small bowl, whisk together {FAT}, a touch of {BRIGHT}, and a restrained pinch of {HEAT} until glossy.",
          "Taste and adjust the acidity so it feels lifted but not sharp.",
        ],
      },
      {
        title: "Assemble with intention",
        steps: [
          "Spoon the dressing over the {MAIN}, letting it pool naturally rather than coating every surface.",
          "Tuck in leaves of {HERB} and any thoughtfully chosen garnish, leaving negative space on the plate.",
        ],
      },
    ],
  },
  {
    id: "comfort_grain_bowl",
    titlePattern: "Warm Grain Bowl with {MAIN} & Fragrant {ACCENT}",
    descriptionPattern:
      "A softly comforting bowl built on grains, layered with {MAIN}, and finished with fragrant {ACCENT}.",
    suitableCuisines: ["plant_forward", "mediterranean"],
    baseDietaryTags: ["vegan", "high_protein"],
    emphasis: "comfort",
    sections: [
      {
        title: "Cook the base",
        steps: [
          "Simmer the grain of your choice until just tender, then steam off any excess moisture for a fluffy texture.",
          "Fold in a thread of {FAT} and a pinch of salt while still warm.",
        ],
      },
      {
        title: "Layer the proteins",
        steps: [
          "Tumble the {MAIN} over the grains, letting some pieces sink while others stay visible.",
          "Scatter in roasted or quickly sautéed vegetables for contrast.",
        ],
      },
      {
        title: "Finish with brightness",
        steps: [
          "Drizzle with a lively sauce built from {BRIGHT}, {HERB}, and a hint of {HEAT} if desired.",
          "Crown the bowl with crunchy elements that echo the {ACCENT} ingredient.",
        ],
      },
    ],
  },
  {
    id: "espresso_dessert_plate",
    titlePattern: "Plated Espresso Dessert with {MAIN} & {ACCENT}",
    descriptionPattern:
      "A composed dessert that frames {MAIN} with a refined espresso backbone and delicate {ACCENT}.",
    suitableCuisines: ["espresso_bar"],
    baseDietaryTags: ["vegetarian"],
    emphasis: "celebratory",
    sections: [
      {
        title: "Create the base",
        steps: [
          "Spread a gentle swoosh of cream or custard infused with {MAIN} across a cool, wide plate.",
          "Layer shards of crisp elements along one side to anchor the composition.",
        ],
      },
      {
        title: "Introduce espresso",
        steps: [
          "Pull a short, intense shot of {ESPRESSO} and cool it slightly.",
          "Drizzle or dot the espresso around the plate, keeping the center mostly untouched.",
        ],
      },
      {
        title: "Finish with detail",
        steps: [
          "Nestle fresh {ACCENT} fruit or nuts into the cream so they feel scattered but intentional.",
          "Dust with finely grated {AROMA} just before serving.",
        ],
      },
    ],
  },
];

// ---------- Utility Functions ----------

function randomOf<T>(items: T[]): T | null {
  if (!items.length) return null;
  const idx = Math.floor(Math.random() * items.length);
  return items[idx] ?? null;
}

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 12);
}

function normalizeIngredientName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function searchIngredients(query: string, limit = 8): Ingredient[] {
  const q = query.trim().toLowerCase();
  if (!q) return ingredients.slice(0, limit);
  const matches = ingredients.filter((ing) => ing.name.toLowerCase().includes(q));
  return matches.slice(0, limit);
}

// ---------- AI-Like Recipe Generation (Mocked, In-Memory) ----------
// This is a purely client-side, deterministic-ish remixing engine over templates & ingredients.

function pickTemplate(input: GenerateRecipeInput): RecipeTemplate {
  const byCuisine = input.cuisineId
    ? templates.filter((t) => t.suitableCuisines.includes(input.cuisineId!))
    : templates;
  const pool = byCuisine.length ? byCuisine : templates;

  const dietaryScore = (t: RecipeTemplate) =>
    input.dietaryTags.reduce((score, tag) => (t.baseDietaryTags.includes(tag) ? score + 1 : score), 0);

  const scored = pool
    .map((t) => ({ t, score: dietaryScore(t) + Math.random() * 0.3 }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.t ?? pool[0];
}

function buildTitle(template: RecipeTemplate, main: string, accent: string): string {
  return template.titlePattern
    .replace("{MAIN}", main)
    .replace("{ACCENT}", accent);
}

function buildDescription(template: RecipeTemplate, main: string, accent: string): string {
  return template.descriptionPattern
    .replace("{MAIN}", main.toLowerCase())
    .replace("{ACCENT}", accent.toLowerCase());
}

function chooseImageForCuisine(cuisineId: string | null): string | undefined {
  if (!cuisineId) return randomOf(placeholderImages)?.url ?? undefined;
  if (cuisineId === "espresso_bar") {
    const espressoImage = placeholderImages.find((img) => img.id === "espresso_scene");
    if (espressoImage) return espressoImage.url;
  }
  return randomOf(placeholderImages)?.url ?? undefined;
}

function deriveDietaryTags(
  template: RecipeTemplate,
  userTags: DietaryTag[],
): DietaryTag[] {
  const set = new Set<DietaryTag>([...template.baseDietaryTags, ...userTags]);
  return Array.from(set);
}

function hydrateSections(
  template: RecipeTemplate,
  normalizedIngredients: string[],
): string[] {
  const main = normalizedIngredients[0] || "seasonal produce";
  const accent = normalizedIngredients[1] || "herbs";

  const hasBright = normalizedIngredients.some((name) => name.includes("lemon") || name.includes("zest"));
  const hasHerb = normalizedIngredients.some((name) => name.includes("basil") || name.includes("herb"));
  const hasHeat = normalizedIngredients.some((name) => name.includes("chili") || name.includes("pepper"));

  const bright = hasBright ? "lemon" : "citrus";
  const herb = hasHerb ? "basil" : "soft herbs";
  const heat = hasHeat ? "chili" : "warm spice";

  const espresso = normalizedIngredients.find((n) => n.includes("espresso")) || "espresso";
  const aroma = normalizedIngredients.find((n) => n.includes("vanilla")) || "vanilla";

  const fat = normalizedIngredients.find((n) => n.includes("oil") || n.includes("butter")) || "good olive oil";

  const replaceTokens = (text: string): string =>
    text
      .replace("{MAIN}", main)
      .replace("{ACCENT}", accent)
      .replace("{BRIGHT}", bright)
      .replace("{HERB}", herb)
      .replace("{HEAT}", heat)
      .replace("{ESPRESSO}", espresso)
      .replace("{AROMA}", aroma)
      .replace("{FAT}", fat);

  const steps: string[] = [];
  template.sections.forEach((section) => {
    section.steps.forEach((step) => steps.push(replaceTokens(step)));
  });

  return steps;
}

function buildIngredientList(normalizedIngredients: string[]): string[] {
  if (!normalizedIngredients.length) {
    return [
      "Seasonal market vegetables, thinly sliced",
      "A cold-pressed, fruity olive oil",
      "Citrus for brightness",
      "Soft herbs to finish",
      "Flaky sea salt and freshly cracked pepper",
    ];
  }

  const pretty = normalizedIngredients.map((name) => {
    const base = name.split(" ").map((word) => (word.length > 3 ? word : word.toLowerCase())).join(" ");
    return base.charAt(0).toUpperCase() + base.slice(1);
  });

  if (!pretty.some((n) => n.toLowerCase().includes("olive"))) {
    pretty.push("A generous thread of cold-pressed olive oil");
  }

  return pretty;
}

export function generateRecipe(input: GenerateRecipeInput): ActionResult<GeneratedRecipe> {
  const normalized = Array.from(
    new Set(
      input.ingredients
        .map(normalizeIngredientName)
        .filter((n) => n.length > 0),
    ),
  );

  const template = pickTemplate(input);

  const mainName =
    normalized[0] ||
    ingredients.find((i) => i.category === "produce")?.name ||
    "seasonal produce";
  const accentName =
    normalized[1] ||
    ingredients.find((i) => i.category === "fat")?.name ||
    "good olive oil";

  const title = buildTitle(template, mainName, accentName);
  const description = buildDescription(template, mainName, accentName);
  const instructions = hydrateSections(template, normalized);
  const ingredientList = buildIngredientList(normalized);
  const imageUrl = chooseImageForCuisine(input.cuisineId);
  const dietaryTags = deriveDietaryTags(template, input.dietaryTags);

  const recipe: GeneratedRecipe = {
    id: randomId(),
    title,
    description,
    ingredients: ingredientList,
    instructions,
    cuisineId: input.cuisineId,
    dietaryTags,
    imageUrl,
    createdAt: new Date().toISOString(),
    templateId: template.id,
    sourceType: "generated",
  };

  return {
    status: "success",
    message: "Recipe composed in-browser using AtelierAI's mock engine.",
    payload: recipe,
  };
}

// ---------- Favorites State (Single In-Memory Store + LocalStorage) ----------

let favoritesState: FavoriteRecipe[] = [];

function loadFavoritesFromStorage(): FavoriteRecipe[] {
  const raw = safeStorage.getItem(STORAGE_KEYS.favorites);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as FavoriteRecipe[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((fav) => ({ ...fav }));
  } catch {
    return [];
  }
}

function persistFavorites() {
  try {
    safeStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favoritesState));
  } catch {
    // ignore
  }
}

// Initialize immediately in module scope (safe in browser-only app)
favoritesState = loadFavoritesFromStorage();

// ---------- Subscription Mechanism ----------

export type FavoritesSubscriber = (favorites: FavoriteRecipe[]) => void;

const subscribers = new Set<FavoritesSubscriber>();

function notifySubscribers() {
  const snapshot = favoritesState.map((f) => ({ ...f }));
  subscribers.forEach((fn) => {
    try {
      fn(snapshot);
    } catch {
      // ignore individual subscriber failures
    }
  });
}

export function subscribeToFavorites(subscriber: FavoritesSubscriber): () => void {
  subscribers.add(subscriber);
  subscriber(favoritesState.map((f) => ({ ...f })));
  return () => {
    subscribers.delete(subscriber);
  };
}

// ---------- Favorites Selectors & CRUD ----------

export function getFavoritesSnapshot(): FavoriteRecipe[] {
  return favoritesState.map((f) => ({ ...f }));
}

export function isRecipeFavorited(recipeId: string): boolean {
  return favoritesState.some((fav) => fav.id === recipeId);
}

export function saveFavorite(recipe: GeneratedRecipe): ActionResult<FavoriteRecipe> {
  if (isRecipeFavorited(recipe.id)) {
    const existing = favoritesState.find((f) => f.id === recipe.id)!;
    return {
      status: "error",
      message: "This recipe is already in your Atelier collection.",
      payload: existing,
    };
  }

  const favorite: FavoriteRecipe = {
    ...recipe,
    favoritedAt: new Date().toISOString(),
  };

  favoritesState = [favorite, ...favoritesState];
  persistFavorites();
  notifySubscribers();

  return {
    status: "success",
    message: "Saved to your local Atelier collection (mock, stored in this browser).",
    payload: favorite,
  };
}

export function removeFavorite(recipeId: string): ActionResult<{ id: string }> {
  const exists = favoritesState.some((fav) => fav.id === recipeId);
  if (!exists) {
    return {
      status: "error",
      message: "This recipe is not in your favorites.",
      payload: { id: recipeId },
    };
  }

  favoritesState = favoritesState.filter((fav) => fav.id !== recipeId);
  persistFavorites();
  notifySubscribers();

  return {
    status: "success",
    message: "Removed from your Atelier collection (local mock state).",
    payload: { id: recipeId },
  };
}

export function clearAllFavorites(): ActionResult<void> {
  favoritesState = [];
  persistFavorites();
  notifySubscribers();
  return {
    status: "success",
    message: "Cleared your local favorites. This only affects this browser.",
  };
}

// ---------- Convenience Helpers for UI ----------

export function getCuisineById(id: string | null | undefined): Cuisine | null {
  if (!id) return null;
  return cuisines.find((c) => c.id === id) ?? null;
}

export function getDietaryLabel(tag: DietaryTag): string {
  return dietaryOptions.find((d) => d.id === tag)?.label ?? tag;
}

export function getDietaryDescription(tag: DietaryTag): string | undefined {
  return dietaryOptions.find((d) => d.id === tag)?.description;
}

// ---------- Notes for Integrating UI ----------
// - All generation and favorites are MOCKED, in-memory operations.
// - Components should:
//   - Call generateRecipe(...) when user submits the generator form.
//   - Use the returned ActionResult to trigger Sonner toasts (success / error) in the UI layer.
//   - Call saveFavorite(...) and removeFavorite(...) from interaction handlers; again, surface
//     messages via toasts.
//   - Use subscribeToFavorites(...) in pages like FavoritesPage to stay reactive without a
//     dedicated store library or React context.
// - All persistence is via localStorage in this browser only; nothing ever touches a backend.