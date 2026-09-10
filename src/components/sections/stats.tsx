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
import { ScrambleText, TechGridBackdrop } from "@/components/ui/futuristic";

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
    <section aria-labelledby="cifras-titulo" className="relative overflow-hidden pb-6 pt-20 sm:pb-8 sm:pt-24">
      {/* Franja de acento superior */}
      <motion.div
        aria-hidden
        className="hazard-stripe absolute inset-x-0 top-0 h-1.5 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.1, ease: EASE_OUT }}
      />

      <TechGridBackdrop className="opacity-60" />

      <div className="container relative">
        <Reveal>
          <h2 id="cifras-titulo" className="sr-only">
            Cifras de la empresa
          </h2>
          <p className="eyebrow">
            <span className="font-mono-hud text-muted-foreground/70">[02]</span>
            <span aria-hidden className="inline-block h-px w-10 bg-brand" />
            <ScrambleText text="En números" startDelay={0.15} />
          </p>
        </Reveal>

        <Stagger
          as="ul"
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4"
          stagger={0.12}
        >
          {kpis.map((kpi, i) => (
            <StaggerItem as="li" key={kpi.etiqueta} className="group relative lg:pl-5">
              {/* Guía vertical tipo panel de instrumentos */}
              <motion.span
                aria-hidden
                className="absolute left-0 top-1 hidden w-px origin-top bg-gradient-to-b from-brand/60 to-transparent lg:block"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 + i * 0.1 }}
                style={{ height: "100%" }}
              />
              <span className="font-mono-hud text-[11px] tracking-widest text-brand/70">
                0{i + 1}
              </span>
              <div className="mt-1 flex items-baseline font-display text-5xl font-bold leading-none tracking-tightest sm:text-6xl lg:text-7xl">
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
              {/* Línea base que se dibuja */}
              <motion.span
                aria-hidden
                className="mt-3 block h-px origin-left bg-gradient-to-r from-brand via-brand/40 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 + i * 0.1 }}
              />
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
