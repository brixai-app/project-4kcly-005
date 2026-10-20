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
    "path": "/search",
    "name": "SearchPage",
    "filePath": "src/pages/SearchPage.tsx",
    "navLabel": "Search",
    "showInNav": true
  },
  {
    "path": "/recipe/:id",
    "name": "RecipePage",
    "filePath": "src/pages/RecipePage.tsx",
    "showInNav": false
  },
  {
    "path": "/favorites",
    "name": "FavoritesPage",
    "filePath": "src/pages/FavoritesPage.tsx",
    "navLabel": "Favorites",
    "showInNav": true
  },
  {
    "path": "*",
    "name": "NotFoundPage",
    "filePath": "src/pages/NotFoundPage.tsx",
    "showInNav": false
  }
];

export const NAV_LINKS: Array<{ path: string; label: string }> = [
  {
    "path": "/",
    "label": "Home"
  },
  {
    "path": "/search",
    "label": "Search"
  },
  {
    "path": "/favorites",
    "label": "Favorites"
  }
];
