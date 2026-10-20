import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Button, Card } from "@/components/ui/shadcn";
import { useApp, useRecentSearches, useAllRecipes } from "@/mock";

/**
 * SearchBar
 *
 * 100% frontend-only, backed by mocked data and AI generation helpers from src/mock.ts.
 * No network calls are made; all search and autocomplete behavior is simulated in-memory.
 */

export interface SearchBarProps {
  /** Current query value controlled by parent */
  value: string;
  /** Notify parent when the debounced query changes */
  onChange: (value: string) => void;
  /**
   * Optional immediate change handler fired on each keystroke.
   * Useful if a parent wants to keep raw input state separately.
   */
  onImmediateChange?: (value: string) => void;
  /** Called when the user confirms a selection (Enter or suggestion click) */
  onSubmit?: (value: string) => void;
  /** Optional flag to render a more prominent, hero-style bar */
  emphasis?: boolean;
  /** Optional className to merge in additional layout styles */
  className?: string;
  /**
   * When present, renders an inline CTA button to trigger AI recipe generation
   * for the current query. This ONLY uses the mocked generator from src/mock.ts.
   */
  onGenerateClick?: (value: string) => void;
}

interface SuggestionItem {
  id: string;
  label: string;
  type: "recipe" | "recent";
}

const DEBOUNCE_MS = 220;
const MAX_SUGGESTIONS = 6;

const normalize = (v: string) => v.trim().toLowerCase();

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onImmediateChange,
  onSubmit,
  emphasis,
  className,
  onGenerateClick,
}) => {
  const { searchRecipes, addRecentSearch } = useApp();
  const recentSearches = useRecentSearches();
  const allRecipes = useAllRecipes();

  const [internalValue, setInternalValue] = useState<string>(value ?? "");
  const [debouncedValue, setDebouncedValue] = useState<string>(value ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

  // Keep internal value in sync with parent-controlled value
  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  // Debounce user input before notifying parent search handler
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(internalValue);
      onChange(internalValue);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [internalValue, onChange]);

  // Build suggestions from recent searches + recipe titles
  const suggestions: SuggestionItem[] = useMemo(() => {
    const base: SuggestionItem[] = [];
    const q = normalize(debouncedValue);

    const matchRecent = recentSearches
      .filter((item) => !q || item.includes(q))
      .slice(0, 4)
      .map<SuggestionItem>((item, idx) => ({
        id: `recent-${idx}-${item}`,
        label: item,
        type: "recent",
      }));

    base.push(...matchRecent);

    if (allRecipes.length) {
      const recipeMatches = allRecipes
        .filter((r) => !q || r.title.toLowerCase().includes(q))
        .slice(0, MAX_SUGGESTIONS - base.length)
        .map<SuggestionItem>((r) => ({
          id: r.id,
          label: r.title,
          type: "recipe",
        }));

      base.push(...recipeMatches);
    }

    return base.slice(0, MAX_SUGGESTIONS);
  }, [debouncedValue, recentSearches, allRecipes]);

  // Open the menu when there is input or recent history
  useEffect(() => {
    const hasContent = normalize(internalValue).length > 0 || suggestions.length > 0;
    setIsOpen(hasContent);
    setActiveIndex(suggestions.length ? 0 : -1);
  }, [internalValue, suggestions.length]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setInternalValue(next);
      onImmediateChange?.(next);
    },
    [onImmediateChange],
  );

  const commitValue = useCallback(
    (next: string) => {
      const trimmed = next.trim();
      if (!trimmed) return;
      addRecentSearch(trimmed);
      onChange(trimmed);
      onSubmit?.(trimmed);
      setIsOpen(false);
    },
    [addRecentSearch, onChange, onSubmit],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen && ["ArrowDown", "ArrowUp"].includes(event.key)) {
        setIsOpen(true);
        return;
      }

      if (!suggestions.length) {
        if (event.key === "Enter") {
          commitValue(internalValue);
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) => {
          const next = prev + 1;
          return next >= suggestions.length ? 0 : next;
        });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) => {
          const next = prev - 1;
          return next < 0 ? suggestions.length - 1 : next;
        });
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          const selected = suggestions[activeIndex];
          commitValue(selected.label);
        } else {
          commitValue(internalValue);
        }
      } else if (event.key === "Escape") {
        setIsOpen(false);
      }
    },
    [activeIndex, commitValue, internalValue, isOpen, suggestions],
  );

  const handleSuggestionClick = useCallback(
    (item: SuggestionItem) => {
      commitValue(item.label);
    },
    [commitValue],
  );

  const inputId = "tactilechef-search-input";
  const listboxId = "tactilechef-search-listbox";

  const wrapperClasses = [
    "relative w-full",
    emphasis ? "shadow-md shadow-orange-900/5 rounded-2xl bg-white/80 backdrop-blur" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      <div className="flex items-center gap-2 rounded-xl border border-[#e0d5c8] bg-[#fdf9f4] px-3 py-2 focus-within:border-[#d94f4f] focus-within:ring-1 focus-within:ring-[#d94f4f]/50 transition-colors">
        <Search className="h-4 w-4 text-[#8a6a54]" aria-hidden="true" />
        <input
          ref={inputRef}
          id={inputId}
          className="peer w-full bg-transparent text-sm text-[#3e2c23] placeholder:text-[#a8927c] focus:outline-none"
          placeholder="Search by ingredient, craving, or recipe title"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />
        {onGenerateClick && (
          <Button
            type="button"
            size="sm"
            className="hidden md:inline-flex gap-1.5 rounded-full bg-[#d94f4f] px-3 text-xs font-medium text-[#f9f5f0] hover:bg-[#c84747] focus-visible:ring-[#d94f4f]"
            onClick={() => onGenerateClick(internalValue)}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>AI Suggest</span>
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute z-20 mt-1 w-full rounded-xl border border-[#e0d5c8] bg-[#fefaf5] shadow-lg shadow-orange-900/5"
            ref={listboxRef}
          >
            <div
              id={listboxId}
              role="listbox"
              aria-label="Search suggestions"
              className="max-h-64 overflow-y-auto py-1"
            >
              {suggestions.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs md:text-sm transition-colors ${
                      isActive
                        ? "bg-[#f3e3d1] text-[#3e2c23]"
                        : "bg-transparent text-[#5a4334] hover:bg-[#f6e9dc]"
                    }`}
                    onMouseDown={(e) => {
                      // prevent input blur
                      e.preventDefault();
                    }}
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="whitespace-normal break-words font-medium">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-[#9b826f]">
                        {item.type === "recent" ? "Recent search" : "Recipe"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile AI CTA below input */}
      {onGenerateClick && (
        <div className="mt-2 flex items-center justify-between gap-2 md:hidden">
          <Button
            type="button"
            size="sm"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#d94f4f] px-3 py-2 text-xs font-medium text-[#f9f5f0] hover:bg-[#c84747] focus-visible:ring-[#d94f4f]"
            onClick={() => onGenerateClick(internalValue)}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Ask AI for a recipe</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;