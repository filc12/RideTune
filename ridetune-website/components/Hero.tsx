"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const PLAY_URL = "https://play.google.com/store/apps/details?id=com.ridetune.app";

const line = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.21, 0.6, 0.35, 1] as const },
  },
};

const lineStatic = { hidden: { opacity: 1 }, show: { opacity: 1 } };

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // subtle parallax: image moves slower than the page
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.5]);

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col justify-end overflow-hidden">
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-0 animate-hero-zoom">
        <Image
          src="/img/hero.jpg"
          alt="Adventure motorcycle on a mountain road at sunrise"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/25 to-brand-dark/55" />
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-brand-dark" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-40">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: reduce
                ? {}
                : { staggerChildren: 0.14, delayChildren: 0.2 },
            },
          }}
        >
          <motion.div variants={reduce ? lineStatic : line}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
              Motorcycle suspension, intelligent
            </span>
          </motion.div>

          <h1 className="mt-10 text-[15vw] font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-[6.5rem] lg:text-[7.5rem]">
            <motion.span variants={reduce ? lineStatic : line} className="block">
              Every ride
            </motion.span>
            <motion.span variants={reduce ? lineStatic : line} className="block">
              starts with
            </motion.span>
            <motion.span variants={reduce ? lineStatic : line} className="block text-brand-accent">
              the right setup.
            </motion.span>
          </h1>

          <motion.p variants={reduce ? lineStatic : line} className="mt-8 max-w-xl text-lg text-slate-300">
            OEM data, intelligent calculations and the real-world way you ride.
          </motion.p>

          <motion.div variants={reduce ? lineStatic : line} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={PLAY_URL}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-black shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_8px_40px_rgba(74,158,255,0.35)]"
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
            <span className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/20 px-7 py-3.5 text-slate-400 backdrop-blur-md">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                <path d="M16.4 12.9c0-2.7 2.2-4 2.3-4.1-1.3-1.8-3.2-2.1-3.9-2.1-1.6-.2-3.2 1-4 1s-2.1-1-3.5-1c-1.8 0-3.4 1-4.3 2.6-1.9 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8s2 .8 3.5.8c1.4 0 2.3-1.3 3.2-2.6a11 11 0 0 0 1.4-3c-.1 0-2.7-1-2.7-4Zm-2.6-7.5c.7-.9 1.2-2.1 1.1-3.4-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.3 1.1.1 2.3-.6 3-1.5Z" />
              </svg>
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-semibold uppercase tracking-widest opacity-60">
                  Coming soon
                </span>
                <span className="block text-base font-bold text-white/60">for iPhone</span>
              </span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
