// Programmatically generated route table and navigation manifest
export interface RouteItem {
  path: string;
  name: string;
  filePath: string;
  navLabel?: string;
  showInNav: boolean;
}

export const APP_ROUTES: RouteItem[] = [
  {
    "path": "/",
    "name": "HomePage",
    "filePath": "src/pages/HomePage.tsx",
    "navLabel": "Home",
    "showInNav": true
  },
  {
    "path": "/generate",
    "name": "RecipeGeneratorPage",
    "filePath": "src/pages/RecipeGeneratorPage.tsx",
    "navLabel": "Generate Recipe",
    "showInNav": true
  },
  {
    "path": "/favorites",
    "name": "FavoritesPage",
    "filePath": "src/pages/FavoritesPage.tsx",
    "navLabel": "Favorites",
    "showInNav": true
  },
  {
    "path": "/about",
    "name": "AboutPage",
    "filePath": "src/pages/AboutPage.tsx",
    "navLabel": "About",
    "showInNav": true
  }
];

export const NAV_LINKS: Array<{ path: string; label: string }> = [
  {
    "path": "/",
    "label": "Home"
  },
  {
    "path": "/generate",
    "label": "Generate Recipe"
  },
  {
    "path": "/favorites",
    "label": "Favorites"
  },
  {
    "path": "/about",
    "label": "About"
  }
];
