"use client";

/**
 * Servicios — adaptación de @efferd/grid-feature-cards.
 *
 * Grid de 6 tarjetas con reveal on-scroll escalonado, elevación en hover y
 * un halo que sigue al cursor dentro de cada tarjeta.
 */

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { Boxes, Brush, Building2, Hammer, Ruler, Wrench, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { servicios, type IconKey, type Servicio } from "@/lib/data";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

const ICONOS: Record<IconKey, LucideIcon> = {
  "obra-civil": Building2,
  remodelaciones: Hammer,
  diseno: Ruler,
  estructuras: Boxes,
  acabados: Brush,
  mantenimiento: Wrench,
};

function ServicioCard({ servicio, index }: { servicio: Servicio; index: number }) {
  const reduced = useReducedMotionSafe();
  const Icon = ICONOS[servicio.icon];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const halo = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, rgba(255,106,26,0.13), transparent 72%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <StaggerItem as="li" className="h-full">
      <motion.div
        onMouseMove={onMove}
        whileHover={reduced ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={cn(
          "group relative h-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.025] p-7",
          "transition-colors duration-300 hover:border-brand/40",
        )}
      >
        {/* Halo que sigue al cursor */}
        {!reduced && (
          <motion.span
            aria-hidden
            style={{ background: halo }}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

        {/* Filo superior de acento */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand via-brand/40 to-transparent transition-transform duration-500 group-hover:scale-x-100"
        />

        {/* Barrido de luz al pasar el cursor */}
        {!reduced && (
          <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="absolute -inset-y-2 left-0 w-1/3 -translate-x-[130%] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:animate-[fut-sheen_0.9s_ease-out] group-hover:opacity-100" />
          </span>
        )}

        <div className="relative">
          <div className="flex items-start justify-between">
            <span className="inline-grid size-12 place-items-center rounded-lg border border-white/10 bg-steel-900 text-brand transition-colors duration-300 group-hover:border-brand/50 group-hover:bg-brand group-hover:text-black">
              <Icon className="size-5" aria-hidden strokeWidth={1.75} />
            </span>
            <span className="font-mono-hud text-[11px] tracking-widest text-white/25 transition-colors duration-300 group-hover:text-brand/70">
              S-{String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h3 className="mt-6 text-xl font-semibold tracking-tight">{servicio.titulo}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {servicio.descripcion}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {servicio.bullets.map((b) => (
              <li
                key={b}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-steel-300"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </StaggerItem>
  );
}

export function Servicios() {
  return (
    <section id="servicios" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          numero="01"
          eyebrow="Servicios"
          titulo={
            <>
              Todo lo que hace falta para{" "}
              <span className="text-brand">levantar una obra</span>
            </>
          }
          descripcion="Seis líneas de trabajo con un mismo estándar: equipo propio, control de calidad documentado y un único responsable de principio a fin."
        />

        <Stagger as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {servicios.map((servicio, i) => (
            <ServicioCard key={servicio.titulo} servicio={servicio} index={i} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
