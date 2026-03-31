export interface Band {
  id: string;
  slug: string;
  name: string;
  genre: string;
  tagline: string;
  description: string;
  image: string;
  gallery?: string[];
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
  venuesGallery?: {
    name: string;
    image: string;
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
    image: "../images/bands/arturo-de-la-torre.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1464375117522-1311dd6d4110?w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=2000&auto=format&fit=crop",
    ],
    members: 1,
    phone: "3334444634",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Show Estelar", price: "A cotizar", features: ["Show completo", "Músicos de primer nivel", "Repertorio original y covers"] },
    ],
    venuesGallery: [
      {
        name: "PALACIO DE BELLAS ARTES",
        image: "https://images.unsplash.com/photo-1541976590-713941681591?w=2000&auto=format&fit=crop",
      },
      {
        name: "AUDITORIO NACIONAL",
        image: "https://images.unsplash.com/photo-1521334726092-b509a19597c1?w=2000&auto=format&fit=crop",
      },
      {
        name: "TEATRO DEGOLLADO",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=2000&auto=format&fit=crop",
      },
      {
        name: "MUSEO SOUMAYA",
        image: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=2000&auto=format&fit=crop",
      },
      {
        name: "ST. REGIS PUNTA MITA",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=2000&auto=format&fit=crop",
      },
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
    image: "../images/bands/arturo-de-la-torre-jazz-orchestra.png",
    gallery: [
      "https://images.unsplash.com/photo-1484766280341-87861644c80d?w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=2000&auto=format&fit=crop",
    ],
    members: 12,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [
      { name: "Orquesta Completa", price: "A cotizar", features: ["12+ músicos", "Director musical", "Repertorio Big Band"] },
    ],
    venuesGallery: [
      {
        name: "CONJUNTO SANTANDER",
        image: "https://images.unsplash.com/photo-1514525253344-7624feaf685a?w=2000&auto=format&fit=crop",
      },
      {
        name: "FOUR SEASONS CDMX",
        image: "https://images.unsplash.com/photo-1551887373-6b0ed3ce19b2?w=2000&auto=format&fit=crop",
      },
      {
        name: "ROSEWOOD SAN MIGUEL",
        image: "https://images.unsplash.com/photo-1501117716987-c8e2a7b6b4a2?w=2000&auto=format&fit=crop",
      },
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
    image: "../images/bands/beloit.png",
    gallery: [
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=2000&auto=format&fit=crop",
    ],
    members: 4,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [],
    venuesGallery: [
      {
        name: "HOTEL XCARET ARTE",
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=2000&auto=format&fit=crop",
      },
      {
        name: "COLEGIO DE LAS VIZCAÍNAS",
        image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=2000&auto=format&fit=crop",
      },
    ],
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
    gallery: [
      "https://images.unsplash.com/photo-1501612780327-45045538702b?w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1454922915609-78549ad709bb?w=2000&auto=format&fit=crop",
    ],
    members: 5,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [],
    venuesGallery: [
      {
        name: "AUDITORIO NACIONAL",
        image: "https://images.unsplash.com/photo-1521334726092-b509a19597c1?w=2000&auto=format&fit=crop",
      },
    ],
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
    image: "../images/bands/ponzona-de-agave.png",
    gallery: [
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=2000&auto=format&fit=crop",
    ],
    members: 6,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [],
    venuesGallery: [
      {
        name: "TEATRO DEGOLLADO",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=2000&auto=format&fit=crop",
      },
    ],
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
    image: "../images/bands/ana-de-armas.png",
    gallery: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521337706264-a414f153a5f5?w=2000&auto=format&fit=crop",
    ],
    members: 3,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [],
    venuesGallery: [
      {
        name: "FOUR SEASONS CDMX",
        image: "https://images.unsplash.com/photo-1551887373-6b0ed3ce19b2?w=2000&auto=format&fit=crop",
      },
    ],
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
    image: "../images/bands/la-conzatti.png",
    gallery: [
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=2000&auto=format&fit=crop",
    ],
    members: 4,
    phone: "3334444634",
    spotifyEmbed: "",
    youtubeEmbed: "",
    riderPdf: "#",
    packages: [],
    venuesGallery: [
      {
        name: "COLEGIO DE LAS VIZCAÍNAS",
        image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=2000&auto=format&fit=crop",
      },
    ],
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
