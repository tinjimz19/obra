"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { ScrambleText } from "@/components/ui/futuristic";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { EASE_OUT, viewportOnce } from "@/lib/motion";

export interface SectionHeadingProps {
  numero: string;
  eyebrow: string;
  titulo: React.ReactNode;
  descripcion?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  numero,
  eyebrow,
  titulo,
  descripcion,
  align = "left",
  className,
}: SectionHeadingProps) {
  const reduced = useReducedMotionSafe();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax cinemático: todo el bloque del encabezado deriva junto mientras la
  // sección cruza la pantalla (se mueve como una sola pieza, sin solaparse).
  const blockY = useTransform(scrollYProgress, [0, 1], [34, -34]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={reduced ? undefined : { y: blockY }}
        className={cn(
          "flex flex-col gap-4 will-change-transform",
          align === "center" && "items-center text-center",
        )}
      >
      <Reveal distance={16}>
        <span className="eyebrow">
          <span className="font-mono-hud text-muted-foreground/70">[{numero}]</span>
          <motion.span
            aria-hidden
            className="inline-block h-px bg-brand"
            initial={{ width: 0 }}
            whileInView={{ width: reduced ? 28 : 40 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
          />
          <ScrambleText text={eyebrow} startDelay={0.15} />
          <motion.span
            aria-hidden
            className="inline-block h-3.5 w-px bg-brand"
            animate={reduced ? undefined : { opacity: [1, 1, 0, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
        </span>
      </Reveal>

      <motion.h2
        initial={
          reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 40, scale: 0.965, filter: "blur(14px)" }
        }
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={viewportOnce}
        transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.05 }}
        className={cn(
          "max-w-4xl text-balance text-4xl font-bold leading-[0.95] will-change-transform sm:text-5xl lg:text-6xl",
          align === "center" && "mx-auto",
        )}
      >
        {titulo}
      </motion.h2>

      {descripcion && (
        <Reveal distance={20} delay={0.12}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {descripcion}
          </p>
        </Reveal>
      )}
      </motion.div>
    </div>
  );
}
