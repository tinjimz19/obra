"use client";

/**
 * AnimeNavbar — adaptación de @jatin-yadav05/anime-navbar.
 *
 * Barra sticky que:
 *  · arranca transparente y al hacer scroll gana fondo, blur, borde y sombra;
 *  · mueve una píldora con `layoutId` bajo el link activo (scroll-spy);
 *  · dibuja una barra de progreso de lectura con useScroll;
 *  · despliega un menú a pantalla completa en móvil con foco atrapado y Esc.
 */

import * as React from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { HardHat, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { navLinks, seccionIds, empresa } from "@/lib/data";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { EASE_OUT, transition } from "@/lib/motion";
import { MagnetizeButton } from "@/components/ui/magnetize-button";

export function AnimeNavbar() {
  const reduced = useReducedMotionSafe();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const activo = useScrollSpy(seccionIds, 140);

  const { scrollYProgress } = useScroll();
  const progreso = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll y cierra con Escape cuando el menú móvil está abierto
  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const irA = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={reduced ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "transition-all duration-500",
          scrolled
            ? "border-b border-white/10 bg-background/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Navegación principal"
          className={cn(
            "container flex items-center justify-between transition-all duration-500",
            scrolled ? "h-16" : "h-20",
          )}
        >
          {/* Logotipo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              irA("#inicio");
            }}
            className="group flex items-center gap-2.5"
          >
            <motion.span
              whileHover={reduced ? undefined : { rotate: -10, scale: 1.06 }}
              transition={transition.spring}
              className="grid size-9 place-items-center rounded-md bg-brand text-black"
            >
              <HardHat className="size-5" aria-hidden />
            </motion.span>
            <span className="font-display text-lg font-bold tracking-tight">
              {empresa.nombre.split(" & ")[0]}
              <span className="text-brand"> &amp; </span>
              {empresa.nombre.split(" & ")[1]}
            </span>
          </a>

          {/* Links de escritorio con píldora animada */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = activo === link.id;
              return (
                <li key={link.id} className="relative">
                  <a
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      irA(link.href);
                    }}
                    className={cn(
                      "relative block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                      isActive ? "text-black" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-brand"
                        transition={
                          reduced
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 380, damping: 32 }
                        }
                      />
                    )}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <MagnetizeButton
              className="hidden h-10 px-5 text-[13px] sm:inline-flex"
              onClick={() => irA("#contacto")}
            >
              Cotiza tu obra
            </MagnetizeButton>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="grid size-10 place-items-center rounded-md border border-white/12 text-foreground transition-colors hover:border-brand/60 lg:hidden"
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </nav>
      </div>

      {/* Progreso de lectura */}
      <motion.div
        aria-hidden
        style={{ scaleX: progreso }}
        className="h-[2px] origin-left bg-brand"
      />

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-0 -z-10 bg-background/97 pt-24 backdrop-blur-xl lg:hidden"
          >
            <motion.ul
              className="container flex flex-col gap-1"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.id}
                  variants={{
                    hidden: { opacity: 0, x: reduced ? 0 : -24 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_OUT } },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      irA(link.href);
                    }}
                    className={cn(
                      "flex items-baseline gap-4 border-b border-white/8 py-5 font-display text-3xl font-bold tracking-tight transition-colors",
                      activo === link.id ? "text-brand" : "text-foreground hover:text-brand",
                    )}
                  >
                    <span className="font-sans text-xs font-semibold text-muted-foreground">
                      0{navLinks.indexOf(link) + 1}
                    </span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <div className="container mt-8">
              <MagnetizeButton className="w-full" onClick={() => irA("#contacto")}>
                Cotiza tu obra
              </MagnetizeButton>
              <p className="mt-6 text-sm text-muted-foreground">
                <a href={empresa.telefonoHref} className="hover:text-brand">
                  {empresa.telefono}
                </a>
                <br />
                {empresa.horario}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
