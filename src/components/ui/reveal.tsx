"use client";

/**
 * Envoltorios reutilizables para las entradas on-scroll.
 * Centralizan `whileInView` + `viewport once` + respeto de reduced motion,
 * para no repetir la misma configuración en cada sección.
 */

import * as React from "react";
import { motion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { fadeUp, reduceVariants, staggerContainer, viewportOnce } from "@/lib/motion";

type Tag = "div" | "section" | "ul" | "li" | "article" | "span" | "header" | "footer";

export interface RevealProps extends React.PropsWithChildren {
  className?: string;
  /** Desplazamiento vertical inicial, en px. */
  distance?: number;
  delay?: number;
  as?: Tag;
}

export function Reveal({ children, className, distance = 28, delay = 0, as = "div" }: RevealProps) {
  const reduced = useReducedMotionSafe();
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      className={className}
      variants={reduceVariants(fadeUp(distance), reduced)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

export interface StaggerProps extends React.PropsWithChildren {
  className?: string;
  stagger?: number;
  delayChildren?: number;
  as?: Tag;
}

/** Contenedor: orquesta a sus hijos <StaggerItem>. */
export function Stagger({
  children,
  className,
  stagger = 0.09,
  delayChildren = 0.05,
  as = "div",
}: StaggerProps) {
  const reduced = useReducedMotionSafe();
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      className={className}
      variants={staggerContainer(reduced ? 0.03 : stagger, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </Comp>
  );
}

export interface StaggerItemProps extends React.PropsWithChildren {
  className?: string;
  distance?: number;
  variants?: Variants;
  as?: Tag;
}

export function StaggerItem({
  children,
  className,
  distance = 24,
  variants,
  as = "div",
}: StaggerItemProps) {
  const reduced = useReducedMotionSafe();
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp className={cn(className)} variants={reduceVariants(variants ?? fadeUp(distance), reduced)}>
      {children}
    </Comp>
  );
}
