"use client";

import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import PhoneTour from "@/components/PhoneTour";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { useI18n } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const PLAY_URL = "https://play.google.com/store/apps/details?id=com.ridetune.app";

/* ── tiny building blocks ────────────────────────────────────────────────── */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-card/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-muted backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
      {children}
    </span>
  );
}

function PlayButton() {
  const { t } = useI18n();
  return (
    <a
      href={PLAY_URL}
      className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-black transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_8px_40px_rgba(74,158,255,0.35)]"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="currentColor" aria-hidden>
        <path d="M3.6 1.8 13.7 12 3.6 22.2c-.4-.3-.6-.8-.6-1.4V3.2c0-.6.2-1.1.6-1.4Zm12.6 7.7L6.3 3.8l9.9 5.7ZM6.3 20.2l9.9-5.7-2.5-2.5-7.4 8.2Zm11.5-9.3 2.8 1.6c1 .6 1 1.6 0 2.2l-2.8 1.6L15.2 12l2.6-2.6Z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-semibold uppercase tracking-widest opacity-60">
          {t.home.getItOn}
        </span>
        <span className="block text-base font-bold">Google Play</span>
      </span>
    </a>
  );
}

function Logo({ big = false }: { big?: boolean }) {
  return (
    <a href="#top" className={`flex items-center ${big ? "gap-3" : "gap-2.5"}`}>
      <span
        className={`${big ? "h-4 w-9" : "h-3 w-7"} rounded-full bg-brand-accent shadow-[0_0_22px_rgba(74,158,255,0.9)]`}
      />
      <span className={`${big ? "text-2xl" : "text-lg"} font-bold tracking-tight`}>
        Ride<span className="text-brand-accent">Tune</span>
      </span>
    </a>
  );
}

/** Full-bleed emotional photo interlude — image and one line, nothing else. */
function Interlude({
  img,
  title,
  sub,
  position = "center",
}: {
  img: string;
  title: string;
  sub?: string;
  position?: string;
}) {
  return (
    <section className="relative flex h-[85vh] items-end overflow-hidden">
      <Image src={img} alt={title} fill className="object-cover" sizes="100vw" style={{ objectPosition: position }} />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/10 to-brand-dark/30" />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-24">
        <Reveal>
          <h2 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight md:text-8xl">
            {title}
          </h2>
          {sub ? <p className="mt-5 max-w-md text-lg text-slate-300">{sub}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}

const cardHover =
  "transition-all duration-300 hover:-translate-y-1.5 hover:bg-brand-card hover:shadow-[0_18px_50px_-18px_rgba(0,0,0,0.7)]";

const tourImgs = [
  "/screens/home.webp",
  "/screens/bikes.webp",
  "/screens/load.webp",
  "/screens/clicks.webp",
  "/screens/tyres.webp",
  "/screens/diary.webp",
];

const rideImgs = ["/img/adventure.jpg", "/img/touring.jpg", "/img/sport.jpg"];

const brands = [
  "Aprilia", "BMW", "CF Moto", "Ducati", "Honda", "Kawasaki", "Kove",
  "KTM", "Macbor", "QJ Motor", "Suzuki", "Triumph", "Voge", "Yamaha",
];

/* ── page ────────────────────────────────────────────────────────────────── */

export default function Home() {
  const { t } = useI18n();
  const h = t.home;

  const tour = h.tour.map(([kicker, title, sub], i) => ({ kicker, title, sub, img: tourImgs[i] }));

  return (
    <main id="top" className="overflow-x-clip bg-brand-dark text-slate-100">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-brand-dark/70 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-6">
          <Logo big />
          <nav className="hidden items-center gap-8 text-sm text-brand-muted md:flex">
            <a href="#features" className="link-underline transition-colors hover:text-white">{h.featuresBadge}</a>
            <a href="#how" className="link-underline transition-colors hover:text-white">{t.nav.how}</a>
            <Link href="/setups" className="link-underline transition-colors hover:text-white">{t.nav.setups}</Link>
            <a href="#premium" className="link-underline transition-colors hover:text-white">{t.nav.premium}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href={PLAY_URL}
              className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-[#04111e] transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_24px_rgba(74,158,255,0.5)]"
            >
              {t.nav.download}
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <Hero />

      {/* DOES YOUR BIKE… */}
      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <Reveal>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">{h.symptomsTitle}</h2>
        </Reveal>
        <RevealGroup className="mx-auto mt-10 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
          {h.symptoms.map((s) => (
            <RevealItem key={s}>
              <div className={`flex items-center gap-4 rounded-2xl bg-brand-card/70 px-6 py-5 ${cardHover}`}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand-border text-brand-accent">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </span>
                <span className="text-slate-200">{s}</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal delay={0.2}>
          <p className="mt-12 text-2xl font-semibold">
            {h.thenRidetune} <span className="text-brand-accent">{h.forYou}</span>
          </p>
        </Reveal>
      </section>

      {/* THE TRUTH */}
      <section className="border-y border-white/5 bg-brand-deep py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <Reveal>
              <Badge>{h.truthBadge}</Badge>
              <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                {h.truthLine1}
                <br />
                {h.truthLine2}
                <br />
                <span className="text-brand-muted">{h.truthLine3}</span>
              </h2>
              <p className="mt-6 max-w-md text-slate-300">
                {h.truthBody}
              </p>
            </Reveal>
            <RevealGroup className="grid gap-5 sm:grid-cols-2">
              {h.problems.map(([title, sub]) => (
                <RevealItem key={title}>
                  <div className={`h-full rounded-3xl bg-brand-card/70 p-7 ${cardHover}`}>
                    <h3 className="font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-muted">{sub}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-32">
        <Reveal className="text-center">
          <Badge>{h.howBadge}</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            {h.howLine1}
            <br />
            {h.howLine2}
          </h2>
        </Reveal>
        <RevealGroup className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {h.steps.map(([title, sub], i) => (
            <RevealItem key={title}>
              <div className={`h-full rounded-3xl bg-brand-card/70 p-8 ${cardHover}`}>
                <div className="text-6xl font-bold text-brand-accent/25">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{sub}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* INTERLUDE — emotion, not features */}
      <Interlude img="/img/touring.jpg" title={h.interludeConfidence} position="center 35%" />

      {/* FEATURES */}
      <section id="features" className="border-y border-white/5 bg-brand-deep py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-end gap-8 lg:grid-cols-2">
            <Reveal>
              <Badge>{h.featuresBadge}</Badge>
              <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
                {h.featuresLine1}
                <br />
                {h.featuresLine2}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-md text-slate-300 lg:justify-self-end">
                {h.featuresIntro}
              </p>
            </Reveal>
          </div>
          <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {h.features.map(([title, sub]) => (
              <RevealItem key={title}>
                <div className={`h-full rounded-3xl bg-brand-card/70 p-8 ${cardHover}`}>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">{sub}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* INSIDE RIDETUNE — sticky phone tour */}
      <section className="py-24">
        <Reveal className="mx-auto max-w-6xl px-6 text-center">
          <Badge>{h.insideBadge}</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            {h.insideTitle}
          </h2>
        </Reveal>
        <PhoneTour steps={tour} />
      </section>

      {/* CTA after the tour */}
      <section className="mx-auto max-w-4xl px-6 pb-32 text-center">
        <Reveal>
          <p className="text-2xl font-semibold text-slate-200">{h.readyWhenYouAre}</p>
          <div className="mt-8 flex justify-center">
            <PlayButton />
          </div>
        </Reveal>
      </section>

      {/* BUILT FOR EVERY RIDE — fullscreen panels */}
      <section id="rides" className="border-t border-white/5">
        <Reveal className="mx-auto max-w-6xl px-6 pt-28 pb-16">
          <Badge>{h.ridesBadge}</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            {h.ridesLine1}
            <br />
            {h.ridesLine2}
          </h2>
        </Reveal>
        {h.rides.map(([name, sub], i) => (
          <div key={name} className="relative h-[80vh] overflow-hidden">
            <Image src={rideImgs[i]} alt={`${name} riding`} fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/40" />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-16">
              <Reveal>
                <h3 className="text-5xl font-bold tracking-tight md:text-7xl">{name}</h3>
                <p className="mt-3 max-w-sm text-lg text-slate-300">{sub}</p>
              </Reveal>
            </div>
          </div>
        ))}
      </section>

      {/* PREMIUM */}
      <section id="premium" className="mx-auto max-w-6xl px-6 py-36">
        <Reveal className="text-center">
          <Badge>{h.premiumBadge}</Badge>
          <h2 className="mt-10 text-6xl font-bold leading-[0.95] tracking-tight md:text-[7.5rem]">
            {h.premiumLine1}
            <br />
            <span className="text-brand-accent">{h.premiumLine2}</span>
          </h2>
        </Reveal>
        <RevealGroup className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg text-slate-300 md:text-xl">
          {h.premiumBullets.map((l) => (
            <RevealItem key={l}>
              <span className="font-medium">{l}</span>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mx-auto mt-24 grid max-w-3xl gap-6 md:grid-cols-2">
          <Reveal>
            <div className={`h-full rounded-3xl bg-brand-card/70 p-9 ${cardHover}`}>
              <h3 className="text-xl font-bold">{h.freeTitle}</h3>
              <p className="mt-1 text-sm text-brand-muted">{h.freeSub}</p>
              <ul className="mt-7 space-y-3.5 text-sm text-slate-300">
                {h.freeFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="text-brand-muted">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href={PLAY_URL}
                className="mt-9 block rounded-full border border-brand-border py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:border-brand-accent hover:shadow-[0_4px_24px_rgba(74,158,255,0.25)]"
              >
                {h.startFree}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative h-full rounded-3xl bg-gradient-to-b from-brand-accent/15 to-brand-card/70 p-9 shadow-[0_0_80px_-24px_rgba(74,158,255,0.5)] ring-1 ring-brand-accent/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_100px_-20px_rgba(74,158,255,0.65)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#04111e]">
                {h.lifetime}
              </span>
              <h3 className="text-xl font-bold">{h.premiumTierTitle}</h3>
              <p className="mt-1 text-sm text-brand-muted">
                <span className="text-3xl font-bold text-white">14.99&nbsp;€</span>{" "}
                <span className="line-through">19.99&nbsp;€</span> · {h.launchPrice}
              </p>
              <ul className="mt-7 space-y-3.5 text-sm text-slate-200">
                {h.premiumFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent/20 text-xs text-brand-accent">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={PLAY_URL}
                className="mt-9 block rounded-full bg-brand-accent py-3 text-center text-sm font-bold text-[#04111e] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_30px_rgba(74,158,255,0.5)]"
              >
                {h.getPremium}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SUPPORTED MOTORCYCLES */}
      <section className="border-y border-white/5 bg-brand-deep py-20">
        <Reveal className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-muted">
            {h.supportedTitle}
          </p>
        </Reveal>
        <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-14 pr-14">
            {[...brands, ...brands].map((b, i) => (
              <span key={`${b}-${i}`} className="text-2xl font-semibold tracking-tight text-white/40 transition-colors duration-300 hover:text-white/90">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED BY RIDERS */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center">
        <Reveal>
          <Badge>{h.trustedBadge}</Badge>
          <div className="mt-8 text-3xl tracking-[0.3em] text-brand-accent">★★★★★</div>
          <p className="mx-auto mt-6 max-w-lg text-lg text-slate-300">
            {h.trustedBody}
          </p>
          <a
            href={PLAY_URL}
            className="mt-8 inline-block rounded-full border border-brand-border px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-accent hover:shadow-[0_4px_24px_rgba(74,158,255,0.25)]"
          >
            {h.rateIt}
          </a>
        </Reveal>
      </section>

      {/* FINAL — the road changes */}
      <section className="relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,158,255,0.1),transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl px-6 py-48 text-center">
          <Reveal>
            <h2 className="text-5xl font-bold leading-[1.02] tracking-tight md:text-8xl">
              {h.finalLine1}
              <br />
              <span className="text-brand-accent">{h.finalLine2}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-14 flex justify-center">
              <PlayButton />
            </div>
            <p className="mx-auto mt-10 max-w-md text-sm leading-relaxed text-brand-muted">
              {h.finalBody}
            </p>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-xs text-brand-muted">
              © {new Date().getFullYear()} RideTune. {t.footer.rights}
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-brand-muted">
            <Link href="/setups" className="link-underline transition-colors hover:text-white">{t.nav.setups}</Link>
            <a href="/privacy" className="link-underline transition-colors hover:text-white">{t.footer.privacy}</a>
            <Link href="/terms" className="link-underline transition-colors hover:text-white">{t.footer.terms}</Link>
            <Link href="/contact" className="link-underline transition-colors hover:text-white">{t.footer.contact}</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
