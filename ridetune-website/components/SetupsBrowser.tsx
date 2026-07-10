"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export type ModelLite = {
  slug: string;
  brand: string;
  model: string;
  cc: string;
  categoryLabel: string;
  count: number;
};

export default function SetupsBrowser({ models }: { models: ModelLite[] }) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const categories = useMemo(() => {
    const set = Array.from(new Set(models.map((m) => m.categoryLabel))).sort();
    return ["All", ...set];
  }, [models]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return models.filter((m) => {
      if (cat !== "All" && m.categoryLabel !== cat) return false;
      if (!q) return true;
      return `${m.brand} ${m.model}`.toLowerCase().includes(q);
    });
  }, [models, query, cat]);

  const groups = useMemo(() => {
    const map = new Map<string, ModelLite[]>();
    for (const m of filtered) {
      const arr = map.get(m.brand) ?? [];
      arr.push(m);
      map.set(m.brand, arr);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a model…"
            className="w-full rounded-full border border-brand-border bg-brand-card/70 py-2.5 pl-11 pr-4 text-[15px] text-slate-100 placeholder:text-brand-muted focus:border-brand-accent focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                cat === c
                  ? "border-brand-accent bg-brand-accent text-[#04111e] font-semibold"
                  : "border-brand-border bg-brand-card/70 text-brand-muted hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 font-mono text-[13px] uppercase tracking-[0.15em] text-brand-muted">
        {filtered.length} {filtered.length === 1 ? "model" : "models"}
      </p>

      <motion.div
        key={`${cat}|${query}`}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.21, 0.6, 0.35, 1] }}
        className="mt-4 space-y-12"
      >
        {groups.map(([brand, items]) => (
          <section key={brand}>
            <h2 className="mb-5 flex items-baseline gap-3 text-3xl font-bold tracking-tight">
              {brand}
              <span className="font-mono text-sm font-normal uppercase tracking-[0.12em] text-brand-muted">
                {items.length}
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m) => (
                <Link
                  key={m.slug}
                  href={`/setups/${m.slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-brand-border bg-brand-card/70 px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#26313f] hover:bg-brand-card"
                >
                  <div>
                    <div className="text-base font-semibold">{m.model}</div>
                    <div className="mt-0.5 font-mono text-[13px] uppercase tracking-[0.1em] text-brand-muted">
                      {m.categoryLabel} · {m.cc}
                    </div>
                  </div>
                  <span className="text-brand-accent transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-brand-border bg-brand-deep/40 px-6 py-10 text-center text-[15px] text-brand-muted">
            No models match “{query}”. Riding something not listed? Add your setup from the app.
          </p>
        )}
      </motion.div>
    </div>
  );
}
