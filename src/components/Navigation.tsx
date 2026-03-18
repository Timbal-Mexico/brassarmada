import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-black bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Search */}
        <div className="flex flex-1 items-center">
          <button className="flex items-center gap-2 text-[10px] font-heading tracking-[0.2em] text-black transition-opacity hover:opacity-60">
            <Search className="h-4 w-4" strokeWidth={3} />
            <span className="hidden md:inline">BUSCAR</span>
          </button>
        </div>

        {/* Center: Links */}
        <div className="flex flex-[2] items-center justify-center gap-4 md:gap-8">
          <Link to="/" className="text-[10px] font-heading font-black tracking-[0.2em] text-black transition-opacity hover:opacity-60 md:text-xs">
            INICIO
          </Link>
          <Link to="/noticias" className="text-[10px] font-body font-normal tracking-[0.2em] text-black transition-opacity hover:opacity-60 md:text-xs">
            NOTICIAS
          </Link>
          <Link to="/proyectos" className="text-[10px] font-body font-normal tracking-[0.2em] text-black transition-opacity hover:opacity-60 md:text-xs">
            PROYECTOS
          </Link>
          <Link to="/artistas" className="text-[10px] font-heading font-black tracking-[0.2em] text-black transition-opacity hover:opacity-60 md:text-xs">
            ARTISTAS
          </Link>
          <Link to="/tienda" className="text-[10px] font-body font-normal tracking-[0.2em] text-black transition-opacity hover:opacity-60 md:text-xs">
            TIENDA
          </Link>
        </div>

        {/* Right: Auth & Contact */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <Link to="/login" className="text-[10px] font-body font-normal tracking-[0.2em] text-black transition-opacity hover:opacity-60 md:text-xs">
            LOGIN
          </Link>
          <Link to="/contacto" className="text-[10px] font-heading font-black tracking-[0.2em] text-black transition-opacity hover:opacity-60 md:text-xs">
            CONTACTO
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
