import { Link } from "react-router-dom";
import { getBandNameBySlug, type Artist } from "@/data/artists";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type SortKey = "name" | "bands" | "genre" | "debutYear" | "active";
export type SortDir = "asc" | "desc";

type Props = {
  items: Artist[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSortChange: (nextKey: SortKey) => void;
};

const SortHeader = ({
  label,
  columnKey,
  sortKey,
  sortDir,
  onSortChange,
}: {
  label: string;
  columnKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSortChange: (nextKey: SortKey) => void;
}) => {
  const isActive = sortKey === columnKey;
  const indicator = isActive ? (sortDir === "asc" ? "↑" : "↓") : "";

  return (
    <button
      type="button"
      onClick={() => onSortChange(columnKey)}
      className="flex items-center gap-2 font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase hover:opacity-60"
    >
      <span>{label}</span>
      <span className="font-body text-[10px] font-black opacity-60">{indicator}</span>
    </button>
  );
};

const ArtistsTableView = ({ items, sortKey, sortDir, onSortChange }: Props) => {
  return (
    <div className="border border-black">
      <Table className="bg-white">
        <TableHeader>
          <TableRow className="border-black hover:bg-white">
            <TableHead className="border-b border-black text-black">
              <SortHeader label="ARTISTA" columnKey="name" sortKey={sortKey} sortDir={sortDir} onSortChange={onSortChange} />
            </TableHead>
            <TableHead className="border-b border-black text-black">
              <SortHeader label="BANDAS" columnKey="bands" sortKey={sortKey} sortDir={sortDir} onSortChange={onSortChange} />
            </TableHead>
            <TableHead className="border-b border-black text-black">
              <SortHeader label="GÉNERO" columnKey="genre" sortKey={sortKey} sortDir={sortDir} onSortChange={onSortChange} />
            </TableHead>
            <TableHead className="border-b border-black text-black">
              <SortHeader label="DEBUT" columnKey="debutYear" sortKey={sortKey} sortDir={sortDir} onSortChange={onSortChange} />
            </TableHead>
            <TableHead className="border-b border-black text-black">
              <SortHeader label="ESTADO" columnKey="active" sortKey={sortKey} sortDir={sortDir} onSortChange={onSortChange} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((artist) => (
            <TableRow key={artist.id} className="border-black hover:bg-black/5">
              <TableCell className="text-black">
                <div className="flex items-center gap-4">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    loading="lazy"
                    className="h-10 w-10 shrink-0 border border-black object-cover grayscale"
                  />
                  <div>
                    <Link
                      to={`/artistas/${artist.slug}`}
                      className="font-heading text-xs font-black tracking-tight text-black hover:opacity-60"
                    >
                      {artist.name}
                    </Link>
                    <div className="font-body text-[9px] font-light tracking-[0.2em] text-black uppercase opacity-60">
                      {artist.debutYear}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-black">
                <div className="flex flex-wrap gap-2">
                  {artist.bandSlugs.map((slug) => (
                    <span
                      key={slug}
                      className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase"
                    >
                      {getBandNameBySlug(slug)}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-black">
                <span className="font-body text-[10px] font-light tracking-[0.2em] text-black uppercase">{artist.genre}</span>
              </TableCell>
              <TableCell className="text-black">
                <span className="font-body text-[10px] font-black tracking-[0.2em] text-black">{artist.debutYear}</span>
              </TableCell>
              <TableCell className="text-black">
                <span className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase">
                  {artist.active ? "ACTIVO" : "INACTIVO"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArtistsTableView;
