import type { LucideIcon } from "lucide-react";
import { BarChart3, Calendar, DollarSign, FileText, Film, Guitar, LayoutDashboard, MessageSquare, Paintbrush, Settings, User, Users, Users2, Wallet } from "lucide-react";
import type { Role } from "@brassarmada/types";

export type AdminNavItem = {
  icon: LucideIcon;
  label: string;
  path: string;
  roles?: Role[];
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", roles: ["super_admin", "admin", "artista"] },
  { icon: User, label: "Mi Perfil", path: "/profile", roles: ["super_admin", "admin", "artista"] },
  { icon: Guitar, label: "Mis Bandas", path: "/bands", roles: ["super_admin", "admin", "artista"] },
  { icon: Calendar, label: "Calendario", path: "/calendar", roles: ["super_admin", "admin", "artista"] },
  { icon: Film, label: "Contenido", path: "/artist/content", roles: ["artista"] },
  { icon: BarChart3, label: "Estadísticas", path: "/artist/stats", roles: ["artista"] },
  { icon: Users2, label: "Audiencia", path: "/artist/audience", roles: ["artista"] },
  { icon: Wallet, label: "Monetización", path: "/artist/monetization", roles: ["artista"] },
  { icon: DollarSign, label: "Ganancias", path: "/earnings", roles: ["super_admin", "admin"] },
  { icon: FileText, label: "Cotizaciones", path: "/quotations", roles: ["super_admin", "admin"] },
  { icon: MessageSquare, label: "Mensajes", path: "/messages", roles: ["super_admin", "admin", "artista"] },
  { icon: Paintbrush, label: "Artistas", path: "/artists", roles: ["admin", "super_admin"] },
  { icon: Settings, label: "Configuración", path: "/settings", roles: ["super_admin", "admin"] },
  { icon: Users, label: "Usuarios", path: "/users", roles: ["super_admin"] },
];
