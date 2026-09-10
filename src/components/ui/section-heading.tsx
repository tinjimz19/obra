"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
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

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Reveal distance={16}>
        <span className="eyebrow">
          <span className="text-muted-foreground/70">{numero}</span>
          <motion.span
            aria-hidden
            className="inline-block h-px bg-brand"
            initial={{ width: 0 }}
            whileInView={{ width: reduced ? 28 : 40 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
          />
          {eyebrow}
        </span>
      </Reveal>

      <Reveal distance={24} delay={0.05}>
        <h2
          className={cn(
            "max-w-4xl text-balance text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl",
            align === "center" && "mx-auto",
          )}
        >
          {titulo}
        </h2>
      </Reveal>

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
    </div>
  );
}
