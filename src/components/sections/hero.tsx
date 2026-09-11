"use client";

/**
 * Hero — pantalla flotante que se inclina hacia el cursor (efecto 3D) mostrando
 * un pase de fotos de obra con Ken Burns + crossfade, sobre el fondo animado
 * @jatin-yadav05/elegant-dark-pattern. Titular con @kokonutd/text-rewind y CTAs
 * @kokonutd/magnetize-button. A pantalla completa tipo intro.
 *
 * Adaptado de la idea "scroll-locked-video-hero" PERO:
 *   · NO secuestra la rueda del ratón (el scroll de la página sigue normal);
 *   · sin audio; paleta naranja/industrial de la marca;
 *   · imágenes en vez de video; respeta prefers-reduced-motion y punteros táctiles.
 */

import * as React from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, ChevronDown, Radio, ShieldCheck, Star } from "lucide-react";

import { empresa, proyectos } from "@/lib/data";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { ElegantDarkPattern } from "@/components/ui/elegant-dark-pattern";
import { MagnetizeButton } from "@/components/ui/magnetize-button";
import { TextRewind } from "@/components/ui/text-rewind";

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

// Fotos de obra que rotan dentro de la pantalla flotante.
const SLIDES = proyectos.slice(0, 5).map((p) => ({
  src: p.imagen,
  titulo: p.titulo,
  ubicacion: p.ubicacion,
  categoria: p.categoria,
}));

const SLIDE_MS = 4800;

/**
 * Pantalla flotante: cae/entra en 3D, se inclina siguiendo el cursor mediante
 * springs y muestra el pase de fotos. Todo el 3D se desactiva con reduced
 * motion o en punteros gruesos (táctil).
 */
function FloatingScreen({ reduced, coarse }: { reduced: boolean; coarse: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const interactive = !reduced && !coarse;

  // Avance automático del pase de fotos.
  React.useEffect(() => {
    if (paused || SLIDES.length <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  // Inclinación hacia el cursor.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springX = useSpring(rx, { stiffness: 150, damping: 18, mass: 0.6 });
  const springY = useSpring(ry, { stiffness: 150, damping: 18, mass: 0.6 });
  const rotateX = useTransform(springX, (v) => `${v}deg`);
  const rotateY = useTransform(springY, (v) => `${v}deg`);
  // Brillo especular que se mueve en sentido contrario a la inclinación.
  const glare = useMotionTemplate`radial-gradient(120% 120% at ${useTransform(
    springY,
    [-10, 10],
    [30, 70],
  )}% ${useTransform(springX, [-10, 10], [70, 30])}%, rgba(255,255,255,0.14), transparent 55%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 16);
    rx.set(-py * 12);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    setPaused(false);
  };

  const current = SLIDES[index];

  return (
    <div className="[perspective:1600px]">
      {/* Keyframes Ken Burns autocontenidos (no dependen de globals.css) */}
      <style>{`
        @keyframes kenburns-a {
          from { transform: scale(1.02) translate(0, 0); }
          to   { transform: scale(1.14) translate(-1.5%, -1.5%); }
        }
        @keyframes kenburns-b {
          from { transform: scale(1.14) translate(1.5%, 1%); }
          to   { transform: scale(1.02) translate(0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="kenburns"] { animation: none !important; }
        }
      `}</style>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => interactive && setPaused(true)}
        onPointerLeave={onLeave}
        initial={{ opacity: 0, y: reduced ? 0 : 40, rotateX: reduced ? 0 : 12, scale: reduced ? 1 : 0.94 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 }}
        style={interactive ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className="group relative h-[70svh] max-h-[620px] w-[92vw] overflow-hidden rounded-2xl border border-white/12 bg-steel-950 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)] sm:aspect-[16/10] sm:h-auto sm:max-h-none sm:w-[min(1080px,94vw)] sm:rounded-3xl"
      >
        {/* Aro de acento */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 rounded-2xl ring-1 ring-inset ring-white/10 sm:rounded-3xl"
        />

        {/* Pase de fotos con Ken Burns + crossfade */}
        <div aria-hidden className="absolute inset-0">
          {SLIDES.map((s, i) => {
            const active = i === index;
            return (
              <div
                key={s.src}
                className="absolute inset-0 transition-opacity duration-1000 ease-out"
                style={{ opacity: active ? 1 : 0 }}
              >
                <div
                  className={
                    !reduced && active
                      ? i % 2 === 0
                        ? "absolute inset-0 animate-[kenburns-a_9s_ease-out_forwards]"
                        : "absolute inset-0 animate-[kenburns-b_9s_ease-out_forwards]"
                      : "absolute inset-0"
                  }
                >
                  <Image
                    src={s.src}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1100px) 94vw, 1080px"
                    className="object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Viñeta de lente + degradado inferior para legibilidad del texto */}
        <div
          aria-hidden
          className="absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse 95% 90% at 50% 42%, transparent 48%, rgba(4,6,10,0.5) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 z-10 bg-gradient-to-b from-black/35 via-black/5 to-black/80"
        />

        {/* Brillo especular ligado a la inclinación */}
        {interactive && (
          <motion.span aria-hidden className="absolute inset-0 z-20 mix-blend-screen" style={{ background: glare }} />
        )}

        {/* Esquinas tipo visor técnico */}
        <span aria-hidden className="absolute left-4 top-4 z-20 size-6 rounded-tl-md border-l-2 border-t-2 border-brand/70 sm:left-6 sm:top-6" />
        <span aria-hidden className="absolute right-4 top-4 z-20 size-6 rounded-tr-md border-r-2 border-t-2 border-white/25 sm:right-6 sm:top-6" />
        <span aria-hidden className="absolute bottom-4 left-4 z-20 size-6 rounded-bl-md border-b-2 border-l-2 border-white/25 sm:bottom-6 sm:left-6" />
        <span aria-hidden className="absolute bottom-4 right-4 z-20 size-6 rounded-br-md border-b-2 border-r-2 border-brand/70 sm:bottom-6 sm:right-6" />

        {/* Chip "EN OBRA" + rótulo de la foto actual */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand backdrop-blur-sm">
              <Radio className="size-3 animate-pulse-soft" aria-hidden />
              En obra
            </span>
          </div>
          <motion.div
            key={index}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="max-w-[62%] text-right"
          >
            <p className="truncate font-display text-sm font-bold leading-tight text-white sm:text-base">
              {current.titulo}
            </p>
            <p className="truncate text-[11px] text-steel-300">
              {current.categoria} · {current.ubicacion}
            </p>
          </motion.div>
        </div>

        {/* Puntos indicadores del pase */}
        <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:top-6">
          {SLIDES.map((s, i) => (
            <span
              key={s.src}
              className={
                "h-1 rounded-full transition-all duration-500 " +
                (i === index ? "w-6 bg-brand" : "w-1.5 bg-white/30")
              }
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const reduced = useReducedMotionSafe();
  const [coarse, setCoarse] = React.useState(false);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const irA = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden py-28 sm:py-24"
    >
      <ElegantDarkPattern />

      <motion.div
        style={reduced ? undefined : { y, opacity }}
        className="container relative z-10 flex flex-col items-center"
      >
        {/* Pantalla flotante (el elemento visual protagonista) */}
        <FloatingScreen reduced={reduced} coarse={coarse} />

        {/* Contenido superpuesto — NO se inclina, va por encima de la pantalla */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } } }}
          className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center px-4 text-center"
        >
          <motion.div variants={item} className="pointer-events-auto">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/45 px-4 py-1.5 text-xs font-medium text-steel-200 backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              Constructora general · Licencia CGC-1528904
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 font-display text-[clamp(2.5rem,8.5vw,6.5rem)] font-bold uppercase leading-[0.86] tracking-tightest [text-shadow:0_6px_40px_rgba(0,0,0,0.75)]"
          >
            <TextRewind text="Construimos lo que" delay={0.55} className="block" />
            <TextRewind text="imaginas" delay={1.05} className="block text-brand" />
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-balance text-sm leading-relaxed text-steel-200 [text-shadow:0_2px_16px_rgba(0,0,0,0.9)] sm:text-lg"
          >
            Obra civil, remodelación y diseño-construcción con equipo propio, presupuesto
            abierto por partidas y plazo firme por contrato.
          </motion.p>

          <motion.div variants={item} className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3">
            <MagnetizeButton onClick={() => irA("#proyectos")}>
              Ver proyectos
              <ArrowRight className="size-4" aria-hidden />
            </MagnetizeButton>
            <MagnetizeButton variant="outline" onClick={() => irA("#contacto")}>
              Pedir cotización
            </MagnetizeButton>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs text-steel-300 sm:text-sm"
          >
            <span className="inline-flex items-center gap-2 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
              <ShieldCheck className="size-4 text-brand" aria-hidden />
              Garantía escrita de 5 años
            </span>
            <span className="inline-flex items-center gap-2 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
              <Star className="size-4 fill-brand text-brand" aria-hidden />
              4,9 / 5 en 74 reseñas
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
        transition={{ delay: 1.9, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-steel-400 transition-colors hover:text-brand sm:flex"
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
