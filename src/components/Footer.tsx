import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Separator, Button } from "@/components/ui/shadcn";

// NOTE: This component is part of a 100% frontend-only app.
// All "AI" recipe generation in Saffron & Sage is fully mocked
// on the client with localStorage persistence handled in src/mock.ts.

const year = new Date().getFullYear();

const footerLinks = [
  { label: "Browse recipes", to: "/browse" },
  { label: "Generate recipe", to: "/generate" },
];

const subtleFade = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
};

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-amber-100/60 bg-gradient-to-t from-stone-950 via-stone-950 to-stone-900/95 text-amber-50 px-6 lg:px-12 pt-10 pb-8 mt-16">
      <div className="w-full max-w-[1600px] mx-auto">
        <motion.div
          className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between"
          initial={subtleFade.initial}
          whileInView={subtleFade.animate}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Brand + tone */}
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-rose-400 shadow-md shadow-amber-900/40 flex items-center justify-center text-stone-950 text-sm font-semibold tracking-tight">
                SS
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-amber-300/80">
                  Saffron &amp; Sage
                </p>
                <p className="text-xs text-amber-100/70">
                  A warm, lifestyle‑first recipe companion.
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-amber-50/80">
              Drift from inspiration to the dinner table with gently guided, tactile
              cooking. Saffron &amp; Sage is entirely browser‑based: your favorites and
              mock "AI" creations live on this device only.
            </p>
          </div>

          {/* Quick nav + call to explore */}
          <div className="flex flex-col items-start gap-3 md:items-end md:text-right">
            <p className="text-xs font-medium tracking-wide text-amber-200/80 uppercase">
              Follow your appetite
            </p>
            <div className="flex flex-wrap gap-2.5">
              {footerLinks.map((link) => (
                <Button
                  key={link.to}
                  asChild
                  variant="outline"
                  className="border-amber-300/60 bg-transparent/10 hover:bg-amber-100/10 text-amber-50 hover:text-amber-50 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-colors duration-200"
                >
                  <Link to={link.to} aria-label={link.label}>
                    {link.label}
                  </Link>
                </Button>
              ))}
            </div>
            <p className="text-[11px] text-amber-100/70 max-w-xs md:max-w-sm">
              All suggestions are stylistic, client‑side mockups. They&apos;re meant for
              cozy inspiration, not clinical nutrition or professional advice.
            </p>
          </div>
        </motion.div>

        <div className="mt-8 space-y-4">
          <Separator className="bg-amber-100/15" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-amber-100/60">
              © {year} Saffron &amp; Sage. Crafted as a fully frontend, local‑only
              experience with mock recipe generation.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-amber-100/60">
              <span className="whitespace-nowrap">
                Mock "AI" only – no accounts, no cloud, no servers.
              </span>
              <span className="hidden sm:inline text-amber-100/30">·</span>
              <button
                type="button"
                className="underline underline-offset-4 decoration-amber-200/60 hover:decoration-amber-200/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/90 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 rounded-sm transition-colors duration-150"
                onClick={() => {
                  // purely informational; could later hook into a modal
                  // eslint-disable-next-line no-alert
                  window.alert(
                    'Saffron & Sage runs entirely in your browser. All recipes, favorites, and "AI" generations are mocked and saved only to this device using localStorage.',
                  );
                }}
              >
                Learn how your data stays local
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;