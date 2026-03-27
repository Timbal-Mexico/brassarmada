export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  dateISO: string;
  author: string;
  tags: string[];
  image?: string;
};

const STORAGE_KEY = "brassarmada_news_overrides_v1";

const readOverrides = (): Record<string, Partial<NewsPost>> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Partial<NewsPost>>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeOverrides = (value: Record<string, Partial<NewsPost>>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

export const saveNewsOverride = (slug: string, patch: Partial<NewsPost>) => {
  const o = readOverrides();
  o[slug] = patch;
  writeOverrides(o);
};

export const posts: NewsPost[] = [
  {
    id: "n1",
    slug: "presentacion-arturo-de-la-torre",
    title: "Presentación de Arturo de la Torre en Conjunto Santander",
    excerpt: "Anunciamos una fecha especial con repertorio original y arreglos inéditos.",
    content:
      "El ensamble liderado por Arturo de la Torre se presentará en el Conjunto Santander con un set de piezas originales y arreglos inéditos. La experiencia estará orientada a un público amante del jazz contemporáneo, con fusiones latinas y energía en escena.",
    dateISO: "2026-04-05",
    author: "Brass Armada",
    tags: ["EVENTO", "ARTURO", "JAZZ"],
    image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=1200&fit=crop",
  },
  {
    id: "n2",
    slug: "residencia-la-conzatti",
    title: "Residencia de La Conzatti en club de jazz",
    excerpt: "La Conzatti confirma una nueva residencia semanal con invitados especiales.",
    content:
      "La Conzatti confirma residencia con repertorio que abarca estándares del blues y jazz clásico, más colaboraciones con artistas invitados. La programación incluirá sesiones instrumentales y vocales.",
    dateISO: "2026-04-02",
    author: "Brass Armada",
    tags: ["RESIDENCIA", "LA CONZATTI", "BLUES"],
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&fit=crop",
  },
  {
    id: "n3",
    slug: "lanzamiento-merch",
    title: "Nuevo merch oficial Brass Armada",
    excerpt: "Playeras y posters edición limitada ya disponibles.",
    content:
      "Anunciamos una nueva línea de merchandising oficial con playeras, sudaderas y posters en edición limitada. Disponibles en la tienda de Brass Armada.",
    dateISO: "2026-03-28",
    author: "Brass Armada",
    tags: ["MERCH", "OFICIAL"],
    image: "https://images.unsplash.com/photo-1517673132405-a56a62da7f00?w=1200&fit=crop",
  },
];

export const getNews = (): NewsPost[] => {
  const overrides = readOverrides();
  return posts
    .map((p) => ({ ...p, ...(overrides[p.slug] ?? {}) }))
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO));
};

export const getNewsBySlug = (slug: string): NewsPost | undefined => {
  const overrides = readOverrides();
  const base = posts.find((p) => p.slug === slug);
  if (!base) return undefined;
  return { ...base, ...(overrides[slug] ?? {}) };
};

