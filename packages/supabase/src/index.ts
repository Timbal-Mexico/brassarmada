import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@brassarmada/types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

export const TABLES = {
  ARTISTS: "artists",
  BANDS: "bands",
  NEWS: "news",
  STORE_ITEMS: "store_items",
  EVENTS: "events",
  USERS: "users",
  PERMISSIONS: "permissions",
} as const;

type ApiError = { message: string };

type ApiResult<T> = {
  data: T | null;
  error: ApiError | null;
};

type SupabaseUser = {
  id: string;
  email: string | null;
};

const ACCESS_TOKEN_KEY = "brassarmada_supabase_access_token_v1";
const REFRESH_TOKEN_KEY = "brassarmada_supabase_refresh_token_v1";

const getAccessToken = () => (typeof window === "undefined" ? null : window.localStorage.getItem(ACCESS_TOKEN_KEY));

const setTokens = (accessToken: string, refreshToken?: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const clearTokens = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const apiBase = isSupabaseConfigured ? (supabaseUrl as string).replace(/\/$/, "") : "";

const fetchJson = async <T>(url: string, init: RequestInit): Promise<ApiResult<T>> => {
  try {
    const res = await fetch(url, init);
    const text = await res.text();
    const data = text ? (JSON.parse(text) as T) : (null as T);
    if (!res.ok) {
      return { data: null, error: { message: (data as any)?.msg || (data as any)?.message || `HTTP ${res.status}` } };
    }
    return { data, error: null };
  } catch (e) {
    return { data: null, error: { message: (e as Error)?.message ?? "Network error" } };
  }
};

const authHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const restHeaders = () => ({
  apikey: supabaseAnonKey ?? "",
  ...authHeaders(),
});

const functionsHeaders = () => ({
  apikey: supabaseAnonKey ?? "",
  ...authHeaders(),
  "Content-Type": "application/json",
});

class SelectBuilder {
  private table: string;
  private columns: string;
  private filters: Array<[string, string]> = [];
  private orderBy: string | null = null;
  private limitCount: number | null = null;
  private offsetCount: number | null = null;
  constructor(table: string, columns: string) {
    this.table = table;
    this.columns = columns;
  }
  eq(column: string, value: string) {
    this.filters.push([column, `eq.${encodeURIComponent(value)}`]);
    return this;
  }
  ilike(column: string, pattern: string) {
    this.filters.push([column, `ilike.${encodeURIComponent(pattern)}`]);
    return this;
  }
  in(column: string, values: string[]) {
    const list = values.map((v) => `"${String(v).replace(/"/g, '\\"')}"`).join(",");
    this.filters.push([column, `in.(${list})`]);
    return this;
  }
  contains(column: string, values: string[]) {
    const list = values.map((v) => `"${String(v).replace(/"/g, '\\"')}"`).join(",");
    this.filters.push([column, `cs.{${list}}`]);
    return this;
  }
  order(column: string, opts?: { ascending?: boolean }) {
    const dir = opts?.ascending === false ? "desc" : "asc";
    this.orderBy = `${column}.${dir}`;
    return this;
  }
  limit(count: number) {
    this.limitCount = count;
    return this;
  }
  range(from: number, to: number) {
    this.offsetCount = from;
    this.limitCount = Math.max(0, to - from + 1);
    return this;
  }
  async maybeSingle() {
    const url = new URL(`${apiBase}/rest/v1/${this.table}`);
    url.searchParams.set("select", this.columns);
    for (const [k, v] of this.filters) url.searchParams.set(k, v);
    if (this.orderBy) url.searchParams.set("order", this.orderBy);
    if (this.limitCount !== null) url.searchParams.set("limit", String(this.limitCount));
    if (this.offsetCount !== null) url.searchParams.set("offset", String(this.offsetCount));

    const res = await fetch(`${url.toString()}`, {
      method: "GET",
      headers: {
        ...restHeaders(),
        Accept: "application/vnd.pgrst.object+json",
      },
    });

    if (res.status === 406) return { data: null, error: null } as ApiResult<any>;
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) return { data: null, error: { message: (data as any)?.message || `HTTP ${res.status}` } };
    return { data, error: null } as ApiResult<any>;
  }
  async then<T>(resolve: (value: ApiResult<T[]>) => unknown, reject?: (reason: unknown) => unknown) {
    try {
      const url = new URL(`${apiBase}/rest/v1/${this.table}`);
      url.searchParams.set("select", this.columns);
      for (const [k, v] of this.filters) url.searchParams.set(k, v);
      if (this.orderBy) url.searchParams.set("order", this.orderBy);
      if (this.limitCount !== null) url.searchParams.set("limit", String(this.limitCount));
      if (this.offsetCount !== null) url.searchParams.set("offset", String(this.offsetCount));
      const out = await fetchJson<T[]>(url.toString(), { method: "GET", headers: { ...restHeaders() } });
      return resolve(out);
    } catch (e) {
      if (reject) return reject(e);
      throw e;
    }
  }
}

class InsertBuilder {
  private table: string;
  private payload: unknown;
  constructor(table: string, payload: unknown) {
    this.table = table;
    this.payload = payload;
  }
  async then<T>(resolve: (value: ApiResult<T[]>) => unknown, reject?: (reason: unknown) => unknown) {
    try {
      const url = new URL(`${apiBase}/rest/v1/${this.table}`);
      const out = await fetchJson<T[]>(url.toString(), {
        method: "POST",
        headers: {
          ...restHeaders(),
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(this.payload),
      });
      return resolve(out);
    } catch (e) {
      if (reject) return reject(e);
      throw e;
    }
  }
}

class DeleteBuilder {
  private table: string;
  private filters: Array<[string, string]> = [];
  constructor(table: string) {
    this.table = table;
  }
  eq(column: string, value: string) {
    this.filters.push([column, `eq.${encodeURIComponent(value)}`]);
    return this;
  }
  async then<T>(resolve: (value: ApiResult<T[]>) => unknown, reject?: (reason: unknown) => unknown) {
    try {
      const url = new URL(`${apiBase}/rest/v1/${this.table}`);
      for (const [k, v] of this.filters) url.searchParams.set(k, v);
      const out = await fetchJson<T[]>(url.toString(), {
        method: "DELETE",
        headers: {
          ...restHeaders(),
          Prefer: "return=representation",
        },
      });
      return resolve(out);
    } catch (e) {
      if (reject) return reject(e);
      throw e;
    }
  }
}

class UpdateBuilder {
  private table: string;
  private patch: Record<string, unknown>;
  private filters: Array<[string, string]> = [];
  constructor(table: string, patch: Record<string, unknown>) {
    this.table = table;
    this.patch = patch;
  }
  eq(column: string, value: string) {
    this.filters.push([column, `eq.${encodeURIComponent(value)}`]);
    return this;
  }
  async then<T>(resolve: (value: ApiResult<T[]>) => unknown, reject?: (reason: unknown) => unknown) {
    try {
      const url = new URL(`${apiBase}/rest/v1/${this.table}`);
      for (const [k, v] of this.filters) url.searchParams.set(k, v);
      const out = await fetchJson<T[]>(url.toString(), {
        method: "PATCH",
        headers: {
          ...restHeaders(),
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(this.patch),
      });
      return resolve(out);
    } catch (e) {
      if (reject) return reject(e);
      throw e;
    }
  }
}

export const supabase = {
  auth: {
    async signInWithPassword(payload: { email: string; password: string }) {
      if (!isSupabaseConfigured) return { data: null, error: { message: "Supabase no configurado" } };
      const url = `${apiBase}/auth/v1/token?grant_type=password`;
      const out = await fetchJson<any>(url, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (out.error) return { data: null, error: out.error };
      const accessToken = out.data?.access_token as string | undefined;
      const refreshToken = out.data?.refresh_token as string | undefined;
      if (accessToken) setTokens(accessToken, refreshToken);
      return { data: out.data, error: null };
    },
    async signOut() {
      clearTokens();
      return { error: null };
    },
    async getUser(): Promise<ApiResult<{ user: SupabaseUser | null }>> {
      if (!isSupabaseConfigured) return { data: { user: null }, error: null };
      const token = getAccessToken();
      if (!token) return { data: { user: null }, error: null };
      const url = `${apiBase}/auth/v1/user`;
      const out = await fetchJson<any>(url, {
        method: "GET",
        headers: { apikey: supabaseAnonKey ?? "", Authorization: `Bearer ${token}` },
      });
      if (out.error) return { data: { user: null }, error: out.error };
      const user = out.data as SupabaseUser;
      return { data: { user }, error: null };
    },
  },
  functions: {
    async invoke<T>(name: string, body?: unknown): Promise<ApiResult<T>> {
      if (!isSupabaseConfigured) return { data: null, error: { message: "Supabase no configurado" } };
      const url = `${apiBase}/functions/v1/${name}`;
      return await fetchJson<T>(url, {
        method: "POST",
        headers: { ...functionsHeaders() },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    },
  },
  from(table: string) {
    return {
      select(columns: string) {
        return new SelectBuilder(table, columns);
      },
      insert(payload: unknown) {
        return new InsertBuilder(table, payload);
      },
      update(patch: Record<string, unknown>) {
        return new UpdateBuilder(table, patch);
      },
      delete() {
        return new DeleteBuilder(table);
      },
    };
  },
};

export const getProfile = async (): Promise<Profile | null> => {
  const userRes = await supabase.auth.getUser();
  if (userRes.error) return null;
  const user = userRes.data?.user;
  if (!user) return null;

  const res = await supabase
    .from(TABLES.USERS)
    .select("id,email,full_name,role,created_at,updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (res.error) return null;
  return (res.data as Profile | null) ?? null;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 60_000,
  });
};
