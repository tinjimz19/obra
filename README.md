# ACERO & OBRA — Landing page de constructora

Landing one-page en español para una empresa constructora. Oscura, industrial y
animada con **Motion** (la versión actual de Framer Motion, paquete `motion`).

> Sitio de demostración: la empresa, las obras, las cifras y las reseñas son
> ejemplos ficticios. Las imágenes son placeholders generados.

---

## Stack

| Pieza        | Versión / nota                                   |
| ------------ | ------------------------------------------------ |
| Next.js      | 15.5.x — App Router, React Server Components      |
| React        | 19                                               |
| TypeScript   | 5.7, `strict: true`                              |
| Tailwind CSS | 3.4 + `tailwindcss-animate`                      |
| shadcn/ui    | estilo *new-york*, componentes copiados en `src/components/ui` |
| Motion       | 12.x (`import { motion } from "motion/react"`)   |
| Iconos       | lucide-react                                     |
| Fuentes      | Inter + Barlow Condensed **autoalojadas** (`src/fonts`) |

## Puesta en marcha

```bash
npm install
npm run dev      # http://localhost:3000
```

Otros scripts:

```bash
npm run build      # build de producción
npm run start      # servir el build
npm run lint       # ESLint (next/core-web-vitals + typescript)
npm run typecheck  # tsc --noEmit
```

---

## Estructura

```
src/
├── app/
│   ├── layout.tsx          Fuentes locales, metadata, viewport, skip-link
│   ├── page.tsx            Composición de la página + JSON-LD (GeneralContractor)
│   ├── globals.css         Tokens de tema, utilidades, prefers-reduced-motion
│   ├── icon.svg            Favicon
│   └── api/contacto/       Endpoint del formulario (stub listo para tu CRM)
├── components/
│   ├── ui/                 Primitivas: button, input, card, label,
│   │                       magnetize-button, text-rewind,
│   │                       elegant-dark-pattern, reveal, section-heading
│   └── sections/           Las 9 secciones de la landing
├── hooks/                  use-reduced-motion-safe, use-scroll-spy
├── lib/
│   ├── data.ts             ⬅️ TODO el contenido de la página
│   ├── motion.ts           Eases, transiciones y variantes compartidas
│   └── utils.ts            cn()
└── fonts/                  woff2 autoalojados (OFL 1.1)
public/
├── proyectos/              8 imágenes placeholder (1600×1100)
├── equipo/                 Retrato placeholder (1200×1500)
└── og.jpg                  Imagen para redes sociales
```

## Secciones y su origen en 21st.dev

Cada bloque está **reescrito y adaptado** al contenido, la paleta y los
requisitos de accesibilidad de este proyecto, tomando como referencia el
componente indicado. No se usó el MCP de 21st/Magic: los componentes son
código propio dentro del repo, sin dependencias externas más allá del stack
listado arriba, y por tanto son tuyos para editar sin sorpresas.

| # | Sección       | Archivo                                | Referencia 21st.dev                        |
| - | ------------- | -------------------------------------- | ------------------------------------------ |
| 1 | Navbar        | `sections/anime-navbar.tsx`            | `@jatin-yadav05/anime-navbar`              |
| 2 | Hero          | `sections/hero.tsx`                    | `@kinfe123/hero-section-dark`              |
|   | Fondo         | `ui/elegant-dark-pattern.tsx`          | `@jatin-yadav05/elegant-dark-pattern`      |
|   | Titular       | `ui/text-rewind.tsx`                   | `@kokonutd/text-rewind`                    |
|   | Botones       | `ui/magnetize-button.tsx`              | `@kokonutd/magnetize-button`               |
| 3 | Servicios     | `sections/servicios.tsx`               | `@efferd/grid-feature-cards`               |
| 4 | Cifras / KPIs | `sections/stats.tsx`                   | `@designali-in/stats-2`                    |
| 5 | Proyectos     | `sections/proyectos.tsx`               | `@anurag-mishra22/interactive-bento-gallery` |
| 6 | Proceso       | `sections/proceso.tsx`                 | timeline propio                            |
| 7 | Testimonios   | `sections/testimonios.tsx`             | `@anurag-mishra22/testimonial`             |
| 8 | CTA           | `sections/cta.tsx`                     | `@tommyjepsen/call-to-action`              |
| 9 | Footer        | `sections/footer.tsx`                  | `@shadcnblockscom/footer-7`                |

*(La sección "Nosotros" se añadió para dar destino al link del navbar.)*

Si más adelante quieres traer un componente nuevo de 21st.dev:

```bash
npx shadcn@latest add "https://21st.dev/r/<handle>/<componente>"
```

---

## Sistema de animación

Todo pasa por `src/lib/motion.ts` para que el ritmo sea coherente:

- `EASE_OUT = [0.22, 1, 0.36, 1]` — la curva de toda la página.
- `viewportOnce` — `{ once: true, amount: 0.25 }`, con margen negativo para
  que las entradas arranquen un poco antes de estar del todo visibles.
- `fadeUp`, `scaleIn`, `staggerContainer` — variantes reutilizables.
- `<Reveal>`, `<Stagger>` y `<StaggerItem>` (`ui/reveal.tsx`) encapsulan
  `whileInView` + `viewport once` + reduced motion. Úsalos en vez de repetir
  la configuración en cada sección.

Técnicas por sección:

- **Navbar** — `layoutId` para la píldora del link activo, `useScroll` para la
  barra de progreso, cambio de altura/fondo al pasar de 24 px de scroll.
- **Hero** — cascada con `staggerChildren`, parallax con `useScroll` +
  `useTransform`, y letras del titular con rotación 3D en `text-rewind`.
- **KPIs** — `animate()` sobre un `MotionValue` que escribe en el DOM: cuenta
  sin re-render de React en cada frame.
- **Proyectos** — `layout` para reordenar al filtrar y `layoutId` compartido
  para que la imagen "vuele" hasta el detalle.
- **Proceso** — la línea se dibuja con `useScroll` + `useSpring` sobre `scaleY`.
- **Testimonios** — `AnimatePresence` con `custom` para transición direccional,
  arrastre táctil y autoplay pausable.

### `prefers-reduced-motion`

Se respeta en dos capas:

1. `useReducedMotionSafe()` en cada componente: desactiva parallax, imanes,
   arrastre, autoplay y desplazamientos, dejando sólo fundidos mínimos.
2. Un bloque `@media (prefers-reduced-motion: reduce)` en `globals.css` que
   neutraliza las animaciones y transiciones CSS y el `scroll-behavior: smooth`.

---

## Accesibilidad

- Skip-link al contenido, `aria-current` en el link activo del navbar.
- Menú móvil y modal de proyecto: `Escape` cierra, el scroll de fondo se
  bloquea, `role="dialog"` + `aria-modal`.
- Contadores: valor final disponible para lectores de pantalla vía `sr-only`
  (los dígitos animados van `aria-hidden`).
- Carrusel: `aria-roledescription="carrusel"`, navegación con flechas del
  teclado, autoplay que se pausa con hover y con foco.
- Foco visible global con `:focus-visible` y `outline-offset`.
- Formulario con `<label>` asociado, `required`, `inputMode` y `autoComplete`.

## Rendimiento

- Fuentes autoalojadas con `next/font/local` — sin petición a Google Fonts,
  sin CLS y build reproducible sin red.
- `next/image` con `fill` + `sizes` correctos en toda la galería.
- Los contadores y los halos animan `transform`/`opacity`, no propiedades que
  provoquen layout.
- `optimizePackageImports` para `lucide-react` y `motion`.
- Build de referencia: **~190 kB** de First Load JS en `/`.

---

## Qué personalizar primero

1. **`src/lib/data.ts`** — nombre, teléfono, dirección, licencia, servicios,
   obras, KPIs, testimonios y textos. Casi todo el contenido vive aquí.
2. **Imágenes** — sustituye `public/proyectos/*.jpg` y `public/equipo/*.jpg`
   por fotos reales (mismas proporciones: 16:11 y 4:5).
3. **Color de acento** — `#FF6A1A` está en `tailwind.config.ts` (`brand`) y en
   `globals.css` (`--primary`, `--accent`, `--ring` en HSL: `21 100% 55%`).
4. **`src/app/api/contacto/route.ts`** — conecta el formulario a tu correo o
   CRM y añade protección anti-spam (Turnstile, hCaptcha o un honeypot).
5. **`metadataBase`** en `src/app/layout.tsx` — pon tu dominio real.

## Licencias

- Inter y Barlow Condensed: SIL Open Font License 1.1.
- Iconos: lucide-react (ISC).
- Imágenes: generadas para este proyecto, sin restricciones.
