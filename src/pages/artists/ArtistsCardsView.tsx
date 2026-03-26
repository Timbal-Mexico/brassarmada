import { Link } from "react-router-dom";
import { getBandNameBySlug, type Artist } from "@/data/artists";

type Props = {
  items: Artist[];
};

const ArtistsCardsView = ({ items }: Props) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((artist) => (
        <Link
          key={artist.id}
          to={`/artistas/${artist.slug}`}
          className="group block border border-black bg-white"
        >
          <div className="aspect-square overflow-hidden bg-black">
            <img
              src={artist.image}
              alt={artist.name}
              loading="lazy"
              className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="border-t border-black p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-heading text-lg font-black tracking-tight text-black">{artist.name}</h3>
              <span className="shrink-0 border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase">
                {artist.active ? "ACTIVO" : "INACTIVO"}
              </span>
            </div>
            <div className="mt-2 font-body text-[10px] font-light tracking-[0.2em] text-black uppercase opacity-70">
              {artist.genre}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {artist.bandSlugs.map((slug) => (
                <span
                  key={slug}
                  className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase"
                >
                  {getBandNameBySlug(slug)}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ArtistsCardsView;
