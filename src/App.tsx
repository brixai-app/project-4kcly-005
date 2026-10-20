import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import HomePage from '@/pages/HomePage';
import RecipeSearchPage from '@/pages/RecipeSearchPage';
import RecipeDetailPage from '@/pages/RecipeDetailPage';
import ProfilePage from '@/pages/ProfilePage';

// App
// ----
// Root router configuration for the AI Recipe Generator.
// Note: Only routes that have concrete pages in the project
// are referenced here to avoid missing-module TS errors.

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20">
        <Toaster position="top-right" richColors theme="dark" />
        <Header />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<RecipeSearchPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}