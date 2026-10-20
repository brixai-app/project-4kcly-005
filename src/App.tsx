import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import HomePage, { type HomePageProps } from '@/pages/HomePage';
import BrowsePage, { type BrowsePageProps } from '@/pages/BrowsePage';
import GeneratePage, { type GeneratePageProps } from '@/pages/GeneratePage';
import FavoritesPage from '@/pages/FavoritesPage';

import {
  hydrateState,
  toggleFavorite,
  upsertPreferences,
  type AppState,
  type UserPreferences,
} from '@/mock';

export default function App() {
  const [state, setState] = React.useState<AppState>(() => hydrateState());

  const handleToggleFavorite = React.useCallback((recipeId: string) => {
    setState((prev) => toggleFavorite(prev, recipeId));
  }, []);

  const handlePreferencesChange = React.useCallback(
    (partial: Partial<UserPreferences>) => {
      setState((prev) => upsertPreferences(prev, partial));
    },
    [],
  );

  const handleOpenRecipe = React.useCallback((recipeId: string) => {
    // In this shell component we don't need to do anything; pages that care
    // about opening a recipe (e.g. via sheets) manage that themselves.
    // This callback is passed for API compatibility.
    void recipeId;
  }, []);

  const homePageProps: HomePageProps = {
    state,
    onOpenRecipe: handleOpenRecipe,
    onToggleFavorite: handleToggleFavorite,
  };

  const favoritesPageProps = {
    state,
    onToggleFavorite: handleToggleFavorite,
  };

  const browsePageProps: BrowsePageProps = {
    state,
    onToggleFavorite: handleToggleFavorite,
  };

  const generatePageProps: GeneratePageProps = {
    state,
    onStateChange: setState,
    onToggleFavorite: handleToggleFavorite,
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20">
        <Toaster position="top-right" richColors theme="dark" />
        <Header
          preferences={state.preferences}
          favoritesCount={state.favorites.length}
          onPreferencesChange={handlePreferencesChange}
        />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage {...homePageProps} />} />
            <Route path="/browse" element={<BrowsePage {...browsePageProps} />} />
            <Route path="/generate" element={<GeneratePage {...generatePageProps} />} />
            <Route path="/favorites" element={<FavoritesPage {...favoritesPageProps} />} />
            <Route path="*" element={<HomePage {...homePageProps} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}