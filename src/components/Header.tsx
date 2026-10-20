import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, User, Bookmark, Settings2, Trash2 } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/shadcn";

import { usePreferences, useSavedRecipeIds, clearAllData } from "@/mock";

// NOTE: This app is 100% frontend-only. All user, recipe, and preference data
// are mocked in src/mock.ts with localStorage persistence – there is no backend.

interface HeaderProps {
  className?: string;
}

const navItems = [
  { label: "Home", path: "/" },
  { label: "Search", path: "/search" },
  { label: "Profile", path: "/profile" },
];

const headerVariants = {
  hidden: { y: -24, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Header: React.FC<HeaderProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preferences = usePreferences();
  const savedRecipeIds = useSavedRecipeIds();

  const savedCount = savedRecipeIds.length;

  const handlePreferencesShortcut = () => {
    navigate("/profile#preferences");
  };

  const handleSavedShortcut = () => {
    navigate("/profile#saved");
  };

  const handleClearLocalData = () => {
    clearAllData();
  };

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b border-neutral-200/70 bg-[rgba(250,248,244,0.92)] backdrop-blur-md dark:border-neutral-800 dark:bg-[rgba(20,17,14,0.9)]"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-6 lg:px-12">
        {/* Left: Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/90 text-amber-50 shadow-sm">
            <span className="text-lg font-semibold">AI</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-['Playfair_Display'] text-base font-semibold tracking-tight text-neutral-900 dark:text-amber-50">
              AI Recipe Generator
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              Everyday magic in your kitchen
            </span>
          </div>
        </NavLink>

        {/* Center: Primary Nav (desktop) */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const active = isActivePath(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "relative text-sm font-medium tracking-wide transition-colors",
                    "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-amber-100",
                    (isActive || active) ? "text-neutral-900 dark:text-amber-50" : "",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <span className="group inline-flex flex-col items-center gap-1">
                    <span>{item.label}</span>
                    <span
                      className={`h-[2px] w-0 rounded-full bg-amber-500 transition-[width,background-color] duration-200 ease-out group-hover:w-6 ${
                        isActive || active ? "w-6" : ""
                      }`}
                    />
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Profile menu + mobile overflow */}
        <div className="flex items-center gap-2.5">
          {/* Saved count indicator (desktop) */}
          <div className="hidden items-center rounded-full border border-amber-200/70 bg-amber-50/80 px-3 py-1 text-xs font-medium text-amber-800 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-50 md:inline-flex">
            <Bookmark className="mr-1 h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Saved: {savedCount}</span>
          </div>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full border border-neutral-200/80 bg-neutral-50/80 p-0 shadow-sm transition-colors hover:border-amber-400 hover:bg-amber-50/70 dark:border-neutral-700 dark:bg-neutral-900/60 dark:hover:border-amber-500/70 dark:hover:bg-neutral-900"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage alt={preferences.name} />
                  <AvatarFallback
                    className="text-xs font-semibold text-neutral-900 dark:text-amber-50"
                    style={{ backgroundColor: preferences.avatarColor }}
                  >
                    {preferences.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              sideOffset={8}
              align="end"
              className="w-60 border border-neutral-200/70 bg-neutral-50/95 text-neutral-900 shadow-lg backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 dark:text-neutral-50"
            >
              <div className="flex items-center gap-3 px-3 pb-2 pt-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-neutral-900 dark:text-amber-50" style={{ backgroundColor: preferences.avatarColor }}>
                  {preferences.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">{preferences.name}</span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    Mock profile (local only)
                  </span>
                </div>
              </div>

              <div className="px-3 pb-1 pt-1 text-[11px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                Kitchen shortcuts
              </div>

              <DropdownMenuItem
                onSelect={handleSavedShortcut}
                className="flex items-center gap-2.5 text-sm text-neutral-800 focus:bg-amber-50/80 dark:text-neutral-100 dark:focus:bg-neutral-800/80"
              >
                <Bookmark className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <div className="flex flex-1 items-center justify-between gap-2">
                  <span>Saved recipes</span>
                  <span className="rounded-full bg-amber-100 px-2 py-[2px] text-[10px] font-semibold tracking-wide text-amber-800 dark:bg-amber-500/25 dark:text-amber-200">
                    {savedCount}
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={handlePreferencesShortcut}
                className="flex items-center gap-2.5 text-sm text-neutral-800 focus:bg-amber-50/80 dark:text-neutral-100 dark:focus:bg-neutral-800/80"
              >
                <Settings2 className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                <span>Preferences</span>
              </DropdownMenuItem>

              <div className="px-3 pb-1 pt-2 text-[11px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                Data
              </div>

              <DropdownMenuItem
                onSelect={handleClearLocalData}
                className="flex items-center gap-2.5 text-sm text-red-700 focus:bg-red-50/90 dark:text-red-300 dark:focus:bg-red-950/60"
              >
                <Trash2 className="h-4 w-4" />
                <div className="flex flex-col">
                  <span>Clear local data</span>
                  <span className="text-[11px] text-red-500/80 dark:text-red-400/80">
                    Resets all recipes, saves & preferences
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu indicator (placeholder for potential future expansion) */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200/80 bg-neutral-50/90 text-neutral-700 shadow-sm transition-colors hover:border-amber-400 hover:bg-amber-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-200 dark:hover:border-amber-500/70 dark:hover:bg-neutral-900 md:hidden"
            aria-label="Navigation shortcuts"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;