import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Instagram, Utensils, Mail, MapPin, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    {
      name: 'GitHub',
      href: 'https://github.com/',
      icon: <Github className="w-5 h-5" />,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/',
      icon: <Twitter className="w-5 h-5" />,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/',
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/',
      icon: <Instagram className="w-5 h-5" />,
    },
  ];

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Generate Recipe', to: '#ingredient-form' },
    { label: 'Favorites', to: '/favorites' },
  ];

  const resources = [
    { label: 'About', href: 'https://github.com/', icon: <Users className="w-4 h-4 mr-2" /> },
    { label: 'Contact', href: 'mailto:hello@airecipe.app', icon: <Mail className="w-4 h-4 mr-2" /> },
    { label: 'Location', href: 'https://maps.google.com/', icon: <MapPin className="w-4 h-4 mr-2" /> },
  ];

  return (
    <footer className="relative z-20 bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-white/10 pt-14 pb-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <div className="col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group" tabIndex={0} aria-label="AI Recipe Generator Home">
              <div className="w-9 h-9 bg-emerald-500 dark:bg-emerald-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <Utensils className="text-white dark:text-emerald-950 w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-serif select-none">
                AI Recipe Generator
              </span>
            </Link>
            <div className="text-slate-600 dark:text-slate-400 text-sm max-w-xs">
              Premium AI-powered recipes for home cooks. Discover, save, and share creative meals from your own kitchen.
            </div>
            <div className="flex gap-3 mt-2">
              {socials.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-2 text-slate-500 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all duration-200 shadow-sm hover:scale-110 active:scale-95"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-white mb-2">Navigation</div>
            {navLinks.map(link =>
              link.to.startsWith('/') ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="inline-block py-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.to}
                  className="inline-block py-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-white mb-2">Resources</div>
            {resources.map(r => (
              <a
                key={r.label}
                href={r.href}
                target={r.href.startsWith('http') ? '_blank' : undefined}
                rel={r.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center py-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {r.icon}
                {r.label}
              </a>
            ))}
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-white mb-2">Highlights</div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered Recipes
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-1">
              <Utensils className="w-3.5 h-3.5" /> Step-by-Step Guidance
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/30 text-pink-700 dark:text-pink-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" /> Share & Save Favorites
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-100 dark:border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
          <div className="text-slate-500 dark:text-slate-400">
            &copy; {year} AI Recipe Generator. All rights reserved.
          </div>
          <div className="flex gap-4 text-slate-400 dark:text-slate-500">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              Terms
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              Privacy
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer;