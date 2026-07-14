import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
"use client";
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

  const searchParams = useSearchParams();
  const [showShareModal, setShowShareModal] = useState(false);
  const [pendingSetup, setPendingSetup] = useState(null);

  useEffect(() => {
    const action = searchParams.get("action");
    const bike = searchParams.get("bike");
    const setup = searchParams.get("setup");
    const notes = searchParams.get("notes");

    if (action === "share" && bike && setup) {
      setPendingSetup({ bike, setup, notes: notes || "" });
      setShowShareModal(true);
    }
  }, [searchParams]);

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
    
      {showShareModal && pendingSetup && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
          <div style={{ backgroundColor: "#111827", padding: "24px", borderRadius: "16px", maxWidth: "420px", width: "100%", border: "1px solid #38bdf8", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}>
            <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
              Confirmar Partilha de Setup
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "16px" }}>
              Recebemos este registo do teu diário da app. Queres publicá-lo no site?
            </p>
            <div style={{ backgroundColor: "#1e293b", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px" }}>
              <p style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "15px", margin: 0 }}>{pendingSetup.bike}</p>
              <p style={{ color: "#cbd5e1", fontSize: "13px", marginTop: "6px", marginBottom: 0 }}>{pendingSetup.setup}</p>
              {pendingSetup.notes && (
                <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "6px", fontStyle: "italic", margin: 0 }}>"{pendingSetup.notes}"</p>
              )}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowShareModal(false)} style={{ padding: "10px 16px", borderRadius: "8px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", cursor: "pointer", fontWeight: "600" }}>
                Cancelar
              </button>
              <button onClick={() => { alert("Setup publicado com sucesso!"); setShowShareModal(false); }} style={{ padding: "10px 16px", borderRadius: "8px", background: "#38bdf8", color: "#090d16", fontWeight: "bold", border: "none", cursor: "pointer" }}>
                Publicar Setup
              </button>
            </div>
          </div>
        </div>
      )}

</main>
  );
}
