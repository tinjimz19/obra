import { AnimeNavbar } from "@/components/sections/anime-navbar";
import { Hero } from "@/components/sections/hero";
import { Servicios } from "@/components/sections/servicios";
import { Stats } from "@/components/sections/stats";
import { Proyectos } from "@/components/sections/proyectos";
import { Nosotros } from "@/components/sections/nosotros";
import { Proceso } from "@/components/sections/proceso";
import { Testimonios } from "@/components/sections/testimonios";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { empresa } from "@/lib/data";

/** Datos estructurados para buscadores (ficha de negocio local). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: empresa.nombreLegal,
  alternateName: empresa.nombre,
  description: empresa.descripcion,
  telephone: empresa.telefono,
  email: empresa.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "8350 NW 52nd Ter, Suite 210",
    addressLocality: "Doral",
    addressRegion: "FL",
    postalCode: "33166",
    addressCountry: "US",
  },
  areaServed: "Miami-Dade County",
  foundingDate: String(empresa.fundacion),
  sameAs: empresa.redes.map((r) => r.href),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnimeNavbar />
      <main>
        <Hero />
        <Servicios />
        <Stats />
        <Proyectos />
        <Nosotros />
        <Proceso />
        <Testimonios />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
