import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, Search, User, Menu, X } from "lucide-react";
import { bands } from "@/data/bands";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

const Navigation = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClass =
    "text-[10px] font-body font-light tracking-[0.2em] text-black transition-opacity hover:opacity-60 visited:font-black md:text-xs";

  const mobileNavLinkClass =
    "block px-4 py-3 font-body text-sm font-light tracking-[0.2em] text-black uppercase border-b border-black/10 hover:bg-black hover:text-white transition-colors";

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

        <div className="hidden lg:flex flex-1 items-center justify-center px-2">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-4 py-1 md:gap-8">
            <Link to="/" className={navLinkClass}>
              INICIO
            </Link>
            <Link to="/noticias" className={navLinkClass}>
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

            <Link to="/artistas" className={navLinkClass}>
              ARTISTAS
            </Link>
            <Link to="/tienda" className={navLinkClass}>
              TIENDA
            </Link>
            <Link to="/contacto" className={navLinkClass}>
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
            aria-label="Abrir busqueda"
            onClick={() => setIsSearchOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center border border-black text-black transition-opacity hover:opacity-60"
          >
            <Search className="h-4 w-4" strokeWidth={3} />
          </button>

          <a
            href="https://app.brassarmada.com.mx/login"
            aria-label="Login"
            className="hidden sm:flex h-9 w-9 items-center justify-center border border-black text-black transition-opacity hover:opacity-60"
          >
            <User className="h-4 w-4" strokeWidth={3} />
          </a>

          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center border border-black text-black transition-opacity hover:opacity-60 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DrawerContent className="rounded-t-[10px] border border-black bg-white">
          <DrawerHeader className="relative border-b border-black/10 pb-4">
            <DrawerTitle className="font-body text-xs tracking-[0.3em] uppercase">
              Menu
            </DrawerTitle>
            <DrawerClose className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center">
              <X className="h-5 w-5" />
            </DrawerClose>
          </DrawerHeader>
          <nav className="flex flex-col">
            <Link to="/" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              INICIO
            </Link>
            <Link to="/noticias" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              NOTICIAS
            </Link>
            <Link to="/proyectos" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              PROYECTOS
            </Link>
            <div className="bg-black/5">
              {bands.map((band) => (
                <Link
                  key={band.id}
                  to={`/bandas/${band.slug}`}
                  className="block px-8 py-2 font-body text-xs font-light tracking-[0.2em] text-black uppercase hover:bg-black hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {band.name}
                </Link>
              ))}
            </div>
            <Link to="/artistas" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              ARTISTAS
            </Link>
            <Link to="/tienda" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              TIENDA
            </Link>
            <Link to="/contacto" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              CONTACTO
            </Link>
            <div className="mt-4 flex gap-2 px-4 pb-6">
              <a
                href="https://app.brassarmada.com.mx/login"
                className="flex h-10 flex-1 items-center justify-center border border-black text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors"
              >
                Login
              </a>
            </div>
          </nav>
        </DrawerContent>
      </Drawer>
    </nav>
  );
};

export default Navigation;
