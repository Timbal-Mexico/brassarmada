export type Role = "admin" | "editor" | "viewer";

export type Resource = "news" | "store" | "artists" | "bands";

export type Action = "read" | "create" | "update" | "delete" | "publish";

export type Permission = {
  id: string;
  role: Role;
  resource: Resource;
  action: Action;
};

