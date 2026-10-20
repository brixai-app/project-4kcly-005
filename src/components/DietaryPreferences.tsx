import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { dietaryOptions, type DietaryTag } from "@/mock";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components/ui/shadcn";

export interface DietaryPreferencesProps {
  value: DietaryTag[];
  onChange: (next: DietaryTag[]) => void;
  className?: string;
}

// Small utility to toggle tags in a controlled way
function toggleTag(current: DietaryTag[], tag: DietaryTag): DietaryTag[] {
  if (current.includes(tag)) {
    return current.filter((t) => t !== tag);
  }
  return [...current, tag];
}

export const DietaryPreferences: React.FC<DietaryPreferencesProps> = ({ value, onChange, className }) => {
  const handleToggle = (tag: DietaryTag) => {
    const next = toggleTag(value, tag);
    onChange(next);
  };

  const isAllSelected = value.length === dietaryOptions.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(dietaryOptions.map((d) => d.id));
    }
  };

  return (
    <Card
      className={
        "w-full border border-zinc-200/80 bg-zinc-50/60 dark:bg-zinc-900/60 dark:border-zinc-800/80 backdrop-blur-sm " +
        "shadow-sm hover:shadow-md transition-shadow duration-300 " +
        (className ?? "")
      }
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg tracking-tight font-['Playfair_Display'] text-zinc-900 dark:text-zinc-50">
              Dietary Lens
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
              Layer gentle constraints for how AtelierAI composes your dish. These live only in this browser.
            </CardDescription>
          </div>
          <button
            type="button"
            onClick={handleSelectAll}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-300/80 dark:border-zinc-700/80 px-3 py-1.5 text-xs tracking-tight uppercase text-zinc-700 dark:text-zinc-200 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100/90 dark:hover:bg-zinc-800/90 transition-colors duration-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {isAllSelected ? "Clear" : "Select all"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="flex flex-wrap gap-2 mb-3 sm:hidden">
          <button
            type="button"
            onClick={handleSelectAll}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300/80 dark:border-zinc-700/80 px-3 py-1.5 text-[11px] tracking-tight uppercase text-zinc-700 dark:text-zinc-200 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100/90 dark:hover:bg-zinc-800/90 transition-colors duration-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {isAllSelected ? "Clear" : "Select all"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {dietaryOptions.map((opt) => {
            const active = value.includes(opt.id);
            return (
              <motion.button
                key={opt.id}
                type="button"
                onClick={() => handleToggle(opt.id)}
                whileHover={{ y: -1, boxShadow: "0 10px 25px rgba(15,15,15,0.09)" }}
                whileTap={{ scale: 0.98, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.3 }}
                className={
                  "group relative flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-left " +
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-900 " +
                  (active
                    ? "border-zinc-900 bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-50"
                    : "border-zinc-200/90 bg-white/80 text-zinc-800 hover:border-zinc-900/70 hover:bg-zinc-50/90 dark:bg-zinc-900/70 dark:text-zinc-100 dark:border-zinc-700/80 dark:hover:border-zinc-300/80 dark:hover:bg-zinc-800/80")
                }
              >
                <span
                  className={
                    "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border text-[11px] " +
                    (active
                      ? "border-amber-400 bg-amber-400 text-zinc-900"
                      : "border-zinc-400/80 bg-zinc-100/80 text-zinc-500 dark:border-zinc-600/80 dark:bg-zinc-800/80 dark:text-zinc-300")
                  }
                  aria-hidden="true"
                >
                  {active && <Check className="h-3 w-3" />}
                </span>
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span className="flex items-center gap-1.5">
                    <span className="text-xs font-medium tracking-[0.13em] uppercase">
                      {opt.label}
                    </span>
                    {opt.id === "vegan" && (
                      <Badge
                        variant="outline"
                        className={
                          "border-emerald-500/70 text-[10px] font-normal uppercase tracking-[0.16em] text-emerald-700 bg-emerald-50/70 dark:bg-emerald-900/40 dark:text-emerald-200"
                        }
                      >
                        Plant-first
                      </Badge>
                    )}
                    {opt.id === "high_protein" && (
                      <Badge
                        variant="outline"
                        className={
                          "border-sky-500/70 text-[10px] font-normal uppercase tracking-[0.16em] text-sky-700 bg-sky-50/70 dark:bg-sky-900/40 dark:text-sky-200"
                        }
                      >
                        Studio fuel
                      </Badge>
                    )}
                  </span>
                  {opt.description && (
                    <span className="text-[11px] leading-snug text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {opt.description}
                    </span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="uppercase tracking-[0.16em]">Current lens</span>
          {value.length === 0 && (
            <span className="italic text-zinc-500 dark:text-zinc-400">
              Open to anything – AtelierAI will compose freely.
            </span>
          )}
          {value.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {value.map((tag) => {
                const meta = dietaryOptions.find((d) => d.id === tag);
                return (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-zinc-300/80 bg-zinc-50/80 text-[11px] font-normal tracking-wide text-zinc-700 dark:border-zinc-700/80 dark:bg-zinc-900/80 dark:text-zinc-200"
                  >
                    {meta?.label ?? tag}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DietaryPreferences;