import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Utensils, Star, Heart, BookOpen, Flame, Leaf, Users, Clock, ArrowRight } from 'lucide-react';
import IngredientInput from '../components/IngredientInput';
import { cn } from '@/lib/utils';

function Home() {
  const navigate = useNavigate();

  // Mock feature data for bento grid
  const features = [
    {
      icon: <Utensils className="w-6 h-6 text-emerald-400" />,
      title: 'AI-Powered Recipes',
      desc: 'Get creative, chef-level recipes instantly, tailored to your ingredients and dietary needs.',
      accent: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      icon: <Star className="w-6 h-6 text-amber-400" />,
      title: 'Save Your Favorites',
      desc: 'Bookmark and manage your favorite recipes with a single click. No duplicates, always accessible.',
      accent: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      icon: <Heart className="w-6 h-6 text-pink-400" />,
      title: 'Personalized Suggestions',
      desc: 'Smart recommendations based on your taste, history, and what’s in your kitchen.',
      accent: 'bg-pink-50 dark:bg-pink-900/20',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-violet-400" />,
      title: 'Step-by-Step Guidance',
      desc: 'Clear, beautifully formatted instructions for every skill level, with timing and tips.',
      accent: 'bg-violet-50 dark:bg-violet-900/20',
    },
    {
      icon: <Flame className="w-6 h-6 text-red-400" />,
      title: 'Quick & Easy Meals',
      desc: 'Generate recipes that fit your schedule—weeknight dinners, 15-min lunches, and more.',
      accent: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      icon: <Leaf className="w-6 h-6 text-lime-400" />,
      title: 'Dietary Filters',
      desc: 'Vegan, gluten-free, keto, and more—just select your preferences and go.',
      accent: 'bg-lime-50 dark:bg-lime-900/20',
    },
    {
      icon: <Users className="w-6 h-6 text-sky-400" />,
      title: 'Share with Friends',
      desc: 'Send your creations or favorites to friends and family with a single click.',
      accent: 'bg-sky-50 dark:bg-sky-900/20',
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-400" />,
      title: 'Meal Planning',
      desc: 'Plan ahead with AI-generated meal plans and shopping lists.',
      accent: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  return (
    <div>
      
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 bg-slate-50 dark:bg-zinc-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-2xl relative" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)', WebkitBackdropFilter: 'blur(24px)', backdropFilter: 'blur(24px)'}}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-7"
          >

            <h1 className={cn(
              "text-4xl md:text-6xl font-extrabold tracking-tighter font-serif text-slate-900 dark:text-white leading-tight"
            )}>
              Discover <span className="text-emerald-500 dark:text-emerald-400">delicious recipes</span> from what you have
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg">
              Enter your ingredients and let our AI chef create unique, mouthwatering recipes just for you. Save your favorites, share with friends, and cook smarter every day.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="#ingredient-form"
                className={cn(
                  "px-6 py-3 bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 shadow-lg flex items-center gap-2 border border-slate-900 dark:border-white/10"
                )}
              >
                Start Cooking <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/favorites"
                className={cn(
                  "px-6 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5"
                )}
              >
                View Favorites
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video lg:aspect-square bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-2xl p-4 overflow-hidden flex items-center justify-center"
          >
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
              alt="Fresh ingredients on a kitchen counter"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-80"
              crossOrigin="anonymous"
              draggable={false}
            />
            <div className="relative z-10 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-emerald-500/90 rounded-xl flex items-center justify-center shadow-lg">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <span className="text-lg font-semibold text-white drop-shadow-lg tracking-tight">AI Chef at Work</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl pointer-events-none" />
          </motion.div>
        </div>
      </section>

      
      <section
        id="ingredient-form"
        className="relative z-20 flex justify-center pt-20 pb-20 lg:pb-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-xl w-full bg-gradient-to-br from-red-50 via-white to-rose-100 dark:from-red-500 dark:via-red-700 dark:to-red-700 rounded-2xl shadow-xl border border-red-200 dark:border-red-400/40 px-8 py-10 flex flex-col items-center relative"
        >
          <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-slate-900 dark:text-white mb-2">
            What ingredients do you have?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base mb-6 text-center max-w-md">
            Type or paste your available ingredients below. Our AI will generate a custom recipe for you!
          </p>
          <IngredientInput
            onRecipeGenerated={id => {
              if (id) navigate(`/recipe/${id}`);
            }}
          />
        </motion.div>
      </section>

      
      <section className="py-24 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
              Why AI Recipe Generator?
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Unlock a smarter, more delightful way to cook at home. Our premium AI-powered platform helps you create, save, and share recipes with ease.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className={cn(
                  "flex flex-col items-start gap-3 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-slate-50 dark:bg-zinc-900",
                  f.accent
                )}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-1 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 shadow">
                  {f.icon}
                </div>
                <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{f.title}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;