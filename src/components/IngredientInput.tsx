import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Search } from "lucide-react";

import {
  Button,
  Input,
  Badge,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/shadcn";

import { ingredients, searchIngredients } from "@/mock";

// This is a purely client-side, mock-based ingredient input.
// It does NOT talk to any backend or real AI.

export interface IngredientInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
}

function normalizeIngredientName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  value,
  onChange,
  label = "Ingredients",
  placeholder = "Type to search or add an ingredient (press Enter)",
  helperText = "We remix from this list only in your browser—nothing is sent to a server.",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const normalizedSelected = useMemo(
    () => new Set(value.map((v) => normalizeIngredientName(v))),
    [value],
  );

  const suggestions = useMemo(() => {
    const base = searchIngredients(query || "");
    return base.filter((ing) => !normalizedSelected.has(normalizeIngredientName(ing.name)));
  }, [query, normalizedSelected]);

  const allIngredientNames = useMemo(
    () => ingredients.map((i) => i.name).sort((a, b) => a.localeCompare(b)),
    [],
  );

  const addIngredient = (name: string) => {
    const normalized = normalizeIngredientName(name);
    if (!normalized) return;
    if (normalizedSelected.has(normalized)) {
      setQuery("");
      return;
    }
    const pretty = name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((w, idx) => (idx === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w.toLowerCase()))
      .join(" ");

    onChange([...value, pretty]);
    setQuery("");
  };

  const removeIngredient = (name: string) => {
    const normalized = normalizeIngredientName(name);
    const next = value.filter((v) => normalizeIngredientName(v) !== normalized);
    onChange(next);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" && query.trim()) {
      event.preventDefault();
      addIngredient(query);
    }
    if (event.key === "Backspace" && !query && value.length) {
      // quick remove last
      removeIngredient(value[value.length - 1]);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!inputRef.current) return;
      if (!inputRef.current.parentElement?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm tracking-[0.15em] uppercase text-neutral-500 dark:text-neutral-400 font-semibold">
          {label}
        </label>
        {value.length > 0 && (
          <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            {value.length.toString().padStart(2, "0")} selected
          </span>
        )}
      </div>

      <div className="relative w-full rounded-xl border border-neutral-200/80 bg-white/80 dark:bg-neutral-950/80 dark:border-neutral-800/80 shadow-sm focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900/80 transition-[border,box-shadow] duration-150 ease-out">
        <div className="flex items-center gap-3 px-3 pt-2 pb-1">
          <Search className="h-4 w-4 text-neutral-400" aria-hidden="true" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-neutral-400 font-['Playfair_Display']"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            aria-label={label}
          />
          {query && (
            <button
              type="button"
              className="rounded-full p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              onClick={() => setQuery("")}
              aria-label="Clear ingredient search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          {query.trim() && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="ml-1 h-7 border-neutral-300 bg-white/80 text-[11px] font-medium tracking-[0.16em] uppercase rounded-full px-3 hover:bg-neutral-900 hover:text-neutral-50 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-50 dark:hover:text-neutral-900"
              onClick={() => addIngredient(query)}
            >
              <Plus className="mr-1 h-3 w-3" /> add
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 px-3 pb-2">
          <AnimatePresence initial={false}>
            {value.map((item) => (
              <motion.span
                key={normalizeIngredientName(item)}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 25, mass: 0.6 }}
              >
                <Badge
                  variant="outline"
                  className="group flex items-center gap-1 rounded-full border-neutral-300 bg-neutral-50/70 px-3 py-1 text-[11px] tracking-[0.16em] uppercase text-neutral-700 dark:bg-neutral-900/80 dark:border-neutral-700 dark:text-neutral-100"
                >
                  <span className="font-medium">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(item)}
                    className="ml-1 rounded-full p-0.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 transition-colors"
                    aria-label={`Remove ${item}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="absolute inset-x-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-neutral-200/90 bg-white/95 backdrop-blur-sm shadow-xl shadow-black/5 dark:border-neutral-800/90 dark:bg-neutral-950/95"
              role="listbox"
              aria-label="Ingredient suggestions"
            >
              <div className="py-1">
                {suggestions.length === 0 && query.trim() && (
                  <div className="flex items-center justify-between px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>
                      "{query}" is not in our pantry. Add it as a custom ingredient.
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-[11px] tracking-[0.16em] uppercase text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800/80"
                      onClick={() => addIngredient(query)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Add
                    </Button>
                  </div>
                )}

                {suggestions.length > 0 && (
                  <>
                    <div className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                      Atelier pantry matches
                    </div>
                    <ul className="px-1 pb-2">
                      {suggestions.map((ing) => (
                        <li key={ing.id}>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs text-neutral-800 hover:bg-neutral-100/90 dark:text-neutral-100 dark:hover:bg-neutral-800/80 focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900/70"
                            onClick={() => {
                              addIngredient(ing.name);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium font-['Playfair_Display']">
                                {ing.name}
                              </span>
                              <span className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                                {ing.category.replace("_", " ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {ing.flavorProfile.slice(0, 3).map((note) => (
                                <span
                                  key={note}
                                  className="rounded-full bg-neutral-900 text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900"
                                >
                                  {note}
                                </span>
                              ))}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="border-t border-dashed border-neutral-200/80 px-3 pt-2 pb-2 text-[10px] text-neutral-500 dark:border-neutral-800/80 dark:text-neutral-400">
                  <p className="mb-1">
                    Or browse our pantry:
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-full border-neutral-300 bg-neutral-50/80 px-3 text-[11px] tracking-[0.16em] uppercase text-neutral-800 hover:bg-neutral-900 hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-50 dark:hover:text-neutral-900"
                      >
                        Open pantry
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-72 w-64 overflow-y-auto border-neutral-200/90 bg-white/95 backdrop-blur-sm dark:border-neutral-800/90 dark:bg-neutral-950/95">
                      {allIngredientNames.map((name) => {
                        const isSelected = normalizedSelected.has(normalizeIngredientName(name));
                        return (
                          <DropdownMenuItem
                            key={name}
                            onClick={() => {
                              if (isSelected) {
                                removeIngredient(name);
                              } else {
                                addIngredient(name);
                              }
                            }}
                            className="flex items-center justify-between text-xs text-neutral-800 dark:text-neutral-100"
                          >
                            <span className="font-['Playfair_Display']">{name}</span>
                            {isSelected && (
                              <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900">
                                selected
                              </span>
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {helperText && (
        <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default IngredientInput;