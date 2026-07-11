import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import PhoneTour from "@/components/PhoneTour";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

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
          Get it on
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

/* ── content ─────────────────────────────────────────────────────────────── */

const symptoms = [
  "Dive under braking?",
  "Feel nervous in corners?",
  "Become uncomfortable with luggage?",
  "Feel unstable off-road?",
] as const;

const problems = [
  ["Too much front dive", "Braking hard nose-plants the bike and unsettles the chassis."],
  ["Feels unstable", "Weaves and vagueness at speed erode your trust."],
  ["Harsh over bumps", "Your spine takes hits that the suspension should absorb."],
  ["Poor traction", "Tires skip instead of tracking through corners."],
  ["Too soft with luggage", "Add a passenger or panniers and the bike wallows."],
] as const;

const steps = [
  ["Choose your motorcycle", "Pick your exact model — new motorcycles added regularly."],
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
  ["Growing every month", "New motorcycles and data updates added regularly."],
] as const;

const tour = [
  { kicker: "HOME", title: "Suspension setup, made simple.", sub: "Your current setup, load mode and status — the moment you open the app.", img: "/screens/home.webp" },
  { kicker: "BIKE SELECTION", title: "All the bikes you ride.", sub: "Adventure, naked, sport, touring, supermoto and more — growing every month.", img: "/screens/bikes.webp" },
  { kicker: "LOAD CALCULATOR", title: "Adjust for your real load.", sub: "Rider, passenger, luggage — the setup is recalculated instantly.", img: "/screens/load.webp" },
  { kicker: "RECOMMENDATIONS", title: "Count the clicks with confidence.", sub: "Preload, rebound and compression, in plain language, for your bike.", img: "/screens/clicks.webp" },
  { kicker: "TYRE PRESSURE", title: "Grip starts with pressure.", sub: "OEM cold-tyre pressures for your bike — road or off-road, solo or fully loaded.", img: "/screens/tyres.webp" },
  { kicker: "RIDE DIARY", title: "Every adjustment tells a story.", sub: "Log setup changes and sensations. Build a library only you can build.", img: "/screens/diary.webp" },
];

const rides = [
  { name: "Adventure", sub: "Gravel, dust and distance — solo or fully loaded.", img: "/img/adventure.jpg" },
  { name: "Touring", sub: "Passenger and panniers, recalculated in seconds.", img: "/img/touring.jpg" },
  { name: "Sport", sub: "Track-day precision, street-day comfort.", img: "/img/sport.jpg" },
];

const brands = [
  "Aprilia", "BMW", "CF Moto", "Ducati", "Honda", "Kawasaki", "Kove",
  "KTM", "Macbor", "QJ Motor", "Suzuki", "Triumph", "Voge", "Yamaha",
];

/* ── page ────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main id="top" className="overflow-x-clip bg-brand-dark text-slate-100">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-brand-dark/70 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-6">
          <Logo big />
          <nav className="hidden items-center gap-8 text-sm text-brand-muted md:flex">
            <a href="#features" className="link-underline transition-colors hover:text-white">Features</a>
            <a href="#how" className="link-underline transition-colors hover:text-white">How it works</a>
            <Link href="/setups" className="link-underline transition-colors hover:text-white">Setups</Link>
            <a href="#premium" className="link-underline transition-colors hover:text-white">Premium</a>
          </nav>
          <a
            href={PLAY_URL}
            className="rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-[#04111e] transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_24px_rgba(74,158,255,0.5)]"
          >
            Download
          </a>
        </div>
      </header>

      {/* HERO */}
      <Hero />

      {/* DOES YOUR BIKE… */}
      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <Reveal>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Does your bike…</h2>
        </Reveal>
        <RevealGroup className="mx-auto mt-10 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
          {symptoms.map((s) => (
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
            Then RideTune is <span className="text-brand-accent">for you.</span>
          </p>
        </Reveal>
      </section>

      {/* THE TRUTH */}
      <section className="border-y border-white/5 bg-brand-deep py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <Reveal>
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
            </Reveal>
            <RevealGroup className="grid gap-5 sm:grid-cols-2">
              {problems.map(([title, sub]) => (
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
          <Badge>How it works</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            Four steps between you
            <br />
            and the perfect setup.
          </h2>
        </Reveal>
        <RevealGroup className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, sub], i) => (
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
      <Interlude img="/img/touring.jpg" title="Ride with confidence." position="center 35%" />

      {/* FEATURES */}
      <section id="features" className="border-y border-white/5 bg-brand-deep py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-end gap-8 lg:grid-cols-2">
            <Reveal>
              <Badge>Features</Badge>
              <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
                Everything the manual
                <br />
                doesn&apos;t tell you.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-md text-slate-300 lg:justify-self-end">
                Built as a workshop tool, refined to feel like a Sunday-morning
                app. Every feature exists to give you the same thing: confidence.
              </p>
            </Reveal>
          </div>
          <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, sub]) => (
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
          <Badge>Inside RideTune</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            A guided tour, one screen at a time.
          </h2>
        </Reveal>
        <PhoneTour steps={tour} />
      </section>

      {/* CTA after the tour */}
      <section className="mx-auto max-w-4xl px-6 pb-32 text-center">
        <Reveal>
          <p className="text-2xl font-semibold text-slate-200">Ready when you are.</p>
          <div className="mt-8 flex justify-center">
            <PlayButton />
          </div>
        </Reveal>
      </section>

      {/* BUILT FOR EVERY RIDE — fullscreen panels */}
      <section id="rides" className="border-t border-white/5">
        <Reveal className="mx-auto max-w-6xl px-6 pt-28 pb-16">
          <Badge>Built for every ride</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Whatever the road,
            <br />
            whatever the load.
          </h2>
        </Reveal>
        {rides.map(({ name, sub, img }) => (
          <div key={name} className="relative h-[80vh] overflow-hidden">
            <Image src={img} alt={`${name} riding`} fill className="object-cover" sizes="100vw" />
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
          <Badge>RideTune Premium Lifetime</Badge>
          <h2 className="mt-10 text-6xl font-bold leading-[0.95] tracking-tight md:text-[7.5rem]">
            Buy once.
            <br />
            <span className="text-brand-accent">Ride forever.</span>
          </h2>
        </Reveal>
        <RevealGroup className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg text-slate-300 md:text-xl">
          {["No subscriptions.", "No recurring fees.", "One purchase.", "Lifetime updates."].map((l) => (
            <RevealItem key={l}>
              <span className="font-medium">{l}</span>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mx-auto mt-24 grid max-w-3xl gap-6 md:grid-cols-2">
          <Reveal>
            <div className={`h-full rounded-3xl bg-brand-card/70 p-9 ${cardHover}`}>
              <h3 className="text-xl font-bold">Free</h3>
              <p className="mt-1 text-sm text-brand-muted">Try it on your bike</p>
              <ul className="mt-7 space-y-3.5 text-sm text-slate-300">
                {["1 motorcycle", "Solo load mode", "OEM data browser", "Basic sag guide", "Basic diagnostics"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="text-brand-muted">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href={PLAY_URL}
                className="mt-9 block rounded-full border border-brand-border py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:border-brand-accent hover:shadow-[0_4px_24px_rgba(74,158,255,0.25)]"
              >
                Start free
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative h-full rounded-3xl bg-gradient-to-b from-brand-accent/15 to-brand-card/70 p-9 shadow-[0_0_80px_-24px_rgba(74,158,255,0.5)] ring-1 ring-brand-accent/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_100px_-20px_rgba(74,158,255,0.65)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#04111e]">
                Lifetime
              </span>
              <h3 className="text-xl font-bold">Premium</h3>
              <p className="mt-1 text-sm text-brand-muted">
                <span className="text-3xl font-bold text-white">14.99&nbsp;€</span>{" "}
                <span className="line-through">19.99&nbsp;€</span> · launch price
              </p>
              <ul className="mt-7 space-y-3.5 text-sm text-slate-200">
                {[
                  "All motorcycles",
                  "All load modes",
                  "Saved setups & unlimited Ride Diary",
                  "Smart diagnostics",
                  "Future bike updates included",
                  "Lifetime updates",
                ].map((f) => (
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
                Get Premium in the app
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SUPPORTED MOTORCYCLES */}
      <section className="border-y border-white/5 bg-brand-deep py-20">
        <Reveal className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-muted">
            Supported motorcycles — growing every month
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
          <Badge>Trusted by riders</Badge>
          <div className="mt-8 text-3xl tracking-[0.3em] text-brand-accent">★★★★★</div>
          <p className="mx-auto mt-6 max-w-lg text-lg text-slate-300">
            RideTune is new on Google Play — ride with it, feel the difference,
            and be one of the first to leave a review.
          </p>
          <a
            href={PLAY_URL}
            className="mt-8 inline-block rounded-full border border-brand-border px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-accent hover:shadow-[0_4px_24px_rgba(74,158,255,0.25)]"
          >
            Rate it on Google Play
          </a>
        </Reveal>
      </section>

      {/* FINAL — the road changes */}
      <section className="relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,158,255,0.1),transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl px-6 py-48 text-center">
          <Reveal>
            <h2 className="text-5xl font-bold leading-[1.02] tracking-tight md:text-8xl">
              The road changes.
              <br />
              <span className="text-brand-accent">Your setup should too.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-14 flex justify-center">
              <PlayButton />
            </div>
            <p className="mx-auto mt-10 max-w-md text-sm leading-relaxed text-brand-muted">
              RideTune is continuously evolving — new motorcycles, smarter
              recommendations and new features, added regularly.
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
              © {new Date().getFullYear()} RideTune. All rights reserved.
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-brand-muted">
            <Link href="/setups" className="link-underline transition-colors hover:text-white">Setups</Link>
            <a href="/privacy" className="link-underline transition-colors hover:text-white">Privacy</a>
            <Link href="/terms" className="link-underline transition-colors hover:text-white">Terms</Link>
            <a href="mailto:support@ridetune.app" className="link-underline transition-colors hover:text-white">Support</a>
            <a href="mailto:support@ridetune.app" className="link-underline transition-colors hover:text-white">Contact</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
