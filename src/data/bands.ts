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
}

export const bands: Band[] = [
  {
    id: "1",
    slug: "los-dorados",
    name: "Los Dorados",
    genre: "Rock en Español",
    tagline: "Rock con energía que transforma cualquier evento en una fiesta inolvidable",
    description: "Banda de rock en español con más de 10 años de experiencia en eventos corporativos y privados.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    members: 5,
    phone: "5551234567",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Básico", price: "$25,000", features: ["2 horas de show", "5 músicos", "Sonido básico", "Setlist estándar", "1 encore"] },
      { name: "Premium", price: "$45,000", features: ["3 horas de show", "5 músicos + DJ", "Sonido profesional completo", "Iluminación LED", "Setlist personalizado", "2 encores", "Meet & greet"] },
    ],
    setlist: ["Maná - Rayando el Sol", "Caifanes - La Negra Tomasa", "Café Tacvba - Eres", "Molotov - Gimme tha Power", "Los Fabulosos Cadillacs - Matador", "Soda Stereo - De Música Ligera", "El Tri - Triste Canción", "Héroes del Silencio - Entre Dos Tierras", "Zoé - Soñé", "Julieta Venegas - Me Voy", "Maldita Vecindad - Pachuco"],
    testimonials: [
      { quote: "Los Dorados hicieron de nuestra gala anual un evento épico. El público no paró de bailar.", author: "María González", venue: "Hotel W México" },
      { quote: "Profesionalismo total. Llegaron a tiempo, sonido impecable, y la energía fue increíble.", author: "Carlos Ruiz", venue: "Centro Citibanamex" },
    ],
  },
  {
    id: "2",
    slug: "velvet-jazz",
    name: "Velvet Jazz",
    genre: "Jazz & Bossa Nova",
    tagline: "Elegancia sonora para eventos que exigen sofisticación",
    description: "Cuarteto de jazz con repertorio internacional. Ideal para cenas de gala y cocteles.",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=400&fit=crop",
    members: 4,
    phone: "5559876543",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Básico", price: "$18,000", features: ["2 horas", "4 músicos", "Jazz standards", "Sonido acústico"] },
      { name: "Premium", price: "$35,000", features: ["3.5 horas", "4 músicos + cantante", "Repertorio personalizado", "Sonido profesional", "Iluminación ambiental", "Cocktail set + dinner set"] },
    ],
    setlist: ["Fly Me to the Moon", "Girl From Ipanema", "Take Five", "So What", "Autumn Leaves", "Blue Bossa", "All of Me", "Summertime", "My Funny Valentine", "Cheek to Cheek", "Desafinado", "Wave"],
    testimonials: [
      { quote: "El ambiente que crearon fue perfecto para nuestra cena de fin de año corporativa.", author: "Ana Martínez", venue: "Four Seasons CDMX" },
      { quote: "Clase y elegancia pura. Nuestros invitados quedaron encantados.", author: "Roberto Sánchez", venue: "Museo Soumaya" },
    ],
  },
  {
    id: "3",
    slug: "cumbia-power",
    name: "Cumbia Power",
    genre: "Cumbia & Tropical",
    tagline: "La fiesta tropical que necesita tu evento para ser legendario",
    description: "8 músicos con la mejor cumbia y tropical para poner a bailar a todos.",
    image: "https://images.unsplash.com/photo-1504704911898-68304a7d2571?w=600&h=400&fit=crop",
    members: 8,
    phone: "5552345678",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Básico", price: "$30,000", features: ["2 horas", "8 músicos", "Sonido incluido", "Repertorio clásico tropical"] },
      { name: "Premium", price: "$55,000", features: ["4 horas", "8 músicos + bailarinas", "Sonido + iluminación completa", "Show temático personalizable", "MC incluido"] },
    ],
    setlist: ["La Bilirrubina", "Quimbara", "Cali Pachanguero", "La Pollera Colorá", "Oye Como Va", "Pedro Navaja", "El Cantante", "Despacito (Cumbia version)", "Vivir Mi Vida", "La Gota Fría", "Suavemente"],
    testimonials: [
      { quote: "Pusieron a bailar a 500 personas sin parar. ¡Increíble energía!", author: "Luis Hernández", venue: "Expo Guadalajara" },
      { quote: "La mejor inversión para nuestra fiesta de fin de año.", author: "Patricia López", venue: "Hacienda de los Morales" },
    ],
  },
  {
    id: "4",
    slug: "acoustic-soul",
    name: "Acoustic Soul",
    genre: "Acústico & Soul",
    tagline: "Melodías íntimas que conectan con el corazón de tu audiencia",
    description: "Dúo acústico versátil para ceremonias, cócteles y eventos íntimos.",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=400&fit=crop",
    members: 3,
    phone: "5553456789",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Básico", price: "$12,000", features: ["1.5 horas", "2 músicos", "Guitarra + voz", "Repertorio clásico"] },
      { name: "Premium", price: "$22,000", features: ["3 horas", "3 músicos", "Guitarra + voz + cajón", "Repertorio a la carta", "Ceremonia + cóctel", "Canción dedicada"] },
    ],
    setlist: ["Thinking Out Loud", "Perfect", "All of Me", "Bésame Mucho", "La Vie en Rose", "Wonderful Tonight", "Can't Help Falling in Love", "Stand By Me", "At Last", "A Thousand Years", "Hallelujah"],
    testimonials: [
      { quote: "La ceremonia fue mágica gracias a ellos. Todos lloraron de emoción.", author: "Fernanda Torres", venue: "Jardín Etnobotánico Oaxaca" },
      { quote: "Perfectos para nuestro cóctel de bienvenida VIP.", author: "Diego Ramírez", venue: "Rosewood San Miguel" },
    ],
  },
  {
    id: "5",
    slug: "electro-beats",
    name: "Electro Beats",
    genre: "DJ & Electrónica",
    tagline: "Sets electrónicos que elevan la experiencia de cualquier evento premium",
    description: "DJ profesional con producción visual para after-parties y eventos de alto impacto.",
    image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&h=400&fit=crop",
    members: 2,
    phone: "5554567890",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Básico", price: "$15,000", features: ["3 horas DJ set", "Equipo de sonido pro", "Playlist personalizada"] },
      { name: "Premium", price: "$35,000", features: ["5 horas DJ set", "Producción visual LED", "Máquina de humo + CO2", "Iluminación robótica", "MC + hype man"] },
    ],
    setlist: ["Set personalizado según evento", "House / Deep House", "Tech House", "Reggaetón remix", "Pop internacional remix", "Latin house", "Progressive sets", "Ambient/chill (cóctel)", "High energy (fiesta)", "Classic remixes"],
    testimonials: [
      { quote: "El after-party fue trending en redes. La producción visual fue otro nivel.", author: "Alejandro Vega", venue: "Club Tengo Hambre" },
      { quote: "Transformaron nuestro salón en un club de clase mundial.", author: "Isabella Moreno", venue: "Sofitel Reforma" },
    ],
  },
  {
    id: "6",
    slug: "mariachi-imperial",
    name: "Mariachi Imperial",
    genre: "Mariachi & Ranchero",
    tagline: "La tradición mexicana con el nivel de excelencia que tu evento merece",
    description: "Mariachi de 12 elementos con vestuario de gala. Tradición y elegancia.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop",
    members: 12,
    phone: "5555678901",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Básico", price: "$20,000", features: ["1.5 horas", "8 músicos", "Vestuario tradicional", "Repertorio clásico"] },
      { name: "Premium", price: "$40,000", features: ["3 horas", "12 músicos", "Vestuario de gala", "Repertorio personalizado", "Serenata privada", "Recibimiento de invitados"] },
    ],
    setlist: ["Cielito Lindo", "México Lindo y Querido", "El Rey", "Volver Volver", "Si Nos Dejan", "Amor Eterno", "Las Mañanitas", "El Son de la Negra", "Guadalajara", "Cucurrucucú Paloma", "La Bikina", "Huapango de Moncayo"],
    testimonials: [
      { quote: "Nuestros clientes internacionales quedaron fascinados. ¡Pura magia mexicana!", author: "Jorge Campos", venue: "Palacio de Bellas Artes" },
      { quote: "El serenata fue el momento más emotivo de toda la boda.", author: "Sofía Delgado", venue: "Hacienda Cocoyoc" },
    ],
  },
  {
    id: "7",
    slug: "funk-machine",
    name: "Funk Machine",
    genre: "Funk & Disco",
    tagline: "Grooves irresistibles que garantizan pista llena toda la noche",
    description: "7 músicos con repertorio funk, disco y pop bailable. Energía al máximo.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=400&fit=crop",
    members: 7,
    phone: "5556789012",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Básico", price: "$28,000", features: ["2 horas", "7 músicos", "Sonido incluido", "Repertorio funk/disco clásico"] },
      { name: "Premium", price: "$50,000", features: ["3.5 horas", "7 músicos + 2 coristas", "Sonido + iluminación disco", "Vestuario temático", "Coreografías", "2 cambios de vestuario"] },
    ],
    setlist: ["Superstition", "Get Lucky", "Uptown Funk", "September", "Le Freak", "Stayin' Alive", "I Feel Good", "Play That Funky Music", "Billie Jean", "Don't Stop 'Til You Get Enough", "Boogie Wonderland"],
    testimonials: [
      { quote: "Desde la primera canción la pista se llenó y no paró hasta el final.", author: "Carmen Reyes", venue: "Centro Banamex" },
      { quote: "El show más divertido que hemos tenido en nuestra convención anual.", author: "Pedro Infante Jr.", venue: "Marriott Reforma" },
    ],
  },
  {
    id: "8",
    slug: "latin-groove",
    name: "Latin Groove",
    genre: "Salsa & Latin Pop",
    tagline: "El sabor latino que hace vibrar cada rincón de tu evento",
    description: "Orquesta de salsa y latin pop con 10 músicos. Shows de alto impacto.",
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=400&fit=crop",
    members: 10,
    phone: "5557890123",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Básico", price: "$35,000", features: ["2 horas", "10 músicos", "Sonido profesional", "Repertorio salsa clásica"] },
      { name: "Premium", price: "$60,000", features: ["4 horas", "10 músicos + bailarines", "Producción completa", "Show de salsa + latin pop", "Clase de baile para invitados", "MC bilingüe"] },
    ],
    setlist: ["Vivir Mi Vida", "Quimbara", "La Vida Es Un Carnaval", "Suavemente", "Despacito", "Bailando", "Danza Kuduro", "Waka Waka", "Conga", "1, 2, 3 María", "Livin' La Vida Loca", "Shakira Medley"],
    testimonials: [
      { quote: "La clase de salsa fue el hit de la noche. ¡Todos participaron!", author: "Valentina Ochoa", venue: "Hilton Santa Fe" },
      { quote: "Producción de primer nivel. Parecía un concierto, no una fiesta corporativa.", author: "Marcos Silva", venue: "Pepsi Center WTC" },
    ],
  },
  {
    id: "9",
    slug: "string-quartet",
    name: "String Quartet CDMX",
    genre: "Música Clásica & Crossover",
    tagline: "Elegancia atemporal con arreglos modernos para eventos exclusivos",
    description: "Cuarteto de cuerdas con repertorio clásico y versiones pop/rock.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&h=400&fit=crop",
    members: 4,
    phone: "5558901234",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Básico", price: "$15,000", features: ["1.5 horas", "4 músicos", "Repertorio clásico", "Setup elegante"] },
      { name: "Premium", price: "$28,000", features: ["3 horas", "4 músicos", "Clásico + crossover pop/rock", "Iluminación ambiental", "Ceremonia + cóctel + cena", "Arreglos personalizados"] },
    ],
    setlist: ["Canon in D - Pachelbel", "The Four Seasons - Vivaldi", "Claro de Luna - Debussy", "Viva La Vida - Coldplay", "A Thousand Years - Christina Perri", "Perfect - Ed Sheeran", "Bohemian Rhapsody - Queen", "Game of Thrones Theme", "Cinema Paradiso", "Shape of You - Ed Sheeran", "Yesterday - Beatles"],
    testimonials: [
      { quote: "El crossover de clásico con pop moderno fue genial. Todos quedaron impresionados.", author: "Claudia Herrera", venue: "Castillo de Chapultepec" },
      { quote: "Perfecto para nuestra ceremonia y cóctel. Muy profesionales.", author: "Enrique Bátiz", venue: "Palacio de Minería" },
    ],
  },
  {
    id: "10",
    slug: "reggaeton-kings",
    name: "Reggaetón Kings",
    genre: "Reggaetón & Urbano",
    tagline: "El perreo más exclusivo con producción de concierto para tu evento",
    description: "Show urbano completo con DJ, MC, bailarines y producción de nivel concierto.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop",
    members: 6,
    phone: "5559012345",
    spotifyEmbed: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    riderPdf: "#",
    packages: [
      { name: "Básico", price: "$22,000", features: ["2 horas", "DJ + MC + 2 bailarines", "Sonido profesional", "Hits del momento"] },
      { name: "Premium", price: "$48,000", features: ["4 horas", "DJ + MC + 4 bailarines", "Producción LED completa", "CO2 + confeti", "Neon party setup", "Photobooth incluido"] },
    ],
    setlist: ["Bad Bunny Medley", "Daddy Yankee Medley", "Tití Me Preguntó", "Gasolina", "Dákiti", "Despacito", "Con Calma", "Mi Gente", "X (Equis)", "Baila Conmigo", "La Canción", "Pepas"],
    testimonials: [
      { quote: "La producción fue nivel festival. Los chavos no pararon de bailar.", author: "Daniela Montero", venue: "Arena CDMX" },
      { quote: "El mejor after-party que hemos organizado. ¡Quieren repetir!", author: "Andrés Solís", venue: "Foro Masaryk" },
    ],
  },
];

export const venues = [
  "Hotel W México",
  "Four Seasons CDMX",
  "Centro Citibanamex",
  "Sofitel Reforma",
  "Hilton Santa Fe",
];

export function getBandBySlug(slug: string): Band | undefined {
  return bands.find((b) => b.slug === slug);
}
