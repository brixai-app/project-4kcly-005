import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/shadcn';
import { X, ChevronDown, Plus } from 'lucide-react';

export interface IngredientInputProps {
  /** Currently selected ingredients (plain strings). */
  value: string[];
  /** All known ingredients to suggest from (e.g. from getAllIngredientsCatalog). */
  suggestions: string[];
  /** Called whenever the list of selected ingredients changes. */
  onChange: (ingredients: string[]) => void;
  /** Optional aria-label for accessibility. */
  'aria-label'?: string;
  /** Optional placeholder for the text input. */
  placeholder?: string;
  /** Optional label rendered above the control (outside, not native <label>). */
  label?: string;
  /** Optional helper text rendered below the control. */
  helperText?: string;
}

// Utility to normalize ingredient text for comparison
function normalize(text: string): string {
  return text.trim().toLowerCase();
}

const IngredientInput: React.FC<IngredientInputProps> = ({
  value,
  suggestions,
  onChange,
  'aria-label': ariaLabel,
  placeholder = 'Type an ingredient and press Enter…',
  label,
  helperText,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Filter suggestions by current input & exclude already-selected ones
  const filteredSuggestions = useMemo(() => {
    const normalizedSelected = new Set(value.map((v) => normalize(v)));
    const q = normalize(inputValue);

    return suggestions
      .filter((s) => !normalizedSelected.has(normalize(s)))
      .filter((s) => (q ? normalize(s).includes(q) : true))
      .slice(0, 12); // keep menu manageable
  }, [inputValue, suggestions, value]);

  const handleAdd = (raw: string) => {
    const next = raw.trim();
    if (!next) return;

    const exists = value.some((v) => normalize(v) === normalize(next));
    if (exists) {
      setInputValue('');
      return;
    }

    onChange([...value, next]);
    setInputValue('');
  };

  const handleRemove = (ingredient: string) => {
    onChange(value.filter((v) => normalize(v) !== normalize(ingredient)));
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAdd(inputValue);
    } else if (event.key === 'Backspace' && !inputValue) {
      // Backspace with empty input removes last chip for ergonomic editing
      const last = value[value.length - 1];
      if (last) {
        event.preventDefault();
        handleRemove(last);
      }
    }
  };

  // Close the suggestion menu when there are no more suggestions
  useEffect(() => {
    if (filteredSuggestions.length === 0 && menuOpen) {
      setMenuOpen(false);
    }
  }, [filteredSuggestions.length, menuOpen]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="text-sm font-medium text-stone-800 dark:text-stone-100">
          {label}
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50/70 px-3 py-2 shadow-sm transition-colors dark:border-stone-700 dark:bg-stone-900/60">
        <div className="flex flex-wrap items-center gap-2">
          {value.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {value.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant="secondary"
                  className="flex items-center gap-1 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-medium text-stone-900 shadow-sm ring-1 ring-amber-200/70 transition-colors hover:bg-amber-200/80 dark:bg-amber-900/30 dark:text-amber-50 dark:ring-amber-800/60"
                >
                  <span className="whitespace-normal break-words">
                    {ingredient}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${ingredient}`}
                    onClick={() => handleRemove(ingredient)}
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-stone-50"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label={ariaLabel || 'Add ingredients'}
              placeholder={placeholder}
              className="border-none bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center gap-1 rounded-full border-amber-300 bg-amber-50/80 px-3 text-xs font-medium text-amber-900 shadow-sm transition-colors hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-50 dark:hover:bg-amber-900/60"
                  aria-label="Browse ingredient suggestions"
                >
                  <Plus className="h-3 w-3" aria-hidden="true" />
                  <span>Suggestions</span>
                  <ChevronDown className="h-3 w-3" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="max-h-64 w-56 overflow-y-auto rounded-xl border border-stone-200 bg-stone-50/95 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/95"
              >
                {filteredSuggestions.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-stone-500 dark:text-stone-400">
                    No more suggestions. You can still type anything.
                  </div>
                ) : (
                  filteredSuggestions.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-xs text-stone-800 focus:bg-amber-100/80 focus:text-stone-900 dark:text-stone-100 dark:focus:bg-amber-900/40"
                      onSelect={(event) => {
                        event.preventDefault();
                        handleAdd(s);
                      }}
                    >
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                      <span className="whitespace-normal break-words">{s}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {helperText && (
        <p className="text-xs text-stone-500 dark:text-stone-400">{helperText}</p>
      )}
    </div>
  );
};

export default IngredientInput;