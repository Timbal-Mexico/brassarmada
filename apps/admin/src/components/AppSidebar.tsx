import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "./nav";
import { usePermissions } from "@brassarmada/ui";

const AppSidebar = () => {
  const location = useLocation();
  const { role } = usePermissions();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-60 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5">
        <span className="font-display text-xl font-bold neon-text text-primary">
          Electric Nocturne
        </span>
      </div>

      {/* Artist Info */}
      <div className="mx-4 mb-4 rounded-lg bg-muted/50 px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Artist Name</p>
        <p className="text-xs text-muted-foreground">Pro Studio Member</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {ADMIN_NAV_ITEMS.filter((i) => !i.roles || (role ? i.roles.includes(role) : false)).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary border-r-2 border-primary"
                  : "text-sidebar-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto space-y-2 p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25">
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
