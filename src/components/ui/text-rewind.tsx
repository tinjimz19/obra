"use client";

/**
 * TextRewind — adaptación de @kokonutd/text-rewind.
 *
 * Cada letra "rebobina": entra girando sobre su eje X con un desfase en
 * cascada y, al pasar el cursor por encima (o al hacer foco), la palabra
 * vuelve a rebobinar. Con prefers-reduced-motion el texto simplemente aparece.
 */

import * as React from "react";
import { motion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion-safe";
import { EASE_OUT } from "@/lib/motion";

export interface TextRewindProps {
  text: string;
  className?: string;
  /** Clase aplicada a cada palabra (útil para pintar una en el acento). */
  wordClassName?: (word: string, index: number) => string | undefined;
  /** Retardo antes de que arranque la cascada. */
  delay?: number;
  /** Repetir la animación al pasar el cursor. */
  rewindOnHover?: boolean;
  as?: "h1" | "h2" | "span" | "p";
}

const letter: Variants = {
  hidden: { opacity: 0, y: "0.55em", rotateX: -78, filter: "blur(6px)" },
  show: (stagger: number) => ({
    opacity: 1,
    y: "0em",
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE_OUT, delay: stagger },
  }),
};

export function TextRewind({
  text,
  className,
  wordClassName,
  delay = 0,
  rewindOnHover = true,
  as = "span",
}: TextRewindProps) {
  const reduced = useReducedMotionSafe();
  const [cycle, setCycle] = React.useState(0);
  const words = React.useMemo(() => text.split(" "), [text]);

  const Wrapper = motion[as] as typeof motion.span;

  // El marcado es idéntico con o sin reduced motion: <MotionConfig
  // reducedMotion="user"> hace que Motion ignore los transforms y deje sólo el
  // fundido, así que no hace falta un árbol alternativo (ni desajuste de
  // hidratación). Lo único que se desactiva es el rebobinado al pasar el cursor.

  let letterIndex = 0;

  return (
    <Wrapper
      key={cycle}
      className={cn("inline-block [perspective:800px]", className)}
      initial="hidden"
      animate="show"
      onMouseEnter={rewindOnHover && !reduced ? () => setCycle((c) => c + 1) : undefined}
      onFocus={rewindOnHover && !reduced ? () => setCycle((c) => c + 1) : undefined}
      tabIndex={-1}
    >
      {words.map((word, wIndex) => (
        <span
          key={`${word}-${wIndex}`}
          className={cn("inline-block whitespace-nowrap", wordClassName?.(word, wIndex))}
        >
          {Array.from(word).map((char, cIndex) => {
            const i = letterIndex++;
            return (
              <motion.span
                key={`${char}-${cIndex}`}
                className="inline-block will-change-transform [transform-style:preserve-3d]"
                variants={letter}
                custom={delay + i * 0.032}
              >
                {char}
              </motion.span>
            );
          })}
          {wIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Wrapper>
  );
}
