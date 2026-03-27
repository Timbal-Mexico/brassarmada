import { bands } from "@/data/bands";

export type Artist = {
  id: string;
  slug: string;
  name: string;
  image: string;
  bandSlugs: string[];
  genre: string;
  styles: string[];
  debutYear: number;
  active: boolean;
  bio: string;
  timeline: {
    year: number;
    title: string;
    description: string;
  }[];
  instruments: {
    name: string;
    level: 1 | 2 | 3 | 4 | 5;
  }[];
  cvUrl?: string;
  contact?: {
    email?: string;
    phone?: string;
    preferred?: "whatsapp" | "email" | "phone";
  };
  gallery?: string[];
  jams?: string[];
  availabilityStatus: "disponible" | "reservado" | "pendiente";
  availability: {
    date: string;
    status: "disponible" | "reservado" | "pendiente";
    bandSlug?: string;
    location?: string;
    eventType?: string;
    durationHours?: number;
  }[];
};

export const getBandNameBySlug = (slug: string) => {
  return bands.find((b) => b.slug === slug)?.name ?? slug;
};

const genreToStyles = (genre: string) => {
  return genre
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toUpperCase());
};

const STORAGE_KEY = "brassarmada_artist_overrides_v1";

const readOverrides = (): Record<string, Partial<Artist>> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Partial<Artist>>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeOverrides = (value: Record<string, Partial<Artist>>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

export const saveArtistOverride = (slug: string, artist: Partial<Artist>) => {
  const overrides = readOverrides();
  overrides[slug] = artist;
  writeOverrides(overrides);
};

export const getArtists = () => {
  const overrides = readOverrides();
  return artists.map((a) => ({ ...a, ...(overrides[a.slug] ?? {}) }));
};

export const getArtistBySlug = (slug: string) => getArtists().find((a) => a.slug === slug);

export const getArtistById = (id: string) => getArtists().find((a) => a.id === id);

export const artists: Artist[] = [
  {
    id: "a1",
    slug: "arturo-de-la-torre",
    name: "ARTURO DE LA TORRE",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=800&fit=crop",
    bandSlugs: ["arturo-de-la-torre", "arturo-de-la-torre-jazz-orchestra"],
    genre: "Jazz / Funk / Latin",
    styles: genreToStyles("Jazz / Funk / Latin"),
    debutYear: 2004,
    active: true,
    bio: "Trompetista, compositor y director musical. Trayectoria destacada en la escena del jazz en México, con proyectos que combinan jazz contemporáneo, funk y ritmos latinos.",
    timeline: [
      { year: 2004, title: "Debut profesional", description: "Inicio de carrera profesional como instrumentista y arreglista." },
      { year: 2012, title: "Dirección musical", description: "Consolidación como director y productor en proyectos de ensamble." },
      { year: 2020, title: "Expansión de proyectos", description: "Evolución del catálogo con formatos desde cuarteto hasta big band." },
    ],
    instruments: [
      { name: "TROMPETA", level: 5 },
      { name: "FLUGELHORN", level: 4 },
      { name: "ARREGLOS", level: 4 },
    ],
    cvUrl: "https://example.com/cv/arturo-de-la-torre.pdf",
    contact: { email: "brassarmada@gmail.com", phone: "3334669630", preferred: "whatsapp" },
    gallery: [
      "https://images.unsplash.com/photo-1464375117522-1311dd6d4110?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=800&fit=crop",
    ],
    jams: [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtu.be/aqz-KE-bpKQ",
    ],
    availabilityStatus: "disponible",
    availability: [
      { date: "2026-03-28", status: "reservado", bandSlug: "arturo-de-la-torre", location: "CDMX", eventType: "GALA", durationHours: 2 },
      { date: "2026-04-04", status: "pendiente", bandSlug: "arturo-de-la-torre-jazz-orchestra", location: "GDL", eventType: "FESTIVAL", durationHours: 3 },
      { date: "2026-04-12", status: "disponible", location: "CDMX", eventType: "CORPORATIVO", durationHours: 2 },
    ],
  },
  {
    id: "a2",
    slug: "ana-de-armas",
    name: "ANA DE ARMAS",
    image: "https://images.unsplash.com/photo-1521337706264-a414f153a5f5?w=800&h=800&fit=crop",
    bandSlugs: ["ana-de-armas"],
    genre: "Vocal Jazz / Pop",
    styles: genreToStyles("Vocal Jazz / Pop"),
    debutYear: 2018,
    active: true,
    bio: "Voz principal con enfoque en jazz vocal y pop elegante. Ideal para sets íntimos, eventos privados y formatos acústicos.",
    timeline: [
      { year: 2018, title: "Primeros shows", description: "Presentaciones en foros y eventos privados con repertorio vocal." },
      { year: 2022, title: "Formato full band", description: "Expansión a presentaciones con ensamble completo y producción." },
    ],
    instruments: [
      { name: "VOZ", level: 5 },
      { name: "PERCUSIÓN MENOR", level: 3 },
    ],
    cvUrl: "https://example.com/cv/ana-de-armas.pdf",
    contact: { email: "brassarmada@gmail.com", phone: "3334669630", preferred: "whatsapp" },
    gallery: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200&h=800&fit=crop",
    ],
    jams: [
      "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
    ],
    availabilityStatus: "pendiente",
    availability: [
      { date: "2026-03-30", status: "pendiente", bandSlug: "ana-de-armas", location: "CDMX", eventType: "BODA", durationHours: 2 },
      { date: "2026-04-06", status: "reservado", bandSlug: "ana-de-armas", location: "MTY", eventType: "CORPORATIVO", durationHours: 2 },
      { date: "2026-04-18", status: "disponible", location: "CDMX", eventType: "PRIVADO", durationHours: 2 },
    ],
  },
  {
    id: "a3",
    slug: "miguel-torres",
    name: "MIGUEL TORRES",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&h=800&fit=crop",
    bandSlugs: ["arturo-de-la-torre-jazz-orchestra"],
    genre: "Big Band / Jazz",
    styles: genreToStyles("Big Band / Jazz"),
    debutYear: 2012,
    active: true,
    bio: "Músico de sección enfocado en big band y jazz tradicional. Participación en proyectos orquestales y sesiones en vivo.",
    timeline: [
      { year: 2012, title: "Ingreso a big band", description: "Inicio de participación en formatos orquestales." },
      { year: 2019, title: "Giras y festivales", description: "Participación en eventos de gran formato." },
    ],
    instruments: [
      { name: "SAXOFÓN", level: 4 },
      { name: "CLARINETE", level: 3 },
    ],
    cvUrl: "https://example.com/cv/miguel-torres.pdf",
    availabilityStatus: "disponible",
    availability: [
      { date: "2026-04-02", status: "disponible", bandSlug: "arturo-de-la-torre-jazz-orchestra", location: "CDMX", eventType: "FESTIVAL", durationHours: 3 },
      { date: "2026-04-09", status: "reservado", bandSlug: "arturo-de-la-torre-jazz-orchestra", location: "GDL", eventType: "GALA", durationHours: 2 },
    ],
  },
  {
    id: "a4",
    slug: "sofia-rivera",
    name: "SOFÍA RIVERA",
    image: "https://images.unsplash.com/photo-1520975682031-ae9c2b9d7c0c?w=800&h=800&fit=crop",
    bandSlugs: ["la-conzatti"],
    genre: "Jazz / Blues",
    styles: genreToStyles("Jazz / Blues"),
    debutYear: 2016,
    active: true,
    bio: "Música de ensamble con enfoque en jazz y blues. Repertorio clásico y contemporáneo.",
    timeline: [
      { year: 2016, title: "Formación de repertorio", description: "Curaduría de estándares y blues clásicos." },
      { year: 2021, title: "Residencias", description: "Presentaciones recurrentes en formato club." },
    ],
    instruments: [
      { name: "PIANO", level: 4 },
      { name: "TECLADOS", level: 3 },
    ],
    cvUrl: "https://example.com/cv/sofia-rivera.pdf",
    availabilityStatus: "disponible",
    availability: [
      { date: "2026-04-05", status: "disponible", bandSlug: "la-conzatti", location: "CDMX", eventType: "PRIVADO", durationHours: 2 },
      { date: "2026-04-11", status: "pendiente", bandSlug: "la-conzatti", location: "QRO", eventType: "CORPORATIVO", durationHours: 2 },
    ],
  },
  {
    id: "a5",
    slug: "diego-luna",
    name: "DIEGO LUNA",
    image: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=800&h=800&fit=crop",
    bandSlugs: ["beloit"],
    genre: "Jazz Fusión",
    styles: genreToStyles("Jazz Fusión"),
    debutYear: 2019,
    active: true,
    bio: "Proyecto de jazz fusión con enfoque contemporáneo. Participación en shows dinámicos y producción en vivo.",
    timeline: [
      { year: 2019, title: "Debut con Beloit", description: "Inicio en formatos de jazz fusión." },
      { year: 2024, title: "Producción en estudio", description: "Sesiones y material original." },
    ],
    instruments: [
      { name: "GUITARRA", level: 4 },
      { name: "EFECTOS", level: 3 },
    ],
    cvUrl: "https://example.com/cv/diego-luna.pdf",
    availabilityStatus: "disponible",
    availability: [
      { date: "2026-04-03", status: "pendiente", bandSlug: "beloit", location: "CDMX", eventType: "CORPORATIVO", durationHours: 2 },
      { date: "2026-04-17", status: "disponible", bandSlug: "beloit", location: "GDL", eventType: "FESTIVAL", durationHours: 3 },
    ],
  },
  {
    id: "a6",
    slug: "camila-vargas",
    name: "CAMILA VARGAS",
    image: "https://images.unsplash.com/photo-1520975958225-5c4a1b39d0c7?w=800&h=800&fit=crop",
    bandSlugs: ["d-occidentals"],
    genre: "World Music / Jazz",
    styles: genreToStyles("World Music / Jazz"),
    debutYear: 2015,
    active: true,
    bio: "Exploración de world music con perspectiva jazzística. Ensamble orientado a arreglos y texturas.",
    timeline: [
      { year: 2015, title: "Inicio del ensamble", description: "Integración a formatos de world music y jazz." },
      { year: 2020, title: "Nuevas fusiones", description: "Expansión de repertorio y colaboraciones." },
    ],
    instruments: [
      { name: "VIOLÍN", level: 4 },
      { name: "VOZ", level: 3 },
    ],
    cvUrl: "https://example.com/cv/camila-vargas.pdf",
    availabilityStatus: "disponible",
    availability: [
      { date: "2026-04-01", status: "reservado", bandSlug: "d-occidentals", location: "CDMX", eventType: "GALA", durationHours: 2 },
      { date: "2026-04-15", status: "disponible", bandSlug: "d-occidentals", location: "GDL", eventType: "FESTIVAL", durationHours: 3 },
    ],
  },
  {
    id: "a7",
    slug: "jorge-salazar",
    name: "JORGE SALAZAR",
    image: "https://images.unsplash.com/photo-1520975956755-b5f6a538d6a1?w=800&h=800&fit=crop",
    bandSlugs: ["ponzona-de-agave"],
    genre: "Fusión Regional",
    styles: genreToStyles("Fusión Regional"),
    debutYear: 2017,
    active: true,
    bio: "Fusión regional con arreglos modernos. Participación en eventos masivos y privados.",
    timeline: [
      { year: 2017, title: "Debut en formato regional", description: "Inicio con repertorio regional modernizado." },
      { year: 2023, title: "Producción escénica", description: "Optimización de show para escenarios grandes." },
    ],
    instruments: [
      { name: "BATERÍA", level: 4 },
      { name: "PERCUSIONES", level: 4 },
    ],
    cvUrl: "https://example.com/cv/jorge-salazar.pdf",
    availabilityStatus: "disponible",
    availability: [
      { date: "2026-04-07", status: "reservado", bandSlug: "ponzona-de-agave", location: "GDL", eventType: "CORPORATIVO", durationHours: 2 },
      { date: "2026-04-21", status: "disponible", bandSlug: "ponzona-de-agave", location: "CDMX", eventType: "PRIVADO", durationHours: 2 },
    ],
  },
  {
    id: "a8",
    slug: "paula-mendez",
    name: "PAULA MÉNDEZ",
    image: "https://images.unsplash.com/photo-1520975959924-7c2b7b29ea62?w=800&h=800&fit=crop",
    bandSlugs: ["arturo-de-la-torre", "beloit"],
    genre: "Jazz Fusión",
    styles: genreToStyles("Jazz Fusión"),
    debutYear: 2020,
    active: true,
    bio: "Música de sesión y ensamble para proyectos de jazz fusión. Participa en formatos de show y grabación.",
    timeline: [
      { year: 2020, title: "Ingreso a proyectos", description: "Inicia participación en múltiples formatos de ensamble." },
      { year: 2025, title: "Colaboraciones", description: "Sesiones con proyectos del catálogo." },
    ],
    instruments: [
      { name: "BAJO", level: 4 },
      { name: "CONTRABAJO", level: 3 },
    ],
    cvUrl: "https://example.com/cv/paula-mendez.pdf",
    availabilityStatus: "disponible",
    availability: [
      { date: "2026-04-10", status: "pendiente", bandSlug: "beloit", location: "CDMX", eventType: "CORPORATIVO", durationHours: 2 },
      { date: "2026-04-24", status: "disponible", bandSlug: "arturo-de-la-torre", location: "CDMX", eventType: "PRIVADO", durationHours: 2 },
    ],
  },
  {
    id: "a9",
    slug: "rodrigo-santos",
    name: "RODRIGO SANTOS",
    image: "https://images.unsplash.com/photo-1520975939367-0d4a07b4a773?w=800&h=800&fit=crop",
    bandSlugs: ["la-conzatti", "d-occidentals"],
    genre: "Jazz / Blues",
    styles: genreToStyles("Jazz / Blues"),
    debutYear: 2014,
    active: false,
    bio: "Trayectoria enfocada en jazz y blues. Actualmente inactivo para bookings.",
    timeline: [
      { year: 2014, title: "Inicio de trayectoria", description: "Participación en ensambles de jazz/blues." },
      { year: 2022, title: "Pausa de proyectos", description: "Cambio de disponibilidad a inactivo." },
    ],
    instruments: [
      { name: "GUITARRA", level: 4 },
      { name: "ARMÓNICA", level: 3 },
    ],
    cvUrl: "https://example.com/cv/rodrigo-santos.pdf",
    availabilityStatus: "reservado",
    availability: [
      { date: "2026-04-08", status: "reservado", bandSlug: "la-conzatti", location: "CDMX", eventType: "PRIVADO", durationHours: 2 },
    ],
  },
  {
    id: "a10",
    slug: "valeria-nunez",
    name: "VALERIA NÚÑEZ",
    image: "https://images.unsplash.com/photo-1520975951064-5f2e4b232625?w=800&h=800&fit=crop",
    bandSlugs: ["ana-de-armas", "arturo-de-la-torre-jazz-orchestra"],
    genre: "Vocal Jazz / Pop",
    styles: genreToStyles("Vocal Jazz / Pop"),
    debutYear: 2021,
    active: true,
    bio: "Artista vocal con repertorio orientado a jazz vocal y pop. Participa en formatos de ensamble y orquesta.",
    timeline: [
      { year: 2021, title: "Debut en escenario", description: "Inicio de presentaciones en vivo." },
      { year: 2024, title: "Producciones especiales", description: "Participación en eventos de gala." },
    ],
    instruments: [
      { name: "VOZ", level: 5 },
      { name: "COROS", level: 4 },
    ],
    cvUrl: "https://example.com/cv/valeria-nunez.pdf",
    availabilityStatus: "disponible",
    availability: [
      { date: "2026-04-14", status: "pendiente", bandSlug: "ana-de-armas", location: "CDMX", eventType: "BODA", durationHours: 2 },
      { date: "2026-04-25", status: "disponible", bandSlug: "arturo-de-la-torre-jazz-orchestra", location: "GDL", eventType: "GALA", durationHours: 2 },
    ],
  },
  {
    id: "a11",
    slug: "luis-hernandez",
    name: "LUIS HERNÁNDEZ",
    image: "https://images.unsplash.com/photo-1520975928223-6ea9c60f7ce4?w=800&h=800&fit=crop",
    bandSlugs: ["beloit"],
    genre: "Jazz Fusión",
    styles: genreToStyles("Jazz Fusión"),
    debutYear: 2018,
    active: true,
    bio: "Músico de apoyo en formato de jazz fusión.",
    timeline: [
      { year: 2018, title: "Inicio con ensamble", description: "Participación en formato de jazz fusión." },
    ],
    instruments: [{ name: "BATERÍA", level: 4 }],
    cvUrl: "https://example.com/cv/luis-hernandez.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-04-20", status: "disponible", bandSlug: "beloit", location: "CDMX", eventType: "CORPORATIVO", durationHours: 2 }],
  },
  {
    id: "a12",
    slug: "fernanda-cruz",
    name: "FERNANDA CRUZ",
    image: "https://images.unsplash.com/photo-1520975923204-1c11d8e5d8b8?w=800&h=800&fit=crop",
    bandSlugs: ["d-occidentals"],
    genre: "World Music / Jazz",
    styles: genreToStyles("World Music / Jazz"),
    debutYear: 2013,
    active: true,
    bio: "Música de ensamble en proyectos de world music.",
    timeline: [{ year: 2013, title: "Inicio", description: "Inicio en proyectos de world music." }],
    instruments: [{ name: "FLAUTA", level: 4 }],
    cvUrl: "https://example.com/cv/fernanda-cruz.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-04-22", status: "disponible", bandSlug: "d-occidentals", location: "CDMX", eventType: "FESTIVAL", durationHours: 3 }],
  },
  {
    id: "a13",
    slug: "javier-romo",
    name: "JAVIER ROMO",
    image: "https://images.unsplash.com/photo-1520975923387-7a5dc3e06cdd?w=800&h=800&fit=crop",
    bandSlugs: ["la-conzatti"],
    genre: "Jazz / Blues",
    styles: genreToStyles("Jazz / Blues"),
    debutYear: 2011,
    active: true,
    bio: "Músico de ensamble enfocado en jazz/blues.",
    timeline: [{ year: 2011, title: "Inicio", description: "Inicio en proyectos de jazz y blues." }],
    instruments: [{ name: "CONTRABAJO", level: 4 }],
    cvUrl: "https://example.com/cv/javier-romo.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-04-13", status: "pendiente", bandSlug: "la-conzatti", location: "CDMX", eventType: "PRIVADO", durationHours: 2 }],
  },
  {
    id: "a14",
    slug: "gabriela-perez",
    name: "GABRIELA PÉREZ",
    image: "https://images.unsplash.com/photo-1520975924650-3bfb7f1cd6e9?w=800&h=800&fit=crop",
    bandSlugs: ["ponzona-de-agave"],
    genre: "Fusión Regional",
    styles: genreToStyles("Fusión Regional"),
    debutYear: 2016,
    active: true,
    bio: "Participación en formato regional moderno.",
    timeline: [{ year: 2016, title: "Inicio", description: "Inicio en proyectos regionales." }],
    instruments: [{ name: "BAJO", level: 4 }],
    cvUrl: "https://example.com/cv/gabriela-perez.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-04-16", status: "disponible", bandSlug: "ponzona-de-agave", location: "GDL", eventType: "CORPORATIVO", durationHours: 2 }],
  },
  {
    id: "a15",
    slug: "ivan-carrillo",
    name: "IVÁN CARRILLO",
    image: "https://images.unsplash.com/photo-1520975928849-5a6c7f1a7a19?w=800&h=800&fit=crop",
    bandSlugs: ["arturo-de-la-torre"],
    genre: "Jazz / Funk / Latin",
    styles: genreToStyles("Jazz / Funk / Latin"),
    debutYear: 2009,
    active: true,
    bio: "Músico de apoyo para formatos de jazz contemporáneo.",
    timeline: [{ year: 2009, title: "Inicio", description: "Inicio como músico de apoyo y sesión." }],
    instruments: [{ name: "BATERÍA", level: 4 }],
    cvUrl: "https://example.com/cv/ivan-carrillo.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-04-19", status: "disponible", bandSlug: "arturo-de-la-torre", location: "CDMX", eventType: "PRIVADO", durationHours: 2 }],
  },
  {
    id: "a16",
    slug: "daniela-ortiz",
    name: "DANIELA ORTIZ",
    image: "https://images.unsplash.com/photo-1520975931338-2df99ad8bcb9?w=800&h=800&fit=crop",
    bandSlugs: ["arturo-de-la-torre-jazz-orchestra"],
    genre: "Big Band / Jazz",
    styles: genreToStyles("Big Band / Jazz"),
    debutYear: 2010,
    active: true,
    bio: "Participación en secciones de big band.",
    timeline: [{ year: 2010, title: "Inicio", description: "Ingreso a ensambles orquestales." }],
    instruments: [{ name: "TROMBÓN", level: 4 }],
    cvUrl: "https://example.com/cv/daniela-ortiz.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-04-23", status: "pendiente", bandSlug: "arturo-de-la-torre-jazz-orchestra", location: "CDMX", eventType: "GALA", durationHours: 2 }],
  },
  {
    id: "a17",
    slug: "mateo-velasco",
    name: "MATEO VELASCO",
    image: "https://images.unsplash.com/photo-1520975932367-8553a9e4f386?w=800&h=800&fit=crop",
    bandSlugs: ["ana-de-armas"],
    genre: "Vocal Jazz / Pop",
    styles: genreToStyles("Vocal Jazz / Pop"),
    debutYear: 2022,
    active: true,
    bio: "Músico de apoyo para formatos vocales.",
    timeline: [{ year: 2022, title: "Inicio", description: "Inicio en formatos de show vocal." }],
    instruments: [{ name: "PIANO", level: 4 }],
    cvUrl: "https://example.com/cv/mateo-velasco.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-04-26", status: "disponible", bandSlug: "ana-de-armas", location: "CDMX", eventType: "PRIVADO", durationHours: 2 }],
  },
  {
    id: "a18",
    slug: "renata-solis",
    name: "RENATA SOLÍS",
    image: "https://images.unsplash.com/photo-1520975934767-5d6bba8f993d?w=800&h=800&fit=crop",
    bandSlugs: ["d-occidentals", "beloit"],
    genre: "World Music / Jazz",
    styles: genreToStyles("World Music / Jazz"),
    debutYear: 2019,
    active: true,
    bio: "Participación en formatos de world music y fusión.",
    timeline: [{ year: 2019, title: "Inicio", description: "Inicio en proyectos de world music." }],
    instruments: [{ name: "PERCUSIONES", level: 4 }],
    cvUrl: "https://example.com/cv/renata-solis.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-04-27", status: "disponible", bandSlug: "d-occidentals", location: "GDL", eventType: "FESTIVAL", durationHours: 3 }],
  },
  {
    id: "a19",
    slug: "sergio-morales",
    name: "SERGIO MORALES",
    image: "https://images.unsplash.com/photo-1520975936078-2bdb7d5a5c69?w=800&h=800&fit=crop",
    bandSlugs: ["la-conzatti", "arturo-de-la-torre"],
    genre: "Jazz / Blues",
    styles: genreToStyles("Jazz / Blues"),
    debutYear: 2012,
    active: false,
    bio: "Músico con trayectoria en jazz/blues. Actualmente inactivo.",
    timeline: [{ year: 2012, title: "Inicio", description: "Inicio en proyectos de ensamble." }],
    instruments: [{ name: "GUITARRA", level: 4 }],
    cvUrl: "https://example.com/cv/sergio-morales.pdf",
    availabilityStatus: "reservado",
    availability: [{ date: "2026-04-28", status: "reservado", bandSlug: "la-conzatti", location: "CDMX", eventType: "PRIVADO", durationHours: 2 }],
  },
  {
    id: "a20",
    slug: "alma-navarro",
    name: "ALMA NAVARRO",
    image: "https://images.unsplash.com/photo-1520975937893-2b3a9f2fd1aa?w=800&h=800&fit=crop",
    bandSlugs: ["ponzona-de-agave", "d-occidentals"],
    genre: "Fusión Regional",
    styles: genreToStyles("Fusión Regional"),
    debutYear: 2015,
    active: true,
    bio: "Música de ensamble con enfoque en fusión regional.",
    timeline: [{ year: 2015, title: "Inicio", description: "Inicio en proyectos de fusión." }],
    instruments: [{ name: "TECLADOS", level: 3 }],
    cvUrl: "https://example.com/cv/alma-navarro.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-04-29", status: "pendiente", bandSlug: "ponzona-de-agave", location: "GDL", eventType: "CORPORATIVO", durationHours: 2 }],
  },
  {
    id: "a21",
    slug: "tomas-ibarra",
    name: "TOMÁS IBARRA",
    image: "https://images.unsplash.com/photo-1520975940167-4075f3b9f0d0?w=800&h=800&fit=crop",
    bandSlugs: ["beloit"],
    genre: "Jazz Fusión",
    styles: genreToStyles("Jazz Fusión"),
    debutYear: 2023,
    active: true,
    bio: "Participación en formatos contemporáneos.",
    timeline: [{ year: 2023, title: "Inicio", description: "Ingreso a proyectos recientes." }],
    instruments: [{ name: "SINTETIZADOR", level: 3 }],
    cvUrl: "https://example.com/cv/tomas-ibarra.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-05-01", status: "disponible", bandSlug: "beloit", location: "CDMX", eventType: "PRIVADO", durationHours: 2 }],
  },
  {
    id: "a22",
    slug: "marina-quiroz",
    name: "MARINA QUIROZ",
    image: "https://images.unsplash.com/photo-1520975941670-3bd7d9a52d68?w=800&h=800&fit=crop",
    bandSlugs: ["arturo-de-la-torre-jazz-orchestra"],
    genre: "Big Band / Jazz",
    styles: genreToStyles("Big Band / Jazz"),
    debutYear: 2008,
    active: true,
    bio: "Experiencia en big band con repertorio clásico.",
    timeline: [{ year: 2008, title: "Inicio", description: "Inicio en formatos orquestales." }],
    instruments: [{ name: "SAXOFÓN", level: 4 }],
    cvUrl: "https://example.com/cv/marina-quiroz.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-05-03", status: "disponible", bandSlug: "arturo-de-la-torre-jazz-orchestra", location: "CDMX", eventType: "GALA", durationHours: 2 }],
  },
  {
    id: "a23",
    slug: "nicolas-lara",
    name: "NICOLÁS LARA",
    image: "https://images.unsplash.com/photo-1520975943451-6d0e2d0c3f1a?w=800&h=800&fit=crop",
    bandSlugs: ["la-conzatti"],
    genre: "Jazz / Blues",
    styles: genreToStyles("Jazz / Blues"),
    debutYear: 2017,
    active: true,
    bio: "Músico de ensamble en jazz/blues.",
    timeline: [{ year: 2017, title: "Inicio", description: "Inicio en proyectos club." }],
    instruments: [{ name: "BATERÍA", level: 4 }],
    cvUrl: "https://example.com/cv/nicolas-lara.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-05-04", status: "pendiente", bandSlug: "la-conzatti", location: "CDMX", eventType: "PRIVADO", durationHours: 2 }],
  },
  {
    id: "a24",
    slug: "paz-gutierrez",
    name: "PAZ GUTIÉRREZ",
    image: "https://images.unsplash.com/photo-1520975944984-1bb4da8f9d6c?w=800&h=800&fit=crop",
    bandSlugs: ["ana-de-armas", "arturo-de-la-torre"],
    genre: "Vocal Jazz / Pop",
    styles: genreToStyles("Vocal Jazz / Pop"),
    debutYear: 2020,
    active: true,
    bio: "Voz y apoyo de ensamble para formatos vocales y jazz contemporáneo.",
    timeline: [{ year: 2020, title: "Inicio", description: "Inicio en formatos vocales." }],
    instruments: [{ name: "VOZ", level: 4 }],
    cvUrl: "https://example.com/cv/paz-gutierrez.pdf",
    availabilityStatus: "disponible",
    availability: [{ date: "2026-05-05", status: "disponible", bandSlug: "ana-de-armas", location: "CDMX", eventType: "BODA", durationHours: 2 }],
  },
];

export const artistsDataExample = {
  artists: [
    {
      id: "a1",
      slug: "arturo-de-la-torre",
      name: "ARTURO DE LA TORRE",
      image: "https://...",
      bandSlugs: ["arturo-de-la-torre", "arturo-de-la-torre-jazz-orchestra"],
      genre: "Jazz / Funk / Latin",
      styles: ["JAZZ", "FUNK", "LATIN"],
      debutYear: 2004,
      active: true,
      bio: "Texto de bio / trayectoria…",
      timeline: [{ year: 2020, title: "Hito", description: "Descripción…" }],
      instruments: [{ name: "TROMPETA", level: 5 }],
      cvUrl: "https://.../cv.pdf",
      contact: { email: "brassarmada@gmail.com", phone: "3334669630", preferred: "whatsapp" },
      gallery: ["https://.../photo1.jpg", "https://.../photo2.jpg"],
      jams: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      availabilityStatus: "disponible",
      availability: [{ date: "2026-04-12", status: "disponible", bandSlug: "arturo-de-la-torre", location: "CDMX", eventType: "CORPORATIVO", durationHours: 2 }],
    },
  ],
  bands: bands.map((b) => ({ slug: b.slug, name: b.name })),
};
