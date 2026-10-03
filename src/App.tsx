import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import Favorites from './pages/Favorites';
import { Toaster } from 'sonner';

function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="min-h-[calc(100vh-64px-180px)] flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppRoutes() {
  return (
    <PageTransitionWrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<Recipe />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </PageTransitionWrapper>
  );
}

function App() {
  return (
    <HashRouter>
      <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen flex flex-col font-jakarta antialiased transition-colors duration-300">
        <Header />
        <main className="flex-1 flex flex-col">
          <AppRoutes />
        </main>
        <Footer />
        <Toaster
          position="top-right"
          theme="system"
          toastOptions={{
            className: 'rounded-xl border border-slate-200 dark:border-white/10 shadow-lg font-medium text-base px-4 py-3 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white',
            duration: 3500,
          }}
        />
      </div>
    </HashRouter>
  );
}

export default App;