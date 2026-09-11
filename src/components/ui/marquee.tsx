"use client";

/**
 * VelocityMarquee — franja de texto que se desliza sola y **reacciona a la
 * velocidad del scroll**: al hacer scroll acelera y cambia de sentido según la
 * dirección. Patrón clásico de scroll cinemático (traducido a Framer Motion).
 * Respeta prefers-reduced-motion: sin scroll, queda estática.
 */

import * as React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

/** Envuelve un número dentro del rango [min, max) (para el bucle infinito). */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

export interface VelocityMarqueeProps {
  items: string[];
  baseVelocity?: number;
  className?: string;
  /** Estilo de la franja: sólida (con fondo) o contorno (texto hueco). */
  variant?: "solid" | "outline";
}

export function VelocityMarquee({
  items,
  baseVelocity = 3,
  className,
  variant = "solid",
}: VelocityMarqueeProps) {
  const reduced = useReducedMotionSafe();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  // El contenido se repite; x recorre [-100/repeticiones, 0]% en bucle.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const directionRef = React.useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let moveBy = directionRef.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) directionRef.current = -1;
    else if (vf > 0) directionRef.current = 1;
    moveBy += directionRef.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  // 4 repeticiones para cubrir pantallas anchas sin huecos.
  const repeated = Array.from({ length: 4 }).flatMap(() => items);

  return (
    <div className={cn("relative flex w-full overflow-hidden py-4 sm:py-5", className)}>
      <motion.div
        className="flex whitespace-nowrap"
        style={reduced ? undefined : { x }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span
              className={cn(
                "px-6 font-display text-3xl font-bold uppercase tracking-tight sm:text-5xl",
                variant === "outline" ? "text-outline" : "text-foreground",
              )}
            >
              {item}
            </span>
            <span aria-hidden className="size-2.5 rotate-45 bg-brand sm:size-3" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
