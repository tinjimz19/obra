"use client";

/**
 * Footer — adaptación de @shadcnblockscom/footer-7.
 * Cuatro columnas: marca, navegación, servicios y contacto + mapa,
 * con barra legal inferior.
 */

import { motion } from "motion/react";
import { ArrowUp, HardHat, Mail, MapPin, Phone } from "lucide-react";

import { empresa, navLinks, servicios } from "@/lib/data";
import { viewportOnce } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

export function Footer() {
  const reduced = useReducedMotionSafe();
  const anio = new Date().getFullYear();

  const subir = () =>
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

  return (
    <footer className="relative border-t border-white/10 bg-steel-950">
      <motion.div
        aria-hidden
        className="hazard-stripe h-1.5 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="container py-16 sm:py-20">
        <Stagger className="grid gap-12 md:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {/* Marca */}
          <StaggerItem className="lg:pr-8">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-md bg-brand text-black">
                <HardHat className="size-5" aria-hidden />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                {empresa.nombre}
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {empresa.descripcion}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {empresa.redes.map((red) => (
                <li key={red.nombre}>
                  <a
                    href={red.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-white/12 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                  >
                    {red.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Navegación */}
          <StaggerItem>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Navegación
            </h2>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    <span className="h-px w-0 bg-brand transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Servicios */}
          <StaggerItem>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Servicios
            </h2>
            <ul className="mt-5 space-y-3">
              {servicios.map((s) => (
                <li key={s.titulo}>
                  <a
                    href="#servicios"
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    <span className="h-px w-0 bg-brand transition-all duration-300 group-hover:w-4" />
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Contacto y dirección */}
          <StaggerItem>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Contacto
            </h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                <a
                  href={empresa.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  {empresa.direccion}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                <a
                  href={empresa.telefonoHref}
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  {empresa.telefono}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                <a
                  href={`mailto:${empresa.email}`}
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  {empresa.email}
                </a>
              </li>
            </ul>

            {/* Mapa (placeholder estático enlazado a Google Maps) */}
            <a
              href={empresa.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 block overflow-hidden rounded-lg border border-white/10"
              aria-label="Abrir la ubicación de la oficina en Google Maps"
            >
              <span className="relative block h-32 bg-steel-900">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-grid-steel [background-size:22px_22px] opacity-70"
                />
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-px w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] bg-white/12"
                />
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-[140%] w-px -translate-x-1/2 -translate-y-1/2 rotate-[6deg] bg-white/12"
                />
                <span className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-black transition-transform duration-300 group-hover:scale-110">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-[10px] font-medium text-steel-300">
                  Ver en Google Maps
                </span>
              </span>
            </a>
          </StaggerItem>
        </Stagger>

        {/* Barra legal */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs leading-relaxed text-muted-foreground">
              <p>
                © {anio} {empresa.nombreLegal}. Todos los derechos reservados. ·{" "}
                {empresa.licencia}
              </p>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <a href="#" className="transition-colors hover:text-brand">
                  Aviso legal
                </a>
                <a href="#" className="transition-colors hover:text-brand">
                  Política de privacidad
                </a>
                <a href="#" className="transition-colors hover:text-brand">
                  Política de cookies
                </a>
              </p>
              <p className="mt-3 text-[11px] text-muted-foreground/70">
                Sitio de demostración. Empresa, obras, cifras y reseñas son ejemplos ficticios.
              </p>
            </div>

            <button
              type="button"
              onClick={subir}
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            >
              Volver arriba
              <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
            </button>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
