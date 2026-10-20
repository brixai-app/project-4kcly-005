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
    "name": "RecipeSearchPage",
    "filePath": "src/pages/RecipeSearchPage.tsx",
    "navLabel": "Search",
    "showInNav": true
  },
  {
    "path": "/recipe/:id",
    "name": "RecipeDetailPage",
    "filePath": "src/pages/RecipeDetailPage.tsx",
    "showInNav": false
  },
  {
    "path": "/profile",
    "name": "ProfilePage",
    "filePath": "src/pages/ProfilePage.tsx",
    "navLabel": "Profile",
    "showInNav": true
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
    "path": "/profile",
    "label": "Profile"
  }
];
