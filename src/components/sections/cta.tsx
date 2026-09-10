"use client";

/**
 * CTA final — adaptación de @tommyjepsen/call-to-action.
 *
 * Formulario corto (nombre, teléfono, tipo de proyecto) con validación nativa,
 * estados de envío y confirmación animada. El envío va a /api/contacto, que
 * de momento sólo registra la solicitud: conéctalo a tu CRM o servicio de
 * email cuando lo pongas en producción.
 */

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, Phone } from "lucide-react";

import { empresa, tiposProyecto } from "@/lib/data";
import { EASE_OUT, viewportOnce } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagnetizeButton } from "@/components/ui/magnetize-button";
import { Reveal } from "@/components/ui/reveal";

type Estado = "idle" | "enviando" | "ok" | "error";

export function CTA() {
  const reduced = useReducedMotionSafe();
  const [estado, setEstado] = React.useState<Estado>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const datos = Object.fromEntries(new FormData(form).entries());

    setEstado("enviando");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!res.ok) throw new Error("Respuesta no válida");
      setEstado("ok");
      form.reset();
    } catch {
      setEstado("error");
    }
  }

  return (
    <section id="contacto" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.75, ease: EASE_OUT }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-steel-900/60"
        >
          {/* Textura de fondo */}
          <span aria-hidden className="absolute inset-0 bg-brand-fade" />
          <span
            aria-hidden
            className="absolute inset-0 bg-grid-steel [background-size:48px_48px] opacity-40"
            style={{
              maskImage: "radial-gradient(ellipse 70% 90% at 20% 0%, black, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 90% at 20% 0%, black, transparent 75%)",
            }}
          />
          <motion.span
            aria-hidden
            className="absolute -right-24 -top-24 size-80 rounded-full bg-brand/20 blur-3xl"
            animate={reduced ? undefined : { scale: [1, 1.18, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
            {/* Copy */}
            <div>
              <p className="eyebrow">
                <span className="text-muted-foreground/70">07</span>
                <span aria-hidden className="inline-block h-px w-10 bg-brand" />
                Contacto
              </p>

              <h2 className="mt-5 text-balance font-display text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl">
                ¿Listo para empezar <span className="text-brand">tu obra?</span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-relaxed text-steel-300">
                Cuéntanos qué necesitas y te llamamos en menos de 24 horas hábiles con una
                primera estimación de plazo y rango de inversión. La visita técnica es
                gratuita dentro del condado de Miami-Dade.
              </p>

              <div className="mt-8 flex flex-col gap-3 text-sm">
                <a
                  href={empresa.telefonoHref}
                  className="inline-flex w-fit items-center gap-3 text-steel-200 transition-colors hover:text-brand"
                >
                  <span className="grid size-9 place-items-center rounded-full border border-white/12">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  {empresa.telefono}
                </a>
                <p className="text-muted-foreground">{empresa.horario}</p>
              </div>
            </div>

            {/* Formulario */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {estado === "ok" ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                    className="flex h-full min-h-[320px] flex-col items-start justify-center rounded-2xl border border-brand/30 bg-brand/[0.06] p-8"
                    role="status"
                  >
                    <CheckCircle2 className="size-10 text-brand" aria-hidden />
                    <h3 className="mt-5 text-2xl font-bold">Solicitud recibida</h3>
                    <p className="mt-2 text-sm text-steel-300">
                      Te contactamos en menos de 24 horas hábiles. Si tu obra es urgente,
                      llámanos directamente al {empresa.telefono}.
                    </p>
                    <button
                      type="button"
                      onClick={() => setEstado("idle")}
                      className="mt-6 text-sm font-semibold text-brand underline-offset-4 hover:underline"
                    >
                      Enviar otra solicitud
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm sm:p-8"
                    noValidate={false}
                  >
                    <div className="grid gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre y apellido</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="Marcela Duarte"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          required
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+1 (305) 555-0142"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="tipo">Tipo de proyecto</Label>
                        <div className="relative">
                          <Select id="tipo" name="tipo" required defaultValue="">
                            <option value="" disabled>
                              Selecciona una opción
                            </option>
                            {tiposProyecto.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </Select>
                          <span
                            aria-hidden
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            ▾
                          </span>
                        </div>
                      </div>
                    </div>

                    <MagnetizeButton
                      type="submit"
                      className="mt-7 w-full"
                      disabled={estado === "enviando"}
                    >
                      {estado === "enviando" ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden />
                          Enviando…
                        </>
                      ) : (
                        "Pedir cotización"
                      )}
                    </MagnetizeButton>

                    {estado === "error" && (
                      <p role="alert" className="mt-4 text-sm text-red-400">
                        No pudimos enviar tu solicitud. Inténtalo de nuevo o llámanos al{" "}
                        {empresa.telefono}.
                      </p>
                    )}

                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                      Al enviar aceptas que te contactemos por teléfono o WhatsApp. No
                      compartimos tus datos con terceros.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿Prefieres escribir?{" "}
            <a href={`mailto:${empresa.email}`} className="text-brand underline-offset-4 hover:underline">
              {empresa.email}
            </a>{" "}
            ·{" "}
            <a
              href={empresa.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline-offset-4 hover:underline"
            >
              WhatsApp {empresa.whatsapp}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
