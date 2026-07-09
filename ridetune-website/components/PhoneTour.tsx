"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export type TourStep = {
  kicker: string;
  title: string;
  sub: string;
  img: string;
};

/**
 * Apple-style sticky phone tour: the phone stays pinned while the user
 * scrolls; the screen inside crossfades between real app screenshots.
 */
export default function PhoneTour({ steps }: { steps: TourStep[] }) {
  const [active, setActive] = useState(0);
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
        <div className="relative w-[300px] rounded-[3rem] border border-white/10 bg-gradient-to-b from-[#3a3f47] via-[#22262c] to-[#3a3f47] p-[8px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
          <div className="rounded-[2.6rem] bg-black p-[10px]">
            <div className="relative aspect-[640/1310] overflow-hidden rounded-[2rem]">
              <div className="absolute left-1/2 top-2 z-10 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={steps[active].img}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <Image
                    src={steps[active].img}
                    alt={steps[active].title}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
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
              <div className="relative w-[240px] rounded-[2.6rem] border border-white/10 bg-[#22262c] p-[7px] shadow-2xl">
                <div className="rounded-[2.2rem] bg-black p-[8px]">
                  <div className="relative aspect-[640/1310] overflow-hidden rounded-[1.7rem]">
                    <Image src={s.img} alt={s.title} fill className="object-cover" sizes="240px" />
                  </div>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
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
