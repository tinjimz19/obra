"use client";

/**
 * Hero — adaptación de @kinfe123/hero-section-dark sobre el fondo
 * @jatin-yadav05/elegant-dark-pattern, con el titular animado con
 * @kokonutd/text-rewind y CTAs @kokonutd/magnetize-button.
 *
 * Entrada en cascada (stagger) y ligero parallax del contenido al hacer scroll.
 */

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronDown, ShieldCheck, Star } from "lucide-react";

import { empresa } from "@/lib/data";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { ElegantDarkPattern } from "@/components/ui/elegant-dark-pattern";
import { MagnetizeButton } from "@/components/ui/magnetize-button";
import { TextRewind } from "@/components/ui/text-rewind";

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

export function Hero() {
  const reduced = useReducedMotionSafe();
  const ref = React.useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const irA = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 sm:pt-24"
    >
      <ElegantDarkPattern />

      <motion.div
        style={reduced ? undefined : { y, opacity }}
        className="container relative z-10 py-16"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } } }}
          className="max-w-4xl"
        >
          {/* Distintivo superior */}
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-steel-200 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              Constructora general · Licencia CGC-1528904
            </span>
          </motion.div>

          {/* Titular con efecto rewind */}
          <motion.h1
            variants={item}
            className="mt-7 font-display text-[clamp(2.75rem,9vw,7rem)] font-bold uppercase leading-[0.86] tracking-tightest"
          >
            <TextRewind
              text="Construimos lo que"
              delay={0.45}
              className="block"
            />
            <TextRewind
              text="imaginas"
              delay={0.95}
              className="block text-brand"
            />
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg"
          >
            Obra civil, remodelación y diseño-construcción con equipo propio, presupuesto
            abierto por partidas y plazo firme por contrato. {empresa.fundacion} fue nuestro
            primer año; hoy llevamos más de 200 obras entregadas.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
            <MagnetizeButton onClick={() => irA("#proyectos")}>
              Ver proyectos
              <ArrowRight className="size-4" aria-hidden />
            </MagnetizeButton>
            <MagnetizeButton variant="outline" onClick={() => irA("#contacto")}>
              Pedir cotización
            </MagnetizeButton>
          </motion.div>

          {/* Prueba social compacta */}
          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-steel-400"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand" aria-hidden />
              Garantía escrita de 5 años
            </span>
            <span className="inline-flex items-center gap-2">
              <Star className="size-4 fill-brand text-brand" aria-hidden />
              4,9 / 5 en 74 reseñas verificadas
            </span>
            <span className="hidden items-center gap-2 sm:inline-flex">
              <span className="hazard-stripe h-2.5 w-14 rounded-sm" aria-hidden />
              Seguridad certificada OSHA 30
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.button
        type="button"
        onClick={() => irA("#servicios")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-steel-400 transition-colors hover:text-brand sm:flex"
      >
        Desliza
        <motion.span
          animate={reduced ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-4" aria-hidden />
        </motion.span>
      </motion.button>
    </section>
  );
}
