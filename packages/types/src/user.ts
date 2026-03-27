import type { Role } from "./permissions";

export type User = {
  id: string;
  email: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
};

