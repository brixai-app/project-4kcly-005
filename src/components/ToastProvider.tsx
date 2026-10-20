import React from "react";
import { Toaster } from "sonner";

// ToastProvider
// --------------
// Global Sonner <Toaster /> wrapper used once in the root App layout.
// This configures placement, color scheme, fonts, and motion to match
// the warm, tactile lifestyle branding of the AI Recipe Generator app.
//
// NOTE: This app is 100% frontend-only and uses mocked state in src/mock.ts.
// All toasts are purely client-side UX feedback with no real backend.

const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand={false}
      toastOptions={{
        duration: 3800,
        classNames: {
          toast:
            // Base layout + warm surface + subtle border
            "data-[type=success]:bg-emerald-600/95 data-[type=success]:text-emerald-50 " +
            "data-[type=error]:bg-rose-600/95 data-[type=error]:text-rose-50 " +
            "data-[type=warning]:bg-amber-600/95 data-[type=warning]:text-amber-50 " +
            "data-[type=info]:bg-teal-700/95 data-[type=info]:text-teal-50 " +
            "backdrop-blur-md shadow-lg border border-white/10 rounded-xl " +
            // Spacing & typography aligned with Inter
            "px-4 py-3 text-sm font-normal font-['Inter'] tracking-tight " +
            // Motion & interaction
            "transition-colors transition-opacity duration-200 ease-out",
          title:
            "font-['Inter'] font-medium text-[0.95rem] leading-snug text-white", // high-contrast title
          description:
            "mt-1 font-['Inter'] text-[0.82rem] leading-relaxed text-white/90", // softer supporting copy
          icon:
            "mr-2 w-5 h-5 shrink-0 text-white/90 flex items-center justify-center",
          actionButton:
            "ml-2 rounded-full bg-white/90 px-3 py-1 text-xs font-['Inter'] font-semibold " +
            "text-neutral-900 hover:bg-white focus-visible:outline-none focus-visible:ring-2 " +
            "focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 focus-visible:ring-white/70",
          closeButton:
            "ml-1 text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 " +
            "focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 focus-visible:ring-white/70",
        },
      }}
    />
  );
};

export default ToastProvider;