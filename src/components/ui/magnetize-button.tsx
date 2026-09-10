"use client";

/**
 * MagnetizeButton — adaptación de @kokonutd/magnetize-button.
 *
 * El botón "atrae" al cursor: el contenido se desplaza suavemente hacia el
 * puntero mediante springs y un enjambre de partículas converge al centro
 * mientras el cursor está encima. Con prefers-reduced-motion se degrada a un
 * botón normal con un simple cambio de color.
 */

import * as React from "react";
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";

type Particle = { x: number; y: number; delay: number; sizeClass: string };

function createParticles(count: number): Particle[] {
  // Distribución determinista (nada de Math.random) para evitar
  // desajustes de hidratación entre servidor y cliente.
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius = 34 + (i % 3) * 12;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.55,
      delay: (i % 5) * 0.06,
      // El tamaño va como clase de Tailwind, no como estilo numérico: así el
      // motion.span sólo lleva transform/opacity en su style inline y no hay
      // width/height que discrepe entre servidor y cliente (evita el error de
      // hidratación que Motion provoca al normalizar "2px" a 2).
      sizeClass: i % 3 === 0 ? "size-[3px]" : "size-0.5",
    };
  });
}

const PARTICLES = createParticles(12);

export interface MagnetizeButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  /** Intensidad del imán en píxeles de desplazamiento máximo. */
  strength?: number;
  variant?: "solid" | "outline";
  children: React.ReactNode;
}

export const MagnetizeButton = React.forwardRef<HTMLButtonElement, MagnetizeButtonProps>(
  ({ className, children, strength = 14, variant = "solid", ...props }, forwardedRef) => {
    const reduced = useReducedMotionSafe();
    const innerRef = React.useRef<HTMLButtonElement>(null);
    const [hovered, setHovered] = React.useState(false);

    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLButtonElement);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
    const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

    const handleMove = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (reduced || !innerRef.current) return;
      const rect = innerRef.current.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      x.set((relX / (rect.width / 2)) * strength);
      y.set((relY / (rect.height / 2)) * (strength * 0.6));
    };

    const reset = () => {
      x.set(0);
      y.set(0);
      setHovered(false);
    };

    return (
      <motion.button
        ref={innerRef}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={reset}
        onBlur={reset}
        style={reduced ? undefined : { x: springX, y: springY }}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        className={cn(
          "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-md px-7 text-sm font-semibold tracking-wide",
          "transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          variant === "solid"
            ? "bg-brand text-black hover:bg-brand-400"
            : "border border-white/15 bg-white/[0.03] text-foreground hover:border-brand/60",
          className,
        )}
        {...props}
      >
        {/* Enjambre de partículas que converge al centro en hover */}
        {!reduced && (
          <span aria-hidden className="pointer-events-none absolute inset-0">
            {PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                className={cn(
                  "absolute left-1/2 top-1/2 rounded-full",
                  p.sizeClass,
                  variant === "solid" ? "bg-black/45" : "bg-brand",
                )}
                initial={false}
                animate={
                  hovered
                    ? { x: 0, y: 0, opacity: [0, 1, 0], scale: [0.6, 1.15, 0.4] }
                    : { x: p.x, y: p.y, opacity: 0, scale: 0.6 }
                }
                transition={{
                  duration: 0.85,
                  delay: p.delay,
                  repeat: hovered ? Infinity : 0,
                  ease: "easeOut",
                }}
              />
            ))}
          </span>
        )}

        {/* Barrido de luz */}
        {!reduced && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
        )}

        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </motion.button>
    );
  },
);

MagnetizeButton.displayName = "MagnetizeButton";
