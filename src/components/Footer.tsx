import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/shadcn";

const footerLinks = [
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Accessibility",
    href: "#accessibility",
  },
  {
    label: "Source",
    href: "https://github.com/",
    external: true,
  },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f3ebe2] text-[#3e2c23] border-t border-[#decfbe] mt-12">
      {/* Outer full-width shell with soft max visual width */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start min-w-0">
          {/* Brand + description */}
          <div className="md:col-span-6 lg:col-span-7 min-w-0 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              {/* Inline logo echoing header style, but calmer */}
              <div
                aria-hidden="true"
                className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#d94f4f] to-[#e87a5f] flex items-center justify-center shadow-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-[#fdf7f2]"
                  role="img"
                >
                  <path
                    d="M5 20c0-4.418 3.134-8 7-8s7 3.582 7 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 4.5c-1.657 0-3 1.343-3 3 0 1.185.69 2.208 1.69 2.7.409.198.61.297 1.31.297s.901-.099 1.31-.297A3.002 3.002 0 0 0 15 7.5c0-1.657-1.343-3-3-3Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-base font-semibold tracking-[0.16em] uppercase text-[#4c3328]">
                TactileChef
              </span>
            </div>
            <p className="text-sm md:text-[0.95rem] leading-relaxed text-[#6c5241] max-w-xl">
              Crafted as a <span className="font-medium">100% frontend-only mock</span>,
              TactileChef simulates an AI-powered recipe studio entirely in your
              browser. No accounts, no backend – just tactile ideas and saved
              favorites living in localStorage.
            </p>
          </div>

          {/* Navigation + meta */}
          <div className="md:col-span-6 lg:col-span-5 min-w-0 flex flex-col gap-6 md:items-end md:text-right">
            <nav aria-label="Footer" className="flex flex-wrap gap-3 md:justify-end">
              {footerLinks.map((link) => {
                const baseClasses =
                  "text-sm font-medium text-[#7b5a46] hover:text-[#d94f4f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d94f4f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3ebe2] transition-colors";

                if (link.external) {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={baseClasses}
                    >
                      {link.label}
                    </a>
                  );
                }

                if (link.href.startsWith("/")) {
                  return (
                    <Link key={link.label} to={link.href} className={baseClasses}>
                      {link.label}
                    </Link>
                  );
                }

                return (
                  <a key={link.label} href={link.href} className={baseClasses}>
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="w-full md:w-auto flex flex-col gap-2 text-xs text-[#8b6a55] mt-2">
              <Separator className="bg-[#e0d1c1]" />
              <p>
                © {year} TactileChef. Built as an editorial-style prototype to
                showcase client-side AI recipe flows.
              </p>
              <p>
                Recipe content, preferences, and ratings are all{' '}
                <span className="font-medium">mocked in-memory</span> with
                localStorage persistence for your browser only.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;