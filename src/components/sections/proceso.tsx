"use client";

/**
 * Proceso — timeline vertical de 4 pasos.
 *
 * La línea guía se "dibuja" al hacer scroll: useScroll mide el avance del
 * contenedor y alimenta el scaleY de un trazo con muelle, de modo que la
 * línea sigue al usuario en lugar de aparecer de golpe. Cada punto se llena
 * y pulsa cuando su paso entra en viewport.
 */

import * as React from "react";
import { motion, useInView, useScroll, useSpring } from "motion/react";

import { cn } from "@/lib/utils";
import { proceso, type Paso } from "@/lib/data";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { SectionHeading } from "@/components/ui/section-heading";

function PasoItem({ paso, index }: { paso: Paso; index: number }) {
  const reduced = useReducedMotionSafe();
  const ref = React.useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.55 });

  return (
    <li ref={ref} className="relative pb-14 pl-14 last:pb-0 sm:pl-20">
      {/* Punto sobre la línea */}
      <span className="absolute left-0 top-1 grid size-9 place-items-center sm:size-11">
        <motion.span
          className={cn(
            "grid size-9 place-items-center rounded-full border-2 text-[11px] font-bold transition-colors duration-500 sm:size-11 sm:text-xs",
            inView
              ? "border-brand bg-brand text-black"
              : "border-white/20 bg-steel-950 text-muted-foreground",
          )}
          initial={{ scale: reduced ? 1 : 0.6, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: reduced ? 1 : 0.6, opacity: 0.6 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          {paso.numero}
        </motion.span>
        {inView && !reduced && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-brand"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.75, opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.15 }}
          />
        )}
      </span>

      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.08 + index * 0.04 }}
      >
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{paso.titulo}</h3>
          <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {paso.duracion}
          </span>
        </div>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {paso.descripcion}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {paso.entregables.map((e) => (
            <li
              key={e}
              className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-steel-300"
            >
              {e}
            </li>
          ))}
        </ul>
      </motion.div>
    </li>
  );
}

export function Proceso() {
  const reduced = useReducedMotionSafe();
  const listRef = React.useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 65%", "end 60%"],
  });
  const trazo = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section aria-labelledby="proceso-titulo" className="relative py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          numero="05"
          eyebrow="Proceso"
          titulo={
            <span id="proceso-titulo">
              De la primera visita a la <span className="text-brand">entrega de llaves</span>
            </span>
          }
          descripcion="Cuatro etapas, cada una con entregables concretos. Sabes en qué punto está tu obra en todo momento."
        />

        <div className="relative mt-14">
          {/* Riel base */}
          <span
            aria-hidden
            className="absolute left-[17px] top-1 h-[calc(100%-2rem)] w-px bg-white/10 sm:left-[21px]"
          />
          {/* Trazo que se dibuja con el scroll */}
          <motion.span
            aria-hidden
            style={reduced ? { scaleY: 1 } : { scaleY: trazo }}
            className="absolute left-[17px] top-1 h-[calc(100%-2rem)] w-px origin-top bg-gradient-to-b from-brand via-brand to-brand/30 sm:left-[21px]"
          />

          <ol ref={listRef} className="relative">
            {proceso.map((paso, i) => (
              <PasoItem key={paso.numero} paso={paso} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
