import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import HomePage from '@/pages/HomePage';
import SearchPage from '@/pages/SearchPage';
import RecipePage from '@/pages/RecipePage';
import FavoritesPage from '@/pages/FavoritesPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20">
        <Toaster position="top-right" richColors theme="dark" />
        <Header />
        <main className="flex-1 w-full">
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
