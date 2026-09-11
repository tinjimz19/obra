"use client";

/**
 * Proyectos — adaptación de @anurag-mishra22/interactive-bento-gallery.
 *
 * Galería bento con filtros por categoría. Los reordenamientos usan `layout`
 * de Motion y la apertura de una obra usa `layoutId` compartido, de forma que
 * la imagen de la celda "vuela" hasta el detalle en lugar de aparecer de golpe.
 */

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, MapPin, Ruler, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  categoriasProyecto,
  proyectos,
  type CategoriaProyecto,
  type Proyecto,
} from "@/lib/data";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { SectionHeading } from "@/components/ui/section-heading";

const SPAN: Record<Proyecto["span"], string> = {
  lg: "sm:col-span-2 sm:row-span-2",
  tall: "sm:row-span-2",
  wide: "sm:col-span-2",
  sm: "",
};

/**
 * Media del bento con parallax de profundidad: la foto es más alta que la celda
 * y se desplaza en Y según la posición de scroll. Direcciones/magnitudes
 * alternadas por índice para que las celdas no se muevan al unísono.
 */
function BentoMedia({ p, index, reduced }: { p: Proyecto; index: number; reduced: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const dir = index % 2 === 0 ? 1 : -1;
  const amp = 14 + (index % 3) * 4; // 14–22% de recorrido
  const y = useTransform(scrollYProgress, [0, 1], [`${-amp * dir}%`, `${amp * dir}%`]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-x-0 -inset-y-[24%]"
        style={reduced ? undefined : { y }}
      >
        <Image
          src={p.imagen}
          alt={`${p.titulo} — ${p.categoria} en ${p.ubicacion}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </motion.div>
    </div>
  );
}

export function Proyectos() {
  const reduced = useReducedMotionSafe();
  const [filtro, setFiltro] = React.useState<CategoriaProyecto>("Todos");
  const [abierto, setAbierto] = React.useState<Proyecto | null>(null);

  const visibles = React.useMemo(
    () => (filtro === "Todos" ? proyectos : proyectos.filter((p) => p.categoria === filtro)),
    [filtro],
  );

  // Cerrar el detalle con Escape y bloquear el scroll de fondo
  React.useEffect(() => {
    if (!abierto) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto]);

  return (
    <section id="proyectos" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          numero="03"
          eyebrow="Proyectos"
          titulo={
            <>
              Obras entregadas, <span className="text-brand">no renders</span>
            </>
          }
          descripcion="Una selección de los últimos tres años. Cada ficha incluye superficie, plazo y alcance real de nuestra intervención."
        />

        {/* Filtros */}
        <motion.div
          role="group"
          aria-label="Filtrar proyectos por categoría"
          className="mt-10 flex flex-wrap gap-2"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        >
          {categoriasProyecto.map((cat) => {
            const activo = filtro === cat;
            return (
              <motion.button
                key={cat}
                type="button"
                onClick={() => setFiltro(cat)}
                aria-pressed={activo}
                variants={{
                  hidden: { opacity: 0, y: reduced ? 0 : 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
                }}
                className={cn(
                  "relative rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                  activo
                    ? "border-brand text-black"
                    : "border-white/12 text-muted-foreground hover:border-white/30 hover:text-foreground",
                )}
              >
                {activo && (
                  <motion.span
                    layoutId="filtro-activo"
                    className="absolute inset-0 -z-10 rounded-full bg-brand"
                    transition={
                      reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 34 }
                    }
                  />
                )}
                {cat}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Bento */}
        <motion.ul
          layout={!reduced}
          className="mt-8 grid auto-rows-[210px] grid-cols-1 gap-4 sm:grid-cols-3 lg:auto-rows-[230px] lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visibles.map((p, i) => (
              <motion.li
                key={p.id}
                layout={!reduced}
                initial={{ opacity: 0, scale: reduced ? 1 : 0.92 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5, ease: EASE_OUT, delay: reduced ? 0 : i * 0.04 },
                }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.94, transition: { duration: 0.25 } }}
                className={cn("group relative", SPAN[p.span])}
              >
                <button
                  type="button"
                  onClick={() => setAbierto(p)}
                  aria-label={`Ver detalle de ${p.titulo}`}
                  className="relative block size-full overflow-hidden rounded-xl border border-white/10 text-left"
                >
                  <motion.div layoutId={reduced ? undefined : `img-${p.id}`} className="absolute inset-0">
                    <BentoMedia p={p} index={i} reduced={reduced} />
                  </motion.div>

                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent transition-opacity duration-500 group-hover:from-black/95"
                  />

                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                        {p.categoria}
                      </span>
                      <span className="mt-1 block truncate font-display text-lg font-bold leading-tight sm:text-xl">
                        {p.titulo}
                      </span>
                      <span className="mt-0.5 block text-xs text-steel-300">
                        {p.ubicacion} · {p.anio}
                      </span>
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 bg-black/40 text-white transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-black">
                      <ArrowUpRight className="size-4" aria-hidden />
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      {/* Detalle */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label="Cerrar detalle"
              onClick={() => setAbierto(null)}
              className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-md"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="proyecto-titulo"
              initial={{ opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE_OUT } }}
              exit={{ opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : 0.98, transition: { duration: 0.2 } }}
              className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/12 bg-steel-950"
            >
              <motion.div
                layoutId={reduced ? undefined : `img-${abierto.id}`}
                className="relative aspect-[16/9] w-full"
              >
                <Image
                  src={abierto.imagen}
                  alt={`${abierto.titulo} — ${abierto.categoria} en ${abierto.ubicacion}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                  priority
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-steel-950 via-transparent to-transparent"
                />
              </motion.div>

              <button
                type="button"
                onClick={() => setAbierto(null)}
                aria-label="Cerrar detalle"
                className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition-colors hover:border-brand hover:text-brand"
              >
                <X className="size-4" aria-hidden />
              </button>

              <div className="p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                  {abierto.categoria} · {abierto.anio}
                </p>
                <h3
                  id="proyecto-titulo"
                  className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl"
                >
                  {abierto.titulo}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {abierto.descripcion}
                </p>
                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-brand" aria-hidden />
                    <dt className="sr-only">Ubicación</dt>
                    <dd className="text-steel-200">{abierto.ubicacion}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="size-4 text-brand" aria-hidden />
                    <dt className="sr-only">Superficie</dt>
                    <dd className="text-steel-200">{abierto.superficie}</dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
