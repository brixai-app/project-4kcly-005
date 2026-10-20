import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search as SearchIcon } from "lucide-react";

import { useApp } from "@/mock";
import RecipeDetail from "@/components/RecipeDetail";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn";

/**
 * RecipePage
 *
 * Dedicated detailed recipe route: /recipe/:id
 *
 * 100% FRONTEND-ONLY MOCK IMPLEMENTATION – NO BACKEND.
 * Recipes are read from the mocked state in src/mock.ts (including
 * AI-generated recipes). Favorites, ratings, and preferences all
 * persist via localStorage purely on the client.
 */

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipeById } = useApp();

  const recipeId = id ?? "";
  const recipe = recipeId ? getRecipeById(recipeId) : undefined;

  const handleBack = () => {
    // Prefer going back in history; fallback to /search if no history.
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/search");
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen w-full bg-[#f9f5f0] text-[#3e2c23] flex flex-col">
        <div className="w-full flex-1 py-8 lg:py-12">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#7a5c4a] hover:text-[#d94f4f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d94f4f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f5f0] rounded-full px-4 py-2 border border-[#e1d6c7] bg-white/60 backdrop-blur-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <nav
                  aria-label="Breadcrumb"
                  className="flex flex-wrap items-center gap-2 text-sm text-[#7a5c4a]"
                >
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1 hover:text-[#d94f4f] transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                  <span className="text-[#b09a85]">/</span>
                  <Link
                    to="/search"
                    className="inline-flex items-center gap-1 hover:text-[#d94f4f] transition-colors"
                  >
                    <SearchIcon className="w-4 h-4" />
                    <span>Search</span>
                  </Link>
                  <span className="text-[#b09a85]">/</span>
                  <span className="font-medium">Recipe not found</span>
                </nav>
              </div>

              <Card className="border-[#e1d6c7] bg-white/80 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="font-['Playfair_Display'] text-2xl lg:text-3xl text-[#3e2c23] whitespace-normal break-words">
                    This recipe seems to have slipped off the board
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm lg:text-base text-[#5a4335]">
                  <p className="whitespace-normal break-words">
                    We couldn&apos;t find the recipe you were looking for. It may have been removed,
                    or the link might be slightly off.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Button
                      variant="default"
                      className="bg-[#d94f4f] hover:bg-[#c34444] text-white rounded-full px-5 py-2.5 text-sm font-medium shadow-sm transition-colors"
                      onClick={() => navigate("/")}
                    >
                      Back to Home
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#d94f4f] text-[#d94f4f] hover:bg-[#fbe9e9] rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
                      onClick={() => navigate("/search")}
                    >
                      Browse all recipes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f9f5f0] text-[#3e2c23] flex flex-col">
      <main className="w-full flex-1 py-6 lg:py-10">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6 lg:space-y-8"
          >
            {/* Breadcrumb + back control */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#7a5c4a] hover:text-[#d94f4f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d94f4f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f5f0] rounded-full px-4 py-2 border border-[#e1d6c7] bg-white/70 backdrop-blur-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-sm text-[#7a5c4a]"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 hover:text-[#d94f4f] transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <span className="text-[#b09a85]">/</span>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-1 hover:text-[#d94f4f] transition-colors"
                >
                  <SearchIcon className="w-4 h-4" />
                  <span>Search</span>
                </Link>
                <span className="text-[#b09a85]">/</span>
                <span className="font-medium whitespace-normal break-words">
                  {recipe.title}
                </span>
              </nav>
            </div>

            {/* Main detailed view */}
            <section aria-label={recipe.title} className="w-full">
              <RecipeDetail recipe={recipe} />
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default RecipePage;