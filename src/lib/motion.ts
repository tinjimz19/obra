import type { Transition, Variants } from "motion/react";

/**
 * Curvas y variantes compartidas.
 * Todas las secciones usan estas constantes para que el ritmo de la página
 * se sienta consistente (mismo ease, mismos tiempos, mismo stagger).
 */

/** Ease suave tipo "out-expo" recortado: rápido al entrar, calmado al asentar. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** Ease neutro para micro-interacciones. */
export const EASE_SOFT: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const transition = {
  base: { duration: 0.65, ease: EASE_OUT } satisfies Transition,
  fast: { duration: 0.35, ease: EASE_SOFT } satisfies Transition,
  slow: { duration: 0.95, ease: EASE_OUT } satisfies Transition,
  spring: { type: "spring", stiffness: 260, damping: 26, mass: 0.9 } satisfies Transition,
};

/** Viewport por defecto: se dispara una sola vez y algo antes de entrar del todo. */
export const viewportOnce = { once: true, amount: 0.25, margin: "0px 0px -80px 0px" } as const;

/** Contenedor con stagger para listas/grids. */
export const staggerContainer = (stagger = 0.09, delayChildren = 0.05): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Entrada estándar: fade + slide-up. */
export const fadeUp = (distance = 28): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: transition.base },
});

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition.base },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: transition.base },
};

export const slideFrom = (direction: "left" | "right", distance = 40): Variants => ({
  hidden: { opacity: 0, x: direction === "left" ? -distance : distance },
  show: { opacity: 1, x: 0, transition: transition.base },
});

/**
 * Devuelve variantes "planas" (sin desplazamiento) cuando el usuario pidió
 * menos movimiento. Se mantiene un fade mínimo para no romper la jerarquía.
 */
export function reduceVariants(variants: Variants, reduced: boolean): Variants {
  if (!reduced) return variants;
  return {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2, ease: EASE_SOFT } },
  };
}
