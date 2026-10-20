import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";

import { getRecipeById } from "@/mock";
import RecipeDetail from "@/components/RecipeDetail";
import { Button } from "@/components/ui/shadcn";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const recipe = id ? getRecipeById(id) : undefined;

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/search");
    }
  };

  const accentBg = "bg-gradient-to-b from-stone-100 via-stone-50 to-stone-100 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900";

  return (
    <main className={`w-full min-h-screen ${accentBg} text-stone-900 dark:text-stone-50 pt-4 pb-16`}
      aria-label={recipe ? recipe.title : "Recipe details"}
    >
      <motion.div
        className="w-full max-w-[1600px] mx-auto px-6 lg:px-12"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        {/* Top meta bar / back links */}
        <div className="flex items-center justify-between gap-3 mb-6 mt-2">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              type="button"
              variant="ghost"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-stone-200/70 dark:border-stone-700/80 bg-white/70 dark:bg-stone-900/70 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium shadow-sm transition-colors"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div className="flex flex-col min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400 font-semibold">
                Recipe Studio
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Crafted in your in-browser test kitchen. 100% mock data, no real backend.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Link to="/search">
              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center gap-2 rounded-full border-stone-300 dark:border-stone-700 bg-white/70 dark:bg-stone-900/70 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs sm:text-sm"
              >
                <Search className="w-4 h-4" />
                <span>Browse recipes</span>
              </Button>
            </Link>
          </div>
        </div>

        {recipe ? (
          <RecipeDetail recipe={recipe} />
        ) : (
          <section className="w-full min-h-[60vh] flex flex-col justify-center">
            <div className="w-full max-w-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 rounded-3xl shadow-md px-6 sm:px-10 py-10 space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-['Playfair_Display'] text-stone-900 dark:text-stone-50 whitespace-normal break-words">
                This recipe wandered off the table
              </h1>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 whitespace-normal break-words">
                We couldn&apos;t find a recipe matching that link. It may have been removed from
                this mock collection or the URL might be slightly off. Because this experience
                is 100% frontend-only with mocked state, there&apos;s no backend to ask either.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  type="button"
                  onClick={handleBack}
                  className="rounded-full bg-amber-600 hover:bg-amber-700 text-white text-sm px-5 py-2.5 shadow-sm"
                >
                  Go back
                </Button>
                <Link to="/search">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-stone-300 dark:border-stone-700 text-sm px-5 py-2.5"
                  >
                    Explore recipes
                  </Button>
                </Link>
                <Link to="/">
                  <button
                    type="button"
                    className="text-sm font-medium text-amber-800 dark:text-amber-300 hover:underline underline-offset-4"
                  >
                    Back to home
                  </button>
                </Link>
              </div>
              <div className="pt-4 border-t border-dashed border-stone-200 dark:border-stone-700 text-xs text-stone-500 dark:text-stone-400 space-y-1">
                <p>
                  Technical note: recipes are stored in-memory with safe localStorage persistence
                  via <code className="px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-800">src/mock.ts</code>.
                </p>
                <p>
                  If you recently cleared your browser data, some generated recipes may no longer
                  exist in this mock environment.
                </p>
              </div>
            </div>
          </section>
        )}
      </motion.div>
    </main>
  );
};

export default RecipeDetailPage;