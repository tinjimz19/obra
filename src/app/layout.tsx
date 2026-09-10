import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { MotionProvider } from "@/components/motion-provider";
import { empresa } from "@/lib/data";
import "./globals.css";

/**
 * Fuentes autoalojadas (subconjunto latino) — no dependen de Google Fonts en
 * tiempo de build ni de ejecución: mejor rendimiento, sin peticiones a
 * terceros y build reproducible sin red.
 *   · Inter (variable) para texto.
 *   · Barlow Condensed 600/700/800 para titulares: condensada e industrial.
 * Ambas con licencia SIL Open Font License 1.1.
 */
const inter = localFont({
  src: [{ path: "../fonts/inter-latin-variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial"],
});

const display = localFont({
  src: [
    { path: "../fonts/barlow-condensed-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/barlow-condensed-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/barlow-condensed-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Impact", "Haettenschweiler", "system-ui"],
});

const url = "https://www.aceroyobra.com";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${empresa.nombre} · Constructora general en Miami`,
    template: `%s · ${empresa.nombre}`,
  },
  description: empresa.descripcion,
  keywords: [
    "constructora",
    "obra civil",
    "remodelaciones",
    "diseño y construcción",
    "estructuras",
    "contratista general",
    "Miami",
  ],
  authors: [{ name: empresa.nombreLegal }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url,
    siteName: empresa.nombre,
    title: `${empresa.nombre} · ${empresa.claim}`,
    description: empresa.descripcion,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: empresa.claim }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${empresa.nombre} · ${empresa.claim}`,
    description: empresa.descripcion,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0d0f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${display.variable} dark`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <a
          href="#servicios"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
        >
          Saltar al contenido
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
