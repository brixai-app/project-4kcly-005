import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, SunMedium, Menu } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Switch,
  Sheet,
  SheetTrigger,
  SheetContent,
  Separator,
} from "@/components/ui/shadcn";
import { NAV_LINKS } from "@/routes";

// NOTE: Theme preference here is **purely frontend mock state**.
// It does NOT integrate with any global theming system by default.
// This app is 100% frontend-only; there is no backend or real auth.

const headerMotion = {
  initial: { y: -16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const navItemVariants = {
  rest: { opacity: 0.8, y: 0 },
  hover: { opacity: 1, y: -1 },
};

function useMockThemePreference() {
  const [isDark, setIsDark] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = window.localStorage.getItem("atelierai:theme");
      if (stored === "dark") return true;
      if (stored === "light") return false;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("atelierai:theme", isDark ? "dark" : "light");
    } catch {
      // ignore storage failures
    }
  }, [isDark]);

  const toggle = React.useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { isDark, toggle };
}

export const Header: React.FC = () => {
  const { pathname } = useLocation();
  const { isDark, toggle } = useMockThemePreference();

  const renderNavLink = (label: string, path: string, index: number) => (
    <motion.div
      key={path}
      variants={navItemVariants}
      initial="rest"
      whileHover="hover"
      transition={{ type: "tween", duration: 0.18 }}
      className="flex items-center"
    >
      <NavLink
        to={path}
        className={({ isActive }) =>
          [
            "relative px-2 text-sm tracking-wide uppercase transition-colors duration-150",
            "font-medium",
            "hover:text-neutral-900 dark:hover:text-neutral-50",
            isActive
              ? "text-neutral-900 dark:text-neutral-50"
              : "text-neutral-600 dark:text-neutral-300",
          ].join(" ")
        }
        aria-label={label}
      >
        <span className="pb-1 border-b border-transparent group-hover:border-neutral-800 dark:group-hover:border-neutral-200">
          {label}
        </span>
        <span
          className={[
            "pointer-events-none absolute -bottom-1 left-1/2 h-[1px] w-5 -translate-x-1/2 rounded-full",
            pathname === path
              ? "bg-neutral-900 dark:bg-neutral-100"
              : "bg-transparent",
          ].join(" ")}
        />
      </NavLink>
    </motion.div>
  );

  return (
    <motion.header
      {...headerMotion}
      transition={{ type: "spring", stiffness: 80, damping: 16 }}
      className="w-full sticky top-0 z-40 border-b border-neutral-200/70 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl"
    >
      <div className="w-full px-6 lg:px-12 py-4 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-2" aria-label="AtelierAI Recipes Home">
            <div className="h-9 w-9 rounded-full border border-neutral-300/70 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-[10px] tracking-[0.2em] uppercase text-neutral-700 dark:text-neutral-200">
              AI
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="text-lg leading-none font-semibold font-['Playfair_Display'] tracking-[0.22em] uppercase text-neutral-900 dark:text-neutral-50">
                AtelierAI
              </span>
              <span className="text-[10px] tracking-[0.32em] uppercase text-neutral-500 dark:text-neutral-400">
                Recipes Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((item, index) => renderNavLink(item.label, item.path, index))}
        </nav>

        {/* Right: Preferences & Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Mock Theme Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-neutral-200/80 dark:border-neutral-800/90 bg-neutral-50/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                aria-label="Open appearance preferences"
              >
                <motion.span
                  whileHover={{ rotate: 4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center"
                >
                  {isDark ? (
                    <Moon className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                  ) : (
                    <SunMedium className="h-4 w-4 text-neutral-800 dark:text-neutral-100" />
                  )}
                </motion.span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md"
            >
              <div className="px-2 py-1.5">
                <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 dark:text-neutral-400 mb-1">
                  Studio Preferences
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Theme is simulated locally and stored only in this browser.
                </p>
              </div>
              <Separator className="my-1 bg-neutral-200/70 dark:bg-neutral-800/80" />
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center justify-between py-2.5 cursor-default"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-neutral-800 dark:text-neutral-100">
                    Dark Studio Mode
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Mock toggle for visual exploration.
                  </span>
                </div>
                <Switch
                  checked={isDark}
                  onCheckedChange={toggle}
                  aria-label="Toggle dark studio mode (mock)"
                  className="ml-3"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Navigation Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 rounded-full border border-neutral-200/80 dark:border-neutral-800/90 bg-neutral-50/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[260px] border-l border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl px-5 py-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col -space-y-0.5">
                    <span className="text-sm font-semibold font-['Playfair_Display'] tracking-[0.22em] uppercase text-neutral-900 dark:text-neutral-50">
                      AtelierAI
                    </span>
                    <span className="text-[10px] tracking-[0.32em] uppercase text-neutral-500 dark:text-neutral-400">
                      Recipes Studio
                    </span>
                  </div>
                </div>
                <nav className="flex flex-col gap-3">
                  {NAV_LINKS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        [
                          "text-sm uppercase tracking-[0.22em] py-1.5 border-b",
                          "transition-colors duration-150",
                          isActive
                            ? "text-neutral-900 dark:text-neutral-50 border-neutral-900 dark:border-neutral-100"
                            : "text-neutral-600 dark:text-neutral-300 border-neutral-200/80 dark:border-neutral-800/80",
                        ].join(" ")
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-col gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                <p>All experiences are generated entirely in your browser using mock data.</p>
                <p>Favorites and theme preferences persist locally via localStorage.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;