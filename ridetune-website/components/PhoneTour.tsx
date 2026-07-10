"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type TourStep = {
  kicker: string;
  title: string;
  sub: string;
  img: string;
};

function PhoneFrame({
  children,
  width,
  tilt = false,
}: {
  children: React.ReactNode;
  width: number;
  tilt?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={
        reduce
          ? { opacity: 1, rotate: tilt ? -4 : 0 }
          : { opacity: 0, y: 60, rotate: tilt ? -9 : 0, scale: 0.94 }
      }
      whileInView={{ opacity: 1, y: 0, rotate: tilt ? -4 : 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0 : 1, ease: [0.21, 0.6, 0.35, 1] }}
      className="relative"
      style={{ width }}
    >
      {/* glow behind the phone */}
      <div className="absolute -inset-16 -z-10 rounded-full bg-[radial-gradient(circle,rgba(74,158,255,0.22),transparent_65%)] blur-2xl" />
      <div className="relative rounded-[3rem] border border-white/10 bg-gradient-to-b from-[#3a3f47] via-[#22262c] to-[#3a3f47] p-[8px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)]">
        <div className="rounded-[2.6rem] bg-black p-[10px]">
          <div className="relative aspect-[640/1310] overflow-hidden rounded-[2rem]">
            <div className="absolute left-1/2 top-2 z-20 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
            {children}
            {/* glass reflection */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/[0.09] via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Apple-style sticky phone tour: the phone stays pinned while the user
 * scrolls; the screen inside crossfades between real app screenshots.
 */
export default function PhoneTour({ steps }: { steps: TourStep[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = refs.current.indexOf(e.target as HTMLDivElement);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2">
      {/* sticky phone */}
      <div className="sticky top-0 hidden h-screen items-center justify-center lg:flex">
        <PhoneFrame width={340} tilt>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={steps[active].img}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src={steps[active].img}
                alt={steps[active].title}
                fill
                className="object-cover"
                sizes="340px"
              />
            </motion.div>
          </AnimatePresence>
        </PhoneFrame>
      </div>

      {/* scroll steps */}
      <div>
        {steps.map((s, i) => (
          <div
            key={s.kicker}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="flex min-h-[90vh] flex-col justify-center py-16 lg:min-h-screen"
          >
            {/* mobile phone (non-sticky) */}
            <div className="mb-10 flex justify-center lg:hidden">
              <PhoneFrame width={250}>
                <Image src={s.img} alt={s.title} fill className="object-cover" sizes="250px" />
              </PhoneFrame>
            </div>
            <motion.div
              initial={
                reduce
                  ? { opacity: 1 }
                  : { opacity: 0, y: 30, filter: "blur(6px)" }
              }
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: reduce ? 0 : 0.7, ease: [0.21, 0.6, 0.35, 1] }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-muted">
                <span className="text-brand-accent">{String(i + 1).padStart(2, "0")}</span>
                {"  ——  "}
                {s.kicker}
              </p>
              <h3 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">{s.title}</h3>
              <p className="mt-5 max-w-md text-lg text-slate-300">{s.sub}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
