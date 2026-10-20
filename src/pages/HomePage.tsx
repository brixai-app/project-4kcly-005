import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Leaf, Coffee, Globe2 } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components/ui/shadcn";

// NOTE: This entire application is 100% frontend-only and uses mocked, in-browser data
// and a mock "AI" engine defined in src/mock.ts. There is NO backend or real AI.

const heroImageUrl =
  "https://images.pexels.com/photos/4085266/pexels-photo-4085266.jpeg?auto=compress&cs=tinysrgb&w=1600";

const sectionFade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#060606] text-zinc-50">
      {/* HERO */}
      <section
        className="relative w-full min-h-[80vh] overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
          aria-hidden="true"
        />

        {/* Overlay gradient to ensure contrast and comply with gradient rules */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/30" aria-hidden="true" />

        {/* Content container */}
        <div className="relative z-10 flex flex-col justify-center w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-1 text-xs tracking-[0.2em] uppercase text-zinc-200 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-amber-300" />
              <span>ATELIERAI RECIPES · MOCK IN-BROWSER AI</span>
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight font-['Playfair_Display'] tracking-tight text-zinc-50"
            >
              Curated, cinematic recipes
              <br />
              composed by your private kitchen Atelier.
            </h1>

            <p className="max-w-xl text-sm sm:text-base lg:text-lg text-zinc-200/80 leading-relaxed">
              AtelierAI Recipes is a purely front‑end, editorial generator that remixes your pantry into
              gallery‑worthy plates. No servers, no data exhaust – just mock intelligence living entirely in this
              browser.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  size="lg"
                  className="rounded-full bg-zinc-50 text-black px-7 py-2.5 text-sm tracking-wide font-medium hover:bg-zinc-200 focus-visible:ring-offset-0 focus-visible:ring-zinc-100"
                  onClick={() => navigate("/generate")}
                >
                  Generate a recipe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <button
                type="button"
                onClick={() => {
                  const howItWorks = document.getElementById("how-it-works");
                  if (howItWorks) {
                    howItWorks.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="text-xs sm:text-sm font-medium tracking-[0.22em] uppercase text-zinc-200 hover:text-zinc-50 transition-colors"
              >
                Or stroll through the atelier
              </button>
            </div>

            <div className="flex flex-wrap gap-4 pt-6 text-xs text-zinc-300/80">
              <span className="inline-flex items-center gap-1.5">
                <Leaf className="h-3.5 w-3.5 text-emerald-300" />
                Plant-forward mock engine
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Coffee className="h-3.5 w-3.5 text-amber-200" />
                Espresso-dessert pairings
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5 text-sky-200" />
                Local-only, no network calls
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="w-full bg-[#0b0b0b] border-t border-zinc-800/80"
        aria-labelledby="how-heading"
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.12 }}
            className="space-y-10 lg:space-y-14"
          >
            <motion.header variants={sectionFade} className="space-y-3 max-w-2xl">
              <p className="text-xs tracking-[0.28em] uppercase text-zinc-400">How the atelier composes</p>
              <h2
                id="how-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-['Playfair_Display'] text-zinc-50 tracking-tight"
              >
                A mock AI palate trained on your pantry.
              </h2>
              <p className="text-sm sm:text-base text-zinc-300/85 leading-relaxed">
                Behind the scenes, AtelierAI simply shuffles curated ingredient lists and recipe templates held in
                memory. Every composition is generated on the fly in this tab – no hidden APIs, only elegant
                randomness.
              </p>
            </motion.header>

            <motion.div
              variants={sectionFade}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            >
              <Card className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border-zinc-800/80 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-zinc-50 font-['Playfair_Display'] text-xl">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100/10 text-amber-200 text-xs border border-amber-200/30">
                      01
                    </span>
                    Declare your pantry
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-300/80">
                    Select ingredients from the in-memory Atelier larder or whisper your own in free text.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-xs text-zinc-400 space-y-2">
                  <p>
                    The generator normalizes every ingredient into a quiet canonical form, ready to be woven into
                    titles, descriptions, and steps.
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    All lists live in <code className="font-mono text-[11px]">src/mock.ts</code>; extending the
                    pantry is as simple as editing that single file.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-b from-zinc-900/75 to-zinc-950/95 border-zinc-800/80 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-zinc-50 font-['Playfair_Display'] text-xl">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100/10 text-amber-200 text-xs border border-amber-200/30">
                      02
                    </span>
                    Remix the templates
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-300/80">
                    A mock scoring function pairs your inputs with one of several editorial recipe templates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-xs text-zinc-400 space-y-2">
                  <p>
                    Title fragments, section steps, and tasting notes are composed client‑side, with subtle
                    randomization for variety across generations.
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    No external requests are made; your ideas never leave the browser.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border-zinc-800/80 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-zinc-50 font-['Playfair_Display'] text-xl">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100/10 text-amber-200 text-xs border border-amber-200/30">
                      03
                    </span>
                    Curate your private collection
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-300/80">
                    Save favorite compositions into a local Atelier – a simple localStorage gallery.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-xs text-zinc-400 space-y-2">
                  <p>
                    Every save, remove, and regeneration is accompanied by Sonner toasts, giving a tactile sense of
                    a living, breathing studio.
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Clearing your browser storage simply resets the studio – nothing is synced or shared.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SIGNATURE CUISINES */}
      <section
        className="w-full bg-[#11100f] border-t border-zinc-800/80"
        aria-labelledby="signature-heading"
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            transition={{ staggerChildren: 0.12 }}
            className="space-y-10 lg:space-y-14"
          >
            <motion.header variants={sectionFade} className="flex flex-col lg:flex-row lg:items-end gap-6">
              <div className="space-y-3 max-w-xl">
                <p className="text-xs tracking-[0.28em] uppercase text-zinc-400">Signature mock cuisines</p>
                <h2
                  id="signature-heading"
                  className="text-2xl sm:text-3xl lg:text-4xl font-['Playfair_Display'] text-zinc-50 tracking-tight"
                >
                  Four canvases, infinite plates.
                </h2>
                <p className="text-sm sm:text-base text-zinc-300/85 leading-relaxed">
                  AtelierAI’s mock palate spans bright coastal salads, modern grain bowls, and espresso‑bar desserts.
                  Each recipe is a remix of these foundations, refracted through your chosen ingredients.
                </p>
              </div>
              <div className="lg:ml-auto text-xs text-zinc-400 max-w-sm">
                <p>
                  The generator ships with a small family of cuisines defined in <code className="font-mono text-[11px]">cuisines</code>
                  . Editing or extending them is an invitation to design your own culinary universe.
                </p>
              </div>
            </motion.header>

            <motion.div
              variants={sectionFade}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6"
            >
              <Card className="relative overflow-hidden bg-zinc-950/80 border-zinc-800/80">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-200/5 via-transparent to-amber-900/10 pointer-events-none" />
                <CardHeader className="relative pb-1">
                  <Badge className="mb-2 rounded-full bg-amber-100/10 text-amber-200 border border-amber-200/30 uppercase tracking-[0.22em] text-[10px]">
                    Coastal
                  </Badge>
                  <CardTitle className="font-['Playfair_Display'] text-lg text-zinc-50">
                    Mediterranean Studio Salad
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-300/80">
                    Heirloom tomatoes, cold‑pressed olive oil, and quiet citrus tension.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative pt-1 text-[11px] text-zinc-400 space-y-1.5">
                  <p>Best for: minimalist crudos, unfussy aperitivo spreads.</p>
                  <p className="text-zinc-500">Pairs with: basil, labneh, seasonal market produce.</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-zinc-950/80 border-zinc-800/80">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-200/5 via-transparent to-emerald-900/10 pointer-events-none" />
                <CardHeader className="relative pb-1">
                  <Badge className="mb-2 rounded-full bg-emerald-100/10 text-emerald-200 border border-emerald-200/30 uppercase tracking-[0.22em] text-[10px]">
                    Plant-forward
                  </Badge>
                  <CardTitle className="font-['Playfair_Display'] text-lg text-zinc-50">
                    Modern Grain Atelier
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-300/80">
                    Tri‑colour quinoa, slow‑cooked chickpeas, and silken tofu for quiet strength.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative pt-1 text-[11px] text-zinc-400 space-y-1.5">
                  <p>Best for: weekday suppers with restaurant‑level calm.</p>
                  <p className="text-zinc-500">Pairs with: roasted vegetables, herb oil, citrus‑lifted dressings.</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-zinc-950/80 border-zinc-800/80">
                <div className="absolute inset-0 bg-gradient-to-b from-stone-200/5 via-transparent to-stone-900/10 pointer-events-none" />
                <CardHeader className="relative pb-1">
                  <Badge className="mb-2 rounded-full bg-stone-100/10 text-stone-200 border border-stone-200/30 uppercase tracking-[0.22em] text-[10px]">
                    Modern European
                  </Badge>
                  <CardTitle className="font-['Playfair_Display'] text-lg text-zinc-50">
                    Sourdough & Wild Mushroom
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-300/80">
                    Toasted crumb, aged Parmesan, and deep, woodsy umami notes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative pt-1 text-[11px] text-zinc-400 space-y-1.5">
                  <p>Best for: brunch plates and luxe, savoury toasts.</p>
                  <p className="text-zinc-500">Pairs with: soft‑boiled eggs, herb salad, bitter greens.</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-zinc-950/80 border-zinc-800/80">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-300/6 via-transparent to-amber-900/15 pointer-events-none" />
                <CardHeader className="relative pb-1">
                  <Badge className="mb-2 rounded-full bg-amber-100/10 text-amber-200 border border-amber-200/30 uppercase tracking-[0.22em] text-[10px]">
                    Espresso bar
                  </Badge>
                  <CardTitle className="font-['Playfair_Display'] text-lg text-zinc-50">
                    Espresso Dessert Plates
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-300/80">
                    Madagascar vanilla, almond praline, and dark, inky espresso.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative pt-1 text-[11px] text-zinc-400 space-y-1.5">
                  <p>Best for: late‑night desserts with a restrained, architectural feel.</p>
                  <p className="text-zinc-500">Pairs with: berries, oat milk, shards of dark chocolate.</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="w-full bg-black border-t border-zinc-900" aria-labelledby="cta-heading">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-14 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 border border-zinc-800 rounded-[28px] bg-gradient-to-r from-zinc-900/80 via-zinc-950 to-zinc-900/85 px-6 sm:px-8 lg:px-10 py-8 lg:py-9 shadow-[0_18px_55px_rgba(0,0,0,0.85)]"
          >
            <div className="flex-1 space-y-3">
              <p className="text-xs tracking-[0.28em] uppercase text-zinc-400">Begin composing</p>
              <h2
                id="cta-heading"
                className="text-xl sm:text-2xl lg:text-3xl font-['Playfair_Display'] text-zinc-50 tracking-tight"
              >
                Step into the Atelier and let the mock chef improvise.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300/85 max-w-xl">
                In under a minute you will have a fully generated recipe card ready to save, adapt, and stage. All of
                it lives only here – in your browser, in this moment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  size="lg"
                  className="rounded-full bg-zinc-50 text-black px-6 py-2.5 text-sm tracking-wide font-medium hover:bg-zinc-200 focus-visible:ring-offset-0 focus-visible:ring-zinc-100 whitespace-nowrap"
                  onClick={() => navigate("/generate")}
                >
                  Open the generator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
              <p className="text-[11px] text-zinc-400 max-w-[220px]">
                No sign‑in, no sync, no backend. Just a luxurious mock of what your future culinary studio could feel
                like.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;