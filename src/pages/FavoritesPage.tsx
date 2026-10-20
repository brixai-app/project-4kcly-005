import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartCrack, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui/shadcn";

import {
  FavoriteRecipe,
  subscribeToFavorites,
  clearAllFavorites,
  removeFavorite,
} from "@/mock";

import { FavoritesMasonry } from "@/components/FavoritesMasonry";

// NOTE: This page is 100% frontend-only and uses the mocked, in-browser state from src/mock.ts.
// All favorites and mutations persist only to this browser via localStorage.

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to the single mock favorites store.
    const unsubscribe = subscribeToFavorites((next) => {
      setFavorites(next);
    });
    return unsubscribe;
  }, []);

  const handleClearAll = () => {
    if (!favorites.length || isClearing) return;
    setIsClearing(true);
    const result = clearAllFavorites();
    toast[result.status === "success" ? "success" : "error"](result.message);
    setIsClearing(false);
  };

  const handleRemove = (id: string) => {
    const result = removeFavorite(id);
    toast[result.status === "success" ? "success" : "error"](result.message);
  };

  const hasFavorites = favorites.length > 0;

  return (
    <div className="min-h-screen w-full bg-[#f5f1ea] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 flex flex-col">
      {/* Top band / intro */}
      <section className="w-full border-b border-neutral-200/70 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-14 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="inline-flex items-center gap-2 text-xs tracking-[0.22em] uppercase text-neutral-500 dark:text-neutral-400"
              >
                <span className="h-px w-8 bg-neutral-400/70 dark:bg-neutral-600/70" />
                Atelier Collection
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
                className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight font-serif"
              >
                Curated recipes, held quietly in this browser.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
                className="text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-xl"
              >
                Favorites in AtelierAI Recipes are entirely local &mdash; a private, in-browser collection
                composed by the mock generation engine in <span className="italic">src/mock.ts</span> and
                preserved via localStorage. There is no backend, only your current device.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button
                asChild
                variant="outline"
                className="rounded-full border-neutral-300/80 bg-white/70 text-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900 transition-colors duration-200 text-xs sm:text-sm px-4 py-2"
              >
                <Link to="/generate" className="inline-flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate another recipe
                </Link>
              </Button>

              {hasFavorites && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className="rounded-full border border-transparent text-xs sm:text-sm text-neutral-600 hover:text-neutral-900 hover:border-neutral-400/80 bg-transparent dark:text-neutral-300 dark:hover:text-neutral-50 dark:hover:border-neutral-600/80 px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="inline-flex items-center gap-2">
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear all favorites
                  </span>
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content section */}
      <main className="flex-1 w-full">
        <section className="w-full py-10 lg:py-14">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <Separator className="bg-neutral-200/80 dark:bg-neutral-800/80" />
            </motion.div>

            {!hasFavorites ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
                className="w-full flex justify-center"
              >
                <Card className="w-full md:w-3/4 xl:w-2/3 bg-white/80 dark:bg-neutral-900/80 border-neutral-200/80 dark:border-neutral-800/80 shadow-sm rounded-3xl overflow-hidden">
                  <div className="grid md:grid-cols-[2fr,3fr]">
                    <div className="relative hidden md:block">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage:
                            "url('https://images.pexels.com/photos/4085266/pexels-photo-4085266.jpeg?auto=compress&cs=tinysrgb&w=1600')",
                        }}
                      />
                      <div className="relative h-full w-full bg-gradient-to-r from-[#f5f1ea] via-[#f5f1ea]/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/90" />
                    </div>

                    <CardContent className="p-7 sm:p-9 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-9 w-9 rounded-full border border-neutral-300/80 dark:border-neutral-700/80 flex items-center justify-center">
                          <HeartCrack className="h-4.5 w-4.5 text-neutral-500 dark:text-neutral-400" />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-base sm:text-lg font-serif tracking-tight">
                            Your Atelier is quietly empty.
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                            Start by composing a dish with the mock AI generator, then mark it as a favorite to
                            keep it here, locally, in this browser.
                          </CardDescription>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 mb-6">
                        AtelierAI Recipes never touches a server. All generation logic runs against curated
                        templates and ingredients in <span className="font-mono text-[0.7rem]">src/mock.ts</span>,
                        and favorites are tucked into <span className="font-mono text-[0.7rem]">localStorage</span>.
                        Clearing your browser or switching devices will reset this gallery.
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          type="button"
                          onClick={() => navigate("/generate")}
                          className="rounded-full bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 text-xs sm:text-sm px-4 sm:px-5 py-2 transition-colors duration-200"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5" />
                            Compose a first recipe
                          </span>
                        </Button>

                        <span className="text-[0.7rem] sm:text-xs text-neutral-500 dark:text-neutral-500">
                          No sign-in, no sync &mdash; this is a deliberate, local-only mock experience.
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-sm font-medium tracking-[0.22em] uppercase text-neutral-500 dark:text-neutral-400">
                      Saved compositions
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      {favorites.length === 1
                        ? "One recipe living in this browser."
                        : `${favorites.length.toString().padStart(2, "0")} locally-favorited recipes in your Atelier.`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[0.7rem] sm:text-xs text-neutral-500 dark:text-neutral-500">
                    <span className="h-px w-10 bg-neutral-300/80 dark:bg-neutral-700/80" />
                    <span>
                      Generated by a purely mocked engine &mdash; nothing leaves this window.
                    </span>
                  </div>
                </div>

                <FavoritesMasonry
                  favorites={favorites}
                  onRemove={handleRemove}
                />
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FavoritesPage;