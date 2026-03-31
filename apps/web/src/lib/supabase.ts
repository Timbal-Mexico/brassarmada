import { useQuery } from "@tanstack/react-query";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

const apiBase = isSupabaseConfigured ? (supabaseUrl as string).replace(/\/$/, "") : "";

type ApiError = { message: string };

type ApiResult<T> = {
  data: T | null;
  error: ApiError | null;
};

type SupabaseUser = {
  id: string;
  email: string | null;
};

const ACCESS_TOKEN_KEY = "brassarmada_web_access_token_v1";
const REFRESH_TOKEN_KEY = "brassarmada_web_refresh_token_v1";

const getAccessToken = () => (typeof window === "undefined" ? null : window.localStorage.getItem(ACCESS_TOKEN_KEY));

const setTokens = (accessToken: string, refreshToken?: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const authHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const restHeaders = () => ({
  apikey: supabaseAnonKey ?? "",
  ...authHeaders(),
});

const notConfiguredError: ApiError = {
  message: "Supabase no configurado (revisa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)",
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const errorMessageFrom = (value: unknown, fallback: string) => {
  if (!isRecord(value)) return fallback;
  const msg = value.msg;
  if (typeof msg === "string" && msg.trim()) return msg;
  const message = value.message;
  if (typeof message === "string" && message.trim()) return message;
  return fallback;
};

const fetchJson = async <T>(url: string, init: RequestInit): Promise<ApiResult<T>> => {
  try {
    const res = await fetch(url, init);
    const text = await res.text();
    const parsed: unknown = text ? JSON.parse(text) : null;
    if (!res.ok) {
      return { data: null, error: { message: errorMessageFrom(parsed, `HTTP ${res.status}`) } };
    }
    return { data: (parsed as T) ?? null, error: null };
  } catch (e) {
    return { data: null, error: { message: (e as Error)?.message ?? "Network error" } };
  }
};

type PasswordGrantResponse = {
  access_token: string;
  refresh_token?: string;
  user?: { id: string };
};

export const signInWithPassword = async (payload: { email: string; password: string }) => {
  if (!isSupabaseConfigured) return { data: null, error: { message: "Supabase no configurado" } };
  const url = `${apiBase}/auth/v1/token?grant_type=password`;
  const out = await fetchJson<PasswordGrantResponse>(url, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (out.error) return { data: null, error: out.error };
  const accessToken = out.data?.access_token;
  const refreshToken = out.data?.refresh_token;
  if (accessToken) setTokens(accessToken, refreshToken);
  return { data: out.data, error: null };
};

export const signOut = async () => {
  clearTokens();
  return { error: null };
};

export const getUser = async (): Promise<ApiResult<{ user: SupabaseUser | null }>> => {
  if (!isSupabaseConfigured) return { data: { user: null }, error: null };
  const token = getAccessToken();
  if (!token) return { data: { user: null }, error: null };
  const url = `${apiBase}/auth/v1/user`;
  const out = await fetchJson<SupabaseUser>(url, {
    method: "GET",
    headers: { apikey: supabaseAnonKey ?? "", Authorization: `Bearer ${token}` },
  });
  if (out.error) return { data: { user: null }, error: out.error };
  return { data: { user: out.data ?? null }, error: null };
};

export const useUser = () => {
  return useQuery({
    queryKey: ["web-user"],
    queryFn: async () => {
      const res = await getUser();
      return res.data?.user ?? null;
    },
    staleTime: 30_000,
  });
};

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
  async maybeSingle<T>() {
    if (!apiBase) return { data: null, error: notConfiguredError };
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

    if (res.status === 406) return { data: null, error: null } as ApiResult<T>;
    const text = await res.text();
    const parsed: unknown = text ? JSON.parse(text) : null;
    if (!res.ok) return { data: null, error: { message: errorMessageFrom(parsed, `HTTP ${res.status}`) } };
    return { data: (parsed as T) ?? null, error: null };
  }
  async then<T>(resolve: (value: ApiResult<T[]>) => unknown, reject?: (reason: unknown) => unknown) {
    try {
      if (!apiBase) return resolve({ data: null, error: notConfiguredError });
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
      if (!apiBase) return resolve({ data: null, error: notConfiguredError });
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
      if (!apiBase) return resolve({ data: null, error: notConfiguredError });
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
      if (!apiBase) return resolve({ data: null, error: notConfiguredError });
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

export const from = (table: string) => {
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
};
