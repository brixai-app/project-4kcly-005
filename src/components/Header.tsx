import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Utensils, Heart, Home, Moon, Sun } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });
  const toggle = React.useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  }, []);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);
  return [isDark, toggle];
}

function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, toggleDark] = useDarkMode();

  const navLinks = [
    {
      label: 'Home',
      to: '/',
      icon: <Home className="w-5 h-5 mr-2" />,
      match: (pathname: string) => pathname === '/',
    },
    {
      label: 'Favorites',
      to: '/favorites',
      icon: <Heart className="w-5 h-5 mr-2" />,
      match: (pathname: string) => pathname.startsWith('/favorites'),
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-slate-100 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          tabIndex={0}
          aria-label="AI Recipe Generator Home"
        >
          <div className="w-9 h-9 bg-emerald-500 dark:bg-emerald-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
            <Utensils className="text-white dark:text-emerald-950 w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-serif select-none">
            AI Recipe Generator
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-lg transition-colors duration-200 hover:text-emerald-600 dark:hover:text-emerald-400",
                link.match(location.pathname) && "text-emerald-600 dark:text-emerald-400 font-semibold"
              )}
              aria-current={link.match(location.pathname) ? "page" : undefined}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <Link
            to="#ingredient-form"
            className={cn(
              "px-4 py-2 bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white dark:text-white rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-sm border border-slate-900 dark:border-white/10 flex items-center gap-2"
            )}
          >
            <Utensils className="w-4 h-4" />
            Generate Recipe
          </Link>
          <button
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleDark}
            className={cn(
              "ml-2 rounded-xl p-2 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200 shadow-sm hover:scale-110 active:scale-95"
            )}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
        <div className="md:hidden flex items-center">
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="rounded-xl p-2 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200 shadow-sm hover:scale-110 active:scale-95"
              >
                <Menu className="w-6 h-6" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
              <Dialog.Content className="fixed top-0 right-0 h-full w-80 max-w-full z-50 bg-white dark:bg-zinc-950 border-l border-slate-100 dark:border-white/5 shadow-2xl flex flex-col p-0 focus:outline-none">
                <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100 dark:border-white/10">
                  <Link
                    to="/"
                    className="flex items-center gap-2"
                    tabIndex={0}
                    aria-label="AI Recipe Generator Home"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="w-9 h-9 bg-emerald-500 dark:bg-emerald-400 rounded-lg flex items-center justify-center shadow-lg">
                      <Utensils className="text-white dark:text-emerald-950 w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-serif select-none">
                      AI Recipe Generator
                    </span>
                  </Link>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="rounded-xl p-2 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200 shadow-sm hover:scale-110 active:scale-95"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </Dialog.Close>
                </div>
                <nav className="flex flex-col gap-2 px-6 py-6 text-base font-medium text-slate-700 dark:text-slate-200">
                  {navLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={cn(
                        "flex items-center gap-2 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600 dark:hover:text-emerald-400",
                        link.match(location.pathname) && "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                      )}
                      aria-current={link.match(location.pathname) ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="#ingredient-form"
                    className={cn(
                      "flex items-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white font-semibold shadow-sm border border-slate-900 dark:border-white/10 transition-all duration-300 hover:-translate-y-0.5 mt-2"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Utensils className="w-5 h-5" />
                    Generate Recipe
                  </Link>
                  <button
                    type="button"
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    onClick={() => {
                      toggleDark();
                      setMobileOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200 shadow-sm mt-2"
                    )}
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </button>
                </nav>
                <div className="mt-auto px-6 py-6 border-t border-slate-100 dark:border-white/10">
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    &copy; {new Date().getFullYear()} AI Recipe Generator
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}

export default Header;