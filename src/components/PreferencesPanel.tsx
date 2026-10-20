import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  Button,
  Badge,
  Switch,
  Slider,
  Separator,
} from "@/components/ui/shadcn";
import { useApp, usePreferences, DietaryFlag } from "@/mock";
import { toast } from "sonner";

// NOTE: 100% FRONTEND-ONLY MOCK IMPLEMENTATION – NO BACKEND.
// This component reads and updates preferences via useApp/usePreferences
// from src/mock.ts, which persists to localStorage purely on the client.

const ALL_DIETARY_FLAGS: DietaryFlag[] = [
  "vegan",
  "vegetarian",
  "gluten-free",
  "nut-free",
  "dairy-free",
];

const ALL_CUISINES: string[] = [
  "Italian",
  "Mexican",
  "Asian",
  "Modern",
  "Brunch",
  "Mediterranean",
  "Middle Eastern",
  "Indian",
];

interface PreferencesPanelProps {
  /**
   * Optional: render the trigger as a child instead of the default button.
   * When provided, you are responsible for styling the trigger.
   */
  children?: React.ReactNode;
}

const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ children }) => {
  const { setPreferences } = useApp();
  const prefs = usePreferences();

  const [open, setOpen] = useState(false);
  const [draftDietary, setDraftDietary] = useState<DietaryFlag[]>(
    prefs.dietaryRestrictions,
  );
  const [draftCuisines, setDraftCuisines] = useState<string[]>(
    prefs.preferredCuisines,
  );
  const [draftSpice, setDraftSpice] = useState<number>(prefs.spiceLevel);
  const [draftMaxPrep, setDraftMaxPrep] = useState<number | undefined>(
    prefs.maxPrepTimeMinutes,
  );

  // ensure local draft reflects external updates when panel reopened
  const resetDraftFromSource = () => {
    const latest = usePreferences();
    setDraftDietary(latest.dietaryRestrictions);
    setDraftCuisines(latest.preferredCuisines);
    setDraftSpice(latest.spiceLevel);
    setDraftMaxPrep(latest.maxPrepTimeMinutes);
  };

  const activeDietaryCount = draftDietary.length;
  const activeCuisineCount = draftCuisines.length;

  const spiceLabel = useMemo(() => {
    if (draftSpice <= 1) return "Gentle";
    if (draftSpice === 2) return "Warm";
    if (draftSpice === 3) return "Balanced";
    if (draftSpice === 4) return "Bold";
    return "Fiery";
  }, [draftSpice]);

  const handleToggleDietary = (flag: DietaryFlag) => {
    setDraftDietary((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag],
    );
  };

  const handleToggleCuisine = (cuisine: string) => {
    setDraftCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine],
    );
  };

  const handleClear = () => {
    setDraftDietary([]);
    setDraftCuisines([]);
    setDraftSpice(2);
    setDraftMaxPrep(undefined);
  };

  const handleSave = () => {
    setPreferences({
      dietaryRestrictions: draftDietary,
      preferredCuisines: draftCuisines,
      spiceLevel: draftSpice as 1 | 2 | 3 | 4 | 5,
      maxPrepTimeMinutes: draftMaxPrep,
    });

    toast.success("Preferences updated", {
      description:
        "Your dietary filters and cooking style are now shaping every search.",
    });

    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      // sync with latest stored preferences when opening
      setDraftDietary(prefs.dietaryRestrictions);
      setDraftCuisines(prefs.preferredCuisines);
      setDraftSpice(prefs.spiceLevel);
      setDraftMaxPrep(prefs.maxPrepTimeMinutes);
    }
    setOpen(next);
  };

  const maxPrepDisplay = draftMaxPrep ? `${draftMaxPrep} min` : "No limit";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {children ?? (
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full border-[1px] border-[#d6c3b3] bg-[#f9f5f0] px-3 py-1.5 text-sm font-medium text-[#3e2c23] shadow-sm transition-colors hover:border-[#d94f4f]/70 hover:bg-[#f3e3d5]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Preferences</span>
            {(activeDietaryCount > 0 || activeCuisineCount > 0) && (
              <Badge className="ml-1 rounded-full bg-[#d94f4f] px-2 py-0.5 text-xs font-semibold text-[#fdf7f3]">
                {activeDietaryCount + activeCuisineCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-full max-w-md flex-col border-l border-[#e0d0c0] bg-[#f9f5f0] px-0 py-0 text-[#3e2c23] shadow-xl"
        aria-label="Cooking preferences panel"
      >
        <div className="flex items-center justify-between px-6 pb-3 pt-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8f7460]">
              Tactile filters
            </p>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-[#3e2c23]">
              Shape your plate
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close preferences"
              className="text-[#6b5241] hover:bg-[#f1e2d5] hover:text-[#3e2c23]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="mb-3 bg-[#e2d3c5]" />

        <div className="flex-1 space-y-8 overflow-y-auto px-6 pb-6 pt-1">
          {/* Dietary restrictions */}
          <section className="space-y-3">
            <div className="flex w-full items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-[#3e2c23]">
                  Dietary focus
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#8f7460]">
                  Gently filter recipes to align with how you like to eat. You can
                  combine multiple preferences.
                </p>
              </div>
              {activeDietaryCount > 0 && (
                <Badge className="rounded-full bg-[#e4c9b0] px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-[#4a3326]">
                  {activeDietaryCount} active
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {ALL_DIETARY_FLAGS.map((flag) => {
                const checked = draftDietary.includes(flag);
                const label = flag.replace("-", " ");
                return (
                  <button
                    key={flag}
                    type="button"
                    onClick={() => handleToggleDietary(flag)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d94f4f]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f5f0] ${
                      checked
                        ? "border-[#d94f4f] bg-[#d94f4f]/10 text-[#3e2c23]"
                        : "border-[#dec7b4] bg-[#fbf6f1] text-[#6b5241] hover:border-[#d94f4f]/70 hover:bg-[#f3e3d5]"
                    }`}
                    aria-pressed={checked}
                  >
                    <span
                      className={`h-4 w-7 rounded-full border transition-colors ${
                        checked
                          ? "border-transparent bg-[#d94f4f]"
                          : "border-[#d0bca9] bg-[#fdf7f3]"
                      }`}
                    >
                      <span
                        className={`mt-[2px] ml-[2px] inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
                          checked ? "translate-x-3" : "translate-x-0"
                        }`}
                      />
                    </span>
                    <span className="whitespace-normal break-words capitalize">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <Separator className="bg-[#e2d3c5]" />

          {/* Cuisines */}
          <section className="space-y-3">
            <div className="flex w-full items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-[#3e2c23]">
                  Favorite cuisines
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#8f7460]">
                  Tell TactileChef where you love to travel by plate. Searches and
                  AI recipes will lean into these moods.
                </p>
              </div>
              {activeCuisineCount > 0 && (
                <Badge className="rounded-full bg-[#e4c9b0] px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-[#4a3326]">
                  {activeCuisineCount} chosen
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {ALL_CUISINES.map((cuisine) => {
                const checked = draftCuisines.includes(cuisine);
                return (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => handleToggleCuisine(cuisine)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d94f4f]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f5f0] ${
                      checked
                        ? "border-[#d94f4f] bg-[#d94f4f]/10 text-[#3e2c23]"
                        : "border-[#dec7b4] bg-[#fbf6f1] text-[#6b5241] hover:border-[#d94f4f]/70 hover:bg-[#f3e3d5]"
                    }`}
                    aria-pressed={checked}
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-[#d94f4f]/80" />
                    <span className="whitespace-normal break-words">{cuisine}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <Separator className="bg-[#e2d3c5]" />

          {/* Spice level & time */}
          <section className="space-y-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
              <div className="min-w-0 lg:col-span-7">
                <h3 className="text-sm font-semibold tracking-wide text-[#3e2c23]">
                  Spice comfort zone
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#8f7460]">
                  Set how bold you like your heat. This does not remove recipes –
                  it just guides AI descriptions.
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-[#6b5241]">
                  <span>Mild</span>
                  <span>Very spicy</span>
                </div>
                <div className="mt-1.5">
                  <Slider
                    value={[draftSpice]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(val) => setDraftSpice(val[0] ?? 2)}
                    className="text-[#d94f4f]"
                    aria-label="Preferred spice level"
                  />
                </div>
                <p className="mt-1.5 text-xs font-medium text-[#3e2c23]">
                  {spiceLabel} heat
                </p>
              </div>

              <div className="min-w-0 lg:col-span-5">
                <div className="flex w-full items-center justify-between">
                  <h3 className="text-sm font-semibold tracking-wide text-[#3e2c23]">
                    Prep time
                  </h3>
                  <Switch
                    checked={typeof draftMaxPrep === "number"}
                    onCheckedChange={(checked) => {
                      setDraftMaxPrep(checked ? 30 : undefined);
                    }}
                    aria-label="Limit prep time"
                  />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#8f7460]">
                  Add a soft cap to prep time when you are cooking on busy days.
                </p>
                <AnimatePresence initial={false}>
                  {typeof draftMaxPrep === "number" && (
                    <motion.div
                      key="max-prep-slider"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="mt-3"
                    >
                      <Slider
                        value={[draftMaxPrep]}
                        min={10}
                        max={60}
                        step={5}
                        onValueChange={(v) => setDraftMaxPrep(v[0])}
                        aria-label="Maximum prep time in minutes"
                      />
                      <p className="mt-1 text-xs font-medium text-[#3e2c23]">
                        Up to {maxPrepDisplay}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-[#e2d3c5] bg-[#f6eee6] px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 text-xs text-[#8f7460]">
              <p className="whitespace-normal break-words">
                These settings live only in your browser. No accounts, no
                backend.
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium text-[#6b5241] hover:bg-[#f1e2d5] hover:text-[#3e2c23]"
                onClick={handleClear}
              >
                Reset
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-[#d94f4f] px-4 py-1.5 text-xs font-semibold text-[#fdf7f3] shadow-sm transition-colors hover:bg-[#c64545]"
                onClick={handleSave}
              >
                Save filters
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PreferencesPanel;