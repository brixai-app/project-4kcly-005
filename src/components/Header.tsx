import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Heart, Menu, Sparkles, UtensilsCrossed } from 'lucide-react';
import {
  Button,
  Sheet,
  SheetTrigger,
  SheetContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Separator,
  Switch,
  Slider,
  Badge,
} from '@/components/ui/shadcn';
import type { UserPreferences } from '@/mock';

// NOTE: This header works entirely on the frontend and expects
// preference state to be managed by the parent (e.g., App.tsx)
// using the mocked data layer in src/mock.ts. There is NO backend.

export interface HeaderProps {
  preferences: UserPreferences;
  favoritesCount: number;
  onPreferencesChange: (partial: Partial<UserPreferences>) => void;
}

const navLinkBaseClasses =
  'relative inline-flex items-center text-sm lg:text-[15px] font-medium tracking-wide px-3 py-2 rounded-full border border-transparent text-amber-900/80 dark:text-amber-50/80 hover:text-amber-950 dark:hover:text-amber-50 transition-colors duration-150';

const activeNavClasses =
  'bg-amber-100/80 dark:bg-amber-900/60 border-amber-300/80 dark:border-amber-500/60 shadow-sm';

const inactiveNavClasses = 'hover:bg-amber-50/70 dark:hover:bg-amber-900/30';

const Header: React.FC<HeaderProps> = ({
  preferences,
  favoritesCount,
  onPreferencesChange,
}) => {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleToggle = (key: keyof UserPreferences) => (checked: boolean) => {
    onPreferencesChange({ [key]: checked });
  };

  const handleSpiceChange = (values: number[]) => {
    const value = values[0] ?? 1;
    const lowSpice = value <= 1.33;
    const mediumSpice = value > 0.66 && value < 2.33;
    const highSpice = value >= 1.66;
    onPreferencesChange({ lowSpice, mediumSpice, highSpice });
  };

  const currentSpiceValue = React.useMemo(() => {
    if (preferences.highSpice) return 2.5;
    if (preferences.mediumSpice) return 1.5;
    return 0.5;
  }, [preferences.highSpice, preferences.mediumSpice]);

  const spiceLabel = React.useMemo(() => {
    if (preferences.highSpice) return 'Bold heat';
    if (preferences.mediumSpice) return 'Gentle warmth';
    return 'Soft & mild';
  }, [preferences.highSpice, preferences.mediumSpice]);

  const totalTimeLabel = React.useMemo(() => {
    if (!preferences.maxTotalTimeMinutes) return 'Any length';
    if (preferences.maxTotalTimeMinutes <= 20) return 'Quick bites (≤20 min)';
    if (preferences.maxTotalTimeMinutes <= 35) return 'Unrushed weeknights (≤35 min)';
    return 'Lingering evenings (≤60 min)';
  }, [preferences.maxTotalTimeMinutes]);

  const handleTimePreset = (minutes: number | null) => {
    onPreferencesChange({ maxTotalTimeMinutes: minutes });
  };

  const handleCuisineSelect = (cuisine: string) => {
    const exists = preferences.preferredCuisines.includes(cuisine);
    const preferredCuisines = exists
      ? preferences.preferredCuisines.filter((c) => c !== cuisine)
      : [...preferences.preferredCuisines, cuisine];
    onPreferencesChange({ preferredCuisines });
  };

  const navMotionProps = {
    whileHover: { y: -1, scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  } as const;

  const favoriteBadgeColor =
    'bg-rose-500 text-rose-50 dark:bg-rose-400 dark:text-rose-950';

  return (
    <header className="w-full px-6 lg:px-12 py-3 lg:py-4 border-b border-amber-200/70 dark:border-amber-900/70 bg-gradient-to-b from-amber-50/90 via-amber-50/95 to-amber-100/90 dark:from-zinc-950 dark:via-zinc-950/95 dark:to-amber-950/40 backdrop-blur-sm sticky top-0 z-40">
      <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex items-center justify-center h-10 w-10 rounded-2xl bg-amber-500/90 dark:bg-amber-500 shadow-md shadow-amber-500/30 border border-amber-300/80 dark:border-amber-400/80"
          >
            <Flame className="h-5 w-5 text-amber-50" aria-hidden="true" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-base lg:text-lg font-semibold tracking-[0.16em] uppercase text-amber-900 dark:text-amber-50">
              Saffron & Sage
            </span>
            <span className="text-[11px] lg:text-xs text-amber-900/70 dark:text-amber-100/70">
              A warm, tactile recipe companion
            </span>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center justify-center gap-2 lg:gap-3 flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/60 dark:bg-zinc-900/80 px-1.5 py-1 border border-amber-200/70 dark:border-amber-800/80 shadow-sm"
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                [
                  navLinkBaseClasses,
                  isActive ? activeNavClasses : inactiveNavClasses,
                ].join(' ')
              }
              aria-label="Home"
            >
              {({ isActive }) => (
                <motion.span
                  {...navMotionProps}
                  className="flex items-center gap-1.5"
                >
                  <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
                  <span>Home</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  )}
                </motion.span>
              )}
            </NavLink>

            <NavLink
              to="/browse"
              className={({ isActive }) =>
                [
                  navLinkBaseClasses,
                  isActive ? activeNavClasses : inactiveNavClasses,
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <motion.span
                  {...navMotionProps}
                  className="flex items-center gap-1.5"
                >
                  <span>Browse recipes</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  )}
                </motion.span>
              )}
            </NavLink>

            <NavLink
              to="/generate"
              className={({ isActive }) =>
                [
                  navLinkBaseClasses,
                  isActive ? activeNavClasses : inactiveNavClasses,
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <motion.span
                  {...navMotionProps}
                  className="flex items-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <span>Generate</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  )}
                </motion.span>
              )}
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                [
                  navLinkBaseClasses,
                  isActive ? activeNavClasses : inactiveNavClasses,
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <motion.span
                  {...navMotionProps}
                  className="flex items-center gap-1.5"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  <span>Favorites</span>
                  {favoritesCount > 0 && (
                    <Badge
                      className={`${favoriteBadgeColor} ml-1 px-1.5 py-0 text-[11px] font-semibold`}
                      aria-label={`${favoritesCount} favorite recipes`}
                    >
                      {favoritesCount}
                    </Badge>
                  )}
                  {isActive && favoritesCount === 0 && (
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  )}
                </motion.span>
              )}
            </NavLink>
          </motion.div>
        </nav>

        {/* Right actions: preferences + favorites summary + mobile */}
        <div className="flex items-center justify-end gap-2 lg:gap-3 min-w-0">
          {/* Compact favorites pill on small screens */}
          <div className="flex md:hidden items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/favorites" aria-label="View favorites">
                  {({ isActive }) => (
                    <motion.button
                      type="button"
                      {...navMotionProps}
                      className={`relative inline-flex items-center justify-center h-9 w-9 rounded-full border text-rose-600 dark:text-rose-200 border-rose-200/70 dark:border-rose-500/60 bg-white/80 dark:bg-zinc-900/80 shadow-sm ${
                        isActive ? 'ring-2 ring-rose-400/70' : ''
                      }`}
                    >
                      <Heart className="h-4 w-4" aria-hidden="true" />
                      {favoritesCount > 0 && (
                        <span
                          className={`ml-0.5 text-[10px] font-semibold leading-none ${favoriteBadgeColor} rounded-full px-1.5 py-0.5`}
                          aria-hidden="true"
                        >
                          {favoritesCount}
                        </span>
                      )}
                    </motion.button>
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="bottom">Favorites</TooltipContent>
            </Tooltip>
          </div>

          {/* Preferences controls */}
          <div className="hidden sm:flex items-center gap-1.5 lg:gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3 rounded-full border border-amber-200/80 dark:border-amber-800/80 bg-white/50 dark:bg-zinc-900/70 text-amber-900/80 dark:text-amber-50/80 hover:bg-amber-100/70 dark:hover:bg-amber-900/60 flex items-center gap-1.5 text-xs lg:text-sm"
                    >
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500/90 mr-0.5" />
                      <span>Dietary</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 bg-amber-50/95 dark:bg-zinc-950/95 border-amber-200/80 dark:border-amber-800/80"
                  >
                    <div className="px-2.5 pt-2 pb-1.5">
                      <p className="text-xs font-semibold tracking-wide text-amber-900 dark:text-amber-50 uppercase">
                        Everyday defaults
                      </p>
                      <p className="text-[11px] text-amber-900/70 dark:text-amber-100/70 mt-0.5">
                        Nudge the generator toward how you actually eat.
                      </p>
                    </div>
                    <Separator className="bg-amber-200/80 dark:bg-amber-800/80" />
                    <DropdownMenuItem asChild>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between gap-2 py-2"
                        onClick={() =>
                          handleToggle('vegetarian')(!preferences.vegetarian)
                        }
                      >
                        <span className="flex flex-col items-start">
                          <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                            Mostly vegetarian
                          </span>
                          <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                            Plant-forward plates by default.
                          </span>
                        </span>
                        <Switch
                          checked={preferences.vegetarian}
                          onCheckedChange={handleToggle('vegetarian')}
                          aria-label="Toggle mostly vegetarian"
                        />
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between gap-2 py-2"
                        onClick={() => handleToggle('vegan')(!preferences.vegan)}
                      >
                        <span className="flex flex-col items-start">
                          <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                            Fully plant-based
                          </span>
                          <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                            Nudge out dairy and eggs.
                          </span>
                        </span>
                        <Switch
                          checked={preferences.vegan}
                          onCheckedChange={handleToggle('vegan')}
                          aria-label="Toggle fully plant-based"
                        />
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between gap-2 py-2"
                        onClick={() =>
                          handleToggle('glutenFree')(!preferences.glutenFree)
                        }
                      >
                        <span className="flex flex-col items-start">
                          <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                            Gluten free leaning
                          </span>
                          <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                            Favor grains that love you back.
                          </span>
                        </span>
                        <Switch
                          checked={preferences.glutenFree}
                          onCheckedChange={handleToggle('glutenFree')}
                          aria-label="Toggle gluten free leaning"
                        />
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between gap-2 py-2"
                        onClick={() =>
                          handleToggle('dairyFree')(!preferences.dairyFree)
                        }
                      >
                        <span className="flex flex-col items-start">
                          <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                            Gentle on dairy
                          </span>
                          <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                            Lighter on cream and cheese.
                          </span>
                        </span>
                        <Switch
                          checked={preferences.dairyFree}
                          onCheckedChange={handleToggle('dairyFree')}
                          aria-label="Toggle gentle on dairy"
                        />
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="bottom">Diet preferences</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 rounded-full border-amber-200/90 dark:border-amber-800/80 bg-white/60 dark:bg-zinc-900/70 text-amber-900/80 dark:text-amber-50/80 hover:bg-amber-100/70 dark:hover:bg-amber-900/60 text-xs lg:text-sm flex items-center gap-1.5"
                  onClick={() => setIsSheetOpen(true)}
                >
                  <span className="inline-flex h-1.5 w-4 rounded-full bg-gradient-to-r from-amber-300 via-rose-300 to-emerald-300" />
                  <span className="hidden lg:inline">Spice & time</span>
                  <span className="lg:hidden">Spice</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Open cooking mood panel</TooltipContent>
            </Tooltip>
          </div>

          {/* Mobile menu */}
          <div className="flex md:hidden items-center">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-amber-200/80 dark:border-amber-800/80 bg-white/70 dark:bg-zinc-900/80 text-amber-900/80 dark:text-amber-50/80 hover:bg-amber-100/70 dark:hover:bg-amber-900/60"
                  aria-label="Open navigation and preferences"
                >
                  <Menu className="h-4 w-4" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[320px] sm:w-[360px] bg-amber-50/95 dark:bg-zinc-950/95 border-l border-amber-200/80 dark:border-amber-800/80 flex flex-col gap-4"
              >
                <div className="pt-4 pb-1 flex flex-col gap-1">
                  <p className="text-sm font-semibold tracking-[0.18em] uppercase text-amber-900 dark:text-amber-50">
                    Saffron & Sage
                  </p>
                  <p className="text-xs text-amber-900/80 dark:text-amber-100/80">
                    Tuck favorite recipes and generation settings into your pocket.
                  </p>
                </div>

                <Separator className="bg-amber-200/80 dark:bg-amber-800/80" />

                <nav className="flex flex-col gap-1.5" aria-label="Primary">
                  <NavLink
                    to="/"
                    onClick={() => setIsSheetOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl border text-sm ${
                        isActive
                          ? 'border-amber-400 bg-amber-100/90 text-amber-950'
                          : 'border-transparent bg-white/70 dark:bg-zinc-900/80 text-amber-900/90 dark:text-amber-50/90 hover:bg-amber-100/80 dark:hover:bg-amber-900/70'
                      }`
                  }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
                          <span>Home</span>
                        </span>
                        {isActive && (
                          <span className="text-[11px] text-amber-800 dark:text-amber-200">
                            Current
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>

                  <NavLink
                    to="/browse"
                    onClick={() => setIsSheetOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl border text-sm ${
                        isActive
                          ? 'border-amber-400 bg-amber-100/90 text-amber-950'
                          : 'border-transparent bg-white/70 dark:bg-zinc-900/80 text-amber-900/90 dark:text-amber-50/90 hover:bg-amber-100/80 dark:hover:bg-amber-900/70'
                      }`
                  }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-2">
                          <span>Browse recipes</span>
                        </span>
                        {isActive && (
                          <span className="text-[11px] text-amber-800 dark:text-amber-200">
                            Current
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>

                  <NavLink
                    to="/generate"
                    onClick={() => setIsSheetOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl border text-sm ${
                        isActive
                          ? 'border-amber-500 bg-amber-100/95 text-amber-950'
                          : 'border-transparent bg-white/70 dark:bg-zinc-900/80 text-amber-900/90 dark:text-amber-50/90 hover:bg-amber-100/80 dark:hover:bg-amber-900/70'
                      }`
                  }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" aria-hidden="true" />
                          <span>Generate</span>
                        </span>
                        {isActive && (
                          <span className="text-[11px] text-amber-800 dark:text-amber-200">
                            Current
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>

                  <NavLink
                    to="/favorites"
                    onClick={() => setIsSheetOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl border text-sm ${
                        isActive
                          ? 'border-rose-400 bg-rose-50/95 text-rose-900'
                          : 'border-transparent bg-white/70 dark:bg-zinc-900/80 text-rose-700 dark:text-rose-200 hover:bg-rose-50/90 dark:hover:bg-rose-900/40'
                      }`
                  }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-2">
                          <Heart className="h-4 w-4" aria-hidden="true" />
                          <span>Favorites</span>
                        </span>
                        {favoritesCount > 0 && (
                          <span
                            className={`ml-2 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${favoriteBadgeColor}`}
                            aria-label={`${favoritesCount} favorite recipes`}
                          >
                            {favoritesCount}
                          </span>
                        )}
                        {isActive && favoritesCount === 0 && (
                          <span className="text-[11px] text-rose-700 dark:text-rose-200">
                            Current
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </nav>

                <Separator className="bg-amber-200/80 dark:bg-amber-800/80 my-3" />

                {/* Preferences in sheet */}
                <div className="flex flex-col gap-3 pb-4">
                  <div className="flex items-center justify-between w-full">
                    <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-amber-900 dark:text-amber-50">
                      Preferences
                    </h2>
                    <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                      Just for this browser
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                          Mostly vegetarian
                        </span>
                        <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                          Favor plant-forward ideas.
                        </span>
                      </div>
                      <Switch
                        checked={preferences.vegetarian}
                        onCheckedChange={handleToggle('vegetarian')}
                        aria-label="Toggle mostly vegetarian"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                          Fully plant-based
                        </span>
                        <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                          Hide dairy-heavy ideas.
                        </span>
                      </div>
                      <Switch
                        checked={preferences.vegan}
                        onCheckedChange={handleToggle('vegan')}
                        aria-label="Toggle fully plant-based"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                          Gluten gentle
                        </span>
                        <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                          Prefer naturally GF grains.
                        </span>
                      </div>
                      <Switch
                        checked={preferences.glutenFree}
                        onCheckedChange={handleToggle('glutenFree')}
                        aria-label="Toggle gluten gentle"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                          Lighter on dairy
                        </span>
                        <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                          Ease up on cream & cheese.
                        </span>
                      </div>
                      <Switch
                        checked={preferences.dairyFree}
                        onCheckedChange={handleToggle('dairyFree')}
                        aria-label="Toggle lighter on dairy"
                      />
                    </div>
                  </div>

                  <Separator className="bg-amber-200/80 dark:bg-amber-800/80" />

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                        Spice comfort
                      </span>
                      <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                        {spiceLabel}
                      </span>
                    </div>
                    <Slider
                      value={[currentSpiceValue]}
                      min={0}
                      max={2.5}
                      step={0.5}
                      onValueChange={handleSpiceChange}
                      aria-label="Preferred spice level"
                      className="mt-0.5"
                    />
                    <div className="flex justify-between text-[11px] text-amber-900/70 dark:text-amber-100/70">
                      <span>Soft</span>
                      <span>Balanced</span>
                      <span>Fiery</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                        Time on a weeknight
                      </span>
                      <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                        {totalTimeLabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTimePreset(null)}
                        className={`text-[11px] px-3 py-1 rounded-full border transition-colors duration-150 flex items-center gap-1 ${
                          preferences.maxTotalTimeMinutes === null
                            ? 'border-amber-500 bg-amber-100/80 text-amber-950'
                            : 'border-amber-200/80 bg-white/70 text-amber-900/80 hover:bg-amber-100/70'
                        }`}
                      >
                        Any
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTimePreset(20)}
                        className={`text-[11px] px-3 py-1 rounded-full border transition-colors duration-150 flex items-center gap-1 ${
                          preferences.maxTotalTimeMinutes === 20
                            ? 'border-amber-500 bg-amber-100/80 text-amber-950'
                            : 'border-amber-200/80 bg-white/70 text-amber-900/80 hover:bg-amber-100/70'
                        }`}
                      >
                        ≤20 min
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTimePreset(35)}
                        className={`text-[11px] px-3 py-1 rounded-full border transition-colors duration-150 flex items-center gap-1 ${
                          preferences.maxTotalTimeMinutes === 35
                            ? 'border-amber-500 bg-amber-100/80 text-amber-950'
                            : 'border-amber-200/80 bg-white/70 text-amber-900/80 hover:bg-amber-100/70'
                        }`}
                      >
                        ≤35 min
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTimePreset(60)}
                        className={`text-[11px] px-3 py-1 rounded-full border transition-colors duration-150 flex items-center gap-1 ${
                          preferences.maxTotalTimeMinutes === 60
                            ? 'border-amber-500 bg-amber-100/80 text-amber-950'
                            : 'border-amber-200/80 bg-white/70 text-amber-900/80 hover:bg-amber-100/70'
                        }`}
                      >
                        ≤60 min
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                      Cuisines you reach for
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Mediterranean-inspired', 'Italian-inspired', 'Modern Middle Eastern', 'Modern'].map(
                        (cuisine) => {
                          const isActive = preferences.preferredCuisines.includes(
                            cuisine,
                          );
                          return (
                            <button
                              key={cuisine}
                              type="button"
                              onClick={() => handleCuisineSelect(cuisine)}
                              className={`text-[11px] px-3 py-1 rounded-full border transition-colors duration-150 flex items-center gap-1 whitespace-nowrap ${
                                isActive
                                  ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900'
                                  : 'border-emerald-200/80 bg-white/80 text-emerald-800/90 hover:bg-emerald-50/80'
                              }`}
                            >
                              {cuisine}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop sheet for spice & time */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent
              side="right"
              className="hidden sm:flex flex-col gap-4 w-[380px] lg:w-[420px] bg-amber-50/95 dark:bg-zinc-950/95 border-l border-amber-200/80 dark:border-amber-800/80"
            >
              <div className="pt-4 pb-1 flex flex-col gap-1">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-amber-900 dark:text-amber-50">
                  Cooking mood
                </p>
                <p className="text-xs text-amber-900/80 dark:text-amber-100/80">
                  These gently steer the mock AI suggestions—stored only in this browser.
                </p>
              </div>

              <Separator className="bg-amber-200/80 dark:bg-amber-800/80" />

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                    Spice comfort
                  </span>
                  <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                    {spiceLabel}
                  </span>
                </div>
                <Slider
                  value={[currentSpiceValue]}
                  min={0}
                  max={2.5}
                  step={0.5}
                  onValueChange={handleSpiceChange}
                  aria-label="Preferred spice level"
                  className="mt-0.5"
                />
                <div className="flex justify-between text-[11px] text-amber-900/70 dark:text-amber-100/70">
                  <span>Soft</span>
                  <span>Balanced</span>
                  <span>Fiery</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                    Weeknight time window
                  </span>
                  <span className="text-[11px] text-amber-900/70 dark:text-amber-100/70">
                    {totalTimeLabel}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleTimePreset(null)}
                    className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors duration-150 flex items-center gap-1 ${
                      preferences.maxTotalTimeMinutes === null
                        ? 'border-amber-500 bg-amber-100/80 text-amber-950'
                        : 'border-amber-200/80 bg-white/80 text-amber-900/80 hover:bg-amber-100/70'
                    }`}
                  >
                    Any length
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimePreset(20)}
                    className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors duration-150 flex items-center gap-1 ${
                      preferences.maxTotalTimeMinutes === 20
                        ? 'border-amber-500 bg-amber-100/80 text-amber-950'
                        : 'border-amber-200/80 bg-white/80 text-amber-900/80 hover:bg-amber-100/70'
                    }`}
                  >
                    Quick (≤20 min)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimePreset(35)}
                    className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors duration-150 flex items-center gap-1 ${
                      preferences.maxTotalTimeMinutes === 35
                        ? 'border-amber-500 bg-amber-100/80 text-amber-950'
                        : 'border-amber-200/80 bg-white/80 text-amber-900/80 hover:bg-amber-100/70'
                    }`}
                  >
                    Unrushed (≤35 min)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimePreset(60)}
                    className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors duration-150 flex items-center gap-1 ${
                      preferences.maxTotalTimeMinutes === 60
                        ? 'border-amber-500 bg-amber-100/80 text-amber-950'
                        : 'border-amber-200/80 bg-white/80 text-amber-900/80 hover:bg-amber-100/70'
                    }`}
                  >
                    Slow evening (≤60 min)
                  </button>
                </div>
              </div>

              <Separator className="bg-amber-200/80 dark:bg-amber-800/80" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-medium text-amber-900 dark:text-amber-50">
                    Cuisines you reach for
                  </span>
                  <span className="text-[11px] text-emerald-800/80 dark:text-emerald-300/90">
                    Shapes generated vibes
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Mediterranean-inspired', 'Italian-inspired', 'Modern Middle Eastern', 'Modern'].map(
                    (cuisine) => {
                      const isActive = preferences.preferredCuisines.includes(
                        cuisine,
                      );
                      return (
                        <button
                          key={cuisine}
                          type="button"
                          onClick={() => handleCuisineSelect(cuisine)}
                          className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors duration-150 flex items-center gap-1 whitespace-nowrap ${
                            isActive
                              ? 'border-emerald-500 bg-emerald-50/95 text-emerald-900 shadow-sm'
                              : 'border-emerald-200/80 bg-white/80 text-emerald-800/90 hover:bg-emerald-50/90'
                          }`}
                        >
                          {cuisine}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;