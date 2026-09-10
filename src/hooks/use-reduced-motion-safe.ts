"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Envoltorio sobre useReducedMotion de Motion.
 *
 * Devuelve siempre boolean y, además, `false` durante el render del servidor y
 * el primer render del cliente: así el HTML hidratado coincide exactamente y
 * no se producen desajustes de hidratación en los componentes que cambian su
 * marcado según la preferencia. Tras montar, pasa al valor real.
 *
 * La ventana entre ambos está cubierta por dos redes de seguridad:
 *   · <MotionConfig reducedMotion="user"> en el layout, que hace que Motion
 *     ignore transform/layout para quien pide menos movimiento;
 *   · el bloque @media (prefers-reduced-motion: reduce) de globals.css.
 */
export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted && (reduced ?? false);
}
