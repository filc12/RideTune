import type { Metadata } from "next";
import { SETUP_MODELS } from "@/data/setups";
import { SetupsNav, SetupsFooter } from "@/components/SetupsChrome";
import SetupsBrowser, { type ModelLite } from "@/components/SetupsBrowser";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Motorcycle suspension setups by model",
  description:
    "Reference suspension setups for popular motorcycles — sag, preload, rebound and compression starting points for road, touring, two-up and off-road. Browse free.",
  alternates: { canonical: "/setups" },
  openGraph: {
    type: "website",
    url: "/setups",
    title: "Motorcycle suspension setups by model — RideTune",
    description:
      "Sag, preload, rebound and compression starting points for popular motorcycles. Browse free; personalise to your exact load in the app.",
  },
};

export default function SetupsIndex() {
  const models: ModelLite[] = SETUP_MODELS.map((m) => ({
    slug: m.slug,
    brand: m.brand,
    model: m.model,
    cc: m.cc,
    categoryLabel: m.categoryLabel,
    count: m.setups.length,
  }));

  return (
    <main className="overflow-x-clip bg-brand-dark text-slate-100">
      <SetupsNav />

      <FadeIn>
        <section className="mx-auto max-w-6xl px-6 pb-12 pt-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-card/60 px-4 py-1.5 font-mono text-[13px] uppercase tracking-[0.2em] text-brand-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
            Setup library · verified against OEM
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.03] tracking-tight md:text-6xl">
            Suspension setups,
            <br />
            <span className="text-brand-accent">for your exact bike.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Reference starting points for sag, preload, rebound and compression —
            by model and by how you ride. Browse and contribute for free;
            personalise to your exact load with Premium.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-28">
          <SetupsBrowser models={models} />
        </section>
      </FadeIn>

      <SetupsFooter />
    </main>
  );
}
