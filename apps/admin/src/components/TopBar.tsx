import { Bell, LogOut, Menu, MessageSquare, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@brassarmada/supabase";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { ADMIN_NAV_ITEMS } from "./nav";
import { usePermissions } from "@brassarmada/ui";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = usePermissions();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 w-52 sm:w-72">
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground sm:hidden" aria-label="Menú">
              <Menu className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="p-4">
              <SheetTitle>Menú</SheetTitle>
            </SheetHeader>
            <nav className="space-y-1 p-2">
              {ADMIN_NAV_ITEMS.filter((i) => !i.roles || (role ? i.roles.includes(role) : false)).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar proyectos..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/login", { replace: true });
          }}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" />
        </button>
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <MessageSquare className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
          <span className="text-xs font-bold text-primary-foreground">AN</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
