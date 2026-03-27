import { useDeferredValue, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { merch, type MerchItem } from "@/data/merch";
import { bands } from "@/data/bands";

const normalize = (s: string) => s.trim().toLowerCase();

const getBandName = (slug: string) => bands.find((b) => b.slug === slug)?.name ?? slug;

const StorePage = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [kind, setKind] = useState<"all" | "brassarmada" | "band">("all");
  const [bandSlug, setBandSlug] = useState("");

  const bandOptions = useMemo(() => {
    const slugs = Array.from(new Set(merch.map((m) => m.bandSlug).filter(Boolean))) as string[];
    return slugs
      .map((slug) => ({ slug, name: getBandName(slug) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(deferredQuery);
    return merch.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (bandSlug && item.bandSlug !== bandSlug) return false;
      if (!q) return true;
      const idx = `${item.name} ${item.price} ${item.bandSlug ?? ""}`.toLowerCase();
      return idx.includes(q);
    });
  }, [bandSlug, deferredQuery, kind]);

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="border-b border-black bg-white px-4 py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-heading text-4xl font-black tracking-tighter text-black md:text-6xl">TIENDA</h1>
              <p className="mt-4 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
                Merch oficial de Brass Armada y de bandas · La compra se finaliza en Shopify
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-12">
            <div className="md:col-span-6">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar merch"
                placeholder="BUSCAR PRODUCTO O BANDA"
                className="h-12 w-full rounded-none border border-black bg-white px-4 font-body text-[10px] tracking-[0.2em] text-black placeholder:text-black/40 focus:outline-none"
              />
            </div>
            <div className="md:col-span-3">
              <select
                value={kind}
                onChange={(e) => {
                  const next = e.target.value as "all" | "brassarmada" | "band";
                  setKind(next);
                  if (next !== "band") setBandSlug("");
                }}
                aria-label="Tipo de merch"
                className="h-12 w-full border border-black bg-white px-4 font-body text-[10px] tracking-[0.2em] text-black uppercase"
              >
                <option value="all">TODO</option>
                <option value="brassarmada">BRASS ARMADA</option>
                <option value="band">BANDAS</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <select
                value={bandSlug}
                onChange={(e) => setBandSlug(e.target.value)}
                disabled={kind !== "band"}
                aria-label="Filtrar por banda"
                className="h-12 w-full border border-black bg-white px-4 font-body text-[10px] tracking-[0.2em] text-black uppercase disabled:opacity-40"
              >
                <option value="">TODAS LAS BANDAS</option>
                {bandOptions.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
            RESULTADOS: {filtered.length}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <MerchCard key={item.id} item={item} />
            ))}
          </div>

          {!filtered.length ? (
            <div className="mt-10 border border-black bg-white p-8 text-center font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">
              No hay productos para los filtros actuales
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const MerchCard = ({ item }: { item: MerchItem }) => {
  return (
    <a
      href={item.shopifyUrl}
      target="_blank"
      rel="noreferrer"
      className="group block border border-black bg-white"
      aria-label={`Abrir en Shopify: ${item.name}`}
    >
      <div className="aspect-square overflow-hidden bg-black">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="border-t border-black p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-heading text-sm font-black tracking-tight text-black">{item.name}</div>
            {item.kind === "band" && item.bandSlug ? (
              <div className="mt-2 font-body text-[9px] tracking-[0.2em] text-black uppercase opacity-60">
                {getBandName(item.bandSlug)}
              </div>
            ) : null}
          </div>
          <div className="shrink-0 border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase">
            {item.price}
          </div>
        </div>
        <div className="mt-6 font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase opacity-60">
          ABRIR EN SHOPIFY →
        </div>
      </div>
    </a>
  );
};

export default StorePage;

