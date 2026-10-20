import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, ArrowRight, Clock, Flame, Star } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@/components/ui/shadcn';
import type { Recipe, AppState } from '@/mock';

export interface HomePageProps {
  state: AppState;
  onOpenRecipe: (recipeId: string) => void;
  onToggleFavorite: (recipeId: string) => void;
}

const heroBackgroundUrl =
  'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=1920';

const carouselContainerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const heroTextVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const heroBadgeVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const featuredCardVariants = {
  rest: { y: 0, scale: 1, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.18)' },
  hover: {
    y: -6,
    scale: 1.01,
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.26)',
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: {
    x: '130%',
    transition: {
      duration: 1.4,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
};

function getFeaturedRecipes(recipes: Recipe[]): Recipe[] {
  const base = [...recipes].sort((a, b) => {
    const aScore = (a.isGenerated ? 1 : 0) + (a.tags.includes('saffron') ? 1 : 0);
    const bScore = (b.isGenerated ? 1 : 0) + (b.tags.includes('saffron') ? 1 : 0);
    if (aScore !== bScore) return bScore - aScore;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return base.slice(0, 4);
}

const HomePage: React.FC<HomePageProps> = ({ state, onOpenRecipe, onToggleFavorite }) => {
  const navigate = useNavigate();
  const featured = getFeaturedRecipes(state.recipes);

  return (
    <main className="w-full min-h-screen bg-[rgb(14,10,7)] text-[rgb(252,244,235)]">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[72vh] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: `url(${heroBackgroundUrl})`,
          }}
          aria-hidden="true"
        />
        {/* Warm overlay gradient limited to hero */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(17,12,8,0.96)] via-[rgba(17,12,8,0.86)] to-[rgba(104,66,38,0.78)]" />

        <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-20 flex flex-col gap-10">
          {/* Hero content */}
          <div className="max-w-3xl space-y-6">
            <motion.div
              variants={heroBadgeVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(249,240,231,0.26)] bg-[rgba(29,22,17,0.7)] px-4 py-1.5 backdrop-blur-sm"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(222,143,88)]/90 text-[rgb(28,17,12)]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium tracking-[0.14em] uppercase text-[rgb(245,230,214)]">
                100% frontend · Mock AI recipes
              </span>
            </motion.div>

            <motion.h1
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl leading-tight font-['Playfair_Display'] text-[rgb(253,244,234)] whitespace-normal break-words"
            >
              Saffron &amp; Sage is your warm, tactile recipe companion.
            </motion.h1>

            <motion.p
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.08 }}
              className="max-w-xl text-base sm:text-lg text-[rgb(246,229,214)]/95 leading-relaxed font-['Poppins']"
            >
              Browse richly photographed recipes, spin up playful mock “AI” dishes from whatever is in your pantry, and collect favorites that live right in your browser.
              No accounts, no backend – just cozy, client-side cooking inspiration.
            </motion.p>

            <motion.div
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.14 }}
              className="flex flex-wrap items-center gap-4 sm:gap-5"
            >
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full bg-[rgb(224,143,78)] px-6 sm:px-7 py-2.5 text-[rgb(33,17,9)] font-semibold text-sm sm:text-base shadow-md shadow-[rgba(0,0,0,0.32)] hover:bg-[rgb(233,153,90)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgb(241,190,135)] focus-visible:ring-offset-[rgb(25,18,13)] transition-colors"
                onClick={() => navigate('/generate')}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="h-4 w-4" aria-hidden="true" />
                  <span>Generate a pantry-friendly idea</span>
                </span>
                <motion.span
                  className="pointer-events-none absolute inset-y-0 left-[-30%] w-1/3 bg-gradient-to-r from-[rgba(255,255,255,0.38)]/80 via-transparent to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  aria-hidden="true"
                />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-[rgba(244,228,211,0.5)] bg-[rgba(24,19,14,0.7)] px-6 sm:px-7 py-2.5 text-[rgb(244,228,211)] text-sm sm:text-base hover:bg-[rgba(46,35,26,0.9)] hover:text-[rgb(255,246,237)]"
                onClick={() => navigate('/browse')}
              >
                <span className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  <span>Browse the cookbook</span>
                </span>
              </Button>
            </motion.div>

            <motion.div
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3 text-xs text-[rgb(237,218,197)]/90 font-['Poppins']"
              aria-label="Quick app highlights"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(32,23,17,0.85)] px-3 py-1 border border-[rgba(248,235,221,0.22)]">
                <Clock className="h-3.5 w-3.5 text-[rgb(238,182,124)]" aria-hidden="true" />
                <span>Weeknight-friendly recipes with clear timing</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(32,23,17,0.85)] px-3 py-1 border border-[rgba(248,235,221,0.22)]">
                <Flame className="h-3.5 w-3.5 text-[rgb(244,138,104)]" aria-hidden="true" />
                <span>Spice-aware suggestions, tuned to your mood</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(32,23,17,0.85)] px-3 py-1 border border-[rgba(248,235,221,0.22)]">
                <Star className="h-3.5 w-3.5 text-[rgb(245,204,120)]" aria-hidden="true" />
                <span>Favorites saved locally with every click</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED STRIP / CAROUSEL */}
      <section className="w-full bg-[rgb(20,14,10)]/98 border-t border-[rgba(246,228,209,0.08)] py-10 md:py-14">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[rgb(251,241,231)] whitespace-normal break-words">
                Tonight&apos;s featured table.
              </h2>
              <p className="max-w-xl text-sm sm:text-base text-[rgb(239,220,200)]/92 font-['Poppins'] leading-relaxed">
                A rotating peek at recipes that define Saffron &amp; Sage: golden breakfasts, sheet-pan suppers, and quietly celebratory desserts. Tap any card to slip into the full story.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-[rgb(233,209,184)] font-['Poppins']">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(37,25,18,0.9)] px-3 py-1 border border-[rgba(246,228,209,0.16)]">
                <span className="h-2 w-2 rounded-full bg-[rgb(224,143,78)]" aria-hidden="true" />
                Live mock data · frontend-only
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(37,25,18,0.9)] px-3 py-1 border border-[rgba(246,228,209,0.16)]">
                <span className="h-2 w-2 rounded-full bg-[rgb(238,182,124)]" aria-hidden="true" />
                Slides gently · framer-motion powered
              </span>
            </div>
          </div>

          <AnimatePresence>
            <motion.div
              variants={carouselContainerVariants}
              initial="hidden"
              animate="visible"
              className="relative -mx-3 md:mx-0 px-3 md:px-0"
            >
              <div className="flex gap-4 md:gap-5 overflow-x-auto pb-2 md:pb-1 scrollbar-thin scrollbar-thumb-[rgba(159,116,80,0.85)] scrollbar-track-[rgba(28,21,16,0.9)]">
                {featured.map((recipe) => {
                  const isFavorite = state.favorites.includes(recipe.id);
                  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

                  return (
                    <motion.div
                      key={recipe.id}
                      variants={featuredCardVariants}
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      className="min-w-[260px] max-w-[320px] md:min-w-[280px] md:max-w-[320px]"
                    >
                      <Card
                        className="h-full flex flex-col overflow-hidden bg-[rgba(29,21,16,0.98)] border-[rgba(248,235,221,0.18)] text-[rgb(251,241,231)] cursor-pointer"
                        onClick={() => onOpenRecipe(recipe.id)}
                        aria-label={`Open recipe: ${recipe.title}`}
                      >
                        <div className="relative h-44 w-full overflow-hidden">
                          <motion.img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="h-full w-full object-cover"
                            initial={{ scale: 1.05 }}
                            animate={{ scale: 1.02 }}
                            whileHover={{ scale: 1.06 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,10,7,0.95)] via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between gap-2">
                            <Badge className="rounded-full bg-[rgba(241,202,148,0.96)] text-[rgb(46,25,12)] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase">
                              {recipe.difficulty}
                            </Badge>
                            {recipe.isGenerated && (
                              <Badge className="rounded-full bg-[rgba(187,137,102,0.94)] text-[rgb(252,244,235)] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide">
                                Mock AI
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardHeader className="pb-2 pt-3">
                          <CardTitle className="text-base sm:text-lg font-['Playfair_Display'] whitespace-normal break-words">
                            {recipe.title}
                          </CardTitle>
                          <CardDescription className="mt-1 line-clamp-3 text-[12px] sm:text-[13px] text-[rgb(233,214,193)]">
                            {recipe.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3 flex-1 flex flex-col gap-3">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[rgb(234,213,189)]">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(43,31,22,0.9)] px-2 py-0.5 border border-[rgba(245,229,211,0.16)]">
                              <Clock className="h-3 w-3 text-[rgb(241,189,135)]" aria-hidden="true" />
                              <span>{totalTime} min</span>
                            </span>
                            {recipe.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-[rgba(31,23,18,0.96)] px-2 py-0.5 border border-[rgba(242,226,210,0.18)]"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-[rgb(222,143,88)] mr-1" aria-hidden="true" />
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full text-[rgb(246,230,214)] hover:bg-[rgba(246,230,214,0.12)]"
                              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(recipe.id);
                              }}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className={`h-4 w-4 ${
                                  isFavorite
                                    ? 'fill-[rgb(236,164,111)] stroke-[rgb(236,164,111)]'
                                    : 'fill-none stroke-[rgb(244,229,214)]'
                                }`}
                              >
                                <path
                                  d="M12.1 8.64 12 8.77l-.11-.13C10.14 6.6 7.1 6.24 5.28 8.05c-1.82 1.81-1.46 4.86.72 6.72L12 20l5.99-5.23c2.18-1.86 2.54-4.91.72-6.72-1.82-1.81-4.86-1.45-6.61 1.59z"
                                  strokeWidth={1.3}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full border-[rgba(246,228,209,0.55)] bg-[rgba(31,23,17,0.9)] text-[rgb(249,234,216)] hover:bg-[rgba(51,36,26,0.95)] px-3.5 py-1 text-[11px] flex items-center gap-1.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenRecipe(recipe.id);
                              }}
                            >
                              <span>Open recipe</span>
                              <ArrowRight className="h-3 w-3" aria-hidden="true" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* NOTE: All data and interactions on this page are powered by frontend-only mocks from src/mock.ts and persisted with localStorage. */}
    </main>
  );
};

export default HomePage;