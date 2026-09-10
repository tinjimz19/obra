"use client";

import { useEffect, useState } from "react";

/**
 * Devuelve el id de la sección visible actualmente.
 * Se usa para marcar el link activo del navbar (aria-current + píldora animada).
 */
export function useScrollSpy(ids: string[], offset = 120): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => {
      const scrollY = window.scrollY + offset + 1;
      let current = ids[0] ?? "";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= scrollY) current = id;
      }

      // Al final de la página siempre marcamos la última sección disponible
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;
      if (atBottom) {
        const last = [...ids].reverse().find((id) => document.getElementById(id));
        if (last) current = last;
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [ids, offset]);

  return active;
}
