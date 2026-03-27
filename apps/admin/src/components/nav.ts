import type { LucideIcon } from "lucide-react";
import { Calendar, DollarSign, FileText, Guitar, LayoutDashboard, MessageSquare, Settings, User, Users } from "lucide-react";
import type { Role } from "@brassarmada/types";

export type AdminNavItem = {
  icon: LucideIcon;
  label: string;
  path: string;
  roles?: Role[];
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: User, label: "Mi Perfil", path: "/profile" },
  { icon: Guitar, label: "Mis Bandas", path: "/bands" },
  { icon: Calendar, label: "Calendario", path: "/calendar" },
  { icon: DollarSign, label: "Ganancias", path: "/earnings" },
  { icon: FileText, label: "Cotizaciones", path: "/quotations" },
  { icon: MessageSquare, label: "Mensajes", path: "/messages" },
  { icon: Settings, label: "Configuración", path: "/settings" },
  { icon: Users, label: "Usuarios", path: "/users", roles: ["admin"] },
];
