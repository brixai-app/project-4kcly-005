import React from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/shadcn";
import { cuisines, Cuisine } from "@/mock";

export interface CuisineSelectProps {
  value: string | null; // cuisine id or null for "Any"
  onChange: (cuisineId: string | null) => void;
  label?: string;
  className?: string;
}

// A small helper to render the label for the current value
function getCuisineLabel(id: string | null): string {
  if (!id) return "Any cuisine";
  const match = cuisines.find((c) => c.id === id);
  return match ? match.name : "Any cuisine";
}

export const CuisineSelect: React.FC<CuisineSelectProps> = ({
  value,
  onChange,
  label = "Cuisine focus",
  className,
}) => {
  const handleSelect = (id: string | null) => {
    onChange(id);
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-1">
        <span className="text-xs tracking-[0.18em] uppercase text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Button
                type="button"
                variant="outline"
                className="inline-flex w-full items-center justify-between rounded-full border-neutral-300 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm backdrop-blur-sm transition-colors hover:border-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-50 dark:hover:border-neutral-200 dark:hover:bg-neutral-900"
              >
                <span className="truncate text-left font-serif text-sm tracking-wide">
                  {getCuisineLabel(value)}
                </span>
                <ChevronDown className="ml-3 h-4 w-4 text-neutral-500" aria-hidden="true" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={8}
            className="min-w-[220px] rounded-xl border border-neutral-200 bg-white/95 p-1 shadow-xl backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95"
          >
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handleSelect(null);
              }}
              className="flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-neutral-100/90 dark:text-neutral-50 dark:focus:bg-neutral-800/80"
            >
              <span className="font-medium">Any cuisine</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Let AtelierAI choose a mood for you.
              </span>
            </DropdownMenuItem>
            <div className="my-1 h-px bg-neutral-200/80 dark:bg-neutral-700/80" />
            {cuisines.map((cuisine: Cuisine) => (
              <DropdownMenuItem
                key={cuisine.id}
                onSelect={(event) => {
                  event.preventDefault();
                  handleSelect(cuisine.id);
                }}
                className="flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-neutral-100/90 dark:text-neutral-50 dark:focus:bg-neutral-800/80"
              >
                <span className="font-medium font-serif tracking-wide">
                  {cuisine.name}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {cuisine.region}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CuisineSelect;