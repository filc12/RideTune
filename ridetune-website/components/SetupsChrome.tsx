import Link from "next/link";
import { PLAY_URL } from "@/site.config";

export function SetupsNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-brand-dark/70 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-4 w-9 rounded-full bg-brand-accent shadow-[0_0_22px_rgba(74,158,255,0.9)]" />
          <span className="text-2xl font-bold tracking-tight">
            Ride<span className="text-brand-accent">Tune</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-base font-medium text-brand-muted md:flex">
          <Link href="/#features" className="transition-colors hover:text-white">Features</Link>
          <Link href="/#how" className="transition-colors hover:text-white">How it works</Link>
          <Link href="/setups" className="text-white">Setups</Link>
          <Link href="/#premium" className="transition-colors hover:text-white">Premium</Link>
        </nav>
        <a
          href={PLAY_URL}
          className="rounded-full bg-brand-accent px-6 py-2.5 text-base font-semibold text-[#04111e] transition-all duration-300 hover:bg-brand-accent-soft"
        >
          Download
        </a>
      </div>
    </header>
  );
}

export function SetupsFooter() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-3 w-7 rounded-full bg-brand-accent shadow-[0_0_18px_rgba(74,158,255,0.9)]" />
          <span className="text-lg font-bold tracking-tight">
            Ride<span className="text-brand-accent">Tune</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-[15px] text-brand-muted">
          <Link href="/setups" className="transition-colors hover:text-white">Setups</Link>
          <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
          <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
          <a href="mailto:support@ridetune.app" className="transition-colors hover:text-white">Support</a>
        </nav>
      </div>
    </footer>
  );
}
