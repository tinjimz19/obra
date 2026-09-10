"use client";

/**
 * Nosotros — bloque de confianza: relato corto + cuatro compromisos.
 * Entradas laterales con stagger y un retrato con parallax suave.
 */

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { Check } from "lucide-react";

import { empresa, nosotros } from "@/lib/data";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Nosotros() {
  const reduced = useReducedMotionSafe();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section id="nosotros" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <div>
            <SectionHeading numero="04" eyebrow="Nosotros" titulo={nosotros.titulo} />

            <div className="mt-7 space-y-5">
              {nosotros.parrafos.map((p, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{p}</p>
                </Reveal>
              ))}
            </div>

            <Stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-2" stagger={0.08}>
              {nosotros.valores.map((v) => (
                <StaggerItem as="li" key={v.titulo}>
                  <div className="flex h-full gap-3 rounded-lg border border-white/10 bg-white/[0.025] p-4 transition-colors duration-300 hover:border-brand/40">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-black">
                      <Check className="size-3.5" aria-hidden strokeWidth={3} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{v.titulo}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{v.texto}</span>
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Retrato con parallax */}
          <div ref={ref} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: reduced ? 1 : 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.9, ease: EASE_OUT }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10"
            >
              <motion.div style={reduced ? undefined : { y }} className="absolute -inset-y-[6%] inset-x-0">
                <Image
                  src="/equipo/equipo-obra.jpg"
                  alt="Equipo de obra de ACERO & OBRA revisando planos en la estructura de un edificio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
              </motion.div>
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-display text-2xl font-bold leading-tight">74 personas en plantilla</p>
                <p className="mt-1 text-sm text-steel-300">
                  Jefes de obra, encargados, oficiales y técnicos propios. Sin cadenas de subcontratas.
                </p>
              </div>
            </motion.div>

            <Reveal delay={0.15}>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Contratista general
                  </p>
                  <p className="mt-1 text-sm font-semibold">{empresa.licencia}</p>
                </div>
                <span className="hazard-stripe h-8 w-16 rounded-sm" aria-hidden />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
