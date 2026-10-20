import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Share2, Globe, Mail } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
  Separator,
} from "@/components/ui/shadcn";

// NOTE: This is a 100% frontend-only component.
// All application data and persistence are mocked in src/mock.ts with localStorage;
// this footer focuses purely on layout, motion, and navigation.

const socialItems = [
  {
    id: "journal",
    label: "Atelier journal",
    href: "https://example.com",
    icon: Globe,
  },
  {
    id: "studio",
    label: "Studio feed",
    href: "https://example.com",
    icon: Instagram,
  },
  {
    id: "share",
    label: "Share AtelierAI",
    href: "mailto:hello@example.com?subject=AtelierAI%20Recipes",
    icon: Share2,
  },
  {
    id: "contact",
    label: "Contact curator",
    href: "mailto:hello@example.com",
    icon: Mail,
  },
];

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-200/60 bg-neutral-50/80 text-neutral-900 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-50">
      {/* Top band: avatar + brand + description */}
      <div className="w-full px-6 py-10 lg:px-12 lg:py-14">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="rounded-full border border-neutral-200/80 bg-white/80 p-[2px] shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80"
            >
              <Avatar className="h-12 w-12 border border-neutral-200/70 bg-neutral-100/80 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-50">
                {/* Subtle gradient avatar as brand mark */}
                <AvatarFallback className="bg-[radial-gradient(circle_at_30%_20%,#f5e7d2,#e0c7a0)] text-sm font-semibold uppercase tracking-[0.2em] text-neutral-900 dark:bg-[radial-gradient(circle_at_30%_20%,#3b3b3b,#111111)] dark:text-neutral-50">
                  AR
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
                AtelierAI Recipes
              </p>
              <p className="max-w-xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                An editorial, browser‑native mock studio for composing recipes with an
                AI‑inspired engine – no servers, only your local palate and
                imagination.
              </p>
            </div>
          </div>

          {/* Quick navigation */}
          <nav className="flex flex-wrap items-center gap-x-10 gap-y-3 text-xs uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
            <Link
              to="/"
              className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Home
            </Link>
            <Link
              to="/generate"
              className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Generate
            </Link>
            <Link
              to="/favorites"
              className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Favorites
            </Link>
            <Link
              to="/about"
              className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              About
            </Link>
          </nav>
        </div>
      </div>

      <Separator className="border-neutral-200/70 dark:border-neutral-800" />

      {/* Bottom band: social icons + copyright */}
      <div className="w-full px-6 py-6 lg:px-12 lg:py-6">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
            <span>© {year} AtelierAI Recipes</span>
            <span className="h-[1px] w-6 bg-neutral-300/70 dark:bg-neutral-700/80" />
            <span>Composed entirely in‑browser with mocked data & local storage.</span>
          </div>

          <div className="flex items-center gap-2">
            {socialItems.map((item) => {
              const Icon = item.icon;
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <motion.a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200/80 bg-white/90 text-neutral-700 shadow-sm transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-300 dark:hover:border-neutral-200 dark:hover:text-neutral-50"
                      aria-label={item.label}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </motion.a>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="border-neutral-200/80 bg-neutral-50/95 text-xs text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-100"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Subtle micro-CTA using shadcn Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 rounded-full border-neutral-300/80 bg-neutral-100/80 px-4 text-[11px] font-medium tracking-[0.18em] text-neutral-800 shadow-sm transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:border-neutral-200 dark:hover:bg-neutral-100 dark:hover:text-neutral-900"
                    asChild
                  >
                    <Link to="/generate">OPEN THE STUDIO</Link>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="border-neutral-200/80 bg-neutral-50/95 text-xs text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-100"
              >
                Jump directly into the mock recipe generator.
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;