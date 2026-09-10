"use client";

/**
 * Capa "futurista" reutilizable: piezas de movimiento e interfaz tipo HUD que
 * se usan en todas las secciones para dar cohesión (texto que se decodifica,
 * bordes de energía, líneas de escaneo, esquinas de visor, divisores animados
 * y rejilla técnica de fondo). Todo respeta prefers-reduced-motion.
 */

import * as React from "react";
import { motion, useInView } from "motion/react";

import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { EASE_OUT, viewportOnce } from "@/lib/motion";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/*+=<>";

/**
 * Texto que se "decodifica": al entrar en viewport arranca revuelto y va
 * fijando caracteres de izquierda a derecha. Sin movimiento, muestra el texto.
 */
export function ScrambleText({
  text,
  className,
  as = "span",
  startDelay = 0,
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "div";
  startDelay?: number;
}) {
  const reduced = useReducedMotionSafe();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = React.useState(text);

  React.useEffect(() => {
    if (reduced || !inView) {
      setDisplay(text);
      return;
    }
    const total = text.length;
    const dur = Math.min(1000, 260 + total * 40);
    let raf = 0;
    let startTime = 0;
    const tick = (now: number) => {
      if (!startTime) startTime = now + startDelay * 1000;
      const p = Math.max(0, Math.min(1, (now - startTime) / dur));
      const revealed = Math.floor(p * total);
      let out = "";
      for (let i = 0; i < total; i++) {
        const ch = text[i];
        if (ch === " ") {
          out += " ";
        } else if (i < revealed) {
          out += ch;
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, text, startDelay]);

  const Tag = as as "span";
  return (
    <Tag ref={ref as React.Ref<HTMLSpanElement>} className={className}>
      {display}
    </Tag>
  );
}

/** Esquinas tipo visor técnico alrededor de un contenedor relativo. */
export function HudCorners({
  className,
  accent = true,
}: {
  className?: string;
  accent?: boolean;
}) {
  const c = accent ? "border-brand/70" : "border-white/25";
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0 z-20", className)}>
      <span className={cn("absolute left-3 top-3 size-4 rounded-tl border-l-2 border-t-2", c)} />
      <span className="absolute right-3 top-3 size-4 rounded-tr border-r-2 border-t-2 border-white/25" />
      <span className="absolute bottom-3 left-3 size-4 rounded-bl border-b-2 border-l-2 border-white/25" />
      <span className={cn("absolute bottom-3 right-3 size-4 rounded-br border-b-2 border-r-2", c)} />
    </span>
  );
}

/** Línea de escaneo que barre verticalmente de forma continua. */
export function ScanBeam({ className, duration = 4.5 }: { className?: string; duration?: number }) {
  const reduced = useReducedMotionSafe();
  if (reduced) return null;
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-20 h-1/3",
        "bg-gradient-to-b from-transparent via-brand/15 to-transparent",
        className,
      )}
      style={{ animation: `fut-scan ${duration}s linear infinite` }}
    />
  );
}

/** Borde de energía: un arco de luz que rota alrededor del contenedor. */
export function EnergyBorder({
  children,
  className,
  rounded = "rounded-2xl",
  innerClassName,
  duration = 7,
}: {
  children: React.ReactNode;
  className?: string;
  rounded?: string;
  innerClassName?: string;
  duration?: number;
}) {
  const reduced = useReducedMotionSafe();
  return (
    <div className={cn("relative overflow-hidden p-px", rounded, className)}>
      <span
        aria-hidden
        className={cn("absolute inset-0", rounded)}
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)" }}
      />
      {!reduced && (
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0 66%, #ff6a1a 80%, #ffd8b5 86%, transparent 94%)",
            animation: `fut-spin ${duration}s linear infinite`,
          }}
        />
      )}
      <div className={cn("relative bg-steel-950", rounded, innerClassName)}>{children}</div>
    </div>
  );
}

/** Divisor animado entre secciones: la línea se dibuja y un nodo pulsa. */
export function SectionDivider({ className }: { className?: string }) {
  const reduced = useReducedMotionSafe();
  return (
    <div className={cn("container flex items-center justify-center py-2", className)} aria-hidden>
      <div className="relative flex w-full max-w-5xl items-center">
        <motion.span
          className="h-px flex-1 origin-right bg-gradient-to-l from-white/20 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        />
        <span className="relative mx-3 grid place-items-center">
          <span className="size-2 rotate-45 bg-brand" />
          {!reduced && (
            <span
              className="absolute size-2 rotate-45 border border-brand"
              style={{ animation: "fut-pulse-ring 2.4s ease-out infinite" }}
            />
          )}
        </span>
        <motion.span
          className="h-px flex-1 origin-left bg-gradient-to-r from-white/20 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        />
      </div>
    </div>
  );
}

/** Rejilla técnica de fondo con leve desplazamiento y difuminado radial. */
export function TechGridBackdrop({ className }: { className?: string }) {
  const reduced = useReducedMotionSafe();
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 tech-grid", className)}
      style={{
        maskImage: "radial-gradient(ellipse 75% 70% at 50% 40%, black 10%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 40%, black 10%, transparent 80%)",
        animation: reduced ? undefined : "fut-grid-pan 8s linear infinite",
      }}
    />
  );
}
