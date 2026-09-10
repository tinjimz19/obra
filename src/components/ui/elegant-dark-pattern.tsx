"use client";

/**
 * ElegantDarkPattern — adaptación de @jatin-yadav05/elegant-dark-pattern.
 *
 * Fondo compuesto por cuatro capas:
 *  1. Degradado base negro/gris.
 *  2. Rejilla técnica con desvanecido radial (plano de obra).
 *  3. Dos halos de color que respiran lentamente.
 *  4. Vetas diagonales que cruzan la escena, tipo cables tensados.
 *
 * Todo es CSS + transform, sin canvas: coste de render bajo y sin layout
 * thrashing. Con prefers-reduced-motion se congela en un estado estático.
 */

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

export function ElegantDarkPattern({ className }: { className?: string }) {
  const reduced = useReducedMotionSafe();

  const beams = [
    { top: "14%", rotate: -12, width: "140%", delay: 0, duration: 18 },
    { top: "42%", rotate: -12, width: "120%", delay: 3, duration: 22 },
    { top: "71%", rotate: -12, width: "150%", delay: 6, duration: 26 },
  ];

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* 1 · Base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#1c2126_0%,#0b0d0f_55%,#070809_100%)]" />

      {/* 2 · Rejilla técnica */}
      <div
        className="absolute inset-0 bg-grid-steel [background-size:64px_64px]"
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)",
        }}
      />

      {/* 3 · Halos que respiran */}
      <motion.div
        className="absolute -left-[12%] top-[6%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(255,106,26,0.24),transparent_65%)] blur-3xl"
        animate={reduced ? undefined : { scale: [1, 1.14, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[10%] bottom-[-8%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(120,150,190,0.20),transparent_65%)] blur-3xl"
        animate={reduced ? undefined : { scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* 4 · Vetas diagonales */}
      {!reduced &&
        beams.map((beam, i) => (
          <motion.div
            key={i}
            className="absolute left-[-20%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            style={{ top: beam.top, width: beam.width, rotate: `${beam.rotate}deg` }}
            animate={{ x: ["-8%", "8%", "-8%"], opacity: [0.15, 0.5, 0.15] }}
            transition={{
              duration: beam.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: beam.delay,
            }}
          />
        ))}

      {/* Viñeta + fundido inferior para encadenar con la siguiente sección */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.75)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
