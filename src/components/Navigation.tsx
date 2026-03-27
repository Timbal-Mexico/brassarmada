import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, Search, User } from "lucide-react";
import { bands } from "@/data/bands";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navLinkClass =
    "text-[10px] font-body font-light tracking-[0.2em] text-black transition-opacity hover:opacity-60 visited:font-black md:text-xs";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-black bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center">
          <img
            src="/images/logos/brassaarmada.png"
            alt="Brass Armada"
            className="h-auto max-h-[50px] w-auto max-w-[150px] object-contain brightness-0"
          />
        </Link>

        <div className="flex flex-1 items-center justify-center px-2">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-4 py-1 md:gap-8">
            <Link
              to="/"
              className={navLinkClass}
            >
              INICIO
            </Link>
            <Link
              to="/noticias"
              className={navLinkClass}
            >
              NOTICIAS
            </Link>

            <DropdownMenu>
              <div className="flex items-center gap-2">
                <Link to="/proyectos" className={navLinkClass}>
                  PROYECTOS
                </Link>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Abrir proyectos"
                    className="flex h-7 w-7 items-center justify-center border border-black text-black transition-opacity hover:opacity-60"
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={3} />
                  </button>
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent
                align="center"
                sideOffset={12}
                className="max-h-[70vh] w-72 overflow-y-auto rounded-none border border-black bg-white p-2 text-black shadow-none"
              >
                {bands.map((band) => (
                  <DropdownMenuItem
                    key={band.id}
                    asChild
                    className="rounded-none px-3 py-2 font-body text-[10px] font-light tracking-[0.2em] text-black uppercase focus:bg-black focus:text-white"
                  >
                    <Link to={`/bandas/${band.slug}`}>{band.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/artistas"
              className={navLinkClass}
            >
              ARTISTAS
            </Link>
            <Link
              to="/tienda"
              className={navLinkClass}
            >
              TIENDA
            </Link>
            <Link
              to="/contacto"
              className={navLinkClass}
            >
              CONTACTO
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isSearchOpen ? "w-40 md:w-56" : "w-0"
            }`}
          >
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="BUSCAR"
              aria-label="Buscar"
              className="h-9 w-full rounded-none border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black placeholder:text-black/40 focus:outline-none"
              autoFocus={isSearchOpen}
            />
          </div>
          <button
            type="button"
            aria-label="Abrir búsqueda"
            onClick={() => setIsSearchOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center border border-black text-black transition-opacity hover:opacity-60"
          >
            <Search className="h-4 w-4" strokeWidth={3} />
          </button>
          <a
            href="https://brassaarmada-admin.vercel.app/"
            aria-label="Login"
            className="flex h-9 w-9 items-center justify-center border border-black text-black transition-opacity hover:opacity-60"
          >
            <User className="h-4 w-4" strokeWidth={3} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
