"use client";

/**
 * Testimonios — adaptación de @anurag-mishra22/testimonial.
 *
 * Carrusel de 3 reseñas con transición direccional (AnimatePresence custom),
 * autoplay pausable, arrastre táctil y navegación por teclado. El autoplay se
 * desactiva con prefers-reduced-motion y al pasar el cursor por encima.
 */

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { testimonios } from "@/lib/data";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { SectionHeading } from "@/components/ui/section-heading";

const AUTOPLAY_MS = 7000;

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 70 : -70 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE_OUT } },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -70 : 70,
    transition: { duration: 0.35, ease: EASE_OUT },
  }),
};

export function Testimonios() {
  const reduced = useReducedMotionSafe();
  const [[indice, direccion], setEstado] = React.useState<[number, number]>([0, 0]);
  const [pausado, setPausado] = React.useState(false);

  const total = testimonios.length;
  const actual = testimonios[indice];

  const ir = React.useCallback(
    (delta: number) => {
      setEstado(([i]) => [(i + delta + total) % total, delta]);
    },
    [total],
  );

  React.useEffect(() => {
    if (reduced || pausado) return;
    const id = window.setInterval(() => ir(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [ir, pausado, reduced]);

  return (
    <section aria-labelledby="testimonios-titulo" className="relative py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          numero="06"
          eyebrow="Testimonios"
          align="center"
          titulo={
            <span id="testimonios-titulo">
              Lo que dicen quienes ya <span className="text-brand">nos contrataron</span>
            </span>
          }
        />

        <div
          className="relative mx-auto mt-12 max-w-3xl"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onFocusCapture={() => setPausado(true)}
          onBlurCapture={() => setPausado(false)}
          role="group"
          aria-roledescription="carrusel"
          aria-label="Reseñas de clientes"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") ir(1);
            if (e.key === "ArrowLeft") ir(-1);
          }}
        >
          <div className="relative min-h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-8 sm:min-h-[300px] sm:p-12">
            <Quote
              className="absolute right-8 top-8 size-16 text-white/[0.06]"
              aria-hidden
              strokeWidth={1.5}
            />

            <AnimatePresence mode="wait" custom={direccion} initial={false}>
              <motion.blockquote
                key={indice}
                custom={direccion}
                variants={reduced ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } } : variants}
                initial="enter"
                animate="center"
                exit="exit"
                drag={reduced ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) ir(1);
                  else if (info.offset.x > 70) ir(-1);
                }}
                className="relative cursor-grab active:cursor-grabbing"
                aria-live="polite"
              >
                <div className="flex gap-1" aria-label="Valoración: 5 de 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-brand text-brand" aria-hidden />
                  ))}
                </div>

                <p className="mt-6 text-balance text-xl font-medium leading-relaxed sm:text-2xl">
                  “{actual.texto}”
                </p>

                <footer className="mt-8 flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border border-brand/40 bg-brand/10 font-display text-sm font-bold text-brand">
                    {actual.iniciales}
                  </span>
                  <span className="min-w-0">
                    <cite className="block not-italic font-semibold">{actual.nombre}</cite>
                    <span className="block text-sm text-muted-foreground">
                      {actual.cargo} · {actual.empresa}
                    </span>
                    <span className="mt-0.5 block text-xs text-brand">{actual.proyecto}</span>
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controles */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => ir(-1)}
              aria-label="Reseña anterior"
              className="grid size-10 place-items-center rounded-full border border-white/12 text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>

            <div className="flex items-center gap-2">
              {testimonios.map((t, i) => (
                <button
                  key={t.nombre}
                  type="button"
                  onClick={() => setEstado([i, i > indice ? 1 : -1])}
                  aria-label={`Ir a la reseña de ${t.nombre}`}
                  aria-current={i === indice ? "true" : undefined}
                  className="group p-1.5"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-300",
                      i === indice
                        ? "w-8 bg-brand"
                        : "w-1.5 bg-white/25 group-hover:bg-white/50",
                    )}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => ir(1)}
              aria-label="Siguiente reseña"
              className="grid size-10 place-items-center rounded-full border border-white/12 text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
