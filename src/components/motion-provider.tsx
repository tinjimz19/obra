"use client";

import { MotionConfig } from "motion/react";

import { transition } from "@/lib/motion";

/**
 * Configuración global de Motion.
 *
 * `reducedMotion="user"` hace que Motion ignore automáticamente las
 * animaciones de transform y layout cuando el sistema pide menos movimiento,
 * dejando sólo opacidad y color. Es la red de seguridad que complementa a
 * useReducedMotionSafe() en cada componente.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={transition.base}>
      {children}
    </MotionConfig>
  );
}
