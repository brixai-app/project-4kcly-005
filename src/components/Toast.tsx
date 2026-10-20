import React from "react";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Toast.tsx
 *
 * Central Sonner <Toaster /> configuration for TactileChef.
 *
 * IMPORTANT: This is a 100% FRONTEND-ONLY MOCKED UX.
 * All actions that trigger toasts (saving favorites, generating recipes,
 * updating preferences, etc.) are simulated entirely in the browser using
 * local component state and the mock app context from src/mock.ts.
 * No backend or network calls are performed.
 */

export const AppToaster: React.FC = () => {
  return (
    // AnimatePresence is optional here but gives us a smoother mount/unmount
    <AnimatePresence>
      <motion.div
        key="tactilechef-toaster"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            // Warm tactile surface
            style: {
              background: "#f9f5f0",
              color: "#3e2c23",
              borderRadius: 12,
              border: "1px solid rgba(120, 94, 75, 0.18)",
              boxShadow:
                "0 18px 45px rgba(40, 26, 19, 0.18), 0 0 0 1px rgba(249, 245, 240, 0.7)",
              paddingInline: 14,
            },
            className:
              "backdrop-blur-sm shadow-md text-sm font-normal font-['Inter']", // keep typography aligned
            duration: 3200,
          }}
          // The theme here just controls built-in Sonner color decisions.
          // We still fully control the surface via toastOptions.style.
          theme="light"
          closeButton
          expand={false}
          visibleToasts={4}
        />
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Convenience helpers re-exporting Sonner's core APIs so the rest of
 * the app can import from a single tactile-chef themed module if desired.
 *
 * Example usage in components (still 100% client-side mock):
 *   import { showSuccessToast, showErrorToast } from "@/components/Toast";
 *   showSuccessToast("Saved to favorites");
 */

export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    style: {
      // Slightly stronger accent ring for success
      borderColor: "rgba(44, 151, 88, 0.4)",
    },
  });
};

export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
    style: {
      // Use the brand accent for error focus while keeping warm neutral base
      borderColor: "rgba(217, 79, 79, 0.7)",
    },
  });
};

export const showInfoToast = (message: string, description?: string) => {
  toast(message, {
    description,
    style: {
      borderColor: "rgba(122, 92, 74, 0.45)",
    },
  });
};

export const showActionToast = (
  message: string,
  options?: {
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
  },
) => {
  const { description, actionLabel, onAction } = options || {};

  toast(message, {
    description,
    action:
      actionLabel && onAction
        ? {
            label: actionLabel,
            onClick: onAction,
          }
        : undefined,
    style: {
      borderColor: "rgba(217, 79, 79, 0.55)",
    },
  });
};

export default AppToaster;