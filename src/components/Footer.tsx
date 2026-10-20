import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, Globe, MessageCircle } from "lucide-react";
import { Button, Separator, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/shadcn";

// NOTE: This is a frontend-only application using a mocked state layer in src/mock.ts.
// There is no backend; all data and interactions are client-side.

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "Search", to: "/search" },
  { label: "Profile", to: "/profile" },
];

const socialIcons = [
  {
    label: "Visit our global table",
    icon: Globe,
    href: "#", // purely presentational in this frontend-only mock
  },
  {
    label: "Chat with the test kitchen",
    icon: MessageCircle,
    href: "#",
  },
  {
    label: "Follow lifestyle shots",
    icon: Instagram,
    href: "#",
  },
  {
    label: "Gather on socials",
    icon: Facebook,
    href: "#",
  },
  {
    label: "Quick bites & updates",
    icon: Twitter,
    href: "#",
  },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full border-t border-[rgba(120,85,72,0.22)] bg-[radial-gradient(circle_at_top,_rgba(255,243,234,0.9),_rgba(244,219,200,0.96)),linear-gradient(to_right,_#F5E6D3,_#F2D4C2)] text-[rgb(56,36,30)] dark:border-[rgba(251,225,205,0.22)] dark:bg-[radial-gradient(circle_at_top,_rgba(26,20,17,0.98),_rgba(18,12,10,0.98))] dark:text-[rgb(246,234,224)]">
      {/* Subtle texture using layered gradients and low-contrast noise-like effect via background opacity */}
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand + Copy */}
          <div className="min-w-0 max-w-xl space-y-3">
            <p className="text-sm tracking-[0.28em] uppercase text-[rgba(120,85,72,0.9)] dark:text-[rgba(250,235,221,0.78)]">
              AI Recipe Generator
            </p>
            <p className="text-base md:text-lg font-medium leading-relaxed text-[rgb(72,46,37)] dark:text-[rgb(246,234,224)] font-['Inter']">
              A warm, fully mocked AI test kitchen where every recipe, review, and preference
              lives right in your browser.
            </p>
            <p className="text-xs md:text-sm text-[rgba(104,73,60,0.9)] dark:text-[rgba(237,216,199,0.76)]">
              No backend, no tracking—just playful experimentation powered by in-browser
              mocks and local storage.
            </p>
          </div>

          {/* Sitemap + Social */}
          <div className="flex flex-col gap-6 md:items-end min-w-0">
            <div className="flex flex-wrap items-center gap-3 justify-start md:justify-end">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm font-medium font-['Inter'] text-[rgb(120,85,72)] dark:text-[rgb(244,211,187)] hover:text-[rgb(215,98,70)] dark:hover:text-[rgb(248,181,140)] border border-transparent hover:border-[rgba(215,98,70,0.4)] dark:hover:border-[rgba(248,181,140,0.5)] rounded-full px-3.5 py-1.5 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3 items-start md:items-end">
              <p className="text-xs uppercase tracking-[0.22em] text-[rgba(120,85,72,0.9)] dark:text-[rgba(244,211,187,0.8)]">
                Stay in the flavor loop
              </p>
              <div className="flex flex-wrap gap-2.5">
                {socialIcons.map(({ label, icon: Icon, href }) => (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-[rgba(176,133,110,0.6)] bg-[rgba(255,249,243,0.9)]/80 text-[rgb(120,85,72)] hover:bg-[rgb(228,151,114)] hover:text-[rgb(46,24,18)] hover:border-[rgba(215,98,70,0.9)] dark:border-[rgba(244,211,187,0.55)] dark:bg-[rgba(40,28,23,0.96)] dark:text-[rgb(244,211,187)] dark:hover:bg-[rgb(215,98,70)] dark:hover:text-[rgb(19,10,8)] transition-colors duration-200"
                      >
                        <a href={href} aria-label={label}>
                          <Icon className="h-4 w-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-[rgb(46,30,25)] text-[rgb(248,236,228)] border-[rgba(244,211,187,0.4)] font-['Inter'] text-xs"
                    >
                      {label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Separator className="bg-[rgba(176,133,110,0.4)] dark:bg-[rgba(244,211,187,0.35)]" />
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs text-[rgba(104,73,60,0.9)] dark:text-[rgba(237,216,199,0.78)] font-['Inter']">
            <p>
              © {year} AI Recipe Generator. Crafted as a 100% frontend-only mock experience
              with in-browser AI-style recipe generation.
            </p>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <span className="px-2.5 py-1 rounded-full bg-[rgba(255,249,243,0.9)] text-[rgba(120,85,72,0.96)] dark:bg-[rgba(39,27,23,0.98)] dark:text-[rgba(248,236,228,0.92)] border border-[rgba(176,133,110,0.65)] dark:border-[rgba(244,211,187,0.6)]">
                Mocked client-side • No real backend
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[rgba(247,205,178,0.9)] text-[rgb(77,36,24)] dark:bg-[rgba(215,98,70,0.92)] dark:text-[rgb(19,10,8)] border border-[rgba(215,98,70,0.7)] dark:border-[rgba(248,181,140,0.9)]">
                State persisted locally via safeStorage
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;