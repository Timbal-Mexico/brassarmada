import type { Action, Resource, Role } from "@brassarmada/types";
import { supabase, TABLES, useProfile } from "@brassarmada/supabase";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

type CanFn = (resource: Resource, action: Action) => boolean;

const defaultCan: CanFn = () => false;

export const usePermissions = () => {
  const profileQuery = useProfile();
  const role: Role | null = profileQuery.data?.role ?? null;

  const permissionsQuery = useQuery({
    queryKey: ["permissions", role],
    enabled: !!role,
    queryFn: async () => {
      if (!role) return [] as Array<{ resource: Resource; action: Action }>;
      if (role === "admin" || role === "super_admin") return [] as Array<{ resource: Resource; action: Action }>;

      const res = await supabase
        .from(TABLES.PERMISSIONS)
        .select("resource,action")
        .eq("role", role);

      if (res.error) return [] as Array<{ resource: Resource; action: Action }>;
      return (res.data as Array<{ resource: Resource; action: Action }>) ?? [];
    },
    staleTime: 60_000,
  });

  const can: CanFn = (resource, action) => {
    if (!role) return false;
    if (role === "admin" || role === "super_admin") return true;
    return (permissionsQuery.data ?? []).some((p) => p.resource === resource && p.action === action);
  };

  return {
    role,
    can: role ? can : defaultCan,
    isLoading: profileQuery.isLoading || permissionsQuery.isLoading,
    isSuperAdmin: role === "super_admin",
    isAdmin: role === "admin" || role === "super_admin",
    isArtista: role === "artista",
    isCliente: role === "cliente",
    canManageUsers: role === "super_admin",
    canApproveEvents: role === "admin" || role === "super_admin",
    canManageContent: role === "admin" || role === "super_admin",
    canEditOwnProfile: !!role && role !== "cliente",
  };
};

export const RoleGate = ({ roles, children }: { roles: Role[]; children: React.ReactNode }) => {
  const { role } = usePermissions();
  if (!role) return null;
  if (!roles.includes(role)) return null;
  return <>{children}</>;
};

export const RoleGuard = ({ roles, children }: { roles: Role[]; children: React.ReactNode }) => {
  const { role } = usePermissions();
  if (!role) return <Navigate to="/login" replace />;
  if (!roles.includes(role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export const PermissionGate = ({
  resource,
  action,
  children,
}: {
  resource: Resource;
  action: Action;
  children: React.ReactNode;
}) => {
  const { can } = usePermissions();
  if (!can(resource, action)) return null;
  return <>{children}</>;
};
