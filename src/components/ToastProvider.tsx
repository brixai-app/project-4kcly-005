import React from "react";
import { Toaster } from "sonner";

// ToastProvider
// -------------
// This component configures Sonner toasts for the entire AtelierAI Recipes app.
// It does NOT create or manage any app state; it only defines presentation,
// placement, and theming for notifications.
//
// Palette & Layout (editorial-inspired):
// - Neutral porcelain background (#f5f1ea / #faf5ee)
// - Deep ink foreground (#111827)
// - Accents in warm beige / sepia (#d0b49f, #b48a64)
// - Subtle borders & shadows for depth without heaviness.
//
// Usage: Wrap your application tree in <ToastProvider> in src/App.tsx.
// Components can then call `toast()` from `sonner` directly.

export interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors={false}
        closeButton
        expand
        theme="light"
        toastOptions={{
          className:
            // Full-width friendly, editorial toast styling
            "group pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-none border border-neutral-200 bg-[#f9f4ee]/95 px-4 py-3 text-sm shadow-[0_18px_45px_rgba(15,23,42,0.22)] backdrop-blur-sm " +
            "dark:border-neutral-800 dark:bg-neutral-900/95 dark:text-neutral-50",
          style: {
            // Inline style fallbacks for environments without Tailwind processing
            borderRadius: 0,
            borderColor: "#e5e5e5",
            backgroundColor: "rgba(249,244,238,0.95)",
          },
          duration: 3800,
        }}
      />
    </>
  );
};

export default ToastProvider;