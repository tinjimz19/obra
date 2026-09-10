/**
 * Contenido de la landing. Todo el texto de la página vive aquí para que
 * cambiar copys, obras o datos de contacto no obligue a tocar componentes.
 * Los datos son de ejemplo (empresa ficticia) — reemplázalos por los reales.
 */

export const empresa = {
  nombre: "ACERO & OBRA",
  nombreLegal: "Acero & Obra Construcciones LLC",
  claim: "Construimos lo que imaginas",
  descripcion:
    "Constructora integral: obra civil, remodelación y diseño-construcción con equipo propio, plazos firmes y control de costos abierto.",
  fundacion: 2010,
  direccion: "8350 NW 52nd Ter, Suite 210, Doral, FL 33166",
  telefono: "+1 (305) 555-0142",
  telefonoHref: "tel:+13055550142",
  whatsapp: "+1 (305) 555-0187",
  whatsappHref: "https://wa.me/13055550187",
  email: "contacto@aceroyobra.com",
  horario: "Lun a Vie, 7:00 – 18:00 · Sáb 8:00 – 13:00",
  licencia: "Licencia de contratista general CGC-1528904",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=8350+NW+52nd+Ter+Doral+FL+33166",
  redes: [
    { nombre: "Instagram", href: "https://instagram.com/aceroyobra" },
    { nombre: "LinkedIn", href: "https://linkedin.com/company/aceroyobra" },
    { nombre: "Facebook", href: "https://facebook.com/aceroyobra" },
    { nombre: "YouTube", href: "https://youtube.com/@aceroyobra" },
  ],
} as const;

export type NavLink = { label: string; href: string; id: string };

export const navLinks: NavLink[] = [
  { label: "Inicio", href: "#inicio", id: "inicio" },
  { label: "Servicios", href: "#servicios", id: "servicios" },
  { label: "Proyectos", href: "#proyectos", id: "proyectos" },
  { label: "Nosotros", href: "#nosotros", id: "nosotros" },
  { label: "Contacto", href: "#contacto", id: "contacto" },
];

/** Ids observados por el scroll-spy del navbar (constante para evitar re-suscripciones). */
export const seccionIds = navLinks.map((l) => l.id);

export type IconKey =
  | "obra-civil"
  | "remodelaciones"
  | "diseno"
  | "estructuras"
  | "acabados"
  | "mantenimiento";

export type Servicio = {
  icon: IconKey;
  titulo: string;
  descripcion: string;
  bullets: string[];
};

export const servicios: Servicio[] = [
  {
    icon: "obra-civil",
    titulo: "Obra civil",
    descripcion:
      "Ejecución completa de edificaciones y urbanismo, desde movimiento de tierras hasta entrega llave en mano.",
    bullets: ["Movimiento de tierras", "Cimentaciones", "Urbanismo y viales"],
  },
  {
    icon: "remodelaciones",
    titulo: "Remodelaciones",
    descripcion:
      "Renovamos viviendas, oficinas y locales con obra limpia, cronograma cerrado y mínima interrupción de la actividad.",
    bullets: ["Reformas integrales", "Ampliaciones", "Cambio de uso"],
  },
  {
    icon: "diseno",
    titulo: "Diseño y construcción",
    descripcion:
      "Un solo interlocutor para proyecto, permisos y ejecución. Menos coordinación para ti, menos sorpresas en obra.",
    bullets: ["Anteproyecto y BIM", "Gestión de permisos", "Presupuesto abierto"],
  },
  {
    icon: "estructuras",
    titulo: "Estructuras",
    descripcion:
      "Cálculo y montaje de estructuras de concreto y acero, con control de calidad y ensayos certificados.",
    bullets: ["Concreto armado", "Acero estructural", "Refuerzo y recalce"],
  },
  {
    icon: "acabados",
    titulo: "Acabados",
    descripcion:
      "Detalle fino: revestimientos, carpintería a medida e iluminación que definen el resultado final.",
    bullets: ["Revestimientos", "Carpintería a medida", "Pintura e iluminación"],
  },
  {
    icon: "mantenimiento",
    titulo: "Mantenimiento",
    descripcion:
      "Planes preventivos y correctivos para conservar el valor del inmueble y evitar paradas no planificadas.",
    bullets: ["Planes preventivos", "Impermeabilización", "Atención 24/7"],
  },
];

export type Kpi = {
  valor: number;
  sufijo?: string;
  prefijo?: string;
  etiqueta: string;
  detalle: string;
};

export const kpis: Kpi[] = [
  { valor: 15, prefijo: "+", etiqueta: "años de trayectoria", detalle: "Operando de forma ininterrumpida desde 2010." },
  { valor: 200, prefijo: "+", etiqueta: "obras entregadas", detalle: "Residencial, comercial e industrial." },
  { valor: 80, prefijo: "+", etiqueta: "clientes activos", detalle: "El 68 % repite con nosotros." },
  { valor: 100, sufijo: "%", etiqueta: "cumplimiento de plazos", detalle: "Penalidad por retraso incluida en contrato." },
];

export const categoriasProyecto = [
  "Todos",
  "Obra civil",
  "Remodelaciones",
  "Estructuras",
  "Diseño y construcción",
  "Acabados",
] as const;

export type CategoriaProyecto = (typeof categoriasProyecto)[number];

export type Proyecto = {
  id: string;
  titulo: string;
  categoria: Exclude<CategoriaProyecto, "Todos">;
  ubicacion: string;
  anio: number;
  superficie: string;
  descripcion: string;
  imagen: string;
  /** Tamaño dentro del bento. */
  span: "lg" | "tall" | "wide" | "sm";
};

export const proyectos: Proyecto[] = [
  {
    id: "torre-meridiano",
    titulo: "Torre Meridiano",
    categoria: "Obra civil",
    ubicacion: "Doral, FL",
    anio: 2025,
    superficie: "18 niveles · 21.400 m²",
    descripcion:
      "Edificio de uso mixto con 132 apartamentos, dos niveles comerciales y estacionamiento elevado. Entregado tres semanas antes del plazo contractual.",
    imagen: "/proyectos/torre-meridiano.jpg",
    span: "lg",
  },
  {
    id: "residencia-palma-real",
    titulo: "Residencia Palma Real",
    categoria: "Remodelaciones",
    ubicacion: "Coral Gables, FL",
    anio: 2024,
    superficie: "640 m²",
    descripcion:
      "Reforma integral de vivienda de los años 60: nueva envolvente, apertura de planta baja y piscina reconstruida sin alterar la fachada protegida.",
    imagen: "/proyectos/residencia-palma-real.jpg",
    span: "tall",
  },
  {
    id: "centro-logistico-norte",
    titulo: "Centro Logístico Norte",
    categoria: "Estructuras",
    ubicacion: "Medley, FL",
    anio: 2025,
    superficie: "12.000 m²",
    descripcion:
      "Nave industrial en acero con 14 muelles de carga, luz libre de 32 m y losa de alta planimetría para racks de 11 m.",
    imagen: "/proyectos/centro-logistico-norte.jpg",
    span: "sm",
  },
  {
    id: "clinica-santa-marta",
    titulo: "Clínica Santa Marta",
    categoria: "Diseño y construcción",
    ubicacion: "Hialeah, FL",
    anio: 2023,
    superficie: "3.200 m²",
    descripcion:
      "Proyecto y obra de centro ambulatorio con quirófanos, imagenología y sala blanca. Gestión completa de permisos sanitarios.",
    imagen: "/proyectos/clinica-santa-marta.jpg",
    span: "wide",
  },
  {
    id: "plaza-el-roble",
    titulo: "Plaza Comercial El Roble",
    categoria: "Obra civil",
    ubicacion: "Kendall, FL",
    anio: 2024,
    superficie: "22 locales · 6.800 m²",
    descripcion:
      "Centro comercial de una planta con plaza central arbolada, 210 plazas de aparcamiento y sistema de recogida de aguas pluviales.",
    imagen: "/proyectos/plaza-el-roble.jpg",
    span: "sm",
  },
  {
    id: "hotel-bahia-12",
    titulo: "Hotel Bahía 12",
    categoria: "Acabados",
    ubicacion: "Miami Beach, FL",
    anio: 2025,
    superficie: "96 habitaciones",
    descripcion:
      "Acabados y mobiliario fijo de hotel boutique: microcemento, carpintería en roble y iluminación técnica en zonas comunes.",
    imagen: "/proyectos/hotel-bahia-12.jpg",
    span: "tall",
  },
  {
    id: "puente-rio-claro",
    titulo: "Puente Peatonal Río Claro",
    categoria: "Estructuras",
    ubicacion: "Sweetwater, FL",
    anio: 2023,
    superficie: "78 m de luz",
    descripcion:
      "Puente peatonal atirantado montado en dos fases nocturnas para no cortar el tráfico de la vía inferior.",
    imagen: "/proyectos/puente-rio-claro.jpg",
    span: "sm",
  },
  {
    id: "oficinas-vertiz",
    titulo: "Oficinas Grupo Vértiz",
    categoria: "Remodelaciones",
    ubicacion: "Brickell, Miami, FL",
    anio: 2024,
    superficie: "1.100 m²",
    descripcion:
      "Dos plantas de oficinas renovadas por fases, con el cliente operando en el edificio durante toda la obra.",
    imagen: "/proyectos/oficinas-vertiz.jpg",
    span: "sm",
  },
];

export type Paso = {
  numero: string;
  titulo: string;
  duracion: string;
  descripcion: string;
  entregables: string[];
};

export const proceso: Paso[] = [
  {
    numero: "01",
    titulo: "Diagnóstico",
    duracion: "3 a 5 días",
    descripcion:
      "Visitamos el sitio, medimos, revisamos normativa aplicable y entendemos qué quieres lograr y con qué presupuesto.",
    entregables: ["Visita técnica", "Levantamiento del estado actual", "Informe de viabilidad"],
  },
  {
    numero: "02",
    titulo: "Diseño y presupuesto",
    duracion: "2 a 4 semanas",
    descripcion:
      "Desarrollamos el proyecto y entregamos un presupuesto por partidas, con cantidades y precios unitarios abiertos.",
    entregables: ["Planos y render", "Presupuesto por partidas", "Cronograma de obra"],
  },
  {
    numero: "03",
    titulo: "Construcción",
    duracion: "Según alcance",
    descripcion:
      "Ejecutamos con equipo propio y jefe de obra asignado. Recibes reporte semanal con avance, fotos y control de costos.",
    entregables: ["Reporte semanal", "Control de calidad", "Seguridad certificada"],
  },
  {
    numero: "04",
    titulo: "Entrega",
    duracion: "1 semana",
    descripcion:
      "Recorrido conjunto, cierre de observaciones, manuales de mantenimiento y garantía por escrito desde el día uno.",
    entregables: ["Cierre de punch list", "Manual de mantenimiento", "Garantía de 5 años"],
  },
];

export type Testimonio = {
  nombre: string;
  cargo: string;
  empresa: string;
  texto: string;
  proyecto: string;
  iniciales: string;
};

export const testimonios: Testimonio[] = [
  {
    nombre: "Marcela Duarte",
    cargo: "Directora de Operaciones",
    empresa: "Grupo Vértiz",
    proyecto: "Oficinas Grupo Vértiz · 1.100 m²",
    iniciales: "MD",
    texto:
      "Remodelaron dos plantas completas mientras seguíamos trabajando en el edificio. Cero días de oficina cerrada y el cronograma se cumplió semana a semana, sin excusas.",
  },
  {
    nombre: "Andrés Lemos",
    cargo: "Gerente de Expansión",
    empresa: "Retail Kendall Partners",
    proyecto: "Plaza Comercial El Roble · 6.800 m²",
    iniciales: "AL",
    texto:
      "Lo que más valoro es el presupuesto abierto por partidas. Sabíamos exactamente en qué se iba cada dólar y no aparecieron extras al final de la obra.",
  },
  {
    nombre: "Paula Restrepo",
    cargo: "Propietaria",
    empresa: "Residencia Palma Real",
    proyecto: "Reforma integral · 640 m²",
    iniciales: "PR",
    texto:
      "Tenían que respetar una fachada protegida y aun así modernizar toda la casa. El resultado superó lo que habíamos imaginado y la obra terminó a tiempo.",
  },
];

export const tiposProyecto = [
  "Obra civil",
  "Remodelación",
  "Diseño y construcción",
  "Estructuras",
  "Acabados",
  "Mantenimiento",
  "Aún no lo tengo claro",
] as const;

export const nosotros = {
  titulo: "Una constructora que responde con nombre y apellido",
  parrafos: [
    "Nacimos en 2010 como un equipo de seis personas con una grúa alquilada. Hoy somos 74 profesionales con maquinaria propia, pero seguimos trabajando igual: un jefe de obra asignado a tu proyecto, su teléfono directo y un reporte semanal que puedes leer en cinco minutos.",
    "No subcontratamos la responsabilidad. Estructura, instalaciones y acabados los ejecuta gente de la casa, y eso es lo que nos permite firmar plazos con penalidad por retraso incluida en el contrato.",
  ],
  valores: [
    { titulo: "Presupuesto abierto", texto: "Precios unitarios y cantidades a la vista. Sin partidas comodín." },
    { titulo: "Equipo propio", texto: "74 profesionales en plantilla y maquinaria propia en obra." },
    { titulo: "Plazo firme", texto: "Penalidad por retraso incluida en el contrato desde la firma." },
    { titulo: "Garantía de 5 años", texto: "Cobertura escrita sobre estructura e impermeabilización." },
  ],
} as const;
