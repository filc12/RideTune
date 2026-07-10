import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SETUP_MODELS, getModel, USE_LABEL } from "@/data/setups";
import { getCommunitySetups } from "@/data/community";
import { SITE_URL, PLAY_URL } from "@/site.config";
import { SetupsNav, SetupsFooter } from "@/components/SetupsChrome";
import FadeIn from "@/components/FadeIn";

export function generateStaticParams() {
  return SETUP_MODELS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getModel(slug);
  if (!m) return { title: "Setup not found" };

  const name = `${m.brand} ${m.model}`;
  const title = `${name} suspension setup`;
  const description = `Suspension setup for the ${name}: sag, preload, rebound and compression starting points for road, touring, two-up and off-road. Reference values you can personalise to your load in RideTune.`;

  return {
    title,
    description,
    alternates: { canonical: `/setups/${m.slug}` },
    openGraph: {
      type: "article",
      url: `/setups/${m.slug}`,
      title: `${title} — RideTune`,
      description,
    },
  };
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="font-mono text-[13px] uppercase tracking-[0.12em] text-brand-muted">
        {label}
      </div>
    </div>
  );
}

function Value({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className="font-mono text-[13px] uppercase tracking-[0.08em] text-brand-muted">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold">
        {value} <span className="text-brand-accent">{unit}</span>
      </div>
    </div>
  );
}

function OemBadge({ match }: { match: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    verified: { label: "✓ Verified", cls: "text-[#4ade80] bg-[#4ade80]/10" },
    outside_oem: { label: "⚠ Outside OEM", cls: "text-[#fbbf24] bg-[#fbbf24]/10" },
    unverified: { label: "Unverified", cls: "text-brand-muted bg-white/5" },
  };
  const b = map[match] ?? map.unverified;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] ${b.cls}`}>
      {b.label}
    </span>
  );
}

export default async function ModelSetups({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = getModel(slug);
  if (!m) notFound();

  const name = `${m.brand} ${m.model}`;
  const community = await getCommunitySetups(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Setups", item: `${SITE_URL}/setups` },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}/setups/${m.slug}` },
    ],
  };

  return (
    <main className="overflow-x-clip bg-brand-dark text-slate-100">
      <SetupsNav />

      <FadeIn>
      <div className="mx-auto max-w-6xl px-6 pt-32">
        <nav className="font-mono text-[13px] uppercase tracking-[0.12em] text-brand-muted">
          <Link href="/setups" className="transition-colors hover:text-brand-accent">
            Setups
          </Link>
          <span className="px-2">·</span>
          <span>{m.categoryLabel}</span>
          <span className="px-2">·</span>
          <span className="text-brand-accent">{name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-6xl border-b border-brand-border px-6 pb-8 pt-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-card/60 px-4 py-1.5 font-mono text-[13px] uppercase tracking-[0.2em] text-brand-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
          Reference setups · verified against OEM
        </span>
        <h1 className="mt-5 text-4xl font-bold leading-[1.03] tracking-tight md:text-6xl">
          {m.brand} <span className="text-brand-accent">{m.model}</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate-300">
          Suspension starting points by how you ride and load the {m.model}.
          Browse for free — personalise to your exact weight with Premium.
        </p>
        <div className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
          <Stat value={String(m.setups.length)} label="Reference setups" />
          <Stat value={`${m.oem.frontSag} / ${m.oem.rearSag} mm`} label="OEM sag target F / R" />
          <Stat value={m.cc} label="Displacement" />
          <Stat value={m.categoryLabel} label="Category" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-brand-accent/25 bg-gradient-to-b from-brand-accent/[0.07] to-brand-card px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent-soft">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <div>
              <div className="text-[15px] font-semibold">Your personalised setup</div>
              <div className="text-[13px] text-brand-muted">
                Enter your exact rider + luggage weight and get the clicks dialled in for you.
              </div>
            </div>
          </div>
          <a
            href={PLAY_URL}
            className="whitespace-nowrap rounded-full bg-brand-accent px-4 py-2.5 text-sm font-bold text-[#04111e] transition-transform duration-200 hover:scale-[1.03]"
          >
            Unlock in the app →
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {m.setups.map((s) => (
            <article
              key={s.load}
              className="flex flex-col gap-4 rounded-3xl border border-brand-border bg-brand-card/70 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-brand-accent/10 px-3 py-1 text-[13px] text-brand-accent-soft">
                    {USE_LABEL[s.load]}
                  </span>
                  <span className="text-[13px] text-brand-muted">{s.weightHint}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/10 px-2.5 py-1 text-[13px] text-brand-accent-soft">
                  RideTune ref.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-brand-border py-4">
                <Value label="Front sag" value={String(s.frontSag)} unit="mm" />
                <Value label="Rear sag" value={String(s.rearSag)} unit="mm" />
                <Value label="Preload" value={s.preload} unit="" />
                <Value label="Rebound" value={String(s.rebound)} unit="clicks" />
                <Value label="Compression" value={String(s.compression)} unit="clicks" />
              </div>

              <p className="text-sm leading-relaxed text-slate-300">{s.note}</p>
            </article>
          ))}
        </div>

        <p className="mt-5 text-[13px] leading-relaxed text-brand-muted">
          These are reference starting points derived from OEM sag targets and
          typical load adjustments — not a substitute for measuring your own sag.
          Always set sag first, then fine-tune rebound and compression by feel.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Community setups
            {community.length > 0 && (
              <span className="ml-3 font-mono text-sm font-normal uppercase tracking-[0.12em] text-brand-muted">
                {community.length}
              </span>
            )}
          </h2>
          <a
            href={PLAY_URL}
            className="hidden rounded-full border border-brand-border px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-brand-accent sm:inline-block"
          >
            Share yours in the app
          </a>
        </div>

        {community.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-border bg-brand-deep/40 px-6 py-12 text-center">
            <p className="mx-auto max-w-md text-[15px] leading-relaxed text-brand-muted">
              No community setups for the {m.model} yet. Riders share the setups
              that actually work for them — with their real load and how it felt.
              Be one of the first.
            </p>
            <a
              href={PLAY_URL}
              className="mt-7 inline-block rounded-full border border-brand-border px-7 py-3 text-[15px] font-semibold text-white transition-colors duration-300 hover:border-brand-accent"
            >
              Share your setup in the app
            </a>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {community.map((s) => (
              <article
                key={s.id}
                className="flex flex-col gap-4 rounded-3xl border border-brand-border bg-brand-card/70 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-brand-accent/10 px-3 py-1 text-[13px] text-brand-accent-soft">
                      {USE_LABEL[s.load]}
                    </span>
                    <span className="text-[13px] text-brand-muted">
                      {s.rider_gear_kg} kg
                      {s.country ? ` · ${s.country.toUpperCase()}` : ""}
                    </span>
                  </div>
                  <OemBadge match={s.oem_match} />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-brand-border py-4">
                  <Value label="Front sag" value={String(s.front_sag_mm)} unit="mm" />
                  <Value label="Rear sag" value={String(s.rear_sag_mm)} unit="mm" />
                  <Value label="Preload" value={s.preload} unit="" />
                  <Value label="Rebound" value={String(s.rebound)} unit="clicks" />
                  <Value label="Compression" value={String(s.compression)} unit="clicks" />
                </div>

                {s.note ? (
                  <p className="text-sm leading-relaxed text-slate-300">
                    &ldquo;{s.note}&rdquo;
                  </p>
                ) : null}

                <div className="flex items-center justify-between text-[13px] text-brand-muted">
                  <span>Anonymous rider</span>
                  <span className="text-brand-accent-soft">▲ {s.helpful_count} helpful</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      </FadeIn>

      <SetupsFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
