import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Separator } from "@/components/ui/shadcn";

// NOTE: This page describes a 100% frontend-only experience.
// All "AI" behaviour is mocked locally in src/mock.ts using in-memory data + localStorage.

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[radial-gradient(circle_at_top,_#111111,_#050505)] text-zinc-50">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden min-h-[70vh] flex items-center">
        {/* Background image overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/4085266/pexels-photo-4085266.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          }}
        />
        {/* Gradient veil for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/40" />

        <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-24 lg:py-32 flex flex-col gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
            className="max-w-3xl space-y-6"
          >
            <p className="tracking-[0.3em] uppercase text-xs md:text-sm text-zinc-300">
              AtelierAI Recipes • About the Atelier
            </p>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl lg:text-6xl leading-tight md:leading-[1.1]">
              Crafted like an editorial, engineered to live entirely in your browser.
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-zinc-200 max-w-2xl">
              AtelierAI Recipes is not a cloud service. It is a self-contained culinary sketchbook that
              composes recipes from curated templates and ingredient vocabularies — simulated locally,
              stored locally, and forgotten when you close your browser.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <main className="w-full bg-[#070707]">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 lg:py-28 space-y-24">
          {/* In-browser engine */}
          <motion.section
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid gap-12 lg:grid-cols-[minmax(0,_1.2fr)_minmax(0,_1fr)] items-start"
          >
            <div className="space-y-6">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl lg:text-4xl">
                A mock AI atelier, running quietly in the front row of your browser.
              </h2>
              <p className="text-zinc-200 text-sm md:text-base leading-relaxed max-w-xl">
                The so‑called "AI" inside AtelierAI Recipes is intentionally simple and transparent. It
                remixes a library of hand-crafted templates, ingredient profiles, and tonal fragments to
                sketch original-feeling recipes — but every decision happens inside your device.
              </p>
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed max-w-xl">
                There is no model call, no network request, and no hidden training pipeline. The
                generator chooses templates, weaves in your ingredients, then writes an editorial-style
                narrative using deterministic rules and a touch of randomness for surprise.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="bg-zinc-900/70 border-zinc-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-['Playfair_Display'] text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    How the mock engine composes
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-300">
                    A high-level view of the in-browser remix process.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs md:text-sm text-zinc-200 space-y-3">
                  <div>
                    <span className="font-semibold text-zinc-100">1. Curated vocabulary.</span>
                    <p className="mt-1">
                      Ingredients, cuisines, and templates live in a single TypeScript module
                      (<code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[0.7rem]">src/mock.ts</code>)
                      which doubles as the only source of truth for data and local state.
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-100">2. Local composition.</span>
                    <p className="mt-1">
                      When you generate, the engine scores templates against your inputs, injects your
                      ingredients into narrative fragments, and assembles a coherent recipe — all in
                      memory, on this page.
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-100">3. Private collection.</span>
                    <p className="mt-1">
                      Favorites are simply JSON objects persisted to
                      <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[0.7rem]">localStorage</code>
                      under a namespaced key. Clearing your browser data erases the atelier.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          <Separator className="bg-zinc-800" />

          {/* Privacy & local-only state */}
          <motion.section
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid gap-10 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1.1fr)] items-start"
          >
            <div className="space-y-6">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl lg:text-4xl flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-300" />
                Privacy as a default ingredient.
              </h2>
              <p className="text-zinc-200 text-sm md:text-base leading-relaxed max-w-xl">
                AtelierAI Recipes is designed as a contained experiment. There is no account system, no
                analytics beacon, and no backend to speak of. All preferences, favorites, and generated
                recipes live solely inside your browser&apos;s storage.
              </p>
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed max-w-xl">
                This means your collection is beautifully ephemeral: tied to this device, this profile,
                this moment in time. It&apos;s closer to a physical notebook than a social platform — your
                ideas are not uploaded, shared, or mined.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="bg-zinc-900/70 border-zinc-800/80 backdrop-blur-sm flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Local mock state</CardTitle>
                  <CardDescription className="text-[0.7rem] text-zinc-400">
                    A single module, no external store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-[0.72rem] text-zinc-300 space-y-2 flex-1">
                  <p>
                    All ingredient lists, recipe templates, and favorites live in
                    <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[0.65rem]">src/mock.ts</code>.
                  </p>
                  <p>
                    The same module manages in-memory state, exposes helper functions, and persists
                    changes to <span className="font-semibold">localStorage</span> using a small safe
                    wrapper.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/70 border-zinc-800/80 backdrop-blur-sm flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Transparent limitations</CardTitle>
                  <CardDescription className="text-[0.7rem] text-zinc-400">
                    No real AI, no remote persistence.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-[0.72rem] text-zinc-300 space-y-2 flex-1">
                  <p>
                    The experience intentionally stops short of being a full backend product. There are
                    no accounts, no syncing across devices, and no large language model involved.
                  </p>
                  <p>
                    Think of it as a concept car for an AI cookbook — a polished, fully mocked
                    prototype you can touch.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          <Separator className="bg-zinc-800" />

          {/* Design ethos */}
          <motion.section
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="space-y-10"
          >
            <div className="space-y-4 max-w-3xl">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl lg:text-4xl">
                An editorial lens for interface, not just imagery.
              </h2>
              <p className="text-zinc-200 text-sm md:text-base leading-relaxed">
                The interface borrows from print magazines and high-end cookbooks: generous negative
                space, sharp typographic contrast, and imagery that stretches edge-to-edge rather than
                hiding inside cards. Micro-animations from Framer Motion keep interactions soft and
                tactile instead of theatrical.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-zinc-900/70 border-zinc-800/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Typography</CardTitle>
                  <CardDescription className="text-[0.7rem] text-zinc-400">
                    Playfair Display for a gallery feel.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-[0.72rem] text-zinc-300 space-y-1.5">
                  <p>
                    Headlines lean on a classic serif to frame each recipe like a headline feature,
                    while supporting text uses a neutral sans for clarity and rhythm across long
                    paragraphs.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/70 border-zinc-800/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Palette</CardTitle>
                  <CardDescription className="text-[0.7rem] text-zinc-400">
                    Ink, bone, and a whisper of warmth.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-[0.72rem] text-zinc-300 space-y-1.5">
                  <p>
                    The app stays in a restrained spectrum of near-black, soft bone, and subtle warm
                    beige accents to keep the focus on composition, not color noise.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/70 border-zinc-800/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Motion</CardTitle>
                  <CardDescription className="text-[0.7rem] text-zinc-400">
                    Micro-interactions, not fireworks.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-[0.72rem] text-zinc-300 space-y-1.5">
                  <p>
                    Buttons, cards, and transitions respond with small, carefully tuned motions so
                    generating and saving recipes feels responsive without overwhelming the reading
                    experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        </div>

        {/* CTA Band */}
        <section className="w-full border-t border-zinc-800 bg-[radial-gradient(circle_at_top,_#111111,_#050505)]">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <h3 className="font-['Playfair_Display'] text-xl md:text-2xl">
                Ready to see the mock atelier in motion?
              </h3>
              <p className="text-sm md:text-base text-zinc-200">
                Compose a recipe using nothing but your pantry and your browser. Every favorite you
                save stays here, on this device, waiting for the next time you cook.
              </p>
            </div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Button
                asChild
                className="bg-zinc-100 text-black px-6 py-2.5 rounded-full text-xs md:text-sm tracking-[0.18em] uppercase font-semibold hover:bg-zinc-200 transition-colors duration-200"
              >
                <Link to="/generate" className="flex items-center gap-2">
                  Open the generator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;