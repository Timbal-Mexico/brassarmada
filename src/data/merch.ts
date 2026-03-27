export type MerchItem = {
  id: string;
  name: string;
  image: string;
  price: string;
  kind: "brassarmada" | "band";
  bandSlug?: string;
  url: string;
  shopifyUrl: string;
};

export const merch: MerchItem[] = [
  {
    id: "m1",
    name: "Playera BRASS ARMADA",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62da7f00?w=1200&fit=crop",
    price: "$450 MXN",
    url: "/tienda",
    kind: "brassarmada",
    shopifyUrl: "https://brassarmada.myshopify.com/products/playera-brass-armada",
  },
  {
    id: "m2",
    name: "Poster Edición Limitada",
    image: "https://images.unsplash.com/photo-1520975959924-7c2b7b29ea62?w=1200&fit=crop",
    price: "$350 MXN",
    url: "/tienda",
    kind: "brassarmada",
    shopifyUrl: "https://brassarmada.myshopify.com/products/poster-edicion-limitada",
  },
  {
    id: "m3",
    name: "Sudadera BRASS ARMADA",
    image: "https://images.unsplash.com/photo-1553096442-8debd725b8de?w=1200&fit=crop",
    price: "$790 MXN",
    url: "/tienda",
    kind: "brassarmada",
    shopifyUrl: "https://brassarmada.myshopify.com/products/sudadera-brass-armada",
  },
  {
    id: "m4",
    name: "Playera ARTURO DE LA TORRE",
    image: "https://images.unsplash.com/photo-1520975936078-2bdb7d5a5c69?w=1200&fit=crop",
    price: "$450 MXN",
    url: "/tienda",
    kind: "band",
    bandSlug: "arturo-de-la-torre",
    shopifyUrl: "https://brassarmada.myshopify.com/products/playera-arturo-de-la-torre",
  },
  {
    id: "m5",
    name: "Gorra LA CONZATTI",
    image: "https://images.unsplash.com/photo-1520975956755-b5f6a538d6a1?w=1200&fit=crop",
    price: "$420 MXN",
    url: "/tienda",
    kind: "band",
    bandSlug: "la-conzatti",
    shopifyUrl: "https://brassarmada.myshopify.com/products/gorra-la-conzatti",
  },
  {
    id: "m6",
    name: "Poster BELOIT",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&fit=crop",
    price: "$350 MXN",
    url: "/tienda",
    kind: "band",
    bandSlug: "beloit",
    shopifyUrl: "https://brassarmada.myshopify.com/products/poster-beloit",
  }
];
