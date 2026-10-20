import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";

import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/shadcn";
import { usePreferences } from "@/mock";
import { NAV_LINKS } from "@/routes";
import { PreferencesPanel } from "@/components/PreferencesPanel";

const headerVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0 },
};

const logoVariants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
};

const navItemVariants = {
  initial: { opacity: 0, y: 6 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + index * 0.04 },
  }),
};

const Header: React.FC = () => {
  const location = useLocation();
  const preferences = usePreferences();

  const activeDietaryCount = preferences.dietaryRestrictions.length;

  return (
    <motion.header
      className="w-full bg-[#f9f5f0]/95 backdrop-blur border-b border-[#e1d2c4] sticky top-0 z-40"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4, ease: "easeOut" }}
      role="banner"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-3 lg:py-4 flex items-center justify-between gap-4">
        {/* Logo + Brand */}
        <motion.div
          className="flex items-center gap-2.5 lg:gap-3 min-w-0"
          variants={logoVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Link to="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d94f4f] rounded-md pr-1">
            {/* Inline custom SVG logo with warm accent */}
            <svg
              width={32}
              height={32}
              viewBox="0 0 40 40"
              aria-hidden="true"
              className="shrink-0 drop-shadow-sm"
            >
              <defs>
                <linearGradient id="tactilechef-logo-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f7c2a1" />
                  <stop offset="1" stopColor="#d94f4f" />
                </linearGradient>
              </defs>
              <rect
                x="2"
                y="2"
                width="36"
                height="36"
                rx="12"
                fill="url(#tactilechef-logo-gradient)"
              />
              {/* Plate */}
              <circle cx="20" cy="20" r="9" fill="#f9f5f0" />
              {/* Fork */}
              <path
                d="M14 12v6.5c0 .6.4 1.1.9 1.2L18 21"
                stroke="#3e2c23"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 12h2M13 14h2M13 16h2"
                stroke="#3e2c23"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Spoon */}
              <path
                d="M26 13.5c0 1.7-1.1 3-2.4 3-1.3 0-2.4-1.3-2.4-3s1.1-2.7 2.4-2.7c1.3 0 2.4 1.1 2.4 2.7Z"
                fill="#d94f4f"
              />
              <path
                d="M23.6 16.4V22"
                stroke="#7a5c4a"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col min-w-0">
              <span className="text-base lg:text-lg font-semibold tracking-tight text-[#3e2c23] leading-tight">
                TactileChef
              </span>
              <span className="text-[11px] lg:text-xs text-[#7a5c4a] leading-tight">
                AI-crafted recipes, purely in your browser
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Navigation and actions */}
        <nav className="flex items-center gap-3 lg:gap-5 ml-auto" aria-label="Main navigation">
          <ul className="hidden md:flex items-center gap-2 lg:gap-3">
            {NAV_LINKS.map((link, index) => (
              <motion.li
                key={link.path}
                custom={index}
                initial="initial"
                animate="animate"
                variants={navItemVariants}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    [
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d94f4f] focus-visible:ring-offset-[#f9f5f0]",
                      isActive || location.pathname === link.path
                        ? "bg-[#d94f4f] text-white border-[#d94f4f] shadow-sm"
                        : "bg-transparent text-[#3e2c23] border-transparent hover:bg-[#f0e0d2] hover:text-[#2e211a]",
                    ].join(" ")
                  }
                >
                  {link.label}
                </NavLink>
              </motion.li>
            ))}
          </ul>

          {/* Preferences trigger */}
          <PreferencesPanel.Trigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full border-[#d4c3b4] bg-white/80 text-[#3e2c23] hover:bg-[#f0e0d2] hover:text-[#2e211a] transition-colors"
                  aria-label="Open cooking preferences"
                >
                  <Settings2 className="h-4 w-4" />
                  {activeDietaryCount > 0 && (
                    <span className="ml-0.5 inline-flex items-center justify-center rounded-full bg-[#d94f4f] text-white text-[10px] min-w-[1.1rem] h-[1.1rem] font-semibold">
                      {activeDietaryCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-[#3e2c23] text-[#f9f5f0] border border-[#7a5c4a]"
              >
                <p className="text-xs font-medium">Set dietary and cuisine preferences</p>
              </TooltipContent>
            </Tooltip>
          </PreferencesPanel.Trigger>
        </nav>
      </div>
      {/* Render the sheet once at root level */}
      <PreferencesPanel.Content />
    </motion.header>
  );
};

export default Header;