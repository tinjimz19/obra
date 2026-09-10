"use client";

/**
 * Cifras — adaptación de @designali-in/stats-2.
 *
 * Contadores que arrancan cuando la sección entra en viewport (una sola vez).
 * El número se anima con `animate()` de Motion sobre un MotionValue, así que
 * no provoca re-render de React en cada frame. Con reduced motion el valor
 * final se pinta directamente.
 */

import * as React from "react";
import { animate, motion, useInView, useMotionValue } from "motion/react";

import { kpis, type Kpi } from "@/lib/data";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

function Contador({ kpi }: { kpi: Kpi }) {
  const reduced = useReducedMotionSafe();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const value = useMotionValue(0);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduced) {
      node.textContent = String(kpi.valor);
      return;
    }
    if (!inView) return;

    const unsubscribe = value.on("change", (v) => {
      node.textContent = Math.round(v).toLocaleString("es-ES");
    });

    const controls = animate(value, kpi.valor, {
      duration: 1.9,
      ease: EASE_OUT,
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [inView, kpi.valor, reduced, value]);

  return (
    <span
      ref={ref}
      aria-hidden
      className="tabular-nums"
    >
      0
    </span>
  );
}

export function Stats() {
  return (
    <section aria-labelledby="cifras-titulo" className="relative pb-6 pt-20 sm:pb-8 sm:pt-24">
      {/* Franja de acento superior */}
      <motion.div
        aria-hidden
        className="hazard-stripe absolute inset-x-0 top-0 h-1.5 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.1, ease: EASE_OUT }}
      />

      <div className="container">
        <Reveal>
          <h2 id="cifras-titulo" className="sr-only">
            Cifras de la empresa
          </h2>
          <p className="eyebrow">
            <span className="text-muted-foreground/70">02</span>
            <span aria-hidden className="inline-block h-px w-10 bg-brand" />
            En números
          </p>
        </Reveal>

        <Stagger
          as="ul"
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4"
          stagger={0.12}
        >
          {kpis.map((kpi) => (
            <StaggerItem as="li" key={kpi.etiqueta} className="relative">
              <div className="flex items-baseline font-display text-5xl font-bold leading-none tracking-tightest sm:text-6xl lg:text-7xl">
                {kpi.prefijo && <span className="text-brand">{kpi.prefijo}</span>}
                <Contador kpi={kpi} />
                {kpi.sufijo && <span className="text-brand">{kpi.sufijo}</span>}
                {/* Valor accesible para lectores de pantalla */}
                <span className="sr-only">
                  {kpi.prefijo ?? ""}
                  {kpi.valor}
                  {kpi.sufijo ?? ""} {kpi.etiqueta}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                {kpi.etiqueta}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">{kpi.detalle}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
