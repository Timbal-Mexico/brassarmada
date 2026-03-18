export interface Band {
  id: string;
  slug: string;
  name: string;
  genre: string;
  tagline: string;
  description: string;
  image: string;
  members: number;
  phone: string;
  spotifyEmbed: string;
  youtubeEmbed: string;
  riderPdf: string;
  packages: {
    name: string;
    price: string;
    features: string[];
  }[];
  setlist: string[];
  testimonials: {
    quote: string;
    author: string;
    venue: string;
  }[];
  lineup?: string[];
}

export const bands: Band[] = [
  {
    id: "1",
    slug: "arturo-de-la-torre",
    name: "ARTURO DE LA TORRE",
    genre: "Jazz / Funk / Latin",
    tagline: "Jazz contemporáneo, funk, ritmos latinos y alternativas electrónicas",
    description: "Músico y productor con sobresaliente trayectoria a la escena del jazz en México. Más de 20 años de trayectoria lo consolidan como trompetista, compositor y director musical. Frontman con estilo propio, energía que se mezcla con el jazz contemporáneo, funk, ritmos latinos y alternativas electrónicas.",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=400&fit=crop",
    members: 1,
    phone: "3334444634",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Show Estelar", price: "A cotizar", features: ["Show completo", "Músicos de primer nivel", "Repertorio original y covers"] },
    ],
    setlist: ["Repertorio Original", "Jazz Standards", "Funk Fusion"],
    testimonials: [
      { quote: "Un espectáculo de clase mundial.", author: "Festival de Jazz", venue: "Riviera Maya" },
    ],
    lineup: ["Arturo de la Torre (Trompeta / Dirección)"]
  },
  {
    id: "2",
    slug: "arturo-de-la-torre-jazz-orchestra",
    name: "ARTURO DE LA TORRE JAZZ ORCHESTRA",
    genre: "Big Band / Jazz",
    tagline: "La majestuosidad del jazz orquestal",
    description: "Orquesta de jazz liderada por Arturo de la Torre, presentando arreglos sofisticados y una experiencia sonora envolvente ideal para grandes escenarios y eventos de gala.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop",
    members: 12,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [
      { name: "Orquesta Completa", price: "A cotizar", features: ["12+ músicos", "Director musical", "Repertorio Big Band"] },
    ],
    setlist: ["In The Mood", "Sing Sing Sing", "New York, New York"],
    testimonials: [],
    lineup: ["Arturo de la Torre (Director)", "Sección de Metales", "Sección de Maderas", "Sección Rítmica"]
  },
  {
    id: "3",
    slug: "beloit",
    name: "BELOIT",
    genre: "Jazz Fusión",
    tagline: "Innovación sonora y creatividad",
    description: "Propuesta musical fresca y audaz que combina elementos del jazz con ritmos contemporáneos, creando una atmósfera única y sofisticada.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=400&fit=crop",
    members: 4,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [],
    setlist: [],
    testimonials: [],
    lineup: ["Integrante 1", "Integrante 2", "Integrante 3", "Integrante 4"]
  },
  {
    id: "4",
    slug: "d-occidentals",
    name: "D' OCCIDENTALS",
    genre: "World Music / Jazz",
    tagline: "Un viaje musical sin fronteras",
    description: "Ensamble que explora la riqueza de la música occidental con una perspectiva jazzística, fusionando tradiciones y vanguardia.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    members: 5,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [],
    setlist: [],
    testimonials: [],
    lineup: ["Integrante 1", "Integrante 2", "Integrante 3", "Integrante 4", "Integrante 5"]
  },
  {
    id: "5",
    slug: "ponzona-de-agave",
    name: "PONZOÑA DE AGAVE",
    genre: "Fusión Regional",
    tagline: "Raíces mexicanas con espíritu rebelde",
    description: "Una propuesta que reinterpreta la música tradicional con una energía contagiosa y arreglos modernos.",
    image: "https://images.unsplash.com/photo-1504704911898-68304a7d2571?w=600&h=400&fit=crop",
    members: 6,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [],
    setlist: [],
    testimonials: [],
    lineup: ["Integrante 1", "Integrante 2", "Integrante 3", "Integrante 4", "Integrante 5", "Integrante 6"]
  },
  {
    id: "6",
    slug: "ana-de-armas",
    name: "ANA DE ARMAS",
    genre: "Vocal Jazz / Pop",
    tagline: "Elegancia y sentimiento en cada interpretación",
    description: "Voz privilegiada que transita con naturalidad entre el jazz, el pop y la balada, ideal para crear ambientes íntimos y emotivos.",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=400&fit=crop",
    members: 3,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [],
    setlist: [],
    testimonials: [],
    lineup: ["Ana de Armas (Voz)", "Piano", "Contrabajo"]
  },
  {
    id: "7",
    slug: "la-conzatti",
    name: "LA CONZATTI",
    genre: "Jazz / Blues",
    tagline: "El alma del blues y la sofisticación del jazz",
    description: "Banda que captura la esencia de los clubes de jazz clásicos con un repertorio que va desde los estándares hasta composiciones originales.",
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=400&fit=crop",
    members: 4,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [],
    setlist: [],
    testimonials: [],
    lineup: ["Integrante 1", "Integrante 2", "Integrante 3", "Integrante 4"]
  },
];

export const venues = [
  "Palacio de Bellas Artes",
  "Auditorio Nacional",
  "Teatro Degollado",
  "Conjunto Santander",
  "Hotel Xcaret Arte",
  "Four Seasons CDMX",
  "St. Regis Punta Mita",
  "Rosewood San Miguel",
  "Museo Soumaya",
  "Colegio de las Vizcaínas",
];

export const getBandBySlug = (slug: string): Band | undefined => {
  return bands.find((band) => band.slug === slug);
};
