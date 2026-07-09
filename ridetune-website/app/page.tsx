import Image from "next/image";
import Phone from "@/components/Phone";

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

function PlayButton({ light = false }: { light?: boolean }) {
  return (
    <a
      href={PLAY_URL}
      className={`inline-flex items-center gap-3 rounded-full px-6 py-3 transition-transform hover:scale-[1.03] ${
        light ? "bg-white text-black" : "bg-brand-accent text-[#04111e]"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M3.6 1.8 13.7 12 3.6 22.2c-.4-.3-.6-.8-.6-1.4V3.2c0-.6.2-1.1.6-1.4Zm12.6 7.7L6.3 3.8l9.9 5.7ZM6.3 20.2l9.9-5.7-2.5-2.5-7.4 8.2Zm11.5-9.3 2.8 1.6c1 .6 1 1.6 0 2.2l-2.8 1.6L15.2 12l2.6-2.6Z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-semibold uppercase tracking-widest opacity-70">
          Get it on
        </span>
        <span className="block text-base font-bold">Google Play</span>
      </span>
    </a>
  );
}

function IPhoneSoon() {
  return (
    <span className="inline-flex items-center gap-3 rounded-full border border-brand-border px-6 py-3 text-brand-muted">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M16.4 12.9c0-2.7 2.2-4 2.3-4.1-1.3-1.8-3.2-2.1-3.9-2.1-1.6-.2-3.2 1-4 1s-2.1-1-3.5-1c-1.8 0-3.4 1-4.3 2.6-1.9 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8s2 .8 3.5.8c1.4 0 2.3-1.3 3.2-2.6a11 11 0 0 0 1.4-3c-.1 0-2.7-1-2.7-4Zm-2.6-7.5c.7-.9 1.2-2.1 1.1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.3 1.1.1 2.3-.6 3-1.5Z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-semibold uppercase tracking-widest opacity-70">
          Coming soon
        </span>
        <span className="block text-base font-bold text-white/70">for iPhone</span>
      </span>
    </span>
  );
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <span className="h-3 w-7 rounded-full bg-brand-accent shadow-[0_0_18px_rgba(74,158,255,0.9)]" />
      <span className="text-lg font-bold tracking-tight">
        Ride<span className="text-brand-accent">Tune</span>
      </span>
    </a>
  );
}

/* ── content ─────────────────────────────────────────────────────────────── */

const problems = [
  ["Too much front dive", "Braking hard nose-plants the bike and unsettles the chassis."],
  ["Feels unstable", "Weaves and vagueness at speed erode your trust."],
  ["Harsh over bumps", "Your spine takes hits that the suspension should absorb."],
  ["Poor traction", "Tires skip instead of tracking through corners."],
  ["Too soft with luggage", "Add a passenger or panniers and the bike wallows."],
] as const;

const steps = [
  ["Choose your motorcycle", "Pick your exact model from 100+ bikes with OEM-based data."],
  ["Add rider, passenger & luggage", "Enter what you actually carry — not a factory assumption."],
  ["Receive your personalized setup", "Clear click values for preload, rebound and compression."],
  ["Ride with confidence", "Feel the difference on the very first ride."],
] as const;

const features = [
  ["OEM Suspension Database", "OEM-based, verified, calculated or estimated data — always labelled."],
  ["Smart Load Calculator", "Rider, passenger and luggage — recalculated in real time."],
  ["Suspension Recommendations", "Preload, rebound and compression, in clicks, for you."],
  ["Suspension Diagnostics", "Describe what you feel. Get a targeted fix."],
  ["Ride Diary", "Track every ride, every setup, every sensation."],
  ["Tyre Pressure Guide", "Cold-tyre pressures matched to your load."],
  ["SAG Reference", "The one measurement that changes everything."],
  ["6 Languages", "English, Português, Español, Français, Deutsch, Italiano."],
  ["Premium Lifetime", "One payment. Lifetime access. No subscriptions."],
] as const;

const tour = [
  ["HOME", "Suspension setup, made simple.", "Your current setup, load mode and status — the moment you open the app.", "/screens/home.webp"],
  ["BIKE SELECTION", "100+ bikes. All the ones you ride.", "Adventure, naked, sport, touring, supermoto and more — OEM-based data.", "/screens/bikes.webp"],
  ["LOAD CALCULATOR", "Adjust for your real load.", "Rider, passenger, luggage — the setup is recalculated instantly.", "/screens/load.webp"],
  ["RECOMMENDATIONS", "Count the clicks with confidence.", "Preload, rebound and compression, in plain language, for your bike.", "/screens/clicks.webp"],
  ["RIDE DIARY", "Keep every ride that works.", "Log setup changes and sensations. Build a library only you can build.", "/screens/diary.webp"],
] as const;

/* ── page ────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main id="top" className="bg-brand-dark text-slate-100">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-brand-dark/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-brand-muted md:flex">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#how" className="transition-colors hover:text-white">How it works</a>
            <a href="#premium" className="transition-colors hover:text-white">Premium</a>
            <a href="#rides" className="transition-colors hover:text-white">For every ride</a>
          </nav>
          <a
            href={PLAY_URL}
            className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-[#04111e] transition-transform hover:scale-105"
          >
            Download
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
        <Image
          src="/img/hero.jpg"
          alt="Motorcycle rider on a mountain road"
          fill
          priority
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/40 to-brand-dark" />
        <div className="relative mx-auto max-w-4xl px-6 pt-28 pb-20 text-center">
          <Badge>Motorcycle suspension, intelligent</Badge>
          <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Every ride starts with
            <br />
            the <span className="text-brand-accent">right setup.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            RideTune finds your perfect motorcycle suspension setup using OEM
            data, intelligent calculations and the real-world way you ride.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <PlayButton light />
            <IPhoneSoon />
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-brand-muted">
            {["OEM Data", "Ride Diary", "Diagnostics", "Tyre Pressures"].map((c) => (
              <span key={c} className="rounded-full border border-brand-border bg-brand-card/50 px-4 py-1.5">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* THE TRUTH */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <div>
            <Badge>The truth about suspension</Badge>
            <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Your motorcycle
              <br />
              isn&apos;t the problem.
              <br />
              <span className="text-brand-muted">Your setup is.</span>
            </h2>
            <p className="mt-6 max-w-md text-slate-300">
              Most modern motorcycles ship with excellent suspension. Very few
              riders ever unlock what&apos;s already underneath them. RideTune
              closes that gap — without the guesswork.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {problems.map(([title, sub]) => (
              <div
                key={title}
                className="rounded-2xl border border-brand-border bg-brand-card/60 p-5 transition-colors hover:border-brand-accent/40"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-sm text-brand-muted">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-y border-white/5 bg-brand-deep py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <Badge>How it works</Badge>
            <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Four steps between you
              <br />
              and the perfect setup.
            </h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(([title, sub], i) => (
              <div key={title} className="rounded-2xl border border-brand-border bg-brand-card/50 p-6">
                <div className="text-5xl font-bold text-brand-accent/30">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-brand-muted">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-28">
        <div className="grid items-end gap-8 lg:grid-cols-2">
          <div>
            <Badge>Features</Badge>
            <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Everything the manual
              <br />
              doesn&apos;t tell you.
            </h2>
          </div>
          <p className="max-w-md text-slate-300 lg:justify-self-end">
            Built as a workshop tool, refined to feel like a Sunday-morning
            app. Every feature exists to give you the same thing: confidence.
          </p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, sub]) => (
            <div
              key={title}
              className="rounded-2xl border border-brand-border bg-brand-card/60 p-6 transition-colors hover:border-brand-accent/40"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-1.5 text-sm text-brand-muted">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INSIDE RIDETUNE — screen tour */}
      <section className="border-y border-white/5 bg-brand-deep py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <Badge>Inside RideTune</Badge>
            <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              A guided tour, one screen at a time.
            </h2>
          </div>
          <div className="mt-20 space-y-24">
            {tour.map(([kicker, title, sub, img], i) => (
              <div
                key={kicker}
                className={`flex flex-col items-center gap-12 lg:flex-row ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="shrink-0">
                  <Phone src={img} alt={title} width={290} />
                </div>
                <div className="max-w-md text-center lg:text-left">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-muted">
                    <span className="text-brand-accent">{String(i + 1).padStart(2, "0")}</span>
                    {"  ——  "}
                    {kicker}
                  </p>
                  <h3 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{title}</h3>
                  <p className="mt-4 text-slate-300">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM */}
      <section id="premium" className="mx-auto max-w-6xl px-6 py-28">
        <div className="text-center">
          <Badge>RideTune Premium Lifetime</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Buy once.
            <br />
            <span className="text-brand-accent">Ride forever.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-slate-300">
            Everything you need to get started is free. Premium is one payment,
            lifetime access — no subscriptions, ever.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-3xl border border-brand-border bg-brand-card/50 p-8">
            <h3 className="text-xl font-bold">Free</h3>
            <p className="mt-1 text-sm text-brand-muted">Try it on your bike</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {["1 motorcycle", "Solo load mode", "OEM data browser", "Basic sag guide", "Basic diagnostics"].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="text-brand-muted">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href={PLAY_URL}
              className="mt-8 block rounded-full border border-brand-border py-3 text-center text-sm font-semibold text-white transition-colors hover:border-brand-accent"
            >
              Start free
            </a>
          </div>

          {/* Premium */}
          <div className="relative rounded-3xl border border-brand-accent/50 bg-gradient-to-b from-brand-accent/10 to-brand-card/50 p-8 shadow-[0_0_60px_-20px_rgba(74,158,255,0.4)]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#04111e]">
              Lifetime
            </span>
            <h3 className="text-xl font-bold">Premium</h3>
            <p className="mt-1 text-sm text-brand-muted">
              <span className="text-2xl font-bold text-white">14.99&nbsp;€</span>{" "}
              <span className="line-through">19.99&nbsp;€</span> · one payment, launch price
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              {[
                "All motorcycles",
                "All load modes",
                "Saved setups & unlimited Ride Diary",
                "Smart diagnostics",
                "Future bike updates included",
                "Lifetime updates",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent/20 text-xs text-brand-accent">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={PLAY_URL}
              className="mt-8 block rounded-full bg-brand-accent py-3 text-center text-sm font-bold text-[#04111e] transition-transform hover:scale-[1.02]"
            >
              Get Premium in the app
            </a>
          </div>
        </div>
      </section>

      {/* FOR EVERY RIDE */}
      <section id="rides" className="border-y border-white/5 bg-brand-deep py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Badge>Built for every ride</Badge>
          <h2 className="mt-6 max-w-xl text-4xl font-bold tracking-tight md:text-5xl">
            Whatever the road,
            <br />
            whatever the load.
          </h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <div className="relative h-96 overflow-hidden rounded-3xl border border-brand-border">
              <Image
                src="/img/adventure.jpg"
                alt="Adventure riding"
                fill
                className="object-cover opacity-70 transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
              <span className="absolute bottom-6 left-6 text-2xl font-bold">Adventure</span>
            </div>
            <div className="relative h-96 overflow-hidden rounded-3xl border border-brand-border">
              <Image
                src="/img/touring.jpg"
                alt="Touring motorcycle with panniers on a coastal road"
                fill
                className="object-cover opacity-70 transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
              <span className="absolute bottom-6 left-6 text-2xl font-bold">Touring</span>
            </div>
            <div className="relative h-96 overflow-hidden rounded-3xl border border-brand-border">
              <Image
                src="/img/sport.jpg"
                alt="Sport motorcycle cornering on a racetrack"
                fill
                className="object-cover opacity-70 transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
              <span className="absolute bottom-6 left-6 text-2xl font-bold">Sport</span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
          Every ride starts
          <br />
          with the <span className="text-brand-accent">right setup.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-slate-300">
          Download RideTune today. Feel the difference on your very next ride.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <PlayButton light />
          <IPhoneSoon />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-xs text-brand-muted">
              © {new Date().getFullYear()} RideTune. All rights reserved.
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-brand-muted">
            <a href="/privacy" className="transition-colors hover:text-white">Privacy</a>
            <a href="mailto:filipeac12@gmail.com" className="transition-colors hover:text-white">Support</a>
            <a href="mailto:filipeac12@gmail.com" className="transition-colors hover:text-white">Contact</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
